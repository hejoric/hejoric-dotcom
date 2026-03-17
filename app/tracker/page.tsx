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
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        Consistency Log
      </h1>
      <p className="mt-2 max-w-2xl text-text-secondary">
        This page tracks daily effort, not just outcomes. Each heatmap represents
        a year of activity across a discipline I care about. The goal is
        consistency — showing up every day, even when progress feels invisible.
      </p>

      <div className="mt-12">
        <HeatmapTracker data={data} />
      </div>
    </div>
  );
}
