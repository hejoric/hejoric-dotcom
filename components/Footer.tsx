// Two groups: the places to follow along, then the two direct ways to reach
// me. The divider keeps eight links from reading as one undifferentiated row.
const socialLinks = [
  { label: "GitHub", href: "https://github.com/hejoric" },
  { label: "YouTube", href: "https://youtube.com/@hejoric" },
  { label: "Instagram", href: "https://instagram.com/hejoric" },
  { label: "TikTok", href: "https://tiktok.com/@hejoric" },
  { label: "X", href: "https://x.com/hejoric" },
  { label: "LinkedIn", href: "https://linkedin.com/in/hejoric" },
];

const directLinks = [
  { label: "Email", href: "mailto:hejoric@outlook.com" },
  { label: "Resume", href: "/resume.pdf" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-7 sm:flex-row sm:justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
          &copy; {new Date().getFullYear()} Jose Ricardo Herrera
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
          {socialLinks.map((link) => (
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
          {directLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-opacity duration-150 hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
