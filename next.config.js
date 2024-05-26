/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        // domains: ["lh3.googleusercontent.com"],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                // port: '',
            },
        ]
    },
    typescript: {
        ignoreBuildErrors: true,
    }
}

module.exports = nextConfig
