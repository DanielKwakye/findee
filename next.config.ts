import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* Optimize only images served from the Findee Cloudinary account. */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ddnzrzwjx/image/upload/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "findmus.com",
        pathname: "/images/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "findmus.com",
        pathname: "/_next/static/media/**",
        search: "",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
