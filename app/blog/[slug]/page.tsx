import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MDXRemote } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";
import { join } from "path";
import rehypePrettyCode from "rehype-pretty-code";

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

function formatPostDate(date: Date | string): string {
  return new Date(date)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) notFound();

  // Prefer DB content (created via the admin panel); fall back to an MDX file
  // in content/blog/ for legacy/file-based posts.
  let source: string;
  if (post.content && post.content.trim()) {
    source = post.content;
  } else {
    try {
      const filePath = join(process.cwd(), "content", "blog", `${params.slug}.mdx`);
      source = await readFile(filePath, "utf-8");
    } catch {
      source = `# ${post.title}\n\n*Content coming soon.*`;
    }
  }

  const readMinutes = Math.max(1, Math.round(source.split(/\s+/).length / 200));

  const previousPost = post.publishedAt
    ? await prisma.blogPost.findFirst({
        where: { published: true, publishedAt: { lt: post.publishedAt } },
        orderBy: { publishedAt: "desc" },
        select: { slug: true, title: true },
      })
    : null;

  return (
    <article className="mx-auto max-w-[660px] px-6 py-16 sm:py-[72px]">
      <header>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
          {post.publishedAt && (
            <time className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              {formatPostDate(post.publishedAt)}
            </time>
          )}
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-reading"
            >
              {tag}
            </span>
          ))}
          <span className="font-display text-sm italic text-text-muted">
            {readMinutes} min read
          </span>
        </div>
        <h1 className="mt-4 font-display text-4xl leading-[1.12] tracking-[-0.01em] text-text-primary sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 font-display text-xl italic leading-normal text-text-secondary">
          {post.excerpt}
        </p>
        <div className="mt-7 flex gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-[2px] bg-code" />
          <span className="h-1.5 w-1.5 rounded-[2px] bg-music" />
          <span className="h-1.5 w-1.5 rounded-[2px] bg-language" />
          <span className="h-1.5 w-1.5 rounded-[2px] bg-fitness" />
          <span className="h-1.5 w-1.5 rounded-[2px] bg-reading" />
        </div>
      </header>
      <div className="post-prose mt-7">
        <MDXRemote
          source={source}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
            },
          }}
        />
      </div>
      <footer className="mt-14 flex items-baseline justify-between gap-6 border-t border-border pt-6">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
          >
            &larr; {previousPost.title}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/blog"
          className="shrink-0 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-muted transition-opacity duration-150 hover:text-text-primary hover:opacity-70"
        >
          All posts &rarr;
        </Link>
      </footer>
    </article>
  );
}
