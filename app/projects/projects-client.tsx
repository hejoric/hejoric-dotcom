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
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded-full border px-3 py-1 text-xs transition-opacity duration-150 ${
            activeTag === null
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`rounded-full border px-3 py-1 text-xs transition-opacity duration-150 ${
              activeTag === tag
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            githubUrl={project.githubUrl}
            liveUrl={project.liveUrl}
            featured={project.featured}
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
