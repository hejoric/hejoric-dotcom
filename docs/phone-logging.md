# Logging activity from an Android phone

Music, Language, Fitness and Reading are hand-logged, and a row stays hidden
until it has real entries. Opening `/admin` on a laptop to log a gym session is
enough friction that it does not happen, which is why those four rows are
empty. This sets up one-tap logging from the phone's home screen.

## How it works

`POST /api/activity` accepts either the admin Google session (what `/admin`
uses) or a bearer token (`ACTIVITY_TOKEN`). A home-screen shortcut cannot carry
a Google session, so the token is the only practical way in.

The token is deliberately narrow:

- Only `POST /api/activity` checks it. It cannot publish projects or posts.
- It still cannot write `code`. GitHub owns that row, and writing it by hand
  would double-count. A valid token asking for `code` gets a 400.
- Tokens shorter than 24 characters are ignored, so a placeholder cannot
  accidentally become a live credential.
- Unset means phone logging is disabled, not that the endpoint is open.

## 1. Generate the token

```bash
openssl rand -hex 32
```

Add it in Vercel under Settings, Environment Variables, as `ACTIVITY_TOKEN`,
for Production (and Preview if you want to test there). Redeploy so the running
functions pick it up. To rotate later, change the value and redeploy: the old
token stops working immediately.

Keep it out of git. It belongs in `.env` locally, which is gitignored.

## 2. Install HTTP Shortcuts

Android's equivalent of iOS Shortcuts for this job is **HTTP Shortcuts** by
Roland Meyer (free, open source, on both Play Store and F-Droid). It makes
home-screen icons that fire a single HTTP request. Tasker also works if you
already own it, and `curl` in Termux works if you would rather script it.

## 3. Create a date variable

Do this once, before making the shortcuts. In the app's **Variables** section,
add a variable:

- Name: `today`
- Type: **Date**
- Format: `yyyy-MM-dd`

**This part matters.** The server normalizes every entry to UTC midnight,
because the heatmap grid is built in UTC and `ActivityLog` is unique on
`[date, category]`. If the shortcut sends no date, the server falls back to
*its* idea of today: tap "log gym" at 8pm Eastern and UTC has already rolled
over, so the session lands on tomorrow's square. Sending the phone's local date
puts it on the right day.

## 4. Create one shortcut per category

For each, a new **Regular shortcut**:

| Field | Value |
| --- | --- |
| Method | `POST` |
| URL | `https://hejoric.com/api/activity` |
| Request body type | `application/json` |
| Header | `Authorization` = `Bearer YOUR_TOKEN_HERE` |

Body, inserting the `today` variable where shown:

```json
{ "category": "fitness", "date": "{{today}}", "increment": true }
```

Then swap `category` for each row. **The category keys are not the labels:**

| Row on the site | `category` value |
| --- | --- |
| Music | `music` |
| Language | `language` |
| Fitness | `fitness` |
| Reading | `content` |

Reading is stored as `content` for historical reasons. Sending `"reading"`
returns a 400 listing the valid keys.

Long-press each shortcut to place it on the home screen.

## What `increment` does

| Body | Behavior |
| --- | --- |
| `"increment": true` | Adds to whatever today already has. Two gym sessions in a day gives that square a count of 2. This is what you want on a phone. |
| omitted | Replaces the count for that day. This is what `/admin` does, because editing a day should overwrite it, not stack on it. |

Other optional fields: `count` (a whole number from 1 to 1000, defaults to 1)
and `note` (free text, shown in the heatmap tooltip). In increment mode a note
is only written when you send one, so repeat taps do not wipe it.

## Checking it worked

```bash
curl -s -X POST https://hejoric.com/api/activity \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{"category":"fitness","date":"2026-09-08","increment":true}'
```

A `201` with the row echoed back means it landed. `/tracker` and `/` are static
with `revalidate = 300`, so give it up to five minutes to appear.

`GET /api/activity` is public and needs no token, so you can read back what is
stored:

```bash
curl -s 'https://hejoric.com/api/activity?category=fitness'
```

## Errors you might hit

| Response | Cause |
| --- | --- |
| `401 Unauthorized` | Token missing, wrong, under 24 chars, or `ACTIVITY_TOKEN` not set on the deployment. Check for a stray newline in the Vercel value. |
| `400 Invalid category` | Used a label instead of a key. Reading is `content`. |
| `400 date must be a parseable date` | The `today` variable did not expand. Check its format is `yyyy-MM-dd`. |
| `400 count must be a whole number between 1 and 1000` | A `count` of 0, a decimal, or something absurd. |
| Entry on the wrong day | The shortcut is not sending `date`, so the server used UTC today. See step 3. |
