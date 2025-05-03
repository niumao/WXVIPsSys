require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { redisClient } = require('./config/database');
const routes = require('./routes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', routes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'server error' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// 连接Redis
redisClient.connect().catch(console.error);

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('received SIGTERM signal, preparing to close server');
  redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('received SIGINT signal, preparing to close server');
  redisClient.quit();
  process.exit(0);
}); 