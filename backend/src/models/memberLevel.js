const { redisClient } = require('../config/database');

class MemberLevel {
  // 获取所有会员等级
  static async findAll() {
    const levels = await redisClient.keys('member_level:*');
    const result = [];

    for (const levelKey of levels) {
      const level = await redisClient.hGetAll(levelKey);
      if (level.id) {
        result.push(level);
      }
    }

    return result.sort((a, b) => parseInt(a.points_required) - parseInt(b.points_required));
  }

  // 根据积分获取对应的会员等级
  static async getLevelByPoints(points) {
    const levels = await this.findAll();
    let targetLevel = null;

    for (const level of levels) {
      if (points >= parseInt(level.points_required)) {
        if (!targetLevel || parseInt(level.points_required) > parseInt(targetLevel.points_required)) {
          targetLevel = level;
        }
      }
    }

    return targetLevel;
  }

  // 获取下一个等级
  static async getNextLevel(currentLevelId) {
    const levels = await this.findAll();
    const currentLevel = levels.find(level => level.id === currentLevelId);
    
    if (!currentLevel) return null;

    return levels.find(level => parseInt(level.points_required) > parseInt(currentLevel.points_required));
  }

  // 创建会员等级
  static async create(levelData) {
    const { name, points_required, benefits } = levelData;
    const levelId = await redisClient.incr('member_level:next_id');
    
    const level = {
      id: levelId,
      name,
      points_required,
      benefits: JSON.stringify(benefits),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await redisClient.hSet(`member_level:${levelId}`, level);
    return levelId;
  }

  // 更新会员等级
  static async update(id, levelData) {
    const { name, points_required, benefits } = levelData;
    const updates = {
      name,
      points_required,
      benefits: JSON.stringify(benefits),
      updated_at: new Date().toISOString()
    };

    await redisClient.hSet(`member_level:${id}`, updates);
    return true;
  }

  // 删除会员等级
  static async delete(id) {
    await redisClient.del(`member_level:${id}`);
    return true;
  }

  // 初始化会员等级数据
  static async initLevels() {
    const levels = [
      {
        name: '青铜会员',
        points_required: 0,
        benefits: { discount: 0.95, description: '享受95折优惠' }
      },
      {
        name: '白银会员',
        points_required: 100,
        benefits: { discount: 0.9, description: '享受9折优惠' }
      },
      {
        name: '黄金会员',
        points_required: 300,
        benefits: { discount: 0.85, description: '享受85折优惠' }
      },
      {
        name: '铂金会员',
        points_required: 600,
        benefits: { discount: 0.8, description: '享受8折优惠' }
      },
      {
        name: '钻石会员',
        points_required: 1000,
        benefits: { discount: 0.75, description: '享受75折优惠' }
      },
      {
        name: '星耀会员',
        points_required: 1500,
        benefits: { discount: 0.7, description: '享受7折优惠' }
      },
      {
        name: '王者会员',
        points_required: 2000,
        benefits: { discount: 0.65, description: '享受65折优惠' }
      }
    ];

    for (const level of levels) {
      await this.create(level);
    }
  }
}

module.exports = MemberLevel; 