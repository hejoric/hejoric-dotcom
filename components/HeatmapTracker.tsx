import HeatmapGrid from "./HeatmapGrid";
import type { ActivityWindow } from "@/lib/activity";
import { buildCalendar, computeStats } from "@/lib/calendar";
import { CATEGORIES, listLabels, type Category } from "@/lib/categories";
import { plural } from "@/lib/utils";

function githubNote(github: NonNullable<ActivityWindow["github"]>): string {
  const parts = [
    plural(github.commits, "commit"),
    plural(github.pullRequests, "pull request"),
  ];
  if (github.reviews > 0) parts.push(plural(github.reviews, "review"));
  return `Live from github.com/hejoric · ${parts.join(" · ")}`;
}

/** `2026-09-28` -> `Sep 28`, read in UTC like every other day key. */
function shortDate(key: string): string {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function HeatmapTracker({
  activity,
}: {
  activity: ActivityWindow;
}) {
  const calendar = buildCalendar();
  const { days, notes, recentNotes, github } = activity;

  const tracked = CATEGORIES.filter(
    (category) => Object.keys(days[category.key] ?? {}).length > 0
  );
  const untracked: Category[] = CATEGORIES.filter(
    (category) => category.source === "manual" && !tracked.includes(category)
  );

  return (
    <div>
      {tracked.map((category) => {
        const data = days[category.key];
        const stats = computeStats(calendar.keys, data);
        const isGitHub = category.source === "github";

        return (
          <HeatmapGrid
            key={category.key}
            label={category.label}
            colorVar={category.colorVar}
            inkVar={category.inkVar}
            data={data}
            notes={notes[category.key]}
            weeks={calendar.weeks}
            months={calendar.months}
            unit={isGitHub ? "contribution" : "entry"}
            unitPlural={isGitHub ? undefined : "entries"}
            stat={
              isGitHub && github
                ? `${plural(github.total, "contribution")} · ${plural(stats.activeDays, "active day")} · longest streak ${stats.longestStreak}`
                : `${plural(stats.activeDays, "day")} · longest streak ${stats.longestStreak}`
            }
            note={
              isGitHub && github
                ? githubNote(github)
                : "Logged by hand · one entry per day"
            }
          />
        );
      })}

      {!github && (
        <div className="border-b border-border-soft py-7">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-code">
            Code
          </span>
          <p className="mt-3 max-w-[520px] text-sm leading-[1.7] text-text-secondary">
            This row pulls live from the GitHub API and it isn&apos;t loading
            right now. I&apos;d rather leave it out than show you a grid I
            can&apos;t verify.{" "}
            <a
              href="https://github.com/hejoric"
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

      {recentNotes.length > 0 && (
        <section className="border-b border-border-soft py-7">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            Recent notes
          </h2>
          <p className="mt-2.5 max-w-[560px] text-sm leading-[1.7] text-text-secondary">
            Some days get a line about what I actually did. These are the
            latest ones I&apos;ve made public, and the dotted squares above
            have them too.
          </p>
          <ul className="mt-5 space-y-3">
            {recentNotes.map((entry) => {
              const category = CATEGORIES.find((c) => c.key === entry.category);
              return (
                <li
                  key={`${entry.category}-${entry.date}`}
                  className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-4 gap-y-1 sm:grid-cols-[56px_96px_minmax(0,1fr)] sm:items-baseline"
                >
                  <time
                    dateTime={entry.date}
                    className="font-display text-[15px] italic text-text-muted"
                  >
                    {shortDate(entry.date)}
                  </time>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: `var(${category?.inkVar ?? "--text-muted"})` }}
                  >
                    {category?.label ?? entry.category}
                  </span>
                  <p className="col-span-2 break-words text-[15px] leading-[1.6] text-text-primary sm:col-span-1">
                    {entry.note}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {untracked.length > 0 && (
        <p className="mt-7 max-w-[560px] font-display text-[17px] italic leading-[1.6] text-text-muted">
          {listLabels(untracked)}{" "}
          {untracked.length === 1 ? "is" : "are"} logged by hand and
          {untracked.length === 1 ? " has" : " have"} nothing in
          {untracked.length === 1 ? " it" : " them"} yet. Once I start
          logging, that changes.
        </p>
      )}
    </div>
  );
}
