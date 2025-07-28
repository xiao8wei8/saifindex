/** @type {import('next').NextConfig} */


import withAntdLess from 'next-plugin-antd-less';
/**
 * stockmarket
 * stockmarketstatistics
 * information_schema
 */
const nextConfig = {
    async redirects() {
        return [
          // Basic redirect
          {
            source: '/',
            destination: '/home',
            permanent: true,
          }
        ]
      },
    env: {
        MYSQL_HOST: "db.saifchat.com",
        MYSQL_PORT: "3306",
        MYSQL_DATABASE: "stockmarket",
        MYSQL_USER: "front_readonly",
        MYSQL_PASSWORD: "a7^!BX0V][C>oa<P",
    },
    transpilePackages: [
        "shiki",
        "@ant-design/pro-editor",
        "@ant-design/pro-chat",
        "react-intersection-observer",
    ],
    // output: 'standalone',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};


export default withAntdLess(nextConfig);