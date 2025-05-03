const RechargePackage = require('../models/rechargePackage');
const RechargeRecord = require('../models/rechargeRecord');
const User = require('../models/user');
const PointsRecord = require('../models/pointsRecord');
const MemberLevel = require('../models/memberLevel');

class RechargeController {
  // 获取储值套餐
  static async getPackages(req, res) {
    try {
      const packages = await RechargePackage.findAll();
      res.json({ message: '获取成功', packages });
    } catch (error) {
      console.error('获取储值套餐失败:', error);
      res.status(500).json({ message: '获取储值套餐失败' });
    }
  }

  // 创建储值记录
  static async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const { package_id, amount } = req.body;

      // 获取储值套餐
      const pkg = await RechargePackage.findById(package_id);
      if (!pkg) {
        return res.status(404).json({ message: '储值套餐不存在' });
      }

      // 计算实际储值金额和赠送金额
      const actualAmount = amount || pkg.amount;
      const bonusAmount = Math.floor(actualAmount * (pkg.bonus / 100));

      // 创建储值记录
      const recordId = await RechargeRecord.create({
        user_id: userId,
        package_id,
        amount: actualAmount,
        bonus_amount: bonusAmount,
        status: 'pending'
      });

      // 更新用户余额
      await User.updateBalance(userId, actualAmount + bonusAmount);

      res.status(201).json({
        message: '储值成功',
        data: {
          record_id: recordId,
          amount: actualAmount,
          bonus_amount: bonusAmount
        }
      });
    } catch (error) {
      console.error('储值失败:', error);
      res.status(500).json({ message: '储值失败' });
    }
  }

  // 获取储值记录
  static async getRecords(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, pageSize = 10 } = req.query;

      const records = await RechargeRecord.findByUserId(userId, parseInt(page), parseInt(pageSize));
      const total = await RechargeRecord.countByUserId(userId);

      res.json({
        message: '获取成功',
        data: {
          records,
          pagination: {
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
          }
        }
      });
    } catch (error) {
      console.error('获取储值记录失败:', error);
      res.status(500).json({ message: '获取储值记录失败' });
    }
  }

  // 获取所有储值记录（管理员接口）
  static async getAllRecords(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const records = await RechargeRecord.findAll(parseInt(page), parseInt(pageSize));
      const total = await RechargeRecord.countAll();

      res.json({
        message: '获取成功',
        data: {
          records,
          pagination: {
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
          }
        }
      });
    } catch (error) {
      console.error('获取所有储值记录失败:', error);
      res.status(500).json({ message: '获取所有储值记录失败' });
    }
  }

  // 处理支付成功回调
  static async handlePaymentSuccess(req, res) {
    try {
      const { record_id, transaction_id } = req.body;

      // 获取储值记录
      const record = await RechargeRecord.findById(record_id);
      if (!record) {
        return res.status(404).json({ message: '储值记录不存在' });
      }

      if (record.status !== 'pending') {
        return res.status(400).json({ message: '该记录已处理' });
      }

      // 更新储值记录状态
      await RechargeRecord.updateStatus(record_id, 'success', transaction_id);

      // 更新用户余额
      await User.updateBalance(record.user_id, record.amount + record.bonus_amount);

      // 计算获得的积分
      const pointsEarned = Math.floor(record.amount * 0.1); // 储值金额的10%作为积分
      if (pointsEarned > 0) {
        await PointsRecord.create({
          user_id: record.user_id,
          points: pointsEarned,
          type: 'recharge',
          description: `储值获得积分: ${record.amount}元`
        });

        // 检查是否需要更新会员等级
        const user = await User.findById(record.user_id);
        const newLevel = await MemberLevel.getLevelByPoints(user.points + pointsEarned);
        if (newLevel && newLevel.id !== user.level_id) {
          await User.updateLevel(record.user_id, newLevel.id);
        }
      }

      res.json({
        message: '支付成功',
        data: {
          record_id,
          amount: record.amount,
          bonus_amount: record.bonus_amount,
          points_earned: pointsEarned
        }
      });
    } catch (error) {
      console.error('处理支付成功回调失败:', error);
      res.status(500).json({ message: '处理支付成功回调失败' });
    }
  }
}

module.exports = RechargeController; 