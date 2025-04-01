/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    domains: [
      'lh3.googleusercontent.com',
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**", // Allow any path on utfs.io
      },
    ],
  },
};

export default nextConfig;