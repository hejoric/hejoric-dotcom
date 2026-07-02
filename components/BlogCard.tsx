import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: Date | string | null;
}

function formatCardDate(date: Date | string): string {
  return new Date(date)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
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
      <article className="grid gap-3 border-b border-border-soft py-8 sm:grid-cols-[160px_1fr] sm:gap-10">
        <div>
          {publishedAt && (
            <time className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              {formatCardDate(publishedAt)}
            </time>
          )}
          {tags.length > 0 && (
            <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-reading">
              {tags[0]}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-display text-[26px] leading-[1.2] text-text-primary sm:text-[32px]">
            <span className="border-b border-transparent transition-colors duration-150 group-hover:border-text-primary">
              {title}
            </span>
          </h3>
          <p className="mt-2.5 max-w-[640px] text-[15px] leading-[1.7] text-text-secondary">
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
