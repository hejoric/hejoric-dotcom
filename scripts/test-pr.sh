#!/usr/bin/env bash
# Test a pull request end to end, in an isolated worktree, in one command.
#
#   ./scripts/test-pr.sh 14
#
# It runs the whole ladder and stops at the first rung that fails:
#   worktree -> install -> lint -> typecheck -> build -> boot -> smoke
#
# Nothing here touches your main checkout, and the server is always shut down
# on exit, including if you Ctrl+C.
set -uo pipefail

PR="${1:-}"
if [ -z "$PR" ]; then
  echo "usage: ./scripts/test-pr.sh <pr-number>"
  exit 2
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WT="/tmp/pr-test-$PR"
PORT="${PORT:-3100}"
SERVER_PID=""

cleanup() {
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    echo
    echo "shutting down server (pid $SERVER_PID)"
    kill "$SERVER_PID" 2>/dev/null
    wait "$SERVER_PID" 2>/dev/null
  fi
}
trap cleanup EXIT INT TERM

step() { echo; echo "=== $* ==="; }
die()  { echo; echo "FAILED at: $*"; exit 1; }

step "Resolving PR #$PR"
REF="$(gh pr view "$PR" --json headRefName --jq .headRefName 2>/dev/null)"
[ -n "$REF" ] || die "could not read PR #$PR (is gh logged in?)"
TITLE="$(gh pr view "$PR" --json title --jq .title 2>/dev/null)"
echo "  branch: $REF"
echo "  title:  $TITLE"

step "Preparing worktree at $WT"
cd "$ROOT" || die "cd $ROOT"
git fetch origin --quiet || die "git fetch"
if [ -d "$WT" ]; then
  git worktree remove "$WT" --force 2>/dev/null || rm -rf "$WT"
fi
git worktree add "$WT" "origin/$REF" --quiet || die "git worktree add"
cd "$WT" || die "cd $WT"
echo "  HEAD: $(git log --oneline -1)"

# next build prerenders pages that query Postgres, so it needs real credentials.
step "Copying .env"
[ -f "$ROOT/.env" ] || die ".env not found in $ROOT"
cp "$ROOT/.env" "$WT/.env" || die "cp .env"
echo "  copied $(grep -c . "$WT/.env") lines"

step "Installing dependencies"
npm ci >/tmp/pr-test-$PR-install.log 2>&1 || { tail -20 /tmp/pr-test-$PR-install.log; die "npm ci"; }
npx prisma generate >/dev/null 2>&1 || die "prisma generate"
echo "  ok  ($(grep -oE 'found [0-9]+ vulnerabilities|found 0 vulnerabilities' /tmp/pr-test-$PR-install.log | tail -1))"

step "Lint"
# Logged to a file rather than piped through `tail`, because the interesting
# line of an ESLint config failure is the first one, not the last: piping to
# `tail -5` leaves you with five stack frames and no error message.
npm run lint >/tmp/pr-test-$PR-lint.log 2>&1 || { head -30 /tmp/pr-test-$PR-lint.log; die "npm run lint"; }
echo "  ok"

step "Typecheck"
npx tsc --noEmit || die "npx tsc --noEmit"
echo "  ok"

step "Build"
npm run build >/tmp/pr-test-$PR-build.log 2>&1 || { tail -30 /tmp/pr-test-$PR-build.log; die "npm run build"; }
grep -E "Compiled successfully|Generating static pages" /tmp/pr-test-$PR-build.log | tail -2
echo "  ok"

step "Booting server on port $PORT"
PORT="$PORT" npm start >/tmp/pr-test-$PR-server.log 2>&1 &
SERVER_PID=$!
for i in $(seq 1 60); do
  curl -sf "http://localhost:$PORT" >/dev/null 2>&1 && break
  kill -0 "$SERVER_PID" 2>/dev/null || { tail -20 /tmp/pr-test-$PR-server.log; die "server exited"; }
  sleep 1
done
curl -sf "http://localhost:$PORT" >/dev/null 2>&1 || { tail -20 /tmp/pr-test-$PR-server.log; die "server never became ready"; }
echo "  ready after ${i}s (pid $SERVER_PID)"

step "Smoke test"
"$ROOT/scripts/smoke.sh" "http://localhost:$PORT" || die "smoke test"

echo
echo "============================================================"
echo "PR #$PR passed the ladder."
echo
echo "The ladder only proves nothing BROKE. Now check what the PR"
echo "actually claims to fix, by hand, against:"
echo "    http://localhost:$PORT"
echo
echo "Logs:  /tmp/pr-test-$PR-{install,lint,build,server}.log"
echo "Clean: git worktree remove $WT --force"
echo "============================================================"
echo
echo "Server still running on port $PORT. Press Ctrl+C to stop it."
wait "$SERVER_PID"
