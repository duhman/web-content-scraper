/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  webpack(config) {
    config.module.rules.push({
      test: /\.css$/i,
      use: ["postcss-loader"],
    });
    return config;
  },
};

module.exports = nextConfig;