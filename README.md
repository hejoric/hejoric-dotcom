# hejoric.com

Personal site, portfolio, and living progress journal of Jose R. Herrera.

The idea is simple: a GitHub contribution graph, but for everything — code, music, languages, fitness, content creation. Not just finished projects, but consistency over time.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS v3** — no component libraries, everything hand-built
- **Prisma** + **Neon** (serverless Postgres)
- **NextAuth v5** — GitHub OAuth, single-admin auth gate
- **next-mdx-remote** + rehype-pretty-code for blog posts
- **next-themes** for dark/light mode
- Deployed on **Vercel**

## What's in here

**`/`** — Hero with headshot, featured projects from DB, short about blurb

**`/projects`** — Filterable grid of project cards, pulled from Postgres. Filter by tech tag client-side.

**`/blog`** — Blog post list from DB. Individual posts at `/blog/[slug]` render MDX files from `content/blog/` with syntax highlighting.

**`/tracker`** — "Consistency Log" — five GitHub-style heatmaps (code, music, languages, fitness, content), each showing 52 weeks of activity data from the `ActivityLog` table.

**`/admin`** — Auth-gated admin panel (GitHub OAuth, single email check). Forms to log activity entries and add projects. Blog posts are created by dropping an MDX file in `content/blog/` and inserting metadata into the DB.

**`/api/activity`** — GET (heatmap data) + POST (log entry, auth required)

**`/api/projects`** — GET (all projects) + POST (add project, auth required)

## Local dev

```
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Needs a `.env.local` with `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GITHUB_ID`, `GITHUB_SECRET`. See `.env.example`.

Neon requires two DB URLs — pooled for the Prisma client at runtime, direct/unpooled for migrations.

## Managing content

**Blog:** Add `content/blog/your-slug.mdx`, then insert a row into `BlogPost` (via `npx prisma studio` or the Neon dashboard) with `published: true`.

**Tracker:** Use the admin page at `/admin`, or POST to `/api/activity`, or edit directly in Prisma Studio.

**Projects:** Admin page or POST to `/api/projects`.

## Project structure

```
app/
  layout.tsx            Root layout, ThemeProvider, JSON-LD
  page.tsx              Homepage
  projects/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx  MDX renderer
  tracker/page.tsx      Heatmap grids
  admin/page.tsx        Auth-gated admin
  api/                  REST endpoints
  sitemap.ts
  robots.ts
components/             Navbar, Footer, ThemeToggle, HeroSection,
                        ProjectCard, BlogCard, HeatmapGrid,
                        HeatmapTracker, admin forms
lib/                    Prisma client, NextAuth config, utils
content/blog/           MDX blog posts
prisma/                 Schema + seed script
```
