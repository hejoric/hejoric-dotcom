# CLAUDE.md

Guidance for working in this repo. Read this before making changes.

## What this is

`hejoric.com` - personal site, portfolio, and resume for Jose R. Herrera (`@hejoric`).
The concept is "a GitHub contribution graph, but for everything": code, music, languages,
fitness, and reading, tracked over time alongside projects and a blog. Deployed on Vercel
at https://hejoric.com.

## The data-honesty rule

This is the constraint that shapes the tracker, and it must not be broken:

- **Nothing fabricates activity data.** No random seeding, no estimates, no
  placeholder rows. If a category has no data, it renders nothing.
- **Code** comes from the GitHub GraphQL `contributionsCollection` in
  `lib/github.ts`, cached for an hour, never written to the database. It
  includes private-repo contributions. If the fetch fails (or `GITHUB_TOKEN` is
  missing) the UI says the graph could not be loaded instead of drawing an
  empty grid.
- **Music, Language, Fitness, Reading** are hand-logged in `/admin`. The
  activity API rejects writes to `code` so the two sources cannot double-count.
- `lib/categories.ts` is the single source of truth: each category carries a
  `source` of `"github"` or `"manual"`, and `MANUAL_CATEGORY_KEYS` is what the
  API and admin form use.

## Stack

- **Next.js 16** (App Router, Turbopack by default) + **React 19.2** + **TypeScript 5.9**
- **Tailwind CSS v3** - hand-built, no component libraries
- **Prisma 5** + **Neon** serverless Postgres
- **NextAuth v5 (beta)** - Google OAuth, single-admin allowlist (`lib/auth.ts`)
- **next-mdx-remote** + `rehype-pretty-code`/`shiki` for blog posts
- **next-themes** - class-based dark/light, `defaultTheme="system"`
- **ESLint 9** flat config (`eslint.config.mjs`). `next lint` was removed in
  Next 16, so `npm run lint` calls the ESLint CLI directly.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run lint         # eslint . (not `next lint`, removed in Next 16)
npm run db:push      # prisma db push (sync schema)
npm run db:seed      # tsx prisma/seed.ts (upsert the real project list)
npx prisma studio    # browse/edit the DB directly
```

Checks in `scripts/` (see `scripts/README.md`):

```bash
./scripts/check-drift.sh          # live DB vs the schema the code expects
./scripts/smoke.sh [base-url]     # every route actually RENDERED, not just 200'd
./scripts/test-pr.sh <pr-number>  # full ladder for a PR, in a throwaway worktree
```

`check-drift.sh` is the guard against the September 2026 outage: `LatelyItem`
had been dropped from the shared Neon DB while main still queried it, so `/`
returned 500 in production while every local check stayed green. Run it before
and after any `db:push`. CI cannot cover this, because the PR gate is only lint
plus type check and never touches the database.

`.env` needs: `DATABASE_URL` (pooled, runtime), `DATABASE_URL_UNPOOLED`
(direct, migrations), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `ADMIN_EMAIL`, `GITHUB_TOKEN`. See `.env.example`.
Neon requires both DB URLs. `GITHUB_TOKEN` is a classic PAT with `read:user`;
without it the Code heatmap is omitted with a notice.

## Architecture

Routes (`app/`):
- `/` - `page.tsx`: Hero (rotating greeting) + "The Ledger" 52-week strip + Selected Work (2 featured projects) + serif About teaser
- `/projects` - filterable grid, tech-tag filter is client-side (`projects-client.tsx`)
- `/blog` + `/blog/[slug]` - list from DB; body is MDX stored in `BlogPost.content`. **Not in the nav** until a real post exists (`components/Navbar.tsx`)
- `/tracker` - full-year heatmaps for every category that has data
- `/about` - bio, experience, education, skills, resume link (static, sourced from `Jose_Herrera_Resume.pdf`)
- `/admin` - Google-gated forms; renders a sign-in button when there is no session
- `/api/activity`, `/api/projects` - GET public, POST admin-only; `/api/posts` - POST only
- `sitemap.ts` (omits `/blog` while empty), `robots.ts` (disallows `/admin`, `/api/`)
- `opengraph-image.tsx` - generated 1200x630 share card via `next/og`
- `favicon.ico`, `icon.png`, `apple-icon.png` - the 2x2 logo mark

`components/` - Navbar, Footer, ThemeToggle, HeroSection, LedgerSection,
ProjectCard, BlogCard, HeatmapGrid, HeatmapTracker, AuthButton
(`SignInButton`/`SignOutButton`, used only by `/admin`), AdminActivityForm,
AdminProjectForm, AdminBlogForm.

`lib/`:
- `github.ts` - contribution calendar fetch (1-hour `revalidate`)
- `activity.ts` - merges GitHub + hand-logged rows into one 365-day window
- `calendar.ts` - builds the week grid, month segments, and streak stats in UTC on the server, so markup never depends on the visitor's clock
- `categories.ts` - the five categories, their sources, accents, and heatmap ramp
- `prisma.ts`, `auth.ts`, `utils.ts`, `admin-styles.ts`

Rendering: pages are static with `export const revalidate = 300`, so `/admin`
edits appear within five minutes. Keep session reads out of the shared layout
or every page becomes dynamic.

## Data model (`prisma/schema.prisma`)

- `Project` - title, description, `techStack[]`, githubUrl, liveUrl, `featured`, `order`. Homepage shows `featured: true` ordered by `order`, take 2. Keep `techStack` to 5 tags so the card's tech line stays on one row.
- `BlogPost` - slug, title, excerpt, `content` (MDX string), `tags[]`, `published`, `publishedAt`. The renderer prefers DB `content` and falls back to `content/blog/<slug>.mdx` if such a file ever exists again.
- `ActivityLog` - date, category, count, note; unique on `[date, category]`. Hand-logged categories only: `music`, `language`, `fitness`, `content` (shown as "Reading").
- `User` - email, role.

**Content is DB-driven.** Projects live in Postgres (`prisma/seed.ts` upserts
the real four by fixed `seed-*` ids and touches nothing else). Blog posts are
created end-to-end from `/admin`.

## Conventions

- Design tokens are CSS variables surfaced as Tailwind colors in `tailwind.config.js`:
 `background`, `surface`, `text-primary`, `text-secondary`, `text-muted`, `accent`,
 `border`, `border-soft`, plus the five category accents `code`, `music`, `language`,
 `fitness`, `reading`. Use these, not raw hex/`gray-*`. Defined in `app/globals.css`
 (warm off-white `#FAF8F4` light / near-black `#1A1917` dark).
- Category color is the site's only color. `accent` is an alias of Code blue.
- Fonts: Inter via `--font-inter` (`font-sans`, body) + Instrument Serif via
 `--font-display` (`font-display`, headings; italics for editorial "voice" moments).
- Voice/labels: section headers are uppercase 11px letter-spaced micro-labels
 (`text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted`); stats and
 asides are italic serif. **No em dashes anywhere in copy.**
- Layout containers use `mx-auto max-w-5xl px-6`. Interactive elements use
 `transition-opacity duration-150 hover:opacity-70`. Match these.
- Heatmap geometry lives in `components/HeatmapGrid.tsx` (`CELL`/`GAP`); month
 label widths derive from the same pitch, so change them together. Cell colors
 come from `lib/categories.ts` (`color-mix` toward `--background` at
 25/48/72/95%) and ink in via the `.heatmap-cell` animation (respects
 `prefers-reduced-motion`). 53 columns at 18px fits `max-w-5xl` exactly.
- Server Components by default; `"use client"` only where state/interactivity is needed
  (Navbar, projects filter, theme toggle, heatmap tooltip, admin forms).
- `ThemeToggle` renders both icons and swaps them with Tailwind's `dark:`
  variant. Do not reintroduce a `mounted` state gate: it caused a layout hole
  on first paint and trips the `react-hooks/set-state-in-effect` rule.
- `package.json` has no `"type"` field on purpose. Declaring `"commonjs"`
  makes Turbopack fail on every ESM `.ts` file in `lib/`.
- The resume PDF is served from `public/resume.pdf`, linked from the Footer and About.
- **Auth:** single-admin allowlist. `isAdmin(email)` in `lib/auth.ts` is the one source of
  truth, used by the `signIn` callback (non-admins cannot complete login), the `/admin`
  page, and every write API. Admin email comes from `ADMIN_EMAIL`. There is no sign-in
  control in the public nav on purpose.

## Current state

Source of truth for personal/professional details: **`Jose_Herrera_Resume.pdf`** at the
repo root (updated 2026-08-15, mirrored to `public/resume.pdf`).

Done (2026-09-02), the "real data" pass:
- Deleted 368 randomly seeded `ActivityLog` rows, the 3 placeholder `LatelyItem`
 rows (model and table dropped), the placeholder "testing testing" blog post,
 and two stale projects (Smart Inventory System, which had a 404 GitHub link,
 and Course Review, dropped from the resume).
- Code heatmap now reads the live GitHub contribution calendar; the other four
 categories are hand-logged and hidden until they have entries.
- Projects rebuilt from the current resume: Loudoun NCP (featured), Retail ERP
 (featured), hejoric.com, TSA Helper, with real GitHub and live links where
 they exist.
- About page rewritten with an Experience section, current coursework, and the
 new skills list.
- Replaced the headshot-JPEG-renamed-`.ico` favicon and the two 98KB
 `icon.png`/`apple-icon.png` copies of it with a generated logo mark; added a
 generated OG image (the old metadata pointed at a `/og-default.png` that was
 never committed).
- Auth UI moved off the public nav onto `/admin`; `robots.ts` now disallows
 `/admin` and `/api/`; `/about` added to the sitemap.

Done (2026-09-02), the dependency pass:
- Next 14.2.35 to **16.3.4**, React 18 to **19.2.8** (the `@types/react` 19 that
 was already installed had been mismatched against React 18), next-auth to
 beta.32, ESLint 8 to 9 with flat config, plus every safe minor.
- Cleared **15 npm advisories (2 critical, 10 high) down to 0**. The criticals
 were in `@auth/core` (email misdelivery, `getToken()` crash on malformed
 Bearer headers); Next 14.x had no unaffected release, so the major was
 mandatory. The last four were fixed in-range by `npm audit fix`, with no
 dependency overrides.
- Migrations required: flat ESLint config, `eslint .` instead of `next lint`,
 awaited `params` in `app/blog/[slug]`, removing `"type": "commonjs"`, and
 rewriting `ThemeToggle` to satisfy the new react-hooks rules.
- Enabled Dependabot alerts and automated security fixes, and added
 `.github/dependabot.yml` (grouped weekly minors, individual majors).
- Held back on purpose: Tailwind 4 (v3 is on the `v3-lts` tag; v4 is a
 design-token migration), Prisma 7, TypeScript 7. None carry advisories.

Open items:
1. `GITHUB_TOKEN` must be set in Vercel or the Code heatmap will not render in
 production.
2. The public `hejoric/club-finance-helper` mirror of TSA Helper has live admin
 credentials in its README, so the project is listed without a GitHub link
 until that repo is cleaned and those credentials are rotated.
3. Music / Language / Fitness / Reading stay empty until logged in `/admin`, or
 until a real integration (Last.fm, Strava) is wired up.
4. The resume says the site uses GitHub OAuth; it uses Google OAuth.
