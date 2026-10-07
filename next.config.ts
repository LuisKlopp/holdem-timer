import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elio-bucket-s3.s3.ap-northeast-2.amazonaws.com",
        pathname: "/holdem-members/**",
      },
    ],
  },
};

export default nextConfig;
