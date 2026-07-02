import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProjectsClient from "./projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects built by Jose R. Herrera (hejoric) — full-stack apps, tools, and open source contributions.",
  openGraph: {
    title: "Projects | hejoric",
    description:
      "Projects built by Jose R. Herrera (hejoric) — full-stack apps, tools, and open source contributions.",
    url: "https://hejoric.com/projects",
    type: "website",
    images: [{ url: "/og-default.png" }],
  },
  alternates: { canonical: "https://hejoric.com/projects" },
};

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
        Things I&apos;ve shipped — mostly where software meets{" "}
        <span className="font-display text-[17px] italic text-text-primary">
          the messy real world.
        </span>
      </p>
      <ProjectsClient projects={projects} allTags={allTags} />
    </div>
  );
}
