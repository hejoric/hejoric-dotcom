import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canWriteActivity } from "@/lib/api-auth";
import { MANUAL_CATEGORY_KEYS } from "@/lib/categories";

/** Upper bound on a single entry, so a stuck shortcut cannot log 10,000 reps. */
const MAX_COUNT = 1000;

/**
 * Normalizes to UTC midnight, because lib/calendar.ts builds the grid in UTC
 * and ActivityLog is unique on [date, category]: any other time-of-day would
 * create a second row for the same day.
 *
 * Callers should send an explicit `date`. A phone tapped at 8pm Eastern is
 * already tomorrow in UTC, so letting the server guess "today" would file the
 * entry on the wrong square.
 */
function toDayKey(value: unknown): Date | null {
  const day = value === undefined || value === null ? new Date() : new Date(String(value));
  if (Number.isNaN(day.getTime())) return null;
  return new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate())
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  const where: Record<string, unknown> = {
    date: { gte: startDate },
    category: category ?? { in: MANUAL_CATEGORY_KEYS },
  };

  const activities = await prisma.activityLog.findMany({ where });

  const data: Record<string, Record<string, number>> = {};
  for (const entry of activities) {
    if (!data[entry.category]) data[entry.category] = {};
    const key = entry.date.toISOString().split("T")[0];
    data[entry.category][key] = (data[entry.category][key] || 0) + entry.count;
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  // The signed-in admin, or a phone carrying ACTIVITY_TOKEN. See lib/api-auth.
  if (!(await canWriteActivity(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON" }, { status: 400 });
  }

  const { date, category, count, note, increment } = body;

  if (!category || typeof category !== "string") {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }

  // Code is sourced from GitHub, so writing it here would double-count.
  if (!MANUAL_CATEGORY_KEYS.includes(category)) {
    return NextResponse.json(
      {
        error: `Invalid category. Hand-logged categories: ${MANUAL_CATEGORY_KEYS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const day = toDayKey(date);
  if (!day) {
    return NextResponse.json(
      { error: "date must be a parseable date, e.g. 2026-09-08" },
      { status: 400 }
    );
  }

  // A one-tap shortcut sends no count, which means "one of these today".
  const amount = count === undefined || count === null ? 1 : Number(count);
  if (!Number.isInteger(amount) || amount < 1 || amount > MAX_COUNT) {
    return NextResponse.json(
      { error: `count must be a whole number between 1 and ${MAX_COUNT}` },
      { status: 400 }
    );
  }

  const noteText = typeof note === "string" && note.trim() ? note.trim() : undefined;

  // The admin form edits a day, so it replaces the count. A phone shortcut
  // records another session, so it adds to whatever is already there. Prisma's
  // atomic increment avoids a read-then-write race between the two.
  const update = increment
    ? { count: { increment: amount }, ...(noteText ? { note: noteText } : {}) }
    : { count: amount, note: noteText ?? null };

  const entry = await prisma.activityLog.upsert({
    where: { date_category: { date: day, category } },
    update,
    create: { date: day, category, count: amount, note: noteText },
  });

  return NextResponse.json(entry, { status: 201 });
}
