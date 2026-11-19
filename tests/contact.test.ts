import { test } from "node:test";
import assert from "node:assert/strict";
import { validateField, firstName } from "../lib/contact.ts";
import { POST } from "../app/api/contact/route.ts";

process.env.CONTACT_TO = "inbox@example.com";

const good = { type: "Freelance", name: "Sam Lee", email: "sam@studio.co", subject: "Web app", message: "Hello", website: "", elapsedMs: 9000 };
const call = (body: unknown, ip = "1.1.1.1") =>
  POST(new Request("http://x/api/contact", { method: "POST", headers: { "x-forwarded-for": ip }, body: JSON.stringify(body) }));

test("validates the spec's email error and required fields", () => {
  assert.equal(validateField("email", "sam@studio"), "Enter an email address like name@example.com");
  assert.equal(validateField("email", "sam@studio.co"), undefined);
  assert.ok(validateField("name", "  "));
  assert.ok(validateField("message", ""));
  assert.equal(firstName(" Sam Lee "), "Sam");
});

test("honeypot and instant submits are dropped without sending", async () => {
  const real = globalThis.fetch;
  globalThis.fetch = (() => assert.fail("must not send")) as typeof fetch;
  process.env.RESEND_API_KEY = "k";
  process.env.CONTACT_FROM = "a@b.co";
  assert.equal((await call({ ...good, website: "spam" })).status, 200);
  assert.equal((await call({ ...good, elapsedMs: 100 })).status, 200);
  globalThis.fetch = real;
});

test("reports invalid input, missing configuration and delivery failure honestly", async () => {
  assert.equal((await call({ ...good, email: "nope" }, "2.2.2.2")).status, 422);

  delete process.env.RESEND_API_KEY;
  assert.equal((await call(good, "3.3.3.3")).status, 503);

  process.env.RESEND_API_KEY = "k";
  const real = globalThis.fetch;
  globalThis.fetch = (async () => new Response("no", { status: 500 })) as typeof fetch;
  assert.equal((await call(good, "4.4.4.4")).status, 502);
  globalThis.fetch = real;
});

test("rejects non-object and oversized bodies without crashing", async () => {
  assert.equal((await call(null)).status, 400);
  assert.equal((await call([1])).status, 400);
  assert.equal((await call({ ...good, message: "x".repeat(40000) })).status, 413);
});

test("a multi-line name can't reach the email subject", async () => {
  process.env.RESEND_API_KEY = "k";
  process.env.CONTACT_FROM = "a@b.co";
  const real = globalThis.fetch;
  let subject = "";
  globalThis.fetch = (async (_: string, init: RequestInit) => {
    subject = JSON.parse(String(init.body)).subject;
    return new Response("{}", { status: 200 });
  }) as unknown as typeof fetch;
  await call({ ...good, subject: "", name: "Sam\r\nBcc: x@y.z" }, "6.6.6.6");
  assert.ok(!/[\r\n]/.test(subject));
  globalThis.fetch = real;
});

test("sends to the configured inbox with the visitor as reply-to, then rate limits", async () => {
  process.env.RESEND_API_KEY = "k";
  process.env.CONTACT_FROM = "a@b.co";
  const real = globalThis.fetch;
  const bodies: { to: string[]; reply_to: string[] }[] = [];
  globalThis.fetch = (async (_: string, init: RequestInit) => {
    bodies.push(JSON.parse(String(init.body)));
    return new Response("{}", { status: 200 });
  }) as unknown as typeof fetch;

  for (let i = 0; i < 5; i++) assert.equal((await call(good, "5.5.5.5")).status, 200);
  assert.equal((await call(good, "5.5.5.5")).status, 429);
  assert.equal(bodies.length, 5);
  assert.deepEqual(bodies[0].to, ["inbox@example.com"]);
  assert.deepEqual(bodies[0].reply_to, ["sam@studio.co"]);
  globalThis.fetch = real;
});
