import { CONTACT_TYPES, validateContact, type ContactInput } from "../../../lib/contact.ts";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_GLOBAL_PER_WINDOW = 30;
const MIN_FILL_MS = 2000;
const MAX_BODY_CHARS = 32 * 1024;

// ponytail: per-instance memory, so limits reset on cold starts; move to a shared store if abuse appears.
const hits = new Map<string, number[]>();

function over(key: string, limit: number, now: number) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const blocked = recent.length >= limit;
  if (!blocked) recent.push(now);
  hits.delete(key);
  hits.set(key, recent);
  if (hits.size > 5000) hits.delete(hits.keys().next().value!); // Oldest entry, never everyone's.
  return blocked;
}

// The global cap protects the inbox even if a client rotates its forwarded address.
const rateLimited = (ip: string, now: number) => over(ip, MAX_PER_WINDOW, now) || over("*", MAX_GLOBAL_PER_WINDOW, now);

const str = (v: unknown) => (typeof v === "string" ? v : "");
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_CHARS) {
    return Response.json({ error: "too_large" }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_CHARS) return Response.json({ error: "too_large" }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Spam: a filled honeypot or an instant submit gets a quiet success and is dropped.
  if (str(body.website) || typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS) {
    return Response.json({ ok: true });
  }

  const input: ContactInput = {
    type: CONTACT_TYPES.includes(str(body.type)) ? str(body.type) : "Other",
    name: oneLine(str(body.name)),
    email: str(body.email).trim(),
    subject: oneLine(str(body.subject)).slice(0, 200),
    message: str(body.message).trim(),
  };
  const errors = validateContact(input);
  if (Object.keys(errors).length) return Response.json({ error: "invalid", errors }, { status: 422 });

  // The last hop is what the host's own proxy appended; earlier entries are client-supplied.
  const ip = req.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
  if (rateLimited(ip, Date.now())) return Response.json({ error: "rate_limited" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO;
  if (!key || !from || !to) return Response.json({ error: "not_configured" }, { status: 503 });

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: [input.email],
      subject: `[Portfolio · ${input.type}] ${input.subject || `Message from ${input.name}`}`,
      text: `Type: ${input.type}\nFrom: ${input.name} <${input.email}>\nSubject: ${input.subject}\n\n${input.message}`,
    }),
  }).catch(() => null);

  if (!sent?.ok) {
    // Visitors get the fallback; the reason (bad key, unverified sender) belongs in the host's logs.
    console.error("Contact delivery failed:", sent?.status ?? "network error", sent ? await sent.text().catch(() => "") : "");
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
