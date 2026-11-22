/** @type {import('next').NextConfig} */
const nextConfig = {
  // Run ESLint through `npm run lint`; Next 15's build-time lint bridge is
  // incompatible with this repository's ESLint 9 flat configuration.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "googleusercontent.com"],
  },
};

export default nextConfig;
