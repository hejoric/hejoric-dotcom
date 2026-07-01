import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, excerpt, content, tags, published } = body;
  const slug = body.slug ? slugify(body.slug) : slugify(title || "");

  if (!title || !excerpt || !content || !slug) {
    return NextResponse.json(
      { error: "title, excerpt, content, and a valid slug are required" },
      { status: 400 }
    );
  }

  const isPublished = Boolean(published);

  // Upsert by slug so re-submitting the same slug edits the existing post.
  const post = await prisma.blogPost.upsert({
    where: { slug },
    update: {
      title,
      excerpt,
      content,
      tags: Array.isArray(tags) ? tags : [],
      published: isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
    create: {
      slug,
      title,
      excerpt,
      content,
      tags: Array.isArray(tags) ? tags : [],
      published: isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
