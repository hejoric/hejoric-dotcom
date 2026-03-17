import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = ["code", "music", "language", "fitness", "content"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  await prisma.project.upsert({
    where: { id: "seed-project-1" },
    update: {},
    create: {
      id: "seed-project-1",
      title: "Smart Inventory System",
      description:
        "A full-stack inventory management and sales analytics platform built for small family-owned stores in Bolivia. Designed to replace manual pen-and-paper workflows with real-time tracking across multiple store locations.",
      techStack: ["Python", "FastAPI", "React", "PostgreSQL", "SQLAlchemy"],
      githubUrl: "https://github.com/hejoric/inventory-system",
      liveUrl: null,
      featured: true,
      order: 0,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      slug: "hello-world",
      title: "Hello, World!",
      excerpt:
        "Welcome to my blog. This is where I'll share thoughts on code, learning, and building things that matter.",
      tags: ["personal", "intro"],
      published: true,
      publishedAt: new Date(),
    },
  });

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
