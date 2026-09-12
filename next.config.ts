import type { NextConfig } from 'next';

const onGitHubPages = process.env.GITHUB_PAGES === 'true';

const config: NextConfig = {
  output: onGitHubPages ? 'export' : undefined,
  basePath: '',
  assetPrefix: onGitHubPages ? '/devart/' : undefined,
  trailingSlash: false,
  images: { unoptimized: onGitHubPages },
};

export default config;
