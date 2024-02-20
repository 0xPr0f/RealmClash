/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'violet-reluctant-warbler-180.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
}

export default nextConfig
