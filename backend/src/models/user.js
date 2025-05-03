const { redisClient } = require('../config/database');

class User {
  // 创建用户
  static async create(userData) {
    const { openid, nickname, avatar, phone } = userData;
    
    const user = {
      phone,
      openid,
      nickname,
      avatar,
      points: 0,
      balance: 0,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 存储用户数据
    await redisClient.hSet(`user:${phone}`, user);
    await redisClient.set(`user:openid:${phone}`, openid);

    return userId;
  }

  // 根据openid查找用户
  static async findByOpenid(openid) {
    const userId = await redisClient.get(`user:openid:${openid}`);
    if (!userId) return null;

    const user = await redisClient.hGetAll(`user:${userId}`);
    if (!user.id) return null;

    // 获取会员等级信息
    const level = await redisClient.hGetAll(`member_level:${user.level_id}`);
    user.level = level;

    return user;
  }

  // 根据ID查找用户
  static async findById(id) {
    const user = await redisClient.hGetAll(`user:${id}`);
    if (!user.id) return null;

    // 获取会员等级信息
    const level = await redisClient.hGetAll(`member_level:${user.level_id}`);
    user.level = level;

    return user;
  }

  // 更新用户信息
  static async update(id, userData) {
    const { nickname, avatar, phone } = userData;
    const updates = {
      nickname,
      avatar,
      phone,
      updated_at: new Date().toISOString()
    };

    await redisClient.hSet(`user:${id}`, updates);
    return await this.findById(id);
  }

  // 更新用户积分
  static async updatePoints(id, points) {
    const user = await this.findById(id);
    if (!user) return false;

    const newPoints = parseInt(user.points) + points;
    await redisClient.hSet(`user:${id}`, {
      points: newPoints,
      updated_at: new Date().toISOString()
    });

    // 检查是否需要更新会员等级
    const level = await this.getLevelByPoints(newPoints);
    if (level && level.id !== user.level_id) {
      await this.updateLevel(id, level.id);
    }

    return true;
  }

  // 更新用户余额
  static async updateBalance(id, amount) {
    const user = await this.findById(id);
    if (!user) return false;

    const newBalance = parseFloat(user.balance) + amount;
    await redisClient.hSet(`user:${id}`, {
      balance: newBalance,
      updated_at: new Date().toISOString()
    });

    return true;
  }

  // 更新用户等级
  static async updateLevel(id, levelId) {
    await redisClient.hSet(`user:${id}`, {
      level_id: levelId,
      updated_at: new Date().toISOString()
    });
    return true;
  }

  // 获取用户积分余额
  static async getPointsBalance(id) {
    const user = await this.findById(id);
    return user ? parseInt(user.points) : 0;
  }

  // 获取用户余额
  static async getBalance(id) {
    const user = await this.findById(id);
    return user ? parseFloat(user.balance) : 0;
  }

  // 根据积分获取会员等级
  static async getLevelByPoints(points) {
    const levels = await redisClient.keys('member_level:*');
    let targetLevel = null;

    for (const levelKey of levels) {
      const level = await redisClient.hGetAll(levelKey);
      if (points >= parseInt(level.points_required)) {
        if (!targetLevel || parseInt(level.points_required) > parseInt(targetLevel.points_required)) {
          targetLevel = level;
        }
      }
    }

    return targetLevel;
  }

  // 获取所有用户（管理员使用）
  static async findAll(page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    const userIds = await redisClient.zRange('users', start, end);
    const users = [];

    for (const userId of userIds) {
      const user = await this.findById(userId);
      if (user) {
        users.push(user);
      }
    }

    return users;
  }

  // 获取用户总数（管理员使用）
  static async countAll() {
    return await redisClient.zCard('users');
  }
}

module.exports = User; 