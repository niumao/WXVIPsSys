const ConsumptionRecord = require('../models/consumptionRecord');
const User = require('../models/user');
const MemberLevel = require('../models/memberLevel');
const PointsRecord = require('../models/pointsRecord');

class ConsumptionController {
  // 创建消费记录
  static async create(req, res) {
    try {
      const userId = req.user.id;
      const { amount, type, description, points_used = 0 } = req.body;

      // 检查用户余额
      const user = await User.findById(userId);
      if (user.balance < amount) {
        return res.status(400).json({ message: '余额不足' });
      }

      // 检查积分是否足够
      if (points_used > 0) {
        const pointsBalance = await PointsRecord.getBalance(userId);
        if (pointsBalance < points_used) {
          return res.status(400).json({ message: '积分不足' });
        }
      }

      // 创建消费记录
      const recordId = await ConsumptionRecord.create({
        user_id: userId,
        amount,
        type,
        description,
        points_used
      });

      // 更新用户余额
      await User.updateBalance(userId, -amount);

      // 如果使用了积分，创建积分消费记录
      if (points_used > 0) {
        await PointsRecord.create({
          user_id: userId,
          points: -points_used,
          type: 'consumption',
          description: `消费使用积分: ${description}`
        });
      }

      // 计算消费获得的积分
      const pointsEarned = Math.floor(amount * 0.05); // 消费金额的5%作为积分
      if (pointsEarned > 0) {
        await PointsRecord.create({
          user_id: userId,
          points: pointsEarned,
          type: 'consumption',
          description: `消费获得积分: ${description}`
        });

        // 检查是否需要更新会员等级
        const newLevel = await MemberLevel.getLevelByPoints(user.points + pointsEarned);
        if (newLevel && newLevel.id !== user.level_id) {
          await User.updateLevel(userId, newLevel.id);
        }
      }

      res.status(201).json({
        message: '消费成功',
        data: {
          record_id: recordId,
          amount,
          points_used,
          points_earned: pointsEarned
        }
      });
    } catch (error) {
      console.error('创建消费记录失败:', error);
      res.status(500).json({ message: '创建消费记录失败' });
    }
  }

  // 获取消费记录
  static async getRecords(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, pageSize = 10 } = req.query;

      const records = await ConsumptionRecord.findByUserId(userId, parseInt(page), parseInt(pageSize));
      const total = await ConsumptionRecord.countByUserId(userId);

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
      console.error('获取消费记录失败:', error);
      res.status(500).json({ message: '获取消费记录失败' });
    }
  }

  // 获取消费统计
  static async getStatistics(req, res) {
    try {
      const userId = req.user.id;
      const statistics = await ConsumptionRecord.getStatistics(userId);

      res.json({
        message: '获取成功',
        data: statistics
      });
    } catch (error) {
      console.error('获取消费统计失败:', error);
      res.status(500).json({ message: '获取消费统计失败' });
    }
  }

  // 获取所有消费记录（管理员接口）
  static async getAllRecords(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const records = await ConsumptionRecord.findAll(parseInt(page), parseInt(pageSize));
      const total = await ConsumptionRecord.countAll();

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
      console.error('获取所有消费记录失败:', error);
      res.status(500).json({ message: '获取所有消费记录失败' });
    }
  }
}

module.exports = ConsumptionController; 