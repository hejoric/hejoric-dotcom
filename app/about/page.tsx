import type { Metadata } from "next";
import Link from "next/link";

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

const skills: { label: string; items: string }[] = [
  { label: "Languages", items: "Java, Python, C++, JavaScript, SQL, R" },
  {
    label: "Technologies",
    items:
      "Git, Docker, Linux, PostgreSQL, SQLite, Django, React, JDBC, Hibernate, Gradle, JavaFX, AWS, Heroku",
  },
  { label: "Certifications", items: "AWS Cloud Practitioner" },
  {
    label: "Languages (spoken)",
    items: "Fluent in English & Spanish; studying Japanese & Korean",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        About
      </h1>

      <div className="mt-6 space-y-4 leading-relaxed text-text-secondary">
        <p>
          I&apos;m Jose R. Herrera — a Computer Science student at the University
          of Virginia and a full-stack developer who likes shipping things that
          solve real problems. My favorite projects live where software meets
          the messy real world: deploying and self-hosting an Odoo ERP to
          replace a family retail business&apos;s legacy system, migrating 500+
          products into PostgreSQL, and building tools people actually use.
        </p>
        <p>
          I&apos;ve owned deployment and DevOps on Agile teams, built
          Discord-style messaging features, and designed relational schemas with
          real data-integrity constraints. I care about clean code, secure
          systems, and learning in public — which is what this site is for.
        </p>
        <p>
          Away from the keyboard: piano, languages (Japanese and Korean right
          now), and the gym.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">
          Education
        </h2>
        <ul className="mt-4 space-y-4">
          {education.map((e) => (
            <li
              key={e.school}
              className="rounded-lg border border-border p-4"
            >
              <p className="font-medium text-text-primary">{e.school}</p>
              <p className="mt-1 text-sm text-text-secondary">{e.detail}</p>
              <p className="text-sm text-text-secondary">{e.location}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">
          Skills
        </h2>
        <dl className="mt-4 space-y-3">
          {skills.map((s) => (
            <div key={s.label}>
              <dt className="text-sm font-medium text-text-primary">
                {s.label}
              </dt>
              <dd className="text-sm text-text-secondary">{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-70"
        >
          View Resume
        </a>
        <Link
          href="/projects"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-opacity duration-150 hover:opacity-70"
        >
          See Projects
        </Link>
      </div>
    </div>
  );
}
