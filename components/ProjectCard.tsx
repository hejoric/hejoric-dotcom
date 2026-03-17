interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  techStack,
  githubUrl,
  liveUrl,
  featured,
}: ProjectCardProps) {
  return (
    <div className="group relative rounded-lg border border-border bg-surface p-6 transition-opacity duration-150 hover:opacity-90">
      {featured && (
        <span className="absolute right-4 top-4 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          Featured
        </span>
      )}
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent transition-opacity duration-150 hover:opacity-70"
          >
            GitHub
          </a>
        )}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent transition-opacity duration-150 hover:opacity-70"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
