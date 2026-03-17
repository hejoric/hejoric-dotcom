"use client";

import { useState } from "react";
import { getHeatmapColor, dateToKey } from "@/lib/utils";

interface HeatmapGridProps {
  category: string;
  label: string;
  emoji: string;
  data: Record<string, number>;
}

export default function HeatmapGrid({
  category,
  label,
  emoji,
  data,
}: HeatmapGridProps) {
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

  return (
    <div className="relative">
      <h3 className="mb-3 text-sm font-medium text-text-primary">
        <span className="mr-2">{emoji}</span>
        {label}
      </h3>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${di}`}
                      className="h-[13px] w-[13px]"
                    />
                  );
                }
                const key = dateToKey(day);
                const count = data[key] || 0;
                return (
                  <div
                    key={key}
                    className={`h-[13px] w-[13px] rounded-[2px] ${getHeatmapColor(count)}`}
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
