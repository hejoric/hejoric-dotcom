import Image from "next/image";
import { YOUTUBE_HREF } from "@/lib/links";
import type { LatestVideo } from "@/lib/youtube";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function YouTubeCard({ video }: { video: LatestVideo | null }) {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
        On YouTube
      </h2>
      <div className="mt-5 grid items-center gap-6 rounded-lg border border-border p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6">
        <div className="grid items-center gap-5 md:grid-cols-[240px_minmax(0,1fr)]">
          {video && (
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-opacity duration-150 hover:opacity-80"
            >
              <Image
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt={`Thumbnail for "${video.title}"`}
                width={480}
                height={360}
                sizes="(min-width: 768px) 240px, 100vw"
                className="aspect-video w-full rounded object-cover"
              />
            </a>
          )}
          <div>
            {video && (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Latest · {formatDate(video.published)}
                </span>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 block font-display text-2xl leading-tight text-text-primary transition-opacity duration-150 hover:opacity-70"
                >
                  {video.title}
                </a>
              </>
            )}
            <p
              className={
                video
                  ? "mt-2 text-[14.5px] leading-[1.6] text-text-secondary"
                  : "font-display text-[22px] leading-[1.4] text-text-primary"
              }
            >
              A video journal of my life: playing, gameplay, travel. The goal is
              weekly, and showing people what being a UVA student is actually
              like.
            </p>
          </div>
        </div>
        <a
          href={YOUTUBE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-text-primary px-4 text-[13px] font-semibold text-background transition-opacity duration-150 hover:opacity-80"
        >
          Watch on YouTube &#8599;
        </a>
      </div>
    </section>
  );
}
