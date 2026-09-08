#!/usr/bin/env bash
# Hit every route and assert it actually RENDERED, not merely that it responded.
#
#   ./scripts/smoke.sh                          # against a local `npm start`
#   ./scripts/smoke.sh https://hejoric.com      # against production
#
# Why not just check status codes:
#   - hejoric.com 307-redirects to www, so a bare curl returns "Redirecting..."
#     with a 307. Always follow redirects (-L).
#   - A Vercel *preview* URL returns HTTP 200 for the SSO login page, so a green
#     status can mean "you are looking at a login form", not "the app works".
#   - Next.js can serve a rendered error boundary with a 200.
# So every route asserts a status AND a marker string AND the absence of error
# markers. A route that 200s without its marker is a failure.
set -uo pipefail

BASE="${1:-http://localhost:3000}"
BASE="${BASE%/}"
fail=0
unreachable=0

# path|string that must appear in the HTML (taken from each page's <h1>)
ROUTES=(
  "/|Hejoric, aka The"
  "/projects|Stuff I"
  "/blog|Writing."
  "/tracker|The tracker."
  "/about|About me."
)

echo "Smoke testing $BASE"
echo

for entry in "${ROUTES[@]}"; do
  path="${entry%%|*}"
  marker="${entry#*|}"

  resp="$(curl -sL --max-time 30 -w $'\n%{http_code}' "$BASE$path" 2>/dev/null)"
  code="$(printf '%s' "$resp" | tail -n 1)"
  html="$(printf '%s' "$resp" | sed '$d')"
  bytes="${#html}"
  problems=""

  # 000 is not an HTTP status: curl never got a response at all. Report that
  # plainly instead of listing every downstream assertion as its own failure.
  if [ "$code" = "000" ]; then
    printf '  DOWN  %-12s no response (nothing listening at %s?)\n' "$path" "$BASE"
    unreachable=1
    fail=1
    continue
  fi

  [ "$code" != "200" ] && problems="$problems status=$code;"
  printf '%s' "$html" | grep -qi 'Login . Vercel\|vercel.com/sso' \
    && problems="$problems VERCEL LOGIN PAGE (not your app);"
  printf '%s' "$html" | grep -q '__next_error__' \
    && problems="$problems next error boundary;"
  printf '%s' "$html" | grep -q "$marker" \
    || problems="$problems missing marker \"$marker\";"

  if [ -z "$problems" ]; then
    printf '  PASS  %-12s %s  %sB\n' "$path" "$code" "$bytes"
  else
    printf '  FAIL  %-12s %s  %sB  -> %s\n' "$path" "$code" "$bytes" "$problems"
    fail=1
  fi
done

# APIs must return parseable JSON, not an HTML error page. Skipped entirely when
# nothing is listening, since "not JSON" would just be noise on top of "down".
for path in /api/projects /api/activity; do
  [ "$unreachable" -eq 1 ] && break
  body="$(curl -sL --max-time 30 "$BASE$path" 2>/dev/null)"
  if printf '%s' "$body" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{JSON.parse(d);process.exit(0)}catch(e){process.exit(1)}})' 2>/dev/null; then
    printf '  PASS  %-12s valid JSON  %sB\n' "$path" "${#body}"
  else
    printf '  FAIL  %-12s NOT JSON    %sB\n' "$path" "${#body}"
    fail=1
  fi
done

echo
if [ "$fail" -eq 0 ]; then
  echo "All routes rendered."
elif [ "$unreachable" -eq 1 ]; then
  echo "Nothing is serving $BASE. This says nothing about your code yet."
  echo "Start the server first, wait for it to print Ready, then re-run:"
  echo "    PORT=3100 npm start"
else
  echo "Failures above. A 200 with a missing marker means the page loaded but"
  echo "rendered the wrong thing: check the server log for the real error."
fi
exit "$fail"
