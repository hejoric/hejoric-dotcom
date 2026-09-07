import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Jose R. Herrera (hejoric): CS student at the University of Virginia, full-stack and infrastructure developer.",
  openGraph: {
    title: "About | hejoric",
    description:
      "About Jose R. Herrera (hejoric): CS student at the University of Virginia, full-stack and infrastructure developer.",
    url: "https://hejoric.com/about",
    type: "website",
  },
  alternates: { canonical: "https://hejoric.com/about" },
};

const experience = [
  {
    org: "Loudoun Nature Conservation Project",
    role: "Technical Lead, Web & Infrastructure (Volunteer)",
    dates: "Jul 2026 - Present",
    location: "Remote",
    href: "https://loudounnatureconservation.org",
    points: [
      "Rebuilt a managed WordPress site as a statically generated Astro and Tailwind site on Cloudflare Pages, cutting recurring hosting cost from $178/year to roughly $12/year for a 501(c)(3) nonprofit.",
      "Migrated hosting, DNS, and domain registration from Bluehost to Cloudflare with zero downtime, consolidating registrar, DNS, and CDN under one provider.",
      "Integrated Keystatic, a Git-based CMS storing content as YAML, so non-technical staff edit pages in the browser while every change stays version-controlled. Own search and analytics, and wrote the stack documentation for volunteer handoff.",
    ],
  },
  {
    org: "Costco Wholesale",
    role: "Produce Associate",
    dates: "Sep 2024 - Jul 2025",
    location: "Sterling, VA",
    href: null,
    points: [
      "Operated AS/400 mainframe workflows for inventory tracking and sales analysis in a legacy enterprise environment.",
    ],
  },
];

const education = [
  {
    school: "University of Virginia",
    detail: "BS, Computer Science · expected May 2027",
    coursework:
      "Machine Learning, Database Systems, Data Structures & Algorithms II, Software Development Essentials, Artificial Intelligence, Discrete Math & Theory, Cybersecurity, Software Engineering",
    location: "Charlottesville, VA",
  },
  {
    school: "Northern Virginia Community College",
    detail: "AS, Engineering · May 2025",
    coursework: null,
    location: "Annandale, VA",
  },
];

const skills: { label: string; items: string; colorClass: string }[] = [
  {
    label: "Languages",
    items: "C++, Java, Python, TypeScript/JavaScript, SQL, R",
    colorClass: "text-code",
  },
  {
    label: "Technologies",
    items:
      "Git, Linux, Docker, PostgreSQL, Prisma, JDBC, Hibernate, Next.js, React, Django, FastAPI, Astro, Tailwind, LLM APIs (Gemini), AWS, Vercel, Cloudflare",
    colorClass: "text-code",
  },
  {
    label: "Certifications",
    items: "AWS Certified Cloud Practitioner",
    colorClass: "text-code",
  },
  {
    label: "Spoken",
    items: "English and Spanish (fluent) · studying Japanese and Korean",
    colorClass: "text-language",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid items-start gap-12 sm:grid-cols-[1fr_300px] sm:gap-16">
        <div>
          <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
            About me.
          </h1>
          <div className="mt-6 max-w-[560px] space-y-[18px] leading-[1.8] text-text-secondary">
            <p>
              I&apos;m Jose R. Herrera, a Computer Science student at the
              University of Virginia. My favorite work sits where software
              meets the messy real world: self-hosting an ERP to replace a
              retail store&apos;s 30-year-old system, migrating 500+ products
              into PostgreSQL, and taking a nonprofit off managed WordPress so
              it costs $12 a year instead of $178.
            </p>
            <p>
              That means I spend as much time on deployment, data migration,
              and DNS as I do on features, and I like it that way. I care
              about systems that keep working after the person who built them
              moves on, which is why I document and hand off what I build.{" "}
              <span className="font-display text-[17px] italic text-text-primary">
                This site is the same idea, applied to myself.
              </span>
            </p>
            <p>
              Away from the keyboard: piano, languages (Japanese and Korean
              right now), and the gym.
            </p>
          </div>
          <div className="mt-8 flex gap-7">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b-[1.5px] border-text-primary pb-[3px] text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-primary transition-opacity duration-150 hover:opacity-70"
            >
              Resume &#8599;
            </a>
            <a
              href="mailto:hejoric@outlook.com"
              className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
            >
              Say hi &rarr;
            </a>
          </div>
        </div>
        <div className="hidden sm:block">
          <Image
            src="/headshot.png"
            alt="Jose R. Herrera"
            width={300}
            height={360}
            className="h-[360px] w-[300px] rounded object-cover contrast-[1.04]"
            priority
          />
          <div className="mt-3.5 font-display text-[14.5px] italic text-text-muted">
            Charlottesville, VA
          </div>
        </div>
      </div>

      <section className="mt-12">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Experience
        </span>
        <div className="mt-3 border-t border-border">
          {experience.map((job) => (
            <div key={job.org} className="border-b border-border-soft py-[22px]">
              <div className="grid items-baseline gap-1 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <div className="font-display text-[22px] text-text-primary">
                    {job.href ? (
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity duration-150 hover:opacity-70"
                      >
                        {job.org} &#8599;
                      </a>
                    ) : (
                      job.org
                    )}
                  </div>
                  <div className="mt-1 text-[13.5px] text-text-secondary">
                    {job.role}
                  </div>
                </div>
                <span className="font-display text-[14.5px] italic text-text-muted sm:text-right">
                  {job.dates}
                  <span className="block">{job.location}</span>
                </span>
              </div>
              <ul className="mt-3.5 max-w-[680px] space-y-2">
                {job.points.map((point) => (
                  <li
                    key={point}
                    className="relative pl-4 text-[14.5px] leading-[1.7] text-text-secondary before:absolute before:left-0 before:top-[9px] before:h-[5px] before:w-[5px] before:rounded-[1.5px] before:bg-text-muted"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Education
        </span>
        <div className="mt-3 border-t border-border">
          {education.map((e) => (
            <div
              key={e.school}
              className="grid items-baseline gap-1 border-b border-border-soft py-[18px] sm:grid-cols-[1fr_auto] sm:gap-6"
            >
              <div>
                <div className="font-display text-[22px] text-text-primary">
                  {e.school}
                </div>
                <div className="mt-1 text-[13.5px] text-text-secondary">
                  {e.detail}
                </div>
                {e.coursework && (
                  <div className="mt-2 max-w-[600px] text-[13px] leading-[1.6] text-text-muted">
                    Coursework: {e.coursework}
                  </div>
                )}
              </div>
              <span className="font-display text-[14.5px] italic text-text-muted">
                {e.location}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Skills
        </span>
        <div className="mt-3 border-t border-border">
          {skills.map((s) => (
            <div
              key={s.label}
              className="grid gap-1 border-b border-border-soft py-3.5 sm:grid-cols-[180px_1fr] sm:gap-6"
            >
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${s.colorClass}`}
              >
                {s.label}
              </span>
              <span className="text-sm text-text-secondary">{s.items}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-11">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Now
        </span>
        <p className="mt-3.5 max-w-[640px] font-display text-[22px] italic leading-[1.5] text-text-primary">
          Shipping the nonprofit&apos;s site, preparing the retail ERP for its
          production cutover this fall, studying Korean daily, and logging all
          of it here.
        </p>
      </section>
    </div>
  );
}
