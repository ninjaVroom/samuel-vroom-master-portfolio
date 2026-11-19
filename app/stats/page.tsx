import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";
import { ready, sql } from "@/lib/analytics";

export const metadata: Metadata = { title: "Stats", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const RANGES: [number, string][] = [[1, "24h"], [7, "7d"], [30, "30d"], [90, "90d"], [365, "1y"], [0, "All"]];
const PER_PAGE = 50;
const NONE = "__none"; // Filter value meaning "column is empty", e.g. direct traffic.

// Each filter is a URL param that narrows every number, chart and table on the page.
const FILTERS = {
  path: "Page",
  ref: "Source",
  country: "Country",
  region: "Region",
  city: "City",
  device: "Device",
  browser: "Browser",
  os: "OS",
  ip: "IP",
  vid: "Visitor",
  sid: "Session",
} as const;
type Key = keyof typeof FILTERS;
const COLUMN: Record<Key, string> = { ...Object.fromEntries(Object.keys(FILTERS).map((k) => [k, k])), ref: "referrer" } as Record<Key, string>;
const CHOICES: Partial<Record<Key, string[]>> = {
  device: ["Desktop", "Mobile", "Tablet"],
  browser: ["Chrome", "Safari", "Firefox", "Edge", "Opera", "Samsung", "Other"],
  os: ["Windows", "macOS", "iOS", "Android", "Linux", "ChromeOS", "Other"],
};

type Params = Partial<Record<Key | "d" | "q" | "p", string>>;
type Row = Record<string, unknown>;

const fmt = (n: unknown) => Math.round(Number(n) || 0).toLocaleString("en-CA");
const dur = (ms: unknown) => {
  const s = Math.round((Number(ms) || 0) / 1000);
  return s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
};
const when = (d: unknown) =>
  new Date(d as string).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" });
const show = (k: Key, v: string) => (v === NONE ? (k === "ref" ? "Direct" : "Unknown") : k === "vid" || k === "sid" ? v.slice(0, 8) : v);

function Card({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-surface border-line min-w-0 rounded-[16px] border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="t-label">{title}</h2>
        {extra}
      </div>
      {children}
    </section>
  );
}

function Table({ cols, rows }: { cols: [string, (r: Row) => React.ReactNode][]; rows: Row[] }) {
  if (!rows.length) return <p className="text-muted t-ui mt-4">Nothing matches.</p>;
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="t-ui w-full text-left">
        <thead>
          <tr className="text-muted">
            {cols.map(([label]) => <th key={label} className="py-2 pr-4 font-normal whitespace-nowrap last:pr-0">{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, j) => (
            <tr key={j} className="border-line border-t">
              {cols.map(([label, cell]) => (
                <td key={label} className="max-w-[320px] truncate py-2 pr-4 tabular-nums last:pr-0">{cell(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function StatsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const db = sql;
  if (!db) {
    return (
      <div className="wrap page-top">
        <h1 className="t-display-sm">Stats</h1>
        <p className="t-body-lg text-muted mt-4">Set DATABASE_URL to a Postgres database to start collecting visits.</p>
      </div>
    );
  }
  await ready();

  const params = await searchParams;
  const one = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 200) : "");
  const days = RANGES.some(([d]) => String(d) === params.d) ? Number(params.d) : 30;
  const q = one(params.q);
  const active = (Object.keys(FILTERS) as Key[]).filter((k) => one(params[k])).map((k) => [k, one(params[k])] as [Key, string]);
  const page = Math.max(1, Math.floor(Number(params.p)) || 1);

  // Links keep every current filter and change only what is passed.
  const href = (patch: Params) => {
    const next = new URLSearchParams();
    const merged: Params = { d: String(days), q, ...Object.fromEntries(active), ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    return `/stats?${next}`;
  };
  const F = ({ k, v, children }: { k: Key; v: unknown; children?: React.ReactNode }) => {
    const value = v == null || v === "" ? NONE : String(v);
    return <Link href={href({ [k]: value })} className="hover:text-accent underline-offset-2 hover:underline">{children ?? show(k, value)}</Link>;
  };

  const since = days ? new Date(Date.now() - days * 86_400_000) : new Date(0);
  const conds = [db`started_at >= ${since}`];
  for (const [k, v] of active) conds.push(v === NONE ? db`${db(COLUMN[k])} is null` : db`lower(${db(COLUMN[k])}::text) = lower(${v})`);
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    conds.push(db`(ip ilike ${like} or path ilike ${like} or referrer ilike ${like} or city ilike ${like}
      or region ilike ${like} or country ilike ${like} or ua ilike ${like})`);
  }
  const where = conds.reduce((a, c) => db`${a} and ${c}`);

  const top = (col: "path" | "referrer" | "device" | "browser" | "os") =>
    db`select ${db(col)} as v, count(*)::int as views, count(distinct vid)::int as visitors,
          avg(duration_ms)::float as avg_ms, sum(duration_ms)::float as total_ms
        from visits where ${where} group by 1 order by views desc limit 15`;

  const firstDay = days ? since : (await db`select coalesce(min(started_at), now()) as m from visits where ${where}`)[0].m;
  const [[totals], daily, pages, refs, places, devices, browsers, systems, clicked, rows] = await Promise.all([
    db`select count(*)::int as views, count(distinct vid)::int as visitors, count(distinct sid)::int as sessions,
          count(distinct ip)::int as ips, coalesce(avg(duration_ms), 0)::float as avg_ms,
          coalesce(sum(duration_ms), 0)::float as total_ms, coalesce(sum(clicks), 0)::int as clicks,
          coalesce((select avg((n = 1)::int) from (select count(*) n from visits where ${where} group by sid) s), 0)::float as bounce
        from visits where ${where}`,
    db`select to_char(d, 'YYYY-MM-DD') as day, count(v.id)::int as views, count(distinct v.vid)::int as visitors
        from generate_series(date_trunc('day', ${firstDay}::timestamptz), date_trunc('day', now()), '1 day') d
        left join visits v on date_trunc('day', v.started_at) = d and ${where}
        group by d order by d`,
    top("path"),
    top("referrer"),
    db`select country, region, city, count(*)::int as views, count(distinct vid)::int as visitors
        from visits where ${where} group by 1, 2, 3 order by views desc limit 15`,
    top("device"),
    top("browser"),
    top("os"),
    db`select c.target, count(*)::int as clicks from clicks c join visits on visits.id = c.visit_id
        where ${where} group by 1 order by clicks desc limit 15`,
    db`select * from visits where ${where} order by started_at desc limit ${PER_PAGE} offset ${(page - 1) * PER_PAGE}`,
  ]);

  const pages_ = Math.max(1, Math.ceil(totals.views / PER_PAGE));
  const peak = Math.max(1, ...daily.map((d) => d.views as number));
  const tiles: [string, string][] = [
    ["Page views", fmt(totals.views)],
    ["Unique visitors", fmt(totals.visitors)],
    ["Sessions", fmt(totals.sessions)],
    ["IP addresses", fmt(totals.ips)],
    ["Avg. time on page", dur(totals.avg_ms)],
    ["Total time on site", dur(totals.total_ms)],
    ["Clicks", fmt(totals.clicks)],
    ["Bounce rate", `${Math.round(totals.bounce * 100)}%`],
  ];
  const counts: [string, (r: Row) => React.ReactNode][] = [["Views", (r) => fmt(r.views)], ["Visitors", (r) => fmt(r.visitors)]];
  const breakdown = (title: string, k: Key, rows: Row[]) => (
    <Card title={title}>
      <Table rows={rows} cols={[[FILTERS[k], (r) => <F k={k} v={r.v} />], ...counts]} />
    </Card>
  );
  const input = "bg-bg border-line t-ui w-full rounded-[10px] border px-3 py-2";

  return (
    <div className="wrap page-top pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-label">Private</p>
          <h1 className="t-display-sm mt-3">Site stats</h1>
        </div>
        <nav className="flex flex-wrap gap-1" aria-label="Date range">
          {RANGES.map(([d, label]) => (
            <Link
              key={d}
              href={href({ d: String(d) })}
              aria-current={d === days ? "page" : undefined}
              className={`t-ui rounded-full px-3 py-1.5 ${d === days ? "bg-accent text-on-accent" : "bg-surface-alt"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <form action="/stats" className="bg-surface border-line mt-8 rounded-[16px] border p-5">
        <input type="hidden" name="d" value={days} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <label className="col-span-2 flex flex-col gap-1">
            <span className="t-label text-muted">Search IP, page, place, source, browser</span>
            <input name="q" defaultValue={q} placeholder="e.g. 142.112 or Toronto" className={input} />
          </label>
          {(["path", "ref", "country", "city"] as const).map((k) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="t-label text-muted">{FILTERS[k]}</span>
              <input name={k} defaultValue={one(params[k])} placeholder={k === "country" ? "e.g. CA" : "Any"} className={input} />
            </label>
          ))}
          {(["device", "browser", "os"] as const).map((k) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="t-label text-muted">{FILTERS[k]}</span>
              <select name={k} defaultValue={one(params[k])} className={input}>
                <option value="">Any</option>
                {CHOICES[k]!.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          ))}
          <label className="flex flex-col gap-1">
            <span className="t-label text-muted">IP address</span>
            <input name="ip" defaultValue={one(params.ip)} placeholder="Exact" className={input} />
          </label>
          {(["region", "vid", "sid"] as const).map((k) =>
            one(params[k]) ? <input key={k} type="hidden" name={k} value={one(params[k])} /> : null,
          )}
          <div className="col-span-2 flex items-end gap-2">
            <button className="btn btn-primary">Apply filters</button>
            {(active.length > 0 || q) && <Link href={`/stats?d=${days}`} className="btn btn-secondary">Clear all</Link>}
          </div>
        </div>
        {(active.length > 0 || q) && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
            {q && (
              <li><Link href={href({ q: "" })} className="chip inline-flex items-center gap-1">Search: {q} <X size={14} aria-label="Remove" /></Link></li>
            )}
            {active.map(([k, v]) => (
              <li key={k}>
                <Link href={href({ [k]: "" })} className="chip inline-flex items-center gap-1">
                  {FILTERS[k]}: {show(k, v)} <X size={14} aria-label="Remove" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </form>

      <dl className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map(([k, v]) => (
          <div key={k} className="bg-surface border-line rounded-[16px] border p-5">
            <dt className="t-label text-muted">{k}</dt>
            <dd className="mt-2 text-3xl font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3">
        <Card title="Page views per day">
          <div className="mt-4 flex h-40 items-end gap-[2px]" role="img" aria-label="Page views per day; exact numbers in the daily table">
            {daily.map((d) => (
              <div key={d.day} className="group relative flex h-full flex-1 items-end">
                <div className="bg-accent w-full rounded-t-[4px]" style={{ height: `${((d.views as number) / peak) * 100}%`, minHeight: d.views ? 2 : 0 }} />
                <span className="bg-ink text-bg t-ui pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-md px-2 py-1 whitespace-nowrap group-hover:block">
                  {d.day}: {fmt(d.views)} views, {fmt(d.visitors)} visitors
                </span>
              </div>
            ))}
          </div>
          <div className="text-muted t-ui mt-2 flex justify-between">
            <span>{daily[0]?.day}</span>
            <span>{daily.at(-1)?.day}</span>
          </div>
        </Card>
      </div>

      <div className="mt-3">
        <Card
          title={`All visits · ${fmt(totals.views)} matching`}
          extra={
            <span className="t-ui text-muted">
              {totals.views ? `${fmt((page - 1) * PER_PAGE + 1)}–${fmt(Math.min(page * PER_PAGE, totals.views))} of ${fmt(totals.views)}` : ""}
            </span>
          }
        >
          <p className="t-ui text-muted mt-1">Click any page, source, place, IP or visitor to filter by it.</p>
          <Table
            rows={rows}
            cols={[
              ["When", (r) => when(r.started_at)],
              ["IP", (r) => <F k="ip" v={r.ip} />],
              ["Visitor", (r) => <F k="vid" v={r.vid} />],
              ["Session", (r) => <F k="sid" v={r.sid} />],
              ["Location", (r) => (
                <span>
                  {r.city ? <><F k="city" v={r.city} />, </> : null}
                  {r.region ? <><F k="region" v={r.region} />, </> : null}
                  <F k="country" v={r.country} />
                </span>
              )],
              ["Page", (r) => <F k="path" v={r.path} />],
              ["Time on page", (r) => dur(r.duration_ms)],
              ["Clicks", (r) => fmt(r.clicks)],
              ["Source", (r) => <F k="ref" v={r.referrer} />],
              ["Device", (r) => <F k="device" v={r.device} />],
              ["Browser", (r) => <F k="browser" v={r.browser} />],
              ["OS", (r) => <F k="os" v={r.os} />],
            ]}
          />
          {pages_ > 1 && (
            <nav className="t-ui mt-4 flex items-center justify-between gap-2" aria-label="Pages">
              {page > 1 ? <Link href={href({ p: String(page - 1) })} className="btn btn-secondary">Newer</Link> : <span />}
              <span className="text-muted">Page {page} of {pages_}</span>
              {page < pages_ ? <Link href={href({ p: String(page + 1) })} className="btn btn-secondary">Older</Link> : <span />}
            </nav>
          )}
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card title="Pages">
          <Table
            rows={pages}
            cols={[["Page", (r) => <F k="path" v={r.v} />], ...counts, ["Avg. time", (r) => dur(r.avg_ms)], ["Total time", (r) => dur(r.total_ms)]]}
          />
        </Card>
        {breakdown("Where they came from", "ref", refs)}
        <Card title="Locations">
          <Table
            rows={places}
            cols={[
              ["Place", (r) => (
                <span>
                  {r.city ? <><F k="city" v={r.city} />, </> : null}
                  {r.region ? <><F k="region" v={r.region} />, </> : null}
                  <F k="country" v={r.country} />
                </span>
              )],
              ...counts,
            ]}
          />
        </Card>
        <Card title="Most clicked">
          <Table rows={clicked} cols={[["Link or button", (r) => String(r.target)], ["Clicks", (r) => fmt(r.clicks)]]} />
        </Card>
        {breakdown("Devices", "device", devices)}
        {breakdown("Browsers", "browser", browsers)}
        {breakdown("Operating systems", "os", systems)}
        <Card title="Daily numbers">
          <Table rows={[...daily].reverse()} cols={[["Day", (r) => String(r.day)], ...counts]} />
        </Card>
      </div>
    </div>
  );
}
