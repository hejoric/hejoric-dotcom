import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { auth, isAdmin } from "@/lib/auth";

/**
 * Second door for POST /api/activity, so activity can be logged from a phone.
 *
 * The Google admin session cannot travel with an Android home-screen shortcut,
 * so a long-lived bearer token is the only practical way in. It is deliberately
 * narrow: only POST /api/activity ever checks it, so a leaked token cannot
 * publish projects or posts, and it is still subject to the same rule as the
 * admin form - `code` cannot be written, because GitHub owns that row.
 */

/** Below this, a token is treated as absent rather than weak. */
const MIN_TOKEN_LENGTH = 24;

const configured = process.env.ACTIVITY_TOKEN?.trim();

if (configured && configured.length < MIN_TOKEN_LENGTH) {
  console.warn(
    `[api-auth] ACTIVITY_TOKEN is shorter than ${MIN_TOKEN_LENGTH} characters, so it is being ignored. Generate one with: openssl rand -hex 32`
  );
}

/** SHA-256 both sides so the compare is fixed-width and leaks no length. */
function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function tokenMatches(presented: string): boolean {
  // An unset token means the door does not exist, not that it stands open.
  if (!configured || configured.length < MIN_TOKEN_LENGTH) return false;
  return timingSafeEqual(digest(presented), digest(configured));
}

/** True when the request carries a valid `Authorization: Bearer <token>`. */
export function hasActivityToken(req: NextRequest): boolean {
  const header = req.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return false;
  const presented = header.slice(7).trim();
  if (!presented) return false;
  return tokenMatches(presented);
}

/**
 * True for the signed-in admin, or for a request carrying the activity token.
 * Checks the token first so phone logging never pays for a session lookup.
 */
export async function canWriteActivity(req: NextRequest): Promise<boolean> {
  if (hasActivityToken(req)) return true;
  const session = await auth();
  return isAdmin(session?.user?.email);
}
