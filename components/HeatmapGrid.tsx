"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MonthSegment } from "@/lib/calendar";
import {
  getHeatmapLevel,
  heatmapCellColor,
  loggedCellColor,
} from "@/lib/categories";
import { plural } from "@/lib/utils";

// Day cell size and the gap between columns. Month labels are sized off the
// same pitch, so these have to stay in sync.
const CELL = 14;
const GAP = 4;
const PITCH = CELL + GAP;
const LEVELS = [0, 1, 2, 3, 4];
/** Wide enough for "Snow by RHCP, 30 min" on one line, narrow enough for a phone. */
const TOOLTIP_MAX_WIDTH = 240;

interface HeatmapGridProps {
  label: string;
  colorVar: string;
  /**
   * Graded Less/More scale (Code, many contributions a day) or the flat
   * logged/not-logged treatment used for hand-logged categories.
   */
  graded: boolean;
  /** Darker variant of `colorVar` for the label text (WCAG AA at 12px). */
  inkVar: string;
  /** `YYYY-MM-DD` -> count. Days absent from the map are zero. */
  data: Record<string, number>;
  /** `YYYY-MM-DD` -> public note. Only public notes are ever passed in. */
  notes?: Record<string, string>;
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
  graded,
  inkVar,
  data,
  notes = {},
  weeks,
  months,
  stat,
  note,
  unit,
  unitPlural,
}: HeatmapGridProps) {
  const [tooltip, setTooltip] = useState<{
    cell: HTMLElement;
    date: string;
  } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // A tapped note stays open until the next tap elsewhere. The tooltip is
  // fixed-position, so it is re-placed over its cell on every scroll, hidden
  // while the cell is scrolled out of sight or under the nav, and centered on
  // the cell unless its own width would run it off the screen. The cell
  // scales up on hover and focus, so it is anchored on the cell's middle.
  useLayoutEffect(() => {
    if (!tooltip) return;
    const place = () => {
      const el = tooltipRef.current;
      if (!el) return;
      const rect = tooltip.cell.getBoundingClientRect();
      const half = el.offsetWidth / 2 + 8;
      const center = rect.left + rect.width / 2;
      const middle = rect.top + rect.height / 2;
      const x = Math.min(
        Math.max(center, half),
        Math.max(half, document.documentElement.clientWidth - half)
      );
      el.style.left = `${x}px`;
      el.style.top = `${middle - CELL / 2 - 8}px`;
      const hit = document.elementFromPoint(center, middle);
      el.style.visibility = hit && tooltip.cell.contains(hit) ? "" : "hidden";
    };
    const close = () => setTooltip(null);
    const closeOutside = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.("[data-note-cell]")) close();
    };
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [tooltip]);

  // The grid is wider than a phone, and the recent weeks are the ones worth
  // seeing, so start the scroller at its right edge instead of last October.
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, []);

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
            style={{ color: `var(${inkVar})` }}
          >
            {label}
          </span>
        </span>
        <span className="font-display text-[15px] italic text-text-muted sm:text-right">
          {stat}
        </span>
      </div>
      <div ref={scrollerRef} className="overflow-x-auto pb-1">
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
                  const dayNote = notes[key];
                  const cellStyle = {
                    width: CELL,
                    height: CELL,
                    backgroundColor: graded
                      ? heatmapCellColor(colorVar, getHeatmapLevel(count))
                      : loggedCellColor(colorVar, count),
                    // A second log in a day gets a quiet inner ring.
                    boxShadow:
                      !graded && count >= 2
                        ? "inset 0 0 0 2px color-mix(in srgb, var(--background) 45%, transparent)"
                        : undefined,
                    animationDelay: `${wi * 14 + di * 3}ms`,
                  };

                  if (!dayNote) {
                    return (
                      <div
                        key={key}
                        className="heatmap-cell rounded-[3px]"
                        style={cellStyle}
                        onMouseEnter={(e) =>
                          setTooltip({ cell: e.currentTarget, date: key })
                        }
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  }

                  // A day with a public note is a real control, so the note
                  // can be read by keyboard focus and by tap, not only hover.
                  return (
                    <button
                      key={key}
                      type="button"
                      data-note-cell
                      aria-label={`${key}: ${plural(count, unit, unitPlural)}. ${dayNote}`}
                      className="heatmap-cell flex items-center justify-center rounded-[3px] p-0"
                      style={cellStyle}
                      onMouseEnter={(e) =>
                        setTooltip({ cell: e.currentTarget, date: key })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      onFocus={(e) =>
                        setTooltip({ cell: e.currentTarget, date: key })
                      }
                      onBlur={() => setTooltip(null)}
                      onClick={(e) =>
                        setTooltip({ cell: e.currentTarget, date: key })
                      }
                    >
                      <span
                        aria-hidden
                        className="h-1 w-1 rounded-full bg-text-primary opacity-80 dark:bg-background dark:opacity-90"
                      />
                    </button>
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
          {graded ? (
            <>
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
            </>
          ) : (
            <>
              <span
                className="h-[10px] w-[10px] rounded-[2.5px]"
                style={{ backgroundColor: loggedCellColor(colorVar, 0) }}
              />
              <span
                className="h-[10px] w-[10px] rounded-[2.5px]"
                style={{ backgroundColor: loggedCellColor(colorVar, 1) }}
              />
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
                Logged
              </span>
            </>
          )}
        </div>
      </div>
      {tooltip && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="pointer-events-none fixed z-50 w-max -translate-x-1/2 -translate-y-full rounded-md bg-text-primary px-2 py-1 text-xs text-background shadow-lg"
          style={{ maxWidth: TOOLTIP_MAX_WIDTH }}
        >
          {tooltip.date}: {plural(data[tooltip.date] || 0, unit, unitPlural)}
          {notes[tooltip.date] && (
            <span className="mt-0.5 block font-display text-[14px] italic leading-[1.35]">
              {notes[tooltip.date]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
