/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    // output: "export",
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: '/**',
          },
          {
            hostname: '*',
          },
        ],
      },
};

export default nextConfig;
