import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: Date | string | null;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  tags,
  publishedAt,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="rounded-lg border border-border p-6 transition-opacity duration-150 group-hover:opacity-90">
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          {publishedAt && <time>{formatDate(publishedAt)}</time>}
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface px-2 py-0.5 text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-text-primary">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {excerpt}
        </p>
      </article>
    </Link>
  );
}
