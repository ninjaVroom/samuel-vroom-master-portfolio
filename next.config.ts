import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: __dirname },
  async redirects() {
    return [{ source: "/work/aam2023-qr-credentialing", destination: "/work/gateway", permanent: true }];
  },
};

export default config;
