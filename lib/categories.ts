// The five pursuits. `key` matches ActivityLog.category values in the DB
// (the DB's "content" category is presented as "Reading" in the redesign).
//
// `source` says where a category's data comes from:
//   "github" - fetched live from the GitHub contribution calendar (lib/github.ts)
//   "manual" - self-logged through /admin, stored in ActivityLog
//
// Nothing is generated or estimated. A category with no data renders nothing.
export const CATEGORIES = [
  { key: "code", label: "Code", colorVar: "--cat-code", source: "github" },
  { key: "music", label: "Music", colorVar: "--cat-music", source: "manual" },
  { key: "language", label: "Language", colorVar: "--cat-language", source: "manual" },
  { key: "fitness", label: "Fitness", colorVar: "--cat-fitness", source: "manual" },
  { key: "content", label: "Reading", colorVar: "--cat-reading", source: "manual" },
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Categories the admin panel can write to (Code is owned by GitHub). */
export const MANUAL_CATEGORIES = CATEGORIES.filter(
  (c) => c.source === "manual"
);

export const MANUAL_CATEGORY_KEYS: string[] = MANUAL_CATEGORIES.map(
  (c) => c.key
);

/** Joins labels into prose: "Music, Language, Fitness, and Reading". */
export function listLabels(categories: readonly Category[]): string {
  const labels = categories.map((c) => c.label);
  if (labels.length <= 1) return labels.join("");
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

// Intensity ramp from the design: accent mixed toward the page background.
const LEVEL_PERCENTS = [0, 25, 48, 72, 95];

export function getHeatmapLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}

export function heatmapCellColor(colorVar: string, level: number): string {
  if (level === 0) return "var(--surface)";
  return `color-mix(in srgb, var(${colorVar}) ${LEVEL_PERCENTS[level]}%, var(--background))`;
}
