// The five pursuits. `key` matches ActivityLog.category values in the DB
// (the DB's "content" category is presented as "Reading" in the redesign).
export const CATEGORIES = [
  { key: "code", label: "Code", colorVar: "--cat-code" },
  { key: "music", label: "Music", colorVar: "--cat-music" },
  { key: "language", label: "Language", colorVar: "--cat-language" },
  { key: "fitness", label: "Fitness", colorVar: "--cat-fitness" },
  { key: "content", label: "Reading", colorVar: "--cat-reading" },
] as const;

export type Category = (typeof CATEGORIES)[number];

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
