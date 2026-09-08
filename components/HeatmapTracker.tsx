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

export default function HeatmapTracker({
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
            data={data}
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
