"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

// Blog is intentionally absent until there is a real post to read; the
// route still works and gets linked back once /blog has content.
const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/tracker", label: "Tracker" },
  { href: "/about", label: "About" },
];

function LogoMark() {
  return (
    <span className="grid grid-cols-2 gap-[2px]" aria-hidden>
      <span className="h-[7px] w-[7px] rounded-[2px] bg-code" />
      <span className="h-[7px] w-[7px] rounded-[2px] bg-music" />
      <span className="h-[7px] w-[7px] rounded-[2px] bg-fitness" />
      <span className="h-[7px] w-[7px] rounded-[2px] bg-language" />
    </span>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-150 hover:opacity-70"
        >
          <LogoMark />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-primary">
            Hejoric
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "border-b-[1.5px] border-text-primary pb-0.5 text-sm font-medium text-text-primary"
                  : "text-sm text-text-secondary transition-opacity duration-150 hover:text-text-primary hover:opacity-70"
              }
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center text-text-secondary transition-opacity duration-150 hover:text-text-primary hover:opacity-70"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              {mobileOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  isActive(link.href)
                    ? "text-sm font-medium text-text-primary"
                    : "text-sm text-text-secondary transition-opacity duration-150 hover:text-text-primary"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
