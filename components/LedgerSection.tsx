import Link from "next/link";
import type { ActivityWindow } from "@/lib/activity";
import { buildCalendar, computeStats } from "@/lib/calendar";
import {
  CATEGORIES,
  getHeatmapLevel,
  heatmapCellColor,
  listLabels,
  type Category,
} from "@/lib/categories";
import { plural } from "@/lib/utils";

export default function LedgerSection({
  activity,
}: {
  activity: ActivityWindow;
}) {
  const calendar = buildCalendar();
  const { days, github } = activity;

  const tracked = CATEGORIES.filter(
    (category) => Object.keys(days[category.key] ?? {}).length > 0
  );
  const untracked: Category[] = CATEGORIES.filter(
    (category) => category.source === "manual" && !tracked.includes(category)
  );

  if (tracked.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 pt-10">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          The Ledger
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
          Last 12 months
        </span>
      </div>
      <div className="mt-3 border-t border-border">
        {tracked.map((category) => {
          const data = days[category.key];
          const stats = computeStats(calendar.keys, data);

          // One cell per week column: the week's total, ramped like a day cell.
          const weekly = calendar.weeks.map((week) =>
            week.reduce(
              (sum, key) => sum + (key ? data[key] || 0 : 0),
              0
            )
          );

          return (
            <div
              key={category.key}
              className="grid gap-y-2 border-b border-border-soft py-[15px] sm:grid-cols-[110px_1fr_120px] sm:items-center sm:gap-6"
            >
              <span
                className="text-[11.5px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: `var(${category.colorVar})` }}
              >
                {category.label}
              </span>
              <div className="overflow-x-auto">
                <div className="flex w-max gap-[3px]">
                  {weekly.map((count, i) => (
                    <span
                      key={i}
                      className="heatmap-cell h-[10px] w-[10px] flex-none rounded-[2.5px]"
                      style={{
                        backgroundColor: heatmapCellColor(
                          category.colorVar,
                          getHeatmapLevel(count)
                        ),
                        animationDelay: `${i * 12}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="hidden text-right font-display text-[15px] italic text-text-muted sm:block">
                {category.source === "github" && github
                  ? plural(github.total, "contribution")
                  : plural(stats.activeDays, "day")}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <Link
          href="/tracker"
          className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
        >
          See the full tracker &rarr;
        </Link>
        {untracked.length > 0 && (
          <span className="font-display text-[15px] italic text-text-muted">
            {listLabels(untracked)} get logged by hand, and I keep the graph
            honest: no entries, no row.
          </span>
        )}
      </div>
    </section>
  );
}
