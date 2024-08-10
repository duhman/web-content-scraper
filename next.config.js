/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  webpack: (config, { isServer }) => {
    config.resolve.alias['punycode'] = 'punycode/';
    return config;
  },
};

module.exports = nextConfig;