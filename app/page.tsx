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
        <p className="mt-4 max-w-2xl leading-relaxed text-text-secondary">
          I&apos;m a Computer Science student at the University of Virginia
          (BS, expected 2027), after an AS in Engineering at Northern Virginia
          Community College. I build full-stack software that solves real
          problems — recently a self-hosted Odoo ERP for a family retail
          business, a Django student-org platform, and a JavaFX course-review
          app. When I&apos;m not coding, you&apos;ll find me at the piano,
          studying Japanese and Korean, or at the gym.
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
