import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, publishedAt: true },
  });

  const blogEntries = posts.map((post) => ({
    url: `https://hejoric.com/blog/${post.slug}`,
    lastModified: post.publishedAt || undefined,
  }));

  return [
    { url: "https://hejoric.com", lastModified: new Date() },
    { url: "https://hejoric.com/projects", lastModified: new Date() },
    { url: "https://hejoric.com/tracker", lastModified: new Date() },
    { url: "https://hejoric.com/about", lastModified: new Date() },
    // /blog is only worth indexing once something is published there.
    ...(posts.length > 0
      ? [{ url: "https://hejoric.com/blog", lastModified: new Date() }]
      : []),
    ...blogEntries,
  ];
}
