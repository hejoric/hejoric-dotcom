// Run with `npm test` (node:test, loading the TypeScript module directly).
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CATEGORIES,
  MANUAL_CATEGORIES,
  categoryCellColor,
  categoryWeekColor,
} from "./categories.ts";

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

test("a Code week ramps on its total", () => {
  assert.equal(categoryWeekColor(code, [0, 0, 0, 0, 0, 0, 0]), "var(--surface)");
  assert.equal(
    categoryWeekColor(code, [0, 1, 2, 0, 0, 0, 0]),
    "color-mix(in srgb, var(--cat-code) 48%, var(--background))"
  );
  assert.equal(
    categoryWeekColor(code, [3, 3, 3]),
    "color-mix(in srgb, var(--cat-code) 95%, var(--background))"
  );
});

test("a hand-logged week is shaded by days logged, from its floor color to full", () => {
  const week = (days, count = 1) =>
    Array.from({ length: 7 }, (_, i) => (i < days ? count : 0));
  for (const category of MANUAL_CATEGORIES) {
    assert.equal(categoryWeekColor(category, week(0)), "var(--surface)");
    [0, 17, 33, 50, 67, 83, 100].forEach((percent, i) => {
      assert.equal(
        categoryWeekColor(category, week(i + 1)),
        `color-mix(in srgb, var(${category.colorVar}) ${percent}%, var(${category.floorVar}))`,
        `${category.key} with ${i + 1} days`
      );
    });
    assert.equal(
      categoryWeekColor(category, week(1, 2)),
      categoryWeekColor(category, week(1)),
      `${category.key}: two logs on one day is still one day`
    );
  }
});
