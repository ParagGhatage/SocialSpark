const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/proxy-api', // Endpoint your frontend will use
        createProxyMiddleware({
            target: 'https://api.langflow.astra.datastax.com', // Langflow API
            changeOrigin: true,
            pathRewrite: { '^/proxy-api': '' }, // Remove '/proxy-api' prefix
            onProxyReq: (proxyReq, req, res) => {
                // Add Authorization header if needed
                const appToken = '<YOUR_APPLICATION_TOKEN>';
                proxyReq.setHeader('Authorization', `Bearer ${appToken}`);
                proxyReq.setHeader('Content-Type', 'application/json');
            },
        })
    );
};
