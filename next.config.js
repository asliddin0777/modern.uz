require('dotenv').config();
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "ik.imagekit.io",
          pathname: "/z6k3ktb71/**",
        },
      ],
    },
    serverRuntimeConfig: {
      port: process.env.PORT,
    },
    publicRuntimeConfig: {
      port: process.env.PORT,
    },
  };

const withNextIntl = require('next-intl/plugin')(
    './i18n.ts'
);

module.exports = withNextIntl(nextConfig)