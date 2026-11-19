import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { activeDisciplines, projects, projectsIn } from "../lib/content.ts";

test("discipline counts match the published projects", () => {
  assert.equal(projects.length, 10);
  assert.deepEqual(
    activeDisciplines.map((d) => [d.name, projectsIn(d.id).length]),
    [["Development", 7], ["WordPress", 2], ["UI Design", 4], ["Project Management", 2], ["Film", 2]],
  );
});

test("project slugs and discipline ids can share /work/<segment>", () => {
  const segments = [...projects.map((p) => p.slug), ...activeDisciplines.map((d) => d.id)];
  assert.equal(new Set(segments).size, segments.length);
});

test("no phone number or unconfirmed claim reaches the site", () => {
  const src = readFileSync(new URL("../lib/content.ts", import.meta.url), "utf8");
  for (const banned of ["548", "Jordan", "Ledgerly", "sub-second", "Lighthouse", "ReviewRoom", "Nkoso", "Grandstone"]) {
    assert.ok(!src.includes(banned), banned);
  }
});
