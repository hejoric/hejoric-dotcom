"use client";

import { useState } from "react";
import type { MonthSegment } from "@/lib/calendar";
import { getHeatmapLevel, heatmapCellColor } from "@/lib/categories";
import { plural } from "@/lib/utils";

// Day cell size and the gap between columns. Month labels are sized off the
// same pitch, so these have to stay in sync.
const CELL = 14;
const GAP = 4;
const PITCH = CELL + GAP;
const LEVELS = [0, 1, 2, 3, 4];

interface HeatmapGridProps {
  label: string;
  colorVar: string;
  /** `YYYY-MM-DD` -> count. Days absent from the map are zero. */
  data: Record<string, number>;
  /** Week columns from buildCalendar(), Sunday-first. */
  weeks: (string | null)[][];
  months: MonthSegment[];
  /** Right-aligned stat line in the header. */
  stat: string;
  /** Where this row's numbers come from, shown under the grid. */
  note: string;
  /** Word used in the tooltip: "contribution", "entry", ... */
  unit: string;
  /** Plural of `unit`, when adding an "s" is wrong ("entry" -> "entries"). */
  unitPlural?: string;
}

export default function HeatmapGrid({
  label,
  colorVar,
  data,
  weeks,
  months,
  stat,
  note,
  unit,
  unitPlural,
}: HeatmapGridProps) {
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="relative border-b border-border-soft py-7">
      <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
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
        <span className="font-display text-[15px] italic text-text-muted sm:text-right">
          {stat}
        </span>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="w-max">
          <div className="mb-1.5 flex">
            {months.map((segment, i) => (
              <span
                key={i}
                className="overflow-hidden whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.08em] text-text-muted"
                style={{ width: `${segment.weeks * PITCH}px` }}
              >
                {segment.weeks >= 2 ? segment.name : ""}
              </span>
            ))}
          </div>
          <div className="inline-flex" style={{ gap: GAP }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                {week.map((key, di) => {
                  if (!key) {
                    return (
                      <div
                        key={`empty-${di}`}
                        style={{ width: CELL, height: CELL }}
                      />
                    );
                  }
                  const count = data[key] || 0;
                  return (
                    <div
                      key={key}
                      className="heatmap-cell rounded-[3px]"
                      style={{
                        width: CELL,
                        height: CELL,
                        backgroundColor: heatmapCellColor(
                          colorVar,
                          getHeatmapLevel(count)
                        ),
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
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
          {note}
        </p>
        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden>
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
            Less
          </span>
          {LEVELS.map((level) => (
            <span
              key={level}
              className="h-[10px] w-[10px] rounded-[2.5px]"
              style={{ backgroundColor: heatmapCellColor(colorVar, level) }}
            />
          ))}
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
            More
          </span>
        </div>
      </div>
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-text-primary px-2 py-1 text-xs text-background shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          {tooltip.date}: {plural(tooltip.count, unit, unitPlural)}
        </div>
      )}
    </div>
  );
}
