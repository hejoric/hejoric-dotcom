import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Jose R. Herrera (hejoric) — CS student at UVA, full-stack developer, and builder.",
  openGraph: {
    title: "About | hejoric",
    description:
      "About Jose R. Herrera (hejoric) — CS student at UVA, full-stack developer, and builder.",
    url: "https://hejoric.com/about",
    type: "website",
    images: [{ url: "/og-default.png" }],
  },
  alternates: { canonical: "https://hejoric.com/about" },
};

const education = [
  {
    school: "University of Virginia",
    detail: "BS, Computer Science · expected May 2027",
    location: "Charlottesville, VA",
  },
  {
    school: "Northern Virginia Community College",
    detail: "AS, Engineering · 2025",
    location: "Annandale, VA",
  },
];

const skills: { label: string; items: string; colorClass: string }[] = [
  {
    label: "Languages",
    items: "Java, Python, C++, JavaScript, SQL, R",
    colorClass: "text-code",
  },
  {
    label: "Technologies",
    items:
      "Git, Docker, Linux, PostgreSQL, SQLite, Django, React, JDBC, Hibernate, Gradle, JavaFX, AWS, Heroku",
    colorClass: "text-code",
  },
  {
    label: "Certifications",
    items: "AWS Cloud Practitioner",
    colorClass: "text-code",
  },
  {
    label: "Spoken",
    items: "Fluent in English & Spanish · studying Japanese & Korean",
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
              I&apos;m Jose R. Herrera — a CS student at the University of
              Virginia and a full-stack developer who likes shipping things
              that solve real problems. My favorite projects live where
              software meets the messy real world: self-hosting an ERP to
              replace my family&apos;s store&apos;s legacy system, migrating
              500+ products into PostgreSQL, building tools people actually
              use.
            </p>
            <p>
              I&apos;ve owned deployment and DevOps on Agile teams, built
              Discord-style messaging features, and designed relational
              schemas with real data-integrity constraints. I care about clean
              code, secure systems, and learning in public —{" "}
              <span className="font-display text-[17px] italic text-text-primary">
                which is what this site is for.
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
              href="mailto:jose@hejoric.com"
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
            className="h-[360px] w-[300px] rounded object-cover grayscale contrast-[1.04]"
            priority
          />
          <div className="mt-3.5 font-display text-[14.5px] italic text-text-muted">
            Charlottesville, VA
          </div>
        </div>
      </div>

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
          Studying Korean daily, training four days a week, learning Chopin
          slowly, and building this site in public.
        </p>
      </section>
    </div>
  );
}
