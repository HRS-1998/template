const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Load SSL key and certificate
const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.crt')),
};
app.use(express.static(path.join(__dirname, 'public')));

// 添加代理中间件
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://192.168.105.71:1505/api',
    changeOrigin: true,
    secure: false, // 如果目标服务器使用自签名证书
  })
);

// Basic route
app.get('/', (req, res) => {
  res.send(fs.readFileSync(path.join(__dirname, 'index2.html'), 'utf8'));
});

// Start HTTPS server
const PORT = 3000;
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
});
