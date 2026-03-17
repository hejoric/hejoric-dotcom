import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  const where: Record<string, unknown> = {
    date: { gte: startDate },
  };
  if (category) where.category = category;

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
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, category, count, note } = body;

  if (!date || !category) {
    return NextResponse.json(
      { error: "date and category are required" },
      { status: 400 }
    );
  }

  const validCategories = ["code", "music", "language", "fitness", "content"];
  if (!validCategories.includes(category)) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    );
  }

  const entry = await prisma.activityLog.upsert({
    where: {
      date_category: {
        date: new Date(date),
        category,
      },
    },
    update: { count: count || 1, note },
    create: {
      date: new Date(date),
      category,
      count: count || 1,
      note,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
