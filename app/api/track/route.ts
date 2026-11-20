import { geo, isBot, parseUA, ready, sql } from "../../../lib/analytics.ts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_MS = 6 * 60 * 60 * 1000;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const header = (req: Request, k: string) => {
  const v = req.headers.get(k);
  try { return v ? decodeURIComponent(v) : null; } catch { return v; }
};

// ponytail: no rate limit; anyone can post fake views. Add one (like the contact route's) if numbers look gamed.
export async function POST(req: Request) {
  const ok = new Response(null, { status: 204 });
  const ua = req.headers.get("user-agent") ?? "";
  if (!sql || isBot(ua)) return ok;

  let b: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 8192) return ok;
    b = JSON.parse(text);
  } catch {
    return ok;
  }
  const id = str(b.id, 36);
  if (!UUID.test(id)) return ok;

  try {
    await ready();
    if (b.t === "view") {
      const sid = str(b.sid, 36), vid = str(b.vid, 36);
      const path = str(b.path, 300);
      if (!UUID.test(sid) || !UUID.test(vid) || !path.startsWith("/")) return ok;
      const { device, browser, os } = parseUA(ua);
      // The last hop is what the host's own proxy appended; earlier entries are client-supplied.
      const ip = req.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? null;
      // Vercel sends location headers; on the VPS they're absent, so fall back to the local GeoIP file.
      const country = header(req, "x-vercel-ip-country");
      const place = country
        ? { country, region: header(req, "x-vercel-ip-country-region"), city: header(req, "x-vercel-ip-city") }
        : await geo(ip);
      await sql`
        insert into visits (id, sid, vid, path, referrer, ip, country, region, city, ua, device, browser, os)
        values (${id}, ${sid}, ${vid}, ${path}, ${str(b.ref, 300) || null}, ${ip},
          ${place?.country ?? null}, ${place?.region ?? null}, ${place?.city ?? null},
          ${ua.slice(0, 400)}, ${device}, ${browser}, ${os})
        on conflict (id) do nothing`;
    } else if (b.t === "ping") {
      const ms = Math.min(Math.max(Math.round(Number(b.ms) || 0), 0), MAX_MS);
      const targets = (Array.isArray(b.clicks) ? b.clicks : []).slice(0, 50).map((c) => str(c, 160)).filter(Boolean);
      const [v] = await sql`
        update visits set duration_ms = greatest(duration_ms, ${ms}), clicks = clicks + ${targets.length}
        where id = ${id} returning id`;
      if (v && targets.length) await sql`insert into clicks ${sql(targets.map((target) => ({ visit_id: id, target })))}`;
    }
  } catch (e) {
    console.error("Tracking failed:", e);
  }
  return ok;
}
