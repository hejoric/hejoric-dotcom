"use client";

import { useState } from "react";
import { dateToKey } from "@/lib/utils";
import { getHeatmapLevel, heatmapCellColor } from "@/lib/categories";

interface HeatmapGridProps {
  label: string;
  colorVar: string;
  data: Record<string, number>;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function HeatmapGrid({ label, colorVar, data }: HeatmapGridProps) {
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= today) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  const firstDayOfWeek = days[0].getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  for (const day of days) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // Stats for the header: active days + longest streak in the window.
  let activeDays = 0;
  let longestStreak = 0;
  let streak = 0;
  for (const day of days) {
    if ((data[dateToKey(day)] || 0) > 0) {
      activeDays++;
      streak++;
      if (streak > longestStreak) longestStreak = streak;
    } else {
      streak = 0;
    }
  }

  // Month labels: segments sized by how many weeks each month spans.
  const monthSegments: { name: string; weeks: number }[] = [];
  for (const week of weeks) {
    const firstDay = week.find((d): d is Date => d !== null);
    if (!firstDay) continue;
    const name = MONTH_NAMES[firstDay.getMonth()];
    const last = monthSegments[monthSegments.length - 1];
    if (last && last.name === name) {
      last.weeks++;
    } else {
      monthSegments.push({ name, weeks: 1 });
    }
  }

  return (
    <div className="relative border-b border-border-soft py-7">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 rounded-[3px]"
            style={{ backgroundColor: `var(${colorVar})` }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: `var(${colorVar})` }}
          >
            {label}
          </span>
        </span>
        <span className="font-display text-[15px] italic text-text-muted">
          {activeDays} days &middot; longest streak {longestStreak}
        </span>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="w-max">
          <div className="mb-1.5 flex">
            {monthSegments.map((seg, i) => (
              <span
                key={i}
                className="overflow-hidden whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.08em] text-text-muted"
                style={{ width: `${seg.weeks * 13}px` }}
              >
                {seg.weeks >= 2 ? seg.name : ""}
              </span>
            ))}
          </div>
          <div className="inline-flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => {
                  if (!day) {
                    return <div key={`empty-${di}`} className="h-[10px] w-[10px]" />;
                  }
                  const key = dateToKey(day);
                  const count = data[key] || 0;
                  const level = getHeatmapLevel(count);
                  return (
                    <div
                      key={key}
                      className="heatmap-cell h-[10px] w-[10px] rounded-[2.5px]"
                      style={{
                        backgroundColor: heatmapCellColor(colorVar, level),
                        animationDelay: `${wi * 14 + di * 3}ms`,
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          date: key,
                          count,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-text-primary px-2 py-1 text-xs text-background shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          {tooltip.date}: {tooltip.count} {tooltip.count === 1 ? "entry" : "entries"}
        </div>
      )}
    </div>
  );
}
