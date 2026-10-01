import Link from "next/link";
import type { ActivityWindow } from "@/lib/activity";
import { buildCalendar, computeStats } from "@/lib/calendar";
import {
  CATEGORIES,
  categoryCellColor,
  listLabels,
  type Category,
} from "@/lib/categories";
import { GITHUB_HREF } from "@/lib/links";
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

  // One column per week. The columns are fluid rather than a fixed pixel size,
  // so the whole year (recent weeks included) fits a phone without scrolling.
  const columns = {
    gridTemplateColumns: `repeat(${calendar.weeks.length}, minmax(0, 1fr))`,
  };

  return (
    <section id="ledger" className="mx-auto max-w-5xl scroll-mt-20 px-6 pt-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          The Ledger
        </h2>
        <Link
          href="/tracker"
          className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
        >
          Full tracker &rarr;
        </Link>
      </div>
      <p className="mt-2.5 max-w-[640px] text-[15.5px] leading-[1.65] text-text-secondary">
        A GitHub contribution graph, but for everything. Code pulls live from
        GitHub. The rest I log by hand, so a thin row means I didn&apos;t do
        the thing.
      </p>
      <div className="mt-5 border-t border-border">
        {tracked.map((category) => {
          const data = days[category.key];
          const stats = computeStats(calendar.keys, data);

          // One cell per week column: the week's total, colored like a day cell.
          const weekly = calendar.weeks.map((week) =>
            week.reduce(
              (sum, key) => sum + (key ? data[key] || 0 : 0),
              0
            )
          );

          return (
            <div
              key={category.key}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2.5 border-b border-border-soft py-[18px] sm:grid-cols-[100px_minmax(0,1fr)_150px] sm:gap-x-6"
            >
              <span
                className="text-[11.5px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: `var(${category.inkVar})` }}
              >
                {category.label}
              </span>
              <div
                className="col-span-2 row-start-2 grid gap-[2px] sm:col-span-1 sm:row-start-auto sm:gap-[3px]"
                style={columns}
                role="img"
                aria-label={`${category.label}, weekly activity over the last 12 months`}
              >
                {weekly.map((count, i) => (
                  <span
                    key={i}
                    className="heatmap-cell aspect-[1/2.2] rounded-[2px] sm:aspect-[1/1.6] sm:rounded-[2.5px]"
                    style={{
                      backgroundColor: categoryCellColor(category, count),
                      animationDelay: `${i * 12}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-right font-display text-[15px] italic text-text-muted sm:col-start-3 sm:row-start-1">
                {category.source === "github" && github
                  ? plural(github.total, "contribution")
                  : plural(stats.activeDays, "day")}
              </span>
            </div>
          );
        })}
        {/* The hero points at this graph, so when the live Code row cannot
            load, say so here instead of dropping the section silently. */}
        {!github && (
          <div className="grid gap-y-2 border-b border-border-soft py-[18px] sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-x-6">
            <span
              className="text-[11.5px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--cat-code-ink)" }}
            >
              Code
            </span>
            <p className="text-sm leading-[1.7] text-text-secondary">
              This row pulls live from GitHub and it isn&apos;t loading right
              now, so it&apos;s left out rather than guessed.{" "}
              <a
                href={GITHUB_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-text-muted transition-opacity duration-150 hover:opacity-70"
              >
                See it on GitHub
              </a>
              .
            </p>
          </div>
        )}
        {tracked.length > 0 && (
          <div className="grid pt-2 sm:grid-cols-[100px_minmax(0,1fr)_150px] sm:gap-x-6" aria-hidden>
            <div className="grid sm:col-start-2" style={columns}>
              {calendar.months.map((segment, i) => (
                <span
                  key={i}
                  // Twelve labels crowd a phone, so every other one steps aside
                  // there (invisible, not hidden, to keep the column spans).
                  className={`overflow-hidden whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted ${i % 2 === 1 ? "max-sm:invisible" : ""}`}
                  style={{ gridColumn: `span ${segment.weeks}` }}
                >
                  {segment.weeks >= 3 ? segment.name : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {untracked.length > 0 && (
        <p className="mt-4 font-display text-[15px] italic text-text-muted">
          {listLabels(untracked)} I log by hand, so a row only shows up once
          there&apos;s something real in it.
        </p>
      )}
    </section>
  );
}
