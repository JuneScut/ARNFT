/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")(["antd-mobile"]);

const nextConfig = withTM({
  reactStrictMode: false,
  swcMinify: true,
});

module.exports = nextConfig;
