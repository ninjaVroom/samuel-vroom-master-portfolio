import postgres from "postgres";

// One pooled client per server instance; the global survives dev hot reloads.
const g = globalThis as unknown as { __sql?: postgres.Sql; __ready?: Promise<unknown> };
const url = process.env.DATABASE_URL;
export const sql = url ? (g.__sql ??= postgres(url, { max: Number(process.env.DB_POOL_MAX) || 3, idle_timeout: 20, prepare: false })) : null;

// ponytail: tables self-create on first use; switch to migrations if the schema starts changing.
export function ready() {
  if (!sql) return Promise.reject(new Error("DATABASE_URL is not set"));
  return (g.__ready ??= sql.unsafe(`
    create table if not exists visits (
      id uuid primary key,
      sid uuid not null,
      vid uuid not null,
      path text not null,
      referrer text,
      ip text, country text, region text, city text,
      ua text, device text, browser text, os text,
      started_at timestamptz not null default now(),
      duration_ms int not null default 0,
      clicks int not null default 0
    );
    create index if not exists visits_started_at on visits (started_at);
    create table if not exists clicks (
      id bigserial primary key,
      visit_id uuid not null references visits(id) on delete cascade,
      target text not null,
      at timestamptz not null default now()
    );
    create index if not exists clicks_at on clicks (at);
  `).catch((e) => { g.__ready = undefined; throw e; }));
}

const has = (ua: string, re: RegExp) => re.test(ua);

export function parseUA(ua: string) {
  const device = has(ua, /iPad|Tablet/i) ? "Tablet" : has(ua, /Mobi|Android|iPhone/i) ? "Mobile" : "Desktop";
  const browser =
    has(ua, /Edg\//) ? "Edge" : has(ua, /OPR\//) ? "Opera" : has(ua, /SamsungBrowser/) ? "Samsung" :
    has(ua, /Firefox|FxiOS/) ? "Firefox" : has(ua, /Chrome|CriOS/) ? "Chrome" : has(ua, /Safari/) ? "Safari" : "Other";
  const os =
    has(ua, /iPhone|iPad|iOS/) ? "iOS" : has(ua, /Android/) ? "Android" : has(ua, /Windows/) ? "Windows" :
    has(ua, /Mac OS X|Macintosh/) ? "macOS" : has(ua, /CrOS/) ? "ChromeOS" : has(ua, /Linux/) ? "Linux" : "Other";
  return { device, browser, os };
}

export const isBot = (ua: string) => !ua || /bot|crawl|spider|slurp|preview|headless|lighthouse|curl|wget|python|axios/i.test(ua);
