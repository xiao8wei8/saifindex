/** @type {import('next').NextConfig} */
const nextConfig = { env:{
    'MYSQL_HOST':'你的地址',
    'MYSQL_PORT':'3306',
    'MYSQL_DATABASE':'lg',
    'MYSQL_USER':'root',
    'MYSQL_PASSWORD':'root'
},
    transpilePackages: [
        'shiki',
        '@ant-design/pro-editor',
        '@ant-design/pro-chat',
        'react-intersection-observer',
    ],
    // output: 'standalone',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
};


export default nextConfig;

