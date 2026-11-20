import postgres from "postgres";
import { open, validate, type CityResponse, type Reader } from "maxmind";

// One pooled client per server instance; the global survives dev hot reloads.
const g = globalThis as unknown as { __sql?: postgres.Sql; __ready?: Promise<unknown>; __geo?: Promise<Reader<CityResponse> | null> };

export type Place = { country: string | null; region: string | null; city: string | null };

/** Same shape as Vercel's x-vercel-ip-* headers: ISO country, ISO subdivision, English city name. */
export const toPlace = (r: CityResponse | null | undefined): Place | null =>
  r ? { country: r.country?.iso_code ?? null, region: r.subdivisions?.[0]?.iso_code ?? null, city: r.city?.names?.en ?? null } : null;

/** Location from a local GeoLite2-City file at GEOIP_DB, so visitor IPs never leave the server. Null when unset. */
export async function geo(ip: string | null): Promise<Place | null> {
  const path = process.env.GEOIP_DB;
  if (!ip || !path || !validate(ip)) return null;
  // ponytail: opened once per process; restart after updating the .mmdb file.
  g.__geo ??= open<CityResponse>(path).catch((e) => (console.error("GeoIP database failed to open:", e), null));
  return toPlace((await g.__geo)?.get(ip));
}
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
