import type { Metadata } from "next";
import HeatmapTracker from "@/components/HeatmapTracker";
import { getActivityWindow } from "@/lib/activity";

export const metadata: Metadata = {
  title: "Tracker",
  description:
    "A year of real activity: GitHub contributions plus hand-logged practice across music, language, fitness, and reading.",
  openGraph: {
    title: "Tracker | hejoric",
    description:
      "A year of real activity: GitHub contributions plus hand-logged practice across music, language, fitness, and reading.",
    url: "https://hejoric.com/tracker",
    type: "website",
  },
  alternates: { canonical: "https://hejoric.com/tracker" },
};

// Content comes from Postgres, so re-render on a short interval instead of
// freezing at build time (edits made in /admin appear within five minutes).
export const revalidate = 300;

export default async function TrackerPage() {
  const activity = await getActivityWindow();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
        The tracker.
      </h1>
      <p className="mt-4 max-w-[580px] leading-[1.7] text-text-secondary">
        One square per day. Code is pulled live from my GitHub contribution
        graph, private repositories included. Everything else I log by hand.{" "}
        <span className="font-display text-[17px] italic text-text-primary">
          Nothing here is generated.
        </span>
      </p>

      <div className="mt-9">
        <HeatmapTracker activity={activity} />
      </div>
    </div>
  );
}
