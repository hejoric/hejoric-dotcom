import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MDXRemote } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";
import { join } from "path";
import rehypePrettyCode from "rehype-pretty-code";
import { formatDate } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | hejoric`,
      description: post.excerpt,
      url: `https://hejoric.com/blog/${post.slug}`,
      type: "article",
      images: [{ url: "/og-default.png" }],
    },
    alternates: { canonical: `https://hejoric.com/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) notFound();

  let source: string;
  try {
    const filePath = join(process.cwd(), "content", "blog", `${params.slug}.mdx`);
    source = await readFile(filePath, "utf-8");
  } catch {
    source = `# ${post.title}\n\n*Content coming soon.*`;
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
          {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface px-2 py-0.5 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote
          source={source}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
            },
          }}
        />
      </div>
    </article>
  );
}
