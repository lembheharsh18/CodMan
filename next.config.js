/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
