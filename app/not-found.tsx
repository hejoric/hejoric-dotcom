import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

const buttonSolid =
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-text-primary px-5 text-[13px] font-semibold text-background transition-opacity duration-150 hover:opacity-80";
const buttonLine =
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-border px-5 text-[13px] font-semibold text-text-primary transition-colors duration-150 hover:border-text-muted";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-16 pt-10 sm:pt-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">404</p>
      <h1 className="mt-3 font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">This page doesn&apos;t exist.</h1>
      <p className="mt-6 max-w-[560px] leading-[1.8] text-text-secondary">The link may be old, or the page moved. Here&apos;s where everything lives now.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonSolid}>Home</Link>
        <Link href="/tracker" className={buttonLine}>Tracker</Link>
        <Link href="/projects" className={buttonLine}>Projects</Link>
        <Link href="/about" className={buttonLine}>About</Link>
        <Link href="/work" className={buttonLine}>Work with me</Link>
      </div>
    </div>
  );
}
