import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = ["code", "music", "language", "fitness", "content"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const projects = [
    {
      id: "seed-retail-erp",
      title: "Retail ERP Deployment",
      description:
        "Deployed and self-hosted Odoo 18 Community ERP on a Linux VPS to replace a family retail business's legacy Monica 9 system, running the stack in Docker behind a Cloudflare Tunnel. Migrated 500+ active products into PostgreSQL and configured point-of-sale, multi-location inventory, cash control, and tiered pricelists with role-based permissions for a pilot handling 500+ daily transactions.",
      techStack: ["Odoo", "Docker", "PostgreSQL", "Linux", "Cloudflare"],
      githubUrl: null,
      liveUrl: null,
      featured: true,
      order: 0,
    },
    {
      id: "seed-tsa-helper",
      title: "TSA Helper",
      description:
        "Owned deployment and DevOps on a 5-person Agile team shipping a Django student-organization platform (tasks, finance, documents, messaging) to Heroku with Gunicorn, WhiteNoise, and PostgreSQL. Configured AWS S3 storage via django-storages and built a Discord-style multi-channel messaging feature with emoji reactions, reply threading, pinned messages, and live autoscroll.",
      techStack: ["Django", "PostgreSQL", "AWS S3", "Heroku", "JavaScript"],
      githubUrl: null,
      liveUrl: null,
      featured: true,
      order: 1,
    },
    {
      id: "seed-course-review",
      title: "Course Review CRUD App",
      description:
        "Full-stack JavaFX application that lets students create, read, update, and delete course reviews with user authentication and persistent SQLite storage. Designed a relational schema using JDBC with proper foreign key constraints, and implemented secure password hashing and input validation to prevent SQL injection. Built in a team of 3 using Git.",
      techStack: ["Java", "JavaFX", "SQLite", "JDBC"],
      githubUrl: null,
      liveUrl: null,
      featured: false,
      order: 2,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project,
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      slug: "hello-world",
      title: "Hello, World!",
      excerpt:
        "Welcome to my blog. This is where I'll share thoughts on code, learning, and building things that matter.",
      tags: ["personal", "intro"],
      content:
        "# Hello, World!\n\nWelcome to my corner of the internet. This is where I'll write about the things I'm building, the things I'm learning, and the occasional detour into piano, languages, or the gym.\n\nMore soon.",
      published: true,
      publishedAt: new Date(),
    },
  });

  const latelyItems = [
    {
      kind: "video",
      title: "Self-hosting an ERP for the family store",
      subtitle: "YouTube · 12 min",
      url: "https://youtube.com/@hejoric",
      imageUrl: null,
    },
    {
      kind: "song",
      title: "Nocturne Op. 9 No. 2",
      subtitle: "Chopin — learning it on piano",
      url: null,
      imageUrl: null,
    },
    {
      kind: "book",
      title: "Deep Work",
      subtitle: "Cal Newport · ch. 6",
      url: null,
      imageUrl: null,
    },
  ];

  for (const item of latelyItems) {
    await prisma.latelyItem.upsert({
      where: { kind: item.kind },
      update: item,
      create: item,
    });
  }

  const today = new Date();
  const entries: { date: Date; category: string; count: number }[] = [];

  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    for (const category of categories) {
      if (Math.random() > 0.4) {
        entries.push({
          date,
          category,
          count: randomInt(1, 10),
        });
      }
    }
  }

  for (const entry of entries) {
    await prisma.activityLog.upsert({
      where: {
        date_category: {
          date: entry.date,
          category: entry.category,
        },
      },
      update: { count: entry.count },
      create: entry,
    });
  }

  console.log("Seed complete: 1 project, 1 blog post, ~270 activity entries");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
