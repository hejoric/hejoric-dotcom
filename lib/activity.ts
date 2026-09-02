// Assembles the activity window shown by the homepage Ledger and /tracker.
//
// Code comes from the live GitHub contribution calendar; the other categories
// come from ActivityLog rows logged by hand in /admin. Categories with no data
// are returned empty and the UI omits them, so the graph never implies effort
// that did not happen.

import { prisma } from "./prisma";
import { fetchGitHubContributions, type GitHubContributions } from "./github";
import { MANUAL_CATEGORY_KEYS } from "./categories";
import { dateToKey } from "./utils";

/** Days shown in every heatmap and in the Ledger strip. */
export const WINDOW_DAYS = 365;

export interface ActivityWindow {
  /** category key -> (`YYYY-MM-DD` -> count). Missing key means "no data". */
  days: Record<string, Record<string, number>>;
  github: GitHubContributions | null;
}

export async function getActivityWindow(): Promise<ActivityWindow> {
  const start = new Date();
  start.setDate(start.getDate() - (WINDOW_DAYS - 1));
  start.setHours(0, 0, 0, 0);

  const [github, logs] = await Promise.all([
    fetchGitHubContributions(),
    prisma.activityLog.findMany({
      where: {
        date: { gte: start },
        category: { in: MANUAL_CATEGORY_KEYS },
      },
      select: { date: true, category: true, count: true },
    }),
  ]);

  const days: Record<string, Record<string, number>> = {};

  if (github) days.code = github.days;

  for (const log of logs) {
    const key = dateToKey(log.date);
    days[log.category] ??= {};
    days[log.category][key] = (days[log.category][key] || 0) + log.count;
  }

  return { days, github };
}
