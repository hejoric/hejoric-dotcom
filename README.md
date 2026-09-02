# hejoric.com

Personal site, portfolio, and consistency tracker for Jose R. Herrera
([@hejoric](https://github.com/hejoric)). Live at **[hejoric.com](https://hejoric.com)**.

The idea: a GitHub contribution graph, but for more than code. Projects and
writing sit next to a year of day-by-day activity, so consistency is visible
instead of claimed.

## Data honesty

The tracker only ever renders data that exists:

- **Code** is fetched live from the GitHub GraphQL `contributionsCollection`
  (`lib/github.ts`), the same source behind a GitHub profile graph, including
  private-repository contributions. It is cached for an hour and never stored,
  so the graph cannot drift from the truth. If the fetch fails, the row is
  replaced by a note saying so rather than an empty grid.
- **Music, Language, Fitness, and Reading** are hand-logged through `/admin`
  and stored in `ActivityLog`. A category with no entries renders no row.

Nothing in this repo generates, estimates, or seeds activity data.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS v3**, hand-built, no component libraries
- **Prisma 5** + **Neon** serverless Postgres
- **NextAuth v5** (Google OAuth, single-admin allowlist)
- **next-mdx-remote** + `rehype-pretty-code` for post bodies
- **next-themes** for class-based dark mode

## Routes

| Route | What it does |
| --- | --- |
| `/` | Hero, the Ledger (52-week strip), Selected Work, About teaser |
| `/projects` | Every project from Postgres, filterable by tech tag client-side |
| `/tracker` | Full-year heatmaps: GitHub-backed Code plus any hand-logged category |
| `/about` | Bio, experience, education, skills, resume link |
| `/blog`, `/blog/[slug]` | Post list from Postgres; body is MDX stored in the DB |
| `/admin` | Google-gated forms to log activity and publish projects and posts |
| `/api/activity`, `/api/projects` | `GET` public, `POST` admin only |
| `/api/posts` | `POST` admin only (upsert by slug) |

`/blog` is deliberately absent from the nav until there is a post worth
reading; the route still works.

## Local development

```bash
npm install
npm run db:push     # sync the Prisma schema
npm run db:seed     # upsert the real project list (no activity data)
npm run dev
```

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled Neon connection, used at runtime |
| `DATABASE_URL_UNPOOLED` | Direct connection, used for migrations |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | NextAuth session config |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `ADMIN_EMAIL` | The one address allowed to sign in or write |
| `GITHUB_TOKEN` | Classic PAT with `read:user`, powers the Code heatmap |

Neon needs both database URLs: pooled for the Prisma client, direct for
migrations.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # next lint
npm run db:push      # prisma db push
npm run db:seed      # tsx prisma/seed.ts
npx prisma studio    # browse the database
```

## Deployment

Vercel, deployed from `main`. Pages are statically rendered with a 300-second
revalidate window, so entries added through `/admin` appear within five minutes
without a redeploy.
