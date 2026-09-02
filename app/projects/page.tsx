import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProjectsClient from "./projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects built by Jose R. Herrera (hejoric): full-stack apps, self-hosted infrastructure, and tools with real users.",
  openGraph: {
    title: "Projects | hejoric",
    description:
      "Projects built by Jose R. Herrera (hejoric): full-stack apps, self-hosted infrastructure, and tools with real users.",
    url: "https://hejoric.com/projects",
    type: "website",
  },
  alternates: { canonical: "https://hejoric.com/projects" },
};

// Content comes from Postgres, so re-render on a short interval instead of
// freezing at build time (edits made in /admin appear within five minutes).
export const revalidate = 300;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.techStack))
  ).sort();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
        Projects.
      </h1>
      <p className="mt-4 max-w-[560px] leading-[1.7] text-text-secondary">
        Things I&apos;ve shipped, mostly where software meets{" "}
        <span className="font-display text-[17px] italic text-text-primary">
          the messy real world.
        </span>
      </p>
      <ProjectsClient projects={projects} allTags={allTags} />
    </div>
  );
}
