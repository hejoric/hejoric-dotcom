const footerLinks = [
  { label: "GitHub", href: "https://github.com/hejoric" },
  { label: "YouTube", href: "https://youtube.com/@hejoric" },
  { label: "LinkedIn", href: "https://linkedin.com/in/hejoric" },
  { label: "Email", href: "mailto:hejoric@outlook.com" },
  { label: "Resume", href: "/resume.pdf" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-7 sm:flex-row sm:justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
          &copy; {new Date().getFullYear()} Jose R. Herrera
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
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
        </div>
      </div>
    </footer>
  );
}
