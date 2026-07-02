import Link from "next/link";
import { CATEGORIES, getHeatmapLevel, heatmapCellColor } from "@/lib/categories";

interface LedgerSectionProps {
  logs: { date: Date; category: string; count: number }[];
}

const WEEKS = 52;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export default function LedgerSection({ logs }: LedgerSectionProps) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const start = new Date(today.getTime() - (WEEKS * 7 - 1) * MS_PER_DAY);
  start.setHours(0, 0, 0, 0);

  // Weekly totals per category over the last 52 weeks.
  const weekly: Record<string, number[]> = {};
  for (const cat of CATEGORIES) {
    weekly[cat.key] = Array(WEEKS).fill(0);
  }
  for (const log of logs) {
    const idx = Math.floor((log.date.getTime() - start.getTime()) / (7 * MS_PER_DAY));
    if (idx >= 0 && idx < WEEKS && weekly[log.category]) {
      weekly[log.category][idx] += log.count;
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-10">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          The Ledger
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
          Last 52 weeks
        </span>
      </div>
      <div className="mt-3 border-t border-border">
        {CATEGORIES.map((cat) => {
          const cells = weekly[cat.key];
          const activeWeeks = cells.filter((c) => c > 0).length;
          return (
            <div
              key={cat.key}
              className="grid grid-cols-[72px_1fr] items-center gap-x-4 gap-y-2 border-b border-border-soft py-[15px] sm:grid-cols-[110px_1fr_96px] sm:gap-6"
            >
              <span
                className="text-[11.5px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: `var(${cat.colorVar})` }}
              >
                {cat.label}
              </span>
              <div className="overflow-x-auto">
                <div className="flex w-max gap-[3px]">
                  {cells.map((count, i) => (
                    <span
                      key={i}
                      className="heatmap-cell h-3 w-3 flex-none rounded-[2.5px]"
                      style={{
                        backgroundColor: heatmapCellColor(
                          cat.colorVar,
                          getHeatmapLevel(count)
                        ),
                        animationDelay: `${i * 12}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="hidden text-right font-display text-[15px] italic text-text-muted sm:block">
                {activeWeeks} / {WEEKS} wks
              </span>
            </div>
          );
        })}
      </div>
      <Link
        href="/tracker"
        className="mt-4 inline-block text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
      >
        See the full tracker &rarr;
      </Link>
    </section>
  );
}
