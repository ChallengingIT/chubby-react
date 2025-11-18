const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://80.211.138.142:8443',
      changeOrigin: true,
    })
  );
};
