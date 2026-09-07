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
      <ProjectsClient projects={projects} allTags={allTags} />
    </div>
  );
}
