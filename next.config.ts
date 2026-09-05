import type { NextConfig } from "next";

/** Set GITHUB_PAGES=true for project-site deploy under /purp-companion */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGithubPages
    ? {
        basePath: "/purp-companion",
        assetPrefix: "/purp-companion/",
      }
    : {}),
};

export default nextConfig;
