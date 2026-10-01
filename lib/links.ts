// Every outbound link in one place, so the hero, footer, and /work agree.
//
// The homepage is the personal side (follow along); LinkedIn and the resume
// belong to /work, where people who are hiring land.

export const EMAIL = "hejoric@outlook.com";
export const RESUME_HREF = "/resume.pdf";
export const GITHUB_HREF = "https://github.com/hejoric";
export const LINKEDIN_HREF = "https://linkedin.com/in/hejoric";
export const YOUTUBE_HREF = "https://youtube.com/@hejoric";

/** Follow links, in the order they appear. `colorVar` tints the pill dot. */
export const followLinks = [
  { label: "YouTube", href: YOUTUBE_HREF, colorVar: "--cat-music" },
  { label: "Instagram", href: "https://instagram.com/hejoric", colorVar: "--cat-fitness" },
  { label: "TikTok", href: "https://tiktok.com/@hejoric", colorVar: "--cat-reading" },
  { label: "GitHub", href: GITHUB_HREF, colorVar: "--cat-code" },
  { label: "X", href: "https://x.com/hejoric", colorVar: "--text-muted" },
];
