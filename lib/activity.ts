// Assembles the activity window shown by the homepage Ledger and /tracker.
//
// Code comes from the live GitHub contribution calendar; the other categories
// come from ActivityLog rows logged by hand in /admin. Categories with no data
// are returned empty and the UI omits them, so the graph never implies effort
// that did not happen.
//
// Notes are private by default. Only rows marked `isPublic` have their note
// text selected at all, so a private note never reaches a page, its HTML, or
// the RSC payload sent to the browser.

import { prisma } from "./prisma";
import { fetchGitHubContributions, type GitHubContributions } from "./github";
import { MANUAL_CATEGORY_KEYS } from "./categories";
import { dateToKey } from "./utils";

/** Days shown in every heatmap and in the Ledger strip. */
export const WINDOW_DAYS = 365;

/** Recent public notes listed under the /tracker heatmaps. */
const RECENT_NOTES = 8;

export interface PublicNote {
  /** `YYYY-MM-DD` */
  date: string;
  category: string;
  note: string;
}

export interface ActivityWindow {
  /** category key -> (`YYYY-MM-DD` -> count). Missing key means "no data". */
  days: Record<string, Record<string, number>>;
  /** category key -> (`YYYY-MM-DD` -> public note). Private notes are absent. */
  notes: Record<string, Record<string, string>>;
  /** The newest public notes, newest first. */
  recentNotes: PublicNote[];
  github: GitHubContributions | null;
}

export async function getActivityWindow(): Promise<ActivityWindow> {
  const start = new Date();
  start.setDate(start.getDate() - (WINDOW_DAYS - 1));
  start.setHours(0, 0, 0, 0);

  const inWindow = {
    date: { gte: start },
    category: { in: MANUAL_CATEGORY_KEYS },
  };

  const [github, logs, publicNotes] = await Promise.all([
    fetchGitHubContributions(),
    prisma.activityLog.findMany({
      where: inWindow,
      select: { date: true, category: true, count: true },
    }),
    prisma.activityLog.findMany({
      where: { ...inWindow, isPublic: true, note: { not: null } },
      select: { date: true, category: true, note: true },
      orderBy: { date: "desc" },
    }),
  ]);

  const days: Record<string, Record<string, number>> = {};

  if (github) days.code = github.days;

  for (const log of logs) {
    const key = dateToKey(log.date);
    days[log.category] ??= {};
    days[log.category][key] = (days[log.category][key] || 0) + log.count;
  }

  const notes: Record<string, Record<string, string>> = {};
  const recentNotes: PublicNote[] = [];

  for (const log of publicNotes) {
    if (!log.note) continue;
    const key = dateToKey(log.date);
    notes[log.category] ??= {};
    notes[log.category][key] = log.note;
    if (recentNotes.length < RECENT_NOTES) {
      recentNotes.push({ date: key, category: log.category, note: log.note });
    }
  }

  return { days, notes, recentNotes, github };
}
