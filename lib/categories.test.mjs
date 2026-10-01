// Run with `npm test` (node:test, loading the TypeScript module directly).
import assert from "node:assert/strict";
import { test } from "node:test";
import { CATEGORIES, MANUAL_CATEGORIES, categoryCellColor } from "./categories.ts";

const code = CATEGORIES.find((c) => c.key === "code");

test("Code cells climb the graded ramp", () => {
  assert.equal(categoryCellColor(code, 0), "var(--surface)");
  assert.equal(
    categoryCellColor(code, 1),
    "color-mix(in srgb, var(--cat-code) 25%, var(--background))"
  );
  assert.equal(
    categoryCellColor(code, 3),
    "color-mix(in srgb, var(--cat-code) 48%, var(--background))"
  );
  assert.equal(
    categoryCellColor(code, 12),
    "color-mix(in srgb, var(--cat-code) 95%, var(--background))"
  );
});

test("a hand-logged day is the full category color, however many logs", () => {
  for (const category of MANUAL_CATEGORIES) {
    assert.equal(categoryCellColor(category, 0), "var(--surface)");
    for (const count of [1, 2, 5]) {
      assert.equal(
        categoryCellColor(category, count),
        `var(${category.colorVar})`,
        `${category.key} with ${count}`
      );
    }
  }
});
