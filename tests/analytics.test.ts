import { test } from "node:test";
import assert from "node:assert/strict";
import { geo, isBot, parseUA, toPlace } from "../lib/analytics.ts";

test("GeoIP records map to the same fields Vercel's headers gave", async () => {
  const r = { country: { iso_code: "CA" }, subdivisions: [{ iso_code: "ON" }], city: { names: { en: "Brantford" } } };
  assert.deepEqual(toPlace(r as never), { country: "CA", region: "ON", city: "Brantford" });
  assert.deepEqual(toPlace({ country: { iso_code: "GH" } } as never), { country: "GH", region: null, city: null });
  assert.equal(toPlace(null), null);
  assert.equal(await geo("not-an-ip"), null);
});

test("parseUA reads device, browser and OS", () => {
  const iphone = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1";
  assert.deepEqual(parseUA(iphone), { device: "Mobile", browser: "Safari", os: "iOS" });
  const edge = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36 Edg/120.0";
  assert.deepEqual(parseUA(edge), { device: "Desktop", browser: "Edge", os: "Windows" });
});

test("isBot drops crawlers and empty agents", () => {
  assert.ok(isBot("Googlebot/2.1"));
  assert.ok(isBot(""));
  assert.ok(!isBot("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Firefox/120.0"));
});
