import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import LedgerSection from "@/components/LedgerSection";
import ProjectCard from "@/components/ProjectCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const ledgerStart = new Date();
  ledgerStart.setDate(ledgerStart.getDate() - 364);

  const [featuredProjects, activityLogs] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 2,
    }),
    prisma.activityLog.findMany({
      where: { date: { gte: ledgerStart } },
      select: { date: true, category: true, count: true },
    }),
  ]);

  return (
    <>
      <HeroSection />

      <LedgerSection logs={activityLogs} />

      <div
        className="flex justify-center gap-1.5 pb-1 pt-9"
        aria-hidden
      >
        <span className="h-1.5 w-1.5 rounded-[2px] bg-code" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-music" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-language" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-fitness" />
        <span className="h-1.5 w-1.5 rounded-[2px] bg-reading" />
      </div>

      {featuredProjects.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pt-11">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              Selected Work
            </span>
            <Link
              href="/projects"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
            >
              All projects &rarr;
            </Link>
          </div>
          <div className="mt-7 grid gap-10 sm:grid-cols-2 sm:gap-14">
            {featuredProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                techStack={project.techStack}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
                featured={project.featured}
                index={i}
                variant="plain"
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 border-t border-border px-6 py-14 text-center">
        <p className="mx-auto max-w-[700px] font-display text-2xl leading-[1.4] text-text-primary sm:text-[30px]">
          CS at UVA, headed for big tech. Also: piano, three languages, and a
          gym habit. <span className="italic">The graph keeps me honest.</span>
        </p>
        <Link
          href="/about"
          className="mt-5 inline-block text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
        >
          More about me &rarr;
        </Link>
      </section>
    </>
  );
}
