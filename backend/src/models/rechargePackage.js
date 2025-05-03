const { redisClient } = require('../config/database');

class RechargePackage {
  // 获取所有储值套餐
  static async findAll() {
    const packageKeys = await redisClient.keys('recharge_package:*');
    const packages = await Promise.all(
      packageKeys.map(async (key) => {
        const pkg = await redisClient.hGetAll(key);
        return pkg;
      })
    );
    return packages;
  }

  // 根据ID获取储值套餐
  static async findById(id) {
    const packageKey = `recharge_package:${id}`;
    const pkg = await redisClient.hGetAll(packageKey);
    return pkg.id ? pkg : null;
  }

  // 创建储值套餐
  static async create(packageData) {
    const id = await redisClient.incr('recharge_package:next_id');
    const packageKey = `recharge_package:${id}`;
    const pkg = {
      id,
      ...packageData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await redisClient.hSet(packageKey, pkg);
    return id;
  }

  // 更新储值套餐
  static async update(id, packageData) {
    const packageKey = `recharge_package:${id}`;
    const pkg = await redisClient.hGetAll(packageKey);
    if (!pkg.id) {
      return null;
    }
    const updatedPkg = {
      ...pkg,
      ...packageData,
      updated_at: new Date().toISOString()
    };
    await redisClient.hSet(packageKey, updatedPkg);
    return updatedPkg;
  }

  // 删除储值套餐
  static async delete(id) {
    const packageKey = `recharge_package:${id}`;
    const pkg = await redisClient.hGetAll(packageKey);
    if (!pkg.id) {
      return false;
    }
    await redisClient.del(packageKey);
    return true;
  }

  // 初始化储值套餐数据
  static async initPackages() {
    const packages = [
      {
        name: '基础套餐',
        amount: 100,
        bonus: 10,
        description: '充值100元赠送10元'
      },
      {
        name: '进阶套餐',
        amount: 300,
        bonus: 40,
        description: '充值300元赠送40元'
      },
      {
        name: '高级套餐',
        amount: 500,
        bonus: 80,
        description: '充值500元赠送80元'
      },
      {
        name: '尊享套餐',
        amount: 1000,
        bonus: 200,
        description: '充值1000元赠送200元'
      }
    ];

    for (const pkg of packages) {
      await this.create(pkg);
    }
  }
}

module.exports = RechargePackage; 