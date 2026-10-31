import Image from "next/image";
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
}

// No tag filter on purpose: with a handful of projects most tags match a single
// card, so the filter only added rows of buttons. Bring it back at about 8.
export default function ProjectsClient({ projects }: ProjectsClientProps) {
  return (
    <>
      {/* The photo sits beside the heading from lg up. Below lg it stacks under
          the heading, and below sm it is hidden so the first project shows
          early on a phone. */}
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
        <figure className="hidden w-full max-w-[400px] sm:block lg:col-start-2 lg:row-start-1 lg:w-[300px]">
          <Image
            src="/jose-coding.jpg"
            alt="Jose working on a laptop at a cafe"
            width={1200}
            height={900}
            className="aspect-[4/3] w-full rounded object-cover contrast-[1.04]"
          />
          <figcaption className="mt-3.5 font-display text-[14.5px] italic text-text-muted">
            Natural habitat.
          </figcaption>
        </figure>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
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
      </div>
    </>
  );
}
