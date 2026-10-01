import Link from "next/link";
import { EMAIL, followLinks } from "@/lib/links";

// Two groups: the places to follow along, then the two direct ways to reach
// me. LinkedIn and the resume live on /work, which "Work with me" opens.
export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-7 sm:flex-row sm:justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
          &copy; {new Date().getFullYear()} Jose Ricardo Herrera
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
          {followLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-secondary transition-opacity duration-150 hover:text-text-primary hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
          <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
          <a
            href={`mailto:${EMAIL}`}
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-opacity duration-150 hover:opacity-70"
          >
            Email
          </a>
          <Link
            href="/work"
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-opacity duration-150 hover:opacity-70"
          >
            Work with me
          </Link>
        </div>
      </div>
    </footer>
  );
}
