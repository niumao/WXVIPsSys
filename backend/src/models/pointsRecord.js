const { redisClient } = require('../config/database');

class PointsRecord {
  // 创建积分记录
  static async create(recordData) {
    const { user_id, points, type, description } = recordData;
    const recordId = await redisClient.incr('points_record:next_id');
    
    const record = {
      id: recordId,
      user_id,
      points,
      type,
      description,
      created_at: new Date().toISOString()
    };

    await redisClient.hSet(`points_record:${recordId}`, record);
    await redisClient.zAdd(`user:${user_id}:points_records`, {
      score: Date.now(),
      value: recordId.toString()
    });

    return recordId;
  }

  // 获取用户的积分记录
  static async findByUserId(userId, page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    const recordIds = await redisClient.zRevRange(`user:${userId}:points_records`, start, end);
    const records = [];

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`points_record:${recordId}`);
      if (record.id) {
        records.push(record);
      }
    }

    return records;
  }

  // 获取用户积分记录总数
  static async countByUserId(userId) {
    return await redisClient.zCard(`user:${userId}:points_records`);
  }

  // 获取用户积分余额
  static async getBalance(userId) {
    const recordIds = await redisClient.zRange(`user:${userId}:points_records`, 0, -1);
    let balance = 0;

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`points_record:${recordId}`);
      if (record.id) {
        balance += parseInt(record.points);
      }
    }

    return balance;
  }

  // 获取所有积分记录（管理员使用）
  static async findAll(page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    const recordIds = await redisClient.zRevRange('points_records', start, end);
    const records = [];

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`points_record:${recordId}`);
      if (record.id) {
        const user = await redisClient.hGetAll(`user:${record.user_id}`);
        record.user_nickname = user.nickname;
        records.push(record);
      }
    }

    return records;
  }

  // 获取积分记录总数（管理员使用）
  static async countAll() {
    return await redisClient.zCard('points_records');
  }
}

module.exports = PointsRecord; 