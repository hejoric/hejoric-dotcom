/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stop `next dev` from writing its agent-rules block into AGENTS.md or CLAUDE.md.
  agentRules: false,
  images: {
    // Thumbnails for the latest YouTube upload on the homepage.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
};

module.exports = nextConfig;
