import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  "typescript": {
    "ignoreBuildErrors": true
  },
  "eslint": {
    "ignoreDuringBuilds": true
  },
  "images": {
    "unoptimized": true,
    "remotePatterns": [
      {
        "protocol": "https",
        "hostname": "avatars.githubusercontent.com",
        "port": "",
        "pathname": "/**"
      },
      {
        "protocol": "https",
        "hostname": "raw.githubusercontent.com",
        "port": "",
        "pathname": "/**"
      },
      {
        "protocol": "https",
        "hostname": "res.cloudinary.com",
        "port": "",
        "pathname": "/**"
      }
    ]
  },
  "reactStrictMode": true,
  "swcMinify": true,
  "experimental": {
    "appDir": true,
    "serverActions": true,
    "serverComponentsExternalPackages": ["lucide-react"]
  },
  "output": "standalone",
  "transpilePackages": ["@/components/ui", "@/components/terminal"] 
};

export default nextConfig;
