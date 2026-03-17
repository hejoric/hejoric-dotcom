import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="flex flex-col-reverse items-center gap-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Jose R. Herrera
          </h1>
          <p className="mt-2 text-lg text-text-secondary sm:text-xl">
            @hejoric
          </p>
          {/* TODO: replace with real bio copy */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            CS student. Builder. Lifelong learner.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-70"
            >
              View Projects
            </Link>
            <Link
              href="/blog"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-opacity duration-150 hover:opacity-70"
            >
              Read Blog
            </Link>
          </div>
        </div>
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full border-2 border-border sm:h-56 sm:w-56 lg:h-64 lg:w-64">
          <Image
            src="/headshot.png"
            alt="Jose R. Herrera"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
