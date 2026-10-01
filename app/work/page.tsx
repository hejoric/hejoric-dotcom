import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { fetchGitHubContributions } from "@/lib/github";
import {
  EMAIL,
  GITHUB_HREF,
  LINKEDIN_HREF,
  RESUME_HREF,
} from "@/lib/links";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Work with me",
  description:
    "Jose Ricardo Herrera, UVA CS class of 2027, open to new-grad software engineering roles. Resume, projects, and how to reach me.",
  openGraph: {
    title: "Work with me | hejoric",
    description:
      "Jose Ricardo Herrera, UVA CS class of 2027, open to new-grad software engineering roles. Resume, projects, and how to reach me.",
    url: "https://hejoric.com/work",
    type: "website",
  },
  alternates: { canonical: "https://hejoric.com/work" },
};

// Content comes from Postgres, so re-render on a short interval instead of
// freezing at build time (edits made in /admin appear within five minutes).
export const revalidate = 300;

const AVAILABILITY = "Open to new-grad software engineering roles, 2027";

const buttonSolid =
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-text-primary px-5 text-[13px] font-semibold text-background transition-opacity duration-150 hover:opacity-80";
const buttonLine =
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-border px-5 text-[13px] font-semibold text-text-primary transition-colors duration-150 hover:border-text-muted";
const quietLink =
  "text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70";
const microLabel =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted";

export default async function WorkPage() {
  const [projects, github] = await Promise.all([
    prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    }),
    fetchGitHubContributions(),
  ]);

  const featured = projects.filter((p) => p.featured).slice(0, 2);
  const others = projects.filter((p) => !featured.includes(p));

  // Every number here is real. The contribution count is live, so it is left
  // out entirely when GitHub cannot be reached rather than shown stale.
  const proof = [
    { value: "$178 → $12/yr", detail: "Hosting for a 501(c)(3), migrated with zero downtime" },
    { value: "500+", detail: "Products migrated into a self-hosted Odoo ERP" },
    ...(github
      ? [{ value: github.total.toLocaleString("en-US"), detail: "GitHub contributions in the last 12 months, live" }]
      : []),
    { value: "AWS", detail: "Certified Cloud Practitioner" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 pb-4 pt-10 sm:pt-16">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start lg:gap-12">
        <div>
          <p className="inline-flex items-center gap-2 text-balance rounded-2xl border border-border py-1.5 pl-2.5 pr-3 text-[11.5px] font-medium text-text-secondary min-[380px]:whitespace-nowrap min-[380px]:rounded-full min-[440px]:gap-2.5 min-[440px]:pr-3.5 min-[440px]:text-[12.5px]">
            <span
              className="h-2 w-2 flex-none rounded-full bg-language shadow-[0_0_0_3px_color-mix(in_srgb,var(--cat-language)_22%,transparent)]"
              aria-hidden
            />
            {AVAILABILITY}
          </p>
          <p className={`mt-7 ${microLabel}`}>Work with me</p>
          <h1 className="mt-2 font-display text-[44px] leading-[1.04] tracking-[-0.01em] text-text-primary sm:text-5xl lg:text-[60px]">
            I&apos;m Jose Ricardo Herrera.
            <span className="mt-2 block text-[0.42em] italic leading-snug tracking-normal text-text-secondary">
              Online I go by Hejoric.
            </span>
          </h1>
          <p className="mt-5 max-w-[580px] text-base leading-[1.72] text-text-secondary sm:text-[17px]">
            UVA CS, class of 2027. I build{" "}
            <span className="font-medium text-text-primary">
              usable niche tools for real organizations
            </span>{" "}
            and run them in production: a nonprofit&apos;s site and
            infrastructure, a retail store&apos;s ERP. That means as much time
            on deploys, data migrations, and DNS as on features, and I&apos;d
            take that over the other way around.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={RESUME_HREF} target="_blank" rel="noopener noreferrer" className={`${buttonSolid} flex-1 sm:flex-none`}>
              Resume (PDF)
            </a>
            <a href={`mailto:${EMAIL}`} className={`${buttonLine} flex-1 sm:flex-none`}>
              Email me
            </a>
            <span className="flex w-full justify-center gap-5 pt-1 sm:ml-2 sm:w-auto sm:pt-0">
              <a href={GITHUB_HREF} target="_blank" rel="noopener noreferrer" className={quietLink}>
                GitHub &#8599;
              </a>
              <a href={LINKEDIN_HREF} target="_blank" rel="noopener noreferrer" className={quietLink}>
                LinkedIn &#8599;
              </a>
            </span>
          </div>
        </div>
        <figure className="hidden lg:mt-1.5 lg:block">
          <Image
            src="/jose-lawn.jpg"
            alt="Jose on the Lawn at UVA"
            width={800}
            height={1000}
            sizes="250px"
            className="h-[312px] w-full rounded object-cover contrast-[1.04]"
            priority
          />
          <figcaption className="mt-3.5 font-display text-[14.5px] italic text-text-muted">
            On the Lawn at UVA. Fourth year, class of 2027.
          </figcaption>
        </figure>
      </section>

      {/* Hairlines come from the 1px gap showing the container color through. */}
      <section
        aria-label="Highlights"
        className={`mt-12 grid grid-cols-2 gap-px border-y border-border bg-border-soft ${proof.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      >
        {proof.map((item) => (
          <div
            key={item.value}
            className="bg-background py-5 pr-4 odd:last:col-span-2 lg:px-5 lg:first:pl-0 lg:odd:last:col-span-1 even:pl-4"
          >
            <div className="font-display text-[26px] leading-tight text-text-primary sm:text-[30px]">
              {item.value}
            </div>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-text-secondary">
              {item.detail}
            </p>
          </div>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="pt-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className={microLabel}>Selected work</h2>
            <Link href="/projects" className={quietLink}>
              All projects &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {featured.map((project, i) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                techStack={project.techStack}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
                featured={project.featured}
                index={i}
                clampDescription
              />
            ))}
          </div>
          {others.length > 0 && (
            <ul className="mt-8 border-t border-border">
              {others.map((project) => {
                const href = project.liveUrl || project.githubUrl;
                return (
                  <li
                    key={project.id}
                    className="grid gap-1 border-b border-border-soft py-4 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-baseline sm:gap-5"
                  >
                    <span className="font-display text-[22px] text-text-primary">
                      {project.title}
                    </span>
                    <span className="line-clamp-2 text-[14px] leading-[1.55] text-text-secondary">
                      {project.description}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
                      >
                        {project.liveUrl ? "Live" : "GitHub"} &#8599;
                      </a>
                    ) : (
                      <span />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <section className="mt-20 border-t border-border py-14 text-center">
        <p className="mx-auto max-w-[640px] font-display text-2xl leading-[1.35] text-text-primary sm:text-[30px]">
          Hiring for 2027?{" "}
          <span className="italic text-text-secondary">
            I&apos;d like to hear about it.
          </span>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${EMAIL}`} className={buttonSolid}>
            Email me
          </a>
          <a href={RESUME_HREF} target="_blank" rel="noopener noreferrer" className={buttonLine}>
            Resume (PDF)
          </a>
        </div>
      </section>
    </div>
  );
}
