# scripts

Three checks that cover what CI does not. The PR gate in `.github/workflows/ci.yml`
runs `eslint .` and `tsc --noEmit`, and nothing else: it never builds, never boots
the app, and never touches the database. Everything that has actually broken this
site in production lived in that gap.

## `check-drift.sh`

Does the database actually have the tables and columns the code expects?

```bash
./scripts/check-drift.sh                 # against the working tree's schema
./scripts/check-drift.sh origin/main     # against a git ref's schema
```

Compares the live database (whatever `DATABASE_URL` points at) to the models in
a schema file, via `prisma migrate diff`. It only ever prints SQL, it never
executes any. Exit 0 means no drift, exit 1 means drift, and the SQL printed is
what the database is *missing* relative to that schema:

- `CREATE TABLE` / `ADD COLUMN` means the database is behind the code. Deployed
  code that queries it throws at runtime (Postgres 42P01 / 42703).
- `DROP TABLE` means the database is ahead of the code, which is usually fine
  but worth knowing before a `db:push`.

This is the check that would have caught the September 2026 outage. `LatelyItem`
was dropped from the shared Neon database while main's homepage still queried
it, so only `/` returned 500, in production, with every local check green.

There is one database shared across branches and no migration history, so a
`db:push` from a branch schema rewrites production. Run this before and after
every push.

## `smoke.sh`

Hit every route and assert it actually rendered.

```bash
./scripts/smoke.sh                        # against a local `npm start`
./scripts/smoke.sh https://hejoric.com    # against production
```

Status codes alone are not evidence here, for three specific reasons:

- hejoric.com 307-redirects to www, so a bare `curl` returns "Redirecting..."
  rather than the page. The script always follows redirects.
- A Vercel *preview* URL returns 200 for the SSO login page, so a green status
  can mean "you are looking at a login form", not "the app works".
- Next.js can serve a rendered error boundary with a 200.

So each route asserts a status **and** a marker string from its `<h1>` **and**
the absence of error markers. A route that 200s without its marker is a
failure. `/api/projects` and `/api/activity` must additionally parse as JSON.

If you rename a page heading, update the marker in `ROUTES` or the check will
fail on a page that is fine.

## `test-pr.sh`

Test a pull request end to end in one command.

```bash
./scripts/test-pr.sh 9
```

Runs the whole ladder and stops at the first rung that fails:

```
worktree -> install -> lint -> typecheck -> build -> boot -> smoke
```

The PR is checked out into a throwaway worktree at `/tmp/pr-test-<n>`, so your
main checkout is never touched. `.env` is copied in because `next build`
prerenders pages that query Postgres and needs real credentials.

On success it leaves the server running so you can look at the thing by hand,
and prints the cleanup command. That is deliberate: the ladder only proves
nothing broke, not that the PR does what it claims. Ctrl+C stops the server;
the worktree is removed with `git worktree remove /tmp/pr-test-<n> --force`.
