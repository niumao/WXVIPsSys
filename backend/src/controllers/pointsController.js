const PointsRecord = require('../models/pointsRecord');
const User = require('../models/user');
const MemberLevel = require('../models/memberLevel');

class PointsController {
  // 获取积分余额
  static async getBalance(req, res) {
    try {
      const userId = req.user.id;
      const balance = await PointsRecord.getBalance(userId);

      res.json({
        message: '获取成功',
        data: { balance }
      });
    } catch (error) {
      console.error('获取积分余额失败:', error);
      res.status(500).json({ message: '获取积分余额失败' });
    }
  }

  // 获取积分记录
  static async getRecords(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, pageSize = 10 } = req.query;

      const records = await PointsRecord.findByUserId(userId, parseInt(page), parseInt(pageSize));
      const total = await PointsRecord.countByUserId(userId);

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
      console.error('获取积分记录失败:', error);
      res.status(500).json({ message: '获取积分记录失败' });
    }
  }

  // 积分兑换
  static async exchange(req, res) {
    try {
      const userId = req.user.id;
      const { points, type, description } = req.body;

      // 检查积分余额
      const balance = await PointsRecord.getBalance(userId);
      if (balance < points) {
        return res.status(400).json({ message: '积分余额不足' });
      }

      // 创建积分消费记录
      await PointsRecord.create({
        user_id: userId,
        points: -points,
        type,
        description
      });

      // 检查是否需要更新会员等级
      const user = await User.findById(userId);
      const newLevel = await MemberLevel.getLevelByPoints(user.points - points);
      if (newLevel && newLevel.id !== user.level_id) {
        await User.updateLevel(userId, newLevel.id);
      }

      res.json({
        message: '兑换成功',
        data: {
          points,
          type,
          description
        }
      });
    } catch (error) {
      console.error('积分兑换失败:', error);
      res.status(500).json({ message: '积分兑换失败' });
    }
  }

  // 获取积分规则
  static async getRules(req, res) {
    try {
      const rules = {
        recharge: {
          description: '储值获得积分',
          rate: 0.1, // 储值金额的10%作为积分
          min_amount: 100 // 最低储值金额
        },
        consumption: {
          description: '消费获得积分',
          rate: 0.05, // 消费金额的5%作为积分
          min_amount: 50 // 最低消费金额
        },
        exchange: {
          description: '积分兑换',
          rules: [
            {
              type: 'discount',
              points: 100,
              value: 10,
              description: '100积分兑换10元优惠券'
            },
            {
              type: 'gift',
              points: 500,
              value: '精美礼品',
              description: '500积分兑换精美礼品'
            }
          ]
        }
      };

      res.json({
        message: '获取成功',
        data: rules
      });
    } catch (error) {
      console.error('获取积分规则失败:', error);
      res.status(500).json({ message: '获取积分规则失败' });
    }
  }

  // 获取所有积分记录（管理员接口）
  static async getAllRecords(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const records = await PointsRecord.findAll(parseInt(page), parseInt(pageSize));
      const total = await PointsRecord.countAll();

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
      console.error('获取所有积分记录失败:', error);
      res.status(500).json({ message: '获取所有积分记录失败' });
    }
  }
}

module.exports = PointsController; 