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
      "I found LNCP through a WUSA9 feature about them and it stuck with me, because I wanted to point my technical skills at something bigger than profit. I'm their technical lead now, so I run the site, the email, and the Google Workspace. Their managed WordPress site cost $178 a year, so I rebuilt it as a static Astro site on Cloudflare Pages for about $12, moved hosting, DNS, and the domain off Bluehost with zero downtime, and set up Keystatic, a Git-based CMS that stores content as YAML, so staff edit pages in the browser without going near a repo and every change is still version controlled. I run their Google Workspace, Ads, and SEO too.",
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
      "This one was a fun project. A retail store was still running Monica 9, a system over 15 years old, so I self-hosted Odoo 18 Community on a Linux VPS in Docker behind a Cloudflare Tunnel, reachable remotely without exposing the box. I spent a World Cup switching between the matches and Odoo's source code, and what got me was how well composed an open source project like that is: I could read it, work out how the ORM maps to the PostgreSQL schema, and write my own modules to push inventory and pricing past what ships in the box. 500+ products migrated in, plus point of sale, multi-location inventory, and role-based permissions. Production cutover this fall.",
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
      "Every job application had a field for a personal site, so I made one and it came out bland and boring. This is the second attempt. Between YouTube and the occasional TikTok, I wanted one place for the things that don't fit on social: my work, my projects, what I believe, and most of all the trackers, because having them up where anyone can look is what keeps me accountable. It's Next.js 16 on Vercel with Prisma over serverless Postgres on Neon, and Google OAuth gating an admin dashboard. The Code row pulls live from the GitHub API instead of being stored, so the graph can't drift from what actually happened.",
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
      "Five of us on an Agile team building a Django platform for student organizations: tasks, finance, documents, messaging. I owned deployment and DevOps, so Heroku with Gunicorn, WhiteNoise, PostgreSQL, and S3 for media through django-storages, and I built the messaging feature end to end with emoji reactions, reply threading, pinned messages, and live autoscroll. The lasting lesson was about teams, not Django. Contribution was uneven in both directions, and it convinced me a project like this lives or dies on whether someone is genuinely leading it. Next time I'd go for scrum master.",
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
