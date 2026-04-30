const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== 'ReactRefreshPlugin');
    }
    config.resolve.fallback = { fs: false, net: false };
    return config;
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    UPLOAD_TYPE: process.env.UPLOAD_TYPE,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    BASE_CURRENCY: process.env.BASE_CURRENCY,
    SHIPPING_FEE: process.env.SHIPPING_FEE,
    JWT_SECRET: process.env.JWT_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    IMAGE_BASE: process.env.IMAGE_BASE,
    IMAGE_URL: process.env.IMAGE_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    SECRET_KEY: process.env.SECRET_KEY
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ecobuy.site'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'dpwf-dev.ics-global.in',
        pathname: '/api/campaign/public/images/download/**'
      },
      {
        protocol: 'https',
        hostname: 'staging-document-service-api.cargoes.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ]
  },
  devIndicators: false
};

module.exports = withBundleAnalyzer(nextConfig);
