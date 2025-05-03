const User = require('../models/user');
const jwt = require('jsonwebtoken');

class UserController {
  // 用户注册
  static async register(req, res) {
    try {
      const { openid, nickname, avatar, phone } = req.body;
      const userId = await User.create({ openid, nickname, avatar, phone });
      res.status(201).json({ message: '注册成功', userId });
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({ message: '注册失败' });
    }
  }

  // 用户登录
  static async login(req, res) {
    try {
      const { openid } = req.body;
      const user = await User.findByOpenid(openid);
      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ message: '登录成功', token, user });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({ message: '登录失败' });
    }
  }

  // 获取用户信息
  static async getUserInfo(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }
      res.json({ message: '获取成功', user });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      res.status(500).json({ message: '获取用户信息失败' });
    }
  }

  // 更新用户信息
  static async updateUserInfo(req, res) {
    try {
      const userId = req.user.id;
      const { nickname, avatar, phone } = req.body;
      const updatedUser = await User.update(userId, { nickname, avatar, phone });
      if (!updatedUser) {
        return res.status(404).json({ message: '用户不存在' });
      }
      res.json({ message: '更新成功', user: updatedUser });
    } catch (error) {
      console.error('更新用户信息失败:', error);
      res.status(500).json({ message: '更新用户信息失败' });
    }
  }

  // 获取用户余额
  static async getBalance(req, res) {
    try {
      const userId = req.user.id;
      const balance = await User.getBalance(userId);
      res.json({ message: '获取成功', balance });
    } catch (error) {
      console.error('获取用户余额失败:', error);
      res.status(500).json({ message: '获取用户余额失败' });
    }
  }

  // 获取用户积分余额
  static async getPointsBalance(req, res) {
    try {
      const userId = req.user.id;
      const points = await User.getPointsBalance(userId);
      res.json({ message: '获取成功', points });
    } catch (error) {
      console.error('获取用户积分余额失败:', error);
      res.status(500).json({ message: '获取用户积分余额失败' });
    }
  }

  // 获取所有用户（管理员接口）
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json({ message: '获取成功', users });
    } catch (error) {
      console.error('获取用户列表失败:', error);
      res.status(500).json({ message: '获取用户列表失败' });
    }
  }
}

module.exports = UserController; 