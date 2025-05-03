const { redisClient } = require('../config/database');

class RechargeRecord {
  // 创建储值记录
  static async create(recordData) {
    const id = await redisClient.incr('recharge_record:next_id');
    const recordKey = `recharge_record:${id}`;
    const record = {
      id,
      ...recordData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await redisClient.hSet(recordKey, record);
    return id;
  }

  // 根据ID获取储值记录
  static async findById(id) {
    const recordKey = `recharge_record:${id}`;
    const record = await redisClient.hGetAll(recordKey);
    return record.id ? record : null;
  }

  // 根据用户ID获取储值记录
  static async findByUserId(userId, page = 1, pageSize = 10) {
    const recordKeys = await redisClient.keys('recharge_record:*');
    const records = await Promise.all(
      recordKeys.map(async (key) => {
        const record = await redisClient.hGetAll(key);
        return record;
      })
    );
    const userRecords = records.filter(record => record.user_id === userId);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return userRecords.slice(start, end);
  }

  // 统计用户储值记录数量
  static async countByUserId(userId) {
    const recordKeys = await redisClient.keys('recharge_record:*');
    const records = await Promise.all(
      recordKeys.map(async (key) => {
        const record = await redisClient.hGetAll(key);
        return record;
      })
    );
    return records.filter(record => record.user_id === userId).length;
  }

  // 更新储值记录状态
  static async updateStatus(id, status) {
    const recordKey = `recharge_record:${id}`;
    const record = await redisClient.hGetAll(recordKey);
    if (!record.id) {
      return null;
    }
    const updatedRecord = {
      ...record,
      status,
      updated_at: new Date().toISOString()
    };
    await redisClient.hSet(recordKey, updatedRecord);
    return updatedRecord;
  }

  // 获取储值记录详情（包含套餐信息）
  static async getRecordDetail(id) {
    const record = await this.findById(id);
    if (!record) {
      return null;
    }
    const pkg = await redisClient.hGetAll(`recharge_package:${record.package_id}`);
    return {
      ...record,
      package: pkg
    };
  }

  // 获取所有储值记录（管理员使用）
  static async findAll(page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    const recordIds = await redisClient.zRevRange('recharge_records', start, end);
    const records = [];

    for (const recordId of recordIds) {
      const record = await redisClient.hGetAll(`recharge_record:${recordId}`);
      if (record.id) {
        const user = await redisClient.hGetAll(`user:${record.user_id}`);
        const pkg = await redisClient.hGetAll(`recharge_package:${record.package_id}`);
        record.user_nickname = user.nickname;
        record.package_name = pkg.name;
        records.push(record);
      }
    }

    return records;
  }

  // 获取储值记录总数（管理员使用）
  static async countAll() {
    return await redisClient.zCard('recharge_records');
  }
}

module.exports = RechargeRecord; 