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

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v3**, hand-built, no component libraries
- **Prisma 7** (Neon driver adapter) + **Neon** serverless Postgres
- **NextAuth v5** (Google OAuth, single-admin allowlist)
- **next-mdx-remote** + `rehype-pretty-code` for post bodies
- **next-themes** for class-based dark mode

## Routes

| Route | What it does |
| --- | --- |
| `/` | Hero with follow links, Now, the Ledger (52-week strip), photos, latest YouTube video, featured projects |
| `/projects` | Every project from Postgres, filterable by tech tag client-side |
| `/tracker` | Full-year heatmaps: GitHub-backed Code plus any hand-logged category |
| `/about` | Bio, experience, education, skills, resume link |
| `/work` | Work with me: availability, resume, proof numbers, projects |
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

Neon needs both database URLs: pooled for the Prisma client (`lib/prisma.ts`),
direct for the Prisma CLI and migrations (`prisma.config.ts`).

## Commands

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run lint         # eslint . (`next lint` was removed in Next 16)
npm test             # node:test unit tests in lib/ (Node 22.18+, for .ts imports)
npm run db:push      # prisma db push
npm run db:seed      # tsx prisma/seed.ts
npx prisma studio    # browse the database
```

## Dependency maintenance

Nothing the deployed site loads at runtime has a known advisory. `npm audit`
still reports four highs, all in `deepmerge-ts` and `mysql2`, which the Prisma
7.10 CLI pins exactly. The CLI only runs at install, build, and migration time,
never inside the serverless functions, and no 7.x release fixes them yet.

Dependabot alerts and automated security fixes are enabled, and
`.github/dependabot.yml` groups minor and patch bumps into one weekly PR while
raising majors individually. CI (`.github/workflows/ci.yml`) gates every one.

Two versions are held back deliberately:

- **Tailwind 3.4.19** (tagged `v3-lts`). v4 moves theme configuration into CSS
  and changes some defaults, which is a design-system migration rather than a
  version bump.
- **TypeScript 5.9**, advisory-free.

`package.json` deliberately has no `"type"` field: Turbopack errors when the
package is declared CommonJS while the TypeScript sources use ESM.

## Deployment

Vercel, deployed from `main`. Pages are statically rendered with a 300-second
revalidate window, so entries added through `/admin` appear within five minutes
without a redeploy.

Requires Node 20.9+ (a Next 16 floor).
