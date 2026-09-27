/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Thumbnails for the latest YouTube upload on the homepage.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
};

module.exports = nextConfig;
