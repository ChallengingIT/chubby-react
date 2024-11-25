const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://89.46.196.60:8443',
      changeOrigin: true,
    })
  );

  devServer: {
      allowedHosts: 'all',
   }
};
