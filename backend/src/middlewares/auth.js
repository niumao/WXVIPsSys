const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 用户认证中间件
const auth = async (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: '无效的认证令牌' });
    }

    // 获取用户信息
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({ message: '认证失败' });
  }
};

// 管理员认证中间件
const adminAuth = async (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: '无效的认证令牌' });
    }

    // 获取用户信息
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    // 检查用户是否是管理员
    if (user.role !== 'admin') {
      return res.status(403).json({ message: '无权限访问' });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({ message: '认证失败' });
  }
};

module.exports = {
  auth,
  adminAuth
}; 