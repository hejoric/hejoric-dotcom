"use client";

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
      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
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

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
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
