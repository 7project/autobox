import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.autobox74.ru",
          },
        ],
        destination: "https://autobox74.ru/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "autobox.ru",
          },
        ],
        destination: "https://autobox74.ru/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.autobox.ru",
          },
        ],
        destination: "https://autobox74.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

