// next.config.mjs
export default {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://api.langflow.astra.datastax.com/:path*',
        },
      ];
    },
  };
  