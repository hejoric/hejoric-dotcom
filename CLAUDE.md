# CLAUDE.md

Guidance for working in this repo. Read this before making changes.

## What this is

`hejoric.com` — personal site, portfolio, and resume for Jose R. Herrera (`@hejoric`).
The concept is "a GitHub contribution graph, but for everything": code, music, languages,
fitness, and content, tracked over time alongside projects and a blog. Deployed on Vercel
at https://hejoric.com.

## Stack

- **Next.js 14** (App Router) + **TypeScript**, `commonjs` package type
- **Tailwind CSS v3** — hand-built, no component libraries
- **Prisma 5** + **Neon** serverless Postgres
- **NextAuth v5 (beta)** — Google OAuth, single-admin allowlist (`lib/auth.ts`)
- **next-mdx-remote** + `rehype-pretty-code`/`shiki` for blog posts
- **next-themes** — class-based dark/light, `defaultTheme="system"`

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run lint         # next lint
npm run db:push      # prisma db push (sync schema)
npm run db:seed      # tsx prisma/seed.ts (seed/upsert demo data)
npx prisma studio    # browse/edit the DB directly
```

`.env.local` needs: `DATABASE_URL` (pooled, runtime), `DATABASE_URL_UNPOOLED`
(direct, migrations), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `ADMIN_EMAIL`. See `.env.example`. Neon requires both DB
URLs — pooled for the Prisma client, direct for migrations.

## Architecture

Routes (`app/`):
- `/` — `page.tsx`: Hero (rotating greeting) + "The Ledger" 52-week strip (from `ActivityLog`) + Selected Work (from DB) + "Lately" strip (from `LatelyItem`) + serif About teaser
- `/projects` — filterable grid, tech-tag filter is client-side (`projects-client.tsx`)
- `/blog` + `/blog/[slug]` — list from DB; post body is MDX from `content/blog/<slug>.mdx`
- `/tracker` — five GitHub-style heatmaps (code, music, language, fitness, content), 52 weeks from `ActivityLog`
- `/about` — bio, education, skills, resume link (static)
- `/admin` — auth-gated forms to log activity, add projects, and publish blog posts
- `/api/activity`, `/api/projects`, `/api/posts` — GET public (no `/api/posts` GET), POST admin-only
- `sitemap.ts`, `robots.ts`

`components/` — Navbar, Footer, ThemeToggle, HeroSection, LedgerSection,
LatelySection, ProjectCard, BlogCard, HeatmapGrid, HeatmapTracker,
AdminActivityForm, AdminProjectForm.
`lib/` — `prisma.ts` (client singleton), `auth.ts` (NextAuth), `utils.ts`,
`categories.ts` (the five categories: keys, labels, accent vars, heatmap
level/color helpers).

## Data model (`prisma/schema.prisma`)

- `Project` — title, description, `techStack[]`, githubUrl, liveUrl, `featured`, `order`. Homepage shows `featured: true` ordered by `order`, take 2.
- `BlogPost` — slug, title, excerpt, `content` (MDX string, nullable), `tags[]`, `published`, `publishedAt`. The renderer (`app/blog/[slug]/page.tsx`) prefers DB `content`; if empty it falls back to `content/blog/<slug>.mdx` (legacy file-based posts).
- `ActivityLog` — date, category, count, note; unique on `[date, category]`.
  Categories: `code`, `music`, `language`, `fitness`, `content` (displayed as
  "Reading" in the UI — see `lib/categories.ts`).
- `LatelyItem` — cached homepage "Lately" strip; `kind` unique (`video` /
  `song` / `book`), title, subtitle, url, imageUrl. Meant to be written by
  ingestion crons (YouTube / music / reading); currently seeded by hand.
- `User` — email, role.

**Content is DB-driven, not hardcoded.** Project and blog data lives in Postgres
(seeded/upserted via `prisma/seed.ts` or entered through `/admin`). Blog posts are now
created end-to-end from `/admin` (the "New Blog Post" form POSTs to `/api/posts`, which
upserts by slug) — body included, stored in `BlogPost.content`. Vercel's filesystem is
read-only at runtime, so file-based posts can't be created from the browser; that's why
the body lives in the DB. Legacy `content/blog/*.mdx` files still render via the fallback.

## Conventions

- Design tokens are CSS variables surfaced as Tailwind colors in `tailwind.config.js`:
 `background`, `surface`, `text-primary`, `text-secondary`, `text-muted`, `accent`,
 `border`, `border-soft`, plus the five category accents `code`, `music`, `language`,
 `fitness`, `reading`. Use these, not raw hex/`gray-*`. Defined in `app/globals.css`
 (warm off-white `#FAF8F4` light / near-black `#1A1917` dark; category accents have
 brighter dark-mode variants — light accent lifted 25% toward white).
- Category color is the site's only color. `accent` is an alias of Code blue.
- Fonts: Inter via `--font-inter` (`font-sans`, body) + Instrument Serif via
 `--font-display` (`font-display`, headings; italics for editorial "voice" moments).
- Voice/labels: section headers are uppercase 11px letter-spaced micro-labels
 (`text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted`); stats and
 asides are italic serif.
- Layout containers use `mx-auto max-w-5xl px-6`. Interactive elements use
 `transition-opacity duration-150 hover:opacity-70`. Match these.
- Heatmap cell colors come from `lib/categories.ts` (`color-mix` of the category
 accent toward `--background` at 25/48/72/95%); cells ink in on load via the
 `.heatmap-cell` animation in `globals.css` (respects `prefers-reduced-motion`).
- Server Components by default; `"use client"` only where state/interactivity is needed
  (Navbar, projects filter, theme toggle, admin forms).
- The resume PDF is served from `public/resume.pdf` and linked in the Navbar.
- **Auth:** single-admin allowlist. `isAdmin(email)` in `lib/auth.ts` is the one source of
  truth — used by the `signIn` callback (non-admins can't even complete login), the `/admin`
  page, and every write API. Admin email comes from `ADMIN_EMAIL` (defaults to
  `hejoric@gmail.com`). The Navbar shows a Google Sign in / Sign out button (`AuthButton`,
  a server component passed into the client Navbar as `authSlot`).

## Current state

Source of truth for personal/professional details: **`Jose_Herrera_Resume.pdf`** at the
repo root (updated 2026-06-30).

Done (2026-06-30): real Hero + Homepage About copy, new `/about` page, updated
`public/resume.pdf`, three real projects in `prisma/seed.ts` (Retail ERP, TSA Helper,
Course Review), Google auth + admin allowlist, hardened write APIs, in-browser blog
publishing, and a Sign in / Sign out button in the Navbar.

Done (2026-07-02): full visual redesign to the "Field Notes" direction from Claude
Design (editorial serif + warm neutrals + five category accents as the only color):
- New token set + Instrument Serif display font (see Conventions).
- Navbar (2×2 logo mark, uppercase name, active-link underline), Footer (uppercase
 text links incl. demoted Resume link), quiet ThemeToggle. Resume button removed
 from the Navbar — reachable from Footer + About.
- Hero with rotating Hola/Hello/こんにちは/안녕하세요 greeting (CSS keyframes, still a
 Server Component); homepage now has The Ledger, Selected Work, Lately, and a serif
 About teaser.
- Tracker ("The tracker.") — per-category full-year heatmaps with month labels,
 active-days/longest-streak stats, ink-in animation, springy cell hover.
- Editorial ProjectCard (numbered, serif titles, `card`/`plain` variants), restyled
 tag filter; blog list rows (date + first tag in Reading purple), serif post header
 with computed read time, five-dot divider, prev/all-posts footer, hand-rolled
 `.post-prose` MDX styles (the old `prose` classes were no-ops — the typography
 plugin was never installed).
- `LatelyItem` model + seed + homepage strip (scaffold; ingestion crons still TODO).
- `/admin` forms still use the old look — functional, just not restyled.

**Remaining deploy steps (need DB + Vercel access — not doable from a sandbox):**
1. `npm run db:push` against Neon to add the new `BlogPost.content` column **and the
 new `LatelyItem` table**, then `npm run db:seed` (or `/admin` / prisma studio) so
 prod has the data.
2. Get the real project/blog data into the **production** DB — the live site reads Postgres,
 so code changes to `seed.ts` don't show up until the data is there. Either run the seed
 against prod, edit in `prisma studio`, or add them through `/admin`.
3. In Google Cloud Console, create OAuth credentials and set the authorized redirect URI to
 `https://hejoric.com/api/auth/callback/google` (+ localhost for dev).
4. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `ADMIN_EMAIL` in Vercel env (and
 remove the old `GITHUB_ID` / `GITHUB_SECRET`).
5. Wire the Lately ingestion crons (YouTube last upload, current song, current book)
 to upsert `LatelyItem` rows.
