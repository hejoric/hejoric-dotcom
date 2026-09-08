"use client";

import Image from "next/image";
import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

interface ProjectsClientProps {
  projects: Project[];
  allTags: string[];
}

export default function ProjectsClient({
  projects,
  allTags,
}: ProjectsClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? projects.filter((p) => p.techStack.includes(activeTag))
    : projects;

  return (
    <>
      {/* At lg the heading and the tag filter stack in the left column so the
          photo beside them has something to stand next to, instead of leaving
          a hole above the grid. Below lg everything is one column, ordered
          heading, photo, filter. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-x-12">
        <div className="lg:col-start-1 lg:row-start-1">
          <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
            Stuff I&apos;ve built.
          </h1>
          <p className="mt-4 max-w-[560px] leading-[1.7] text-text-secondary">
            Mostly niche tools for real people with specific problems: a
            store that needed off a 15 year old system, a nonprofit paying way
            more for hosting than it had to.{" "}
            <span className="font-display text-[17px] italic text-text-primary">
              Ask me anything about any of these!
            </span>
          </p>
        </div>
        <figure className="w-full max-w-[400px] lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:w-[300px]">
          <Image
            src="/jose-coding.jpg"
            alt="Jose working on a laptop at a cafe"
            width={1200}
            height={900}
            className="aspect-[4/3] w-full rounded object-cover contrast-[1.04]"
            priority
          />
          <figcaption className="mt-3.5 font-display text-[14.5px] italic text-text-muted">
            Natural habitat.
          </figcaption>
        </figure>
        <div className="flex flex-wrap gap-x-5 gap-y-2.5 lg:col-start-1 lg:row-start-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition-opacity duration-150 ${
              activeTag === null
                ? "border-b-[1.5px] border-text-primary pb-0.5 text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition-opacity duration-150 ${
                activeTag === tag
                  ? "border-b-[1.5px] border-text-primary pb-0.5 text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {filtered.map((project, i) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            githubUrl={project.githubUrl}
            liveUrl={project.liveUrl}
            featured={project.featured}
            index={i}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-text-secondary">
            No projects match that filter.
          </p>
        )}
      </div>
    </>
  );
}
