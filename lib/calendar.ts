// Calendar scaffolding for the heatmaps, built once on the server.
//
// Everything is derived in UTC so a key is a stable `YYYY-MM-DD` string: the
// same value GitHub returns, and the same value ActivityLog dates serialize to.
// Building the grid server-side (instead of inside the client component) also
// keeps the rendered markup independent of the visitor's clock.

import { WINDOW_DAYS } from "./activity";

const MS_PER_DAY = 86_400_000;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export interface MonthSegment {
  name: string;
  /** How many week columns this month spans. */
  weeks: number;
}

export interface Calendar {
  /** Every day in the window, oldest first, as `YYYY-MM-DD`. */
  keys: string[];
  /** Week columns, Sunday-first, padded with nulls at both edges. */
  weeks: (string | null)[][];
  months: MonthSegment[];
}

export function buildCalendar(days: number = WINDOW_DAYS): Calendar {
  const now = new Date();
  const end = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    keys.push(new Date(end - i * MS_PER_DAY).toISOString().slice(0, 10));
  }

  const weeks: (string | null)[][] = [];
  let week: (string | null)[] = [];

  // Pad the first column so rows line up with weekdays (Sunday at the top).
  const firstWeekday = new Date(`${keys[0]}T00:00:00Z`).getUTCDay();
  for (let i = 0; i < firstWeekday; i++) week.push(null);

  for (const key of keys) {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(key);
  }
  while (week.length < 7) week.push(null);
  weeks.push(week);

  const months: MonthSegment[] = [];
  for (const column of weeks) {
    const first = column.find((k): k is string => k !== null);
    if (!first) continue;
    const name = MONTH_NAMES[Number(first.slice(5, 7)) - 1];
    const last = months[months.length - 1];
    if (last && last.name === name) last.weeks++;
    else months.push({ name, weeks: 1 });
  }

  return { keys, weeks, months };
}

export interface CategoryStats {
  activeDays: number;
  longestStreak: number;
  total: number;
}

export function computeStats(
  keys: string[],
  data: Record<string, number>
): CategoryStats {
  let activeDays = 0;
  let longestStreak = 0;
  let streak = 0;
  let total = 0;

  for (const key of keys) {
    const count = data[key] || 0;
    if (count > 0) {
      activeDays++;
      total += count;
      streak++;
      if (streak > longestStreak) longestStreak = streak;
    } else {
      streak = 0;
    }
  }

  return { activeDays, longestStreak, total };
}
