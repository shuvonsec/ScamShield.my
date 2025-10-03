import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const config = {
  experimental: {
    serverActions: true
  },
  poweredByHeader: false,
  reactStrictMode: true
};

export default withPWA({
  dest: 'public',
  disable: !isProd,
  runtimeCaching: []
})(config);
