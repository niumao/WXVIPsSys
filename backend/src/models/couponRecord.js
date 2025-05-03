const { redisClient } = require('../config/database');

class CouponRecord {
  // 创建优惠券使用记录
  static async create(recordData) {
    const { user_id, coupon_id, status = 'unused' } = recordData;
    const recordId = await redisClient.incr('coupon_record:next_id');
    
    const record = {
      id: recordId,
      user_id,
      coupon_id,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await redisClient.hSet(`coupon_record:${recordId}`, record);
    await redisClient.zAdd(`user:${user_id}:coupon_records`, {
      score: Date.now(),
      value: recordId.toString()
    });
    await redisClient.zAdd(`coupon:${coupon_id}:received`, {
      score: Date.now(),
      value: recordId.toString()
    });

    return recordId;
  }

  // 更新优惠券使用状态
  static async updateStatus(id, status) {
    await redisClient.hSet(`coupon_record:${id}`, {
      status,
      used_time: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return true;
  }

  // 获取用户的优惠券使用记录
  static async findByUserId(userId) {
    const recordIds = await redisClient.zRange(`user:${userId}:coupon_records`, 0, -1);
    const records = [];

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`coupon_record:${recordId}`);
      if (record.id) {
        const coupon = await redisClient.hGetAll(`coupon:${record.coupon_id}`);
        record.coupon_name = coupon.name;
        record.type = coupon.type;
        record.value = coupon.value;
        record.min_amount = coupon.min_amount;
        records.push(record);
      }
    }

    return records;
  }

  // 检查用户是否已领取优惠券
  static async checkReceived(userId, couponId) {
    const recordIds = await redisClient.zRange(`user:${userId}:coupon_records`, 0, -1);
    
    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`coupon_record:${recordId}`);
      if (record.id && record.coupon_id === couponId) {
        return record;
      }
    }

    return null;
  }

  // 获取优惠券使用统计
  static async getStatistics(couponId) {
    const recordIds = await redisClient.zRange(`coupon:${couponId}:received`, 0, -1);
    let total_received = 0;
    let total_used = 0;
    let total_unused = 0;

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`coupon_record:${recordId}`);
      if (record.id) {
        total_received += 1;
        if (record.status === 'used') {
          total_used += 1;
        } else if (record.status === 'unused') {
          total_unused += 1;
        }
      }
    }

    return {
      total_received,
      total_used,
      total_unused
    };
  }

  // 获取所有优惠券使用记录（管理员使用）
  static async findAll(page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    const recordIds = await redisClient.zRevRange('coupon_records', start, end);
    const records = [];

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`coupon_record:${recordId}`);
      if (record.id) {
        const user = await redisClient.hGetAll(`user:${record.user_id}`);
        const coupon = await redisClient.hGetAll(`coupon:${record.coupon_id}`);
        record.user_nickname = user.nickname;
        record.coupon_name = coupon.name;
        records.push(record);
      }
    }

    return records;
  }

  // 获取优惠券使用记录总数（管理员使用）
  static async countAll() {
    return await redisClient.zCard('coupon_records');
  }
}

module.exports = CouponRecord; 