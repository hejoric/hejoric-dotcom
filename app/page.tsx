import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import LedgerSection from "@/components/LedgerSection";
import NowBlock from "@/components/NowBlock";
import PhotoStrip from "@/components/PhotoStrip";
import ProjectCard from "@/components/ProjectCard";
import YouTubeCard from "@/components/YouTubeCard";
import { getActivityWindow } from "@/lib/activity";
import { EMAIL, YOUTUBE_HREF } from "@/lib/links";
import { prisma } from "@/lib/prisma";
import { fetchLatestVideo } from "@/lib/youtube";

// Content comes from Postgres, so re-render on a short interval instead of
// freezing at build time (edits made in /admin appear within five minutes).
export const revalidate = 300;

export default async function HomePage() {
  const [featuredProjects, activity, latestVideo] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 2,
    }),
    getActivityWindow(),
    fetchLatestVideo(),
  ]);

  return (
    <>
      <HeroSection />

      <NowBlock />

      <LedgerSection activity={activity} />

      <PhotoStrip />

      <YouTubeCard video={latestVideo} />

      {featuredProjects.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pt-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              Things I&apos;ve built
            </h2>
            <Link
              href="/projects"
              className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
            >
              All projects &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-10 sm:grid-cols-2 sm:gap-14">
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
                clampDescription
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-20 border-t border-border px-6 py-14 text-center">
        <p className="mx-auto max-w-[640px] font-display text-2xl leading-[1.35] text-text-primary sm:text-[30px]">
          Questions about any of it, from Snow to DNS?{" "}
          <span className="italic text-text-secondary">
            Reach out any time, I like the questions.
          </span>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex h-10 items-center rounded-md bg-text-primary px-5 text-[13px] font-semibold text-background transition-opacity duration-150 hover:opacity-80"
          >
            Say hi
          </a>
          <a
            href={YOUTUBE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-md border border-border px-5 text-[13px] font-semibold text-text-primary transition-colors duration-150 hover:border-text-muted"
          >
            Follow on YouTube
          </a>
        </div>
        <p className="mt-6 text-[13px] text-text-muted">
          Hiring? The work version of me lives on{" "}
          <Link
            href="/work"
            className="border-b border-border text-text-secondary transition-opacity duration-150 hover:opacity-70"
          >
            Work with me
          </Link>
          , with my resume.
        </p>
      </section>
    </>
  );
}
