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
    rewrites: async () => {
        return [
            {
                source: '/beginid', 
                destination: 'https://begin.is/#beginid',
                basePath: false
            }
        ]
    }
};

export default nextConfig;
