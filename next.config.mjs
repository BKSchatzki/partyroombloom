/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cmt76lyntq.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
