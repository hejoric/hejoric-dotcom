interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  index: number;
  /** "card" = bordered (projects grid), "plain" = borderless (homepage) */
  variant?: "card" | "plain";
}

export default function ProjectCard({
  title,
  description,
  techStack,
  githubUrl,
  liveUrl,
  featured,
  index,
  variant = "card",
}: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");
  const label =
    variant === "card" && featured ? `${number} · Featured` : number;

  const body = (
    <>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-code">
        {label}
      </span>
      <h3 className="mt-3 font-display text-[28px] leading-tight text-text-primary">
        {title}
      </h3>
      <p className="mt-3 text-[14.5px] leading-[1.7] text-text-secondary">
        {description}
      </p>
      <span className="mt-4 block text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
        {techStack.join(" · ")}
      </span>
      {(githubUrl || liveUrl) && (
        <div className="mt-4 flex gap-6">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b-[1.5px] border-text-primary pb-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-opacity duration-150 hover:opacity-70"
            >
              Live &rarr;
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
            >
              GitHub &#8599;
            </a>
          )}
        </div>
      )}
    </>
  );

  if (variant === "plain") {
    return <div>{body}</div>;
  }

  return (
    <div className="rounded-md border border-border p-8 transition-colors duration-150 hover:border-text-muted sm:p-9">
      {body}
    </div>
  );
}
