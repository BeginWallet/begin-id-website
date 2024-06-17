/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/begin-id-website",
    output: "export",
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
