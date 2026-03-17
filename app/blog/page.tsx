import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on software engineering, learning, and building — by Jose R. Herrera (hejoric).",
  openGraph: {
    title: "Blog | hejoric",
    description:
      "Thoughts on software engineering, learning, and building — by Jose R. Herrera (hejoric).",
    url: "https://hejoric.com/blog",
    type: "website",
    images: [{ url: "/og-default.png" }],
  },
  alternates: { canonical: "https://hejoric.com/blog" },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        Blog
      </h1>
      <p className="mt-2 text-text-secondary">
        Writing about code, learning, and the journey.
      </p>

      <div className="mt-10 space-y-6">
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
          <p className="text-center text-text-secondary">
            No posts yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}
