import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ProjectCard from "@/components/ProjectCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProjects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take: 2,
  });

  return (
    <>
      <HeroSection />

      {featuredProjects.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Featured Projects
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {featuredProjects.map((project) => (
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
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          About
        </h2>
        {/* TODO: replace with real bio copy */}
        <p className="mt-4 max-w-2xl leading-relaxed text-text-secondary">
          I&apos;m a CS senior at UVA who loves building things that matter. From
          full-stack web apps to inventory systems for small businesses in
          Bolivia, I care about writing clean code that solves real problems.
          When I&apos;m not coding, you&apos;ll find me practicing piano, studying
          Japanese, or at the gym.
        </p>
        <Link
          href="/about"
          className="mt-4 inline-block text-sm text-accent transition-opacity duration-150 hover:opacity-70"
        >
          More about me &rarr;
        </Link>
      </section>
    </>
  );
}
