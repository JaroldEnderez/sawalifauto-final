import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["via.placeholder.com", "source.unsplash.com", "www.topgear.com", "www.thedrive.com", "cleantechnica.com", "placehold.co", "media.formula1.com", "i0.wp.com", "d2n9h2wits23hf.cloudfront.net", "electrek.co" ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path",
        destination: "http://localhost:4000/api/:path*"
      }
    ]
  }
};


export default nextConfig;
