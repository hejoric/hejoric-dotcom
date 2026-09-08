import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jose Ricardo Herrera (Hejoric), CS at UVA. What I build, what I'm learning, and why I track all of it in public.",
  openGraph: {
    title: "About | hejoric",
    description:
      "Jose Ricardo Herrera (Hejoric), CS at UVA. What I build, what I'm learning, and why I track all of it in public.",
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
      "Integrated Keystatic, a Git-based CMS storing content as YAML, so staff edit pages in the browser without going near a repo while every change stays version-controlled. Wrote the stack documentation for volunteer handoff.",
      "Run the organization's Google Workspace, Google Ads, SEO, search, and analytics alongside the site and DNS.",
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
    items: "English and Spanish (fluent) · Korean and Japanese (learning)",
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
              What&apos;s up, I&apos;m Jose Ricardo Herrera, and online I go by
              Hejoric. I&apos;m a fourth-year Computer Science student at the
              University of Virginia, class of 2027.
            </p>
            <p>
              What I like building is usable niche tools: software for someone
              with a specific problem who isn&apos;t going to write the code
              themselves. A retail store still running a 15 year old system. A
              nonprofit paying $178 a year for hosting it didn&apos;t need. Work
              like that means I spend as much time on deploys, data migrations,
              and DNS as I do on features, and I&apos;d take that over the other
              way around. I started out doing freelance work for my
              family&apos;s businesses, and I wanted to point the same skills at
              something bigger than profit, which is how I ended up running the
              web and infrastructure for a nonprofit.
            </p>
            <p>
              Outside of code: guitar and piano (working on Snow by RHCP, with
              the third movement of the Moonlight Sonata as the long game),
              Korean 101 at UVA with a JLPT N3 retake somewhere down the road,
              the gym,
              salsa and bachata, and gaming. I also run a YouTube channel
              that&apos;s basically a video journal of my life: playing,
              gameplay, travel. The goal is weekly, and showing people what
              being a UVA student is actually like.
            </p>
            <p>
              I put all of it on this site on purpose. I&apos;d rather be public
              about what I&apos;m working on and how far along I actually am,
              and if that gets one person to start tracking their own thing and
              go after it, that&apos;s a win.{" "}
              <span className="font-display text-[17px] italic text-text-primary">
                Reach out any time, I like the questions.
              </span>
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
            alt="Jose Ricardo Herrera"
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
          Getting the retail ERP ready for its production cutover this fall,
          Korean 101 and chapter 1 of Integrated Korean, learning Snow by RHCP,
          and working on getting the gym back to consistent.
        </p>
      </section>
    </div>
  );
}
