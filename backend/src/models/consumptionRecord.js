const { redisClient } = require('../config/database');

class ConsumptionRecord {
  // 创建消费记录
  static async create(recordData) {
    const { user_id, amount, type, description, points_used = 0 } = recordData;
    const recordId = await redisClient.incr('consumption_record:next_id');
    
    const record = {
      id: recordId,
      user_id,
      amount,
      type,
      description,
      points_used,
      created_at: new Date().toISOString()
    };

    await redisClient.hSet(`consumption_record:${recordId}`, record);
    await redisClient.zAdd(`user:${user_id}:consumption_records`, {
      score: Date.now(),
      value: recordId.toString()
    });
    await redisClient.zAdd('consumption_records', {
      score: Date.now(),
      value: recordId.toString()
    });

    return recordId;
  }

  // 获取用户的消费记录
  static async findByUserId(userId, page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    const recordIds = await redisClient.zRevRange(`user:${userId}:consumption_records`, start, end);
    const records = [];

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`consumption_record:${recordId}`);
      if (record.id) {
        records.push(record);
      }
    }

    return records;
  }

  // 获取用户消费记录总数
  static async countByUserId(userId) {
    return await redisClient.zCard(`user:${userId}:consumption_records`);
  }

  // 获取用户消费统计
  static async getStatistics(userId) {
    const recordIds = await redisClient.zRange(`user:${userId}:consumption_records`, 0, -1);
    let total_amount = 0;
    let total_count = 0;
    let total_points_used = 0;

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`consumption_record:${recordId}`);
      if (record.id) {
        total_amount += parseFloat(record.amount);
        total_count += 1;
        total_points_used += parseInt(record.points_used);
      }
    }

    return {
      total_amount,
      total_count,
      total_points_used
    };
  }

  // 获取所有消费记录（管理员使用）
  static async findAll(page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    const recordIds = await redisClient.zRevRange('consumption_records', start, end);
    const records = [];

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`consumption_record:${recordId}`);
      if (record.id) {
        const user = await redisClient.hGetAll(`user:${record.user_id}`);
        record.user_nickname = user.nickname;
        records.push(record);
      }
    }

    return records;
  }

  // 获取消费记录总数（管理员使用）
  static async countAll() {
    return await redisClient.zCard('consumption_records');
  }

  // 获取消费统计（管理员使用）
  static async getAdminStatistics() {
    const recordIds = await redisClient.zRange('consumption_records', 0, -1);
    let total_amount = 0;
    let total_count = 0;
    let total_points_used = 0;
    const userSet = new Set();

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`consumption_record:${recordId}`);
      if (record.id) {
        total_amount += parseFloat(record.amount);
        total_count += 1;
        total_points_used += parseInt(record.points_used);
        userSet.add(record.user_id);
      }
    }

    return {
      total_amount,
      total_count,
      total_points_used,
      total_users: userSet.size
    };
  }
}

module.exports = ConsumptionRecord; 