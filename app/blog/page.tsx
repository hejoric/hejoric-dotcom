import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on what I'm building and what I'm learning, by Jose Ricardo Herrera (Hejoric).",
  openGraph: {
    title: "Blog | hejoric",
    description:
      "Notes on what I'm building and what I'm learning, by Jose Ricardo Herrera (Hejoric).",
    url: "https://hejoric.com/blog",
    type: "website",
  },
  alternates: { canonical: "https://hejoric.com/blog" },
};

// Content comes from Postgres, so re-render on a short interval instead of
// freezing at build time (edits made in /admin appear within five minutes).
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
        Writing.
      </h1>
      <p className="mt-4 max-w-[560px] leading-[1.7] text-text-secondary">
        Notes on building, learning in public, and{" "}
        <span className="font-display text-[17px] italic text-text-primary">
          keeping score.
        </span>
      </p>

      <div className="mt-9 border-t border-border">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            tags={post.tags}
            publishedAt={post.publishedAt}
          />
        ))}
        {posts.length === 0 && (
          <p className="py-10 text-center text-text-secondary">
            No posts yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}
