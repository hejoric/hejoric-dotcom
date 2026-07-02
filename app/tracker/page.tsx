import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeatmapTracker from "@/components/HeatmapTracker";

export const metadata: Metadata = {
  title: "Consistency Log",
  description:
    "Tracking daily effort across code, music, languages, fitness, and content — by hejoric.",
  openGraph: {
    title: "Consistency Log | hejoric",
    description:
      "Tracking daily effort across code, music, languages, fitness, and content — by hejoric.",
    url: "https://hejoric.com/tracker",
    type: "website",
    images: [{ url: "/og-default.png" }],
  },
  alternates: { canonical: "https://hejoric.com/tracker" },
};

export default async function TrackerPage() {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  const activities = await prisma.activityLog.findMany({
    where: {
      date: { gte: startDate },
    },
  });

  const data: Record<string, Record<string, number>> = {};
  for (const entry of activities) {
    if (!data[entry.category]) data[entry.category] = {};
    const key = entry.date.toISOString().split("T")[0];
    data[entry.category][key] = (data[entry.category][key] || 0) + entry.count;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
        The tracker.
      </h1>
      <p className="mt-4 max-w-[560px] leading-[1.7] text-text-secondary">
        One square per day, one color per pursuit.{" "}
        <span className="font-display text-[17px] italic text-text-primary">
          365 days, five ways.
        </span>
      </p>

      <div className="mt-9">
        <HeatmapTracker data={data} />
      </div>
    </div>
  );
}
