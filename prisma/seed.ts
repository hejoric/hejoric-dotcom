// Upserts the real project list. Nothing here fabricates activity data:
// the Code heatmap comes from the live GitHub contribution API, and the other
// tracker categories only ever contain entries logged by hand in /admin.
//
// Safe to re-run. It only touches the rows it owns (the `seed-*` ids), so
// projects added later through /admin are left alone.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    id: "seed-loudoun-ncp",
    title: "Loudoun Nature Conservation Project",
    description:
      "Rebuilt a 501(c)(3) nonprofit's managed WordPress site as a statically generated Astro site on Cloudflare Pages, cutting recurring hosting cost from $178/year to roughly $12/year. Migrated hosting, DNS, and domain registration off Bluehost with zero downtime, then integrated Keystatic, a Git-based CMS that stores content as YAML, so non-technical staff edit pages in the browser while every change stays version-controlled.",
    techStack: ["Astro", "TypeScript", "Tailwind", "Cloudflare", "Keystatic"],
    githubUrl: "https://github.com/hejoric/loudoun-ncp-site",
    liveUrl: "https://loudounnatureconservation.org",
    featured: true,
    order: 0,
  },
  {
    id: "seed-retail-erp",
    title: "Retail ERP Deployment",
    description:
      "Self-hosted Odoo 18 Community on a Linux VPS to replace a retail business's legacy Monica 9 system, running the stack in Docker behind a Cloudflare Tunnel for secure remote access. Wrote custom Odoo modules in Python by reading upstream source and mapping the ORM's PostgreSQL schema to extend inventory and pricing beyond stock functionality, migrated 500+ products through a structured import mapping, and configured point of sale, multi-location inventory, and role-based permissions. Scheduled for production cutover in Fall 2026.",
    techStack: ["Odoo", "Python", "Docker", "PostgreSQL", "Linux"],
    githubUrl: null,
    liveUrl: null,
    featured: true,
    order: 1,
  },
  {
    id: "seed-hejoric-dotcom",
    title: "hejoric.com",
    description:
      "This site. A Next.js 14 App Router application in TypeScript on Vercel, backed by Prisma over serverless Postgres (Neon) using pooled connections at runtime and a direct connection for migrations. Google OAuth through NextAuth v5 gates an admin dashboard for publishing projects, posts, and activity entries, and the Code heatmap is pulled live from the GitHub contribution API instead of being stored, so the graph cannot drift from reality.",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth"],
    githubUrl: "https://github.com/hejoric/hejoric-dotcom",
    liveUrl: "https://hejoric.com",
    featured: false,
    order: 2,
  },
  {
    id: "seed-tsa-helper",
    title: "TSA Helper",
    description:
      "Owned deployment and DevOps on a 5-person Agile team shipping a Django student-organization platform (tasks, finance, documents, messaging) to Heroku with Gunicorn, WhiteNoise, PostgreSQL, and AWS S3 media storage via django-storages. Built the multi-channel messaging feature end to end: emoji reactions, reply threading, pinned messages, and live autoscroll on custom Django models, templates, and JavaScript.",
    techStack: ["Django", "PostgreSQL", "AWS S3", "Heroku", "JavaScript"],
    githubUrl: null,
    liveUrl: null,
    featured: false,
    order: 3,
  },
];

async function main() {
  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project,
    });
  }

  console.log(`Seed complete: ${projects.length} projects upserted.`);
  console.log("Activity data is not seeded by design (GitHub + /admin only).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
