//const mysql = require('mysql2/promise');
const Redis = require('redis');

// // MySQL配置
// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'wxvips_sys',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

// // 创建MySQL连接池
// const pool = mysql.createPool(dbConfig);

// Redis配置
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379'
};

// 创建Redis客户端
const redisClient = Redis.createClient(redisConfig);

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// // 连接Redis
// redisClient.connect().catch(console.error);

module.exports = {
  //pool,
  redisClient
}; 