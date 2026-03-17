import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, techStack, githubUrl, liveUrl, featured } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "title and description are required" },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      techStack: techStack || [],
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      featured: featured || false,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
