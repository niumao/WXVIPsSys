const Coupon = require('../models/coupon');
const CouponRecord = require('../models/couponRecord');
const User = require('../models/user');

class CouponController {
  // 获取优惠券列表
  static async getCoupons(req, res) {
    try {
      const coupons = await Coupon.findAvailable();
      res.json({
        message: '获取成功',
        data: coupons
      });
    } catch (error) {
      console.error('获取优惠券列表失败:', error);
      res.status(500).json({ message: '获取优惠券列表失败' });
    }
  }

  // 领取优惠券
  static async receive(req, res) {
    try {
      const userId = req.user.id;
      const { coupon_id } = req.body;

      // 检查优惠券是否存在且可用
      const coupon = await Coupon.checkAvailability(coupon_id, userId);
      if (!coupon) {
        return res.status(404).json({ message: '优惠券不存在或已下架' });
      }

      // 检查是否已领取
      const existingRecord = await CouponRecord.checkReceived(userId, coupon_id);
      if (existingRecord) {
        return res.status(400).json({ message: '已领取过该优惠券' });
      }

      // 检查优惠券数量
      if (coupon.used_count >= coupon.total) {
        return res.status(400).json({ message: '优惠券已领完' });
      }

      // 创建优惠券领取记录
      const recordId = await CouponRecord.create({
        user_id: userId,
        coupon_id,
        status: 'unused'
      });

      res.status(201).json({
        message: '领取成功',
        data: {
          record_id: recordId,
          coupon
        }
      });
    } catch (error) {
      console.error('领取优惠券失败:', error);
      res.status(500).json({ message: '领取优惠券失败' });
    }
  }

  // 获取用户的优惠券
  static async getUserCoupons(req, res) {
    try {
      const userId = req.user.id;
      const coupons = await Coupon.findByUserId(userId);

      res.json({
        message: '获取成功',
        data: coupons
      });
    } catch (error) {
      console.error('获取用户优惠券失败:', error);
      res.status(500).json({ message: '获取用户优惠券失败' });
    }
  }

  // 使用优惠券
  static async use(req, res) {
    try {
      const userId = req.user.id;
      const { record_id } = req.body;

      // 获取优惠券记录
      const record = await CouponRecord.findById(record_id);
      if (!record) {
        return res.status(404).json({ message: '优惠券记录不存在' });
      }

      if (record.user_id !== userId) {
        return res.status(403).json({ message: '无权使用该优惠券' });
      }

      if (record.status !== 'unused') {
        return res.status(400).json({ message: '优惠券已使用或已过期' });
      }

      // 更新优惠券状态
      await CouponRecord.updateStatus(record_id, 'used');

      res.json({
        message: '使用成功',
        data: {
          record_id,
          coupon_id: record.coupon_id
        }
      });
    } catch (error) {
      console.error('使用优惠券失败:', error);
      res.status(500).json({ message: '使用优惠券失败' });
    }
  }

  // 获取优惠券使用记录
  static async getRecords(req, res) {
    try {
      const userId = req.user.id;
      const records = await CouponRecord.findByUserId(userId);

      res.json({
        message: '获取成功',
        data: records
      });
    } catch (error) {
      console.error('获取优惠券使用记录失败:', error);
      res.status(500).json({ message: '获取优惠券使用记录失败' });
    }
  }

  // 获取所有优惠券（管理员接口）
  static async getAllCoupons(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const coupons = await Coupon.findAll(parseInt(page), parseInt(pageSize));
      const total = await Coupon.countAll();

      res.json({
        message: '获取成功',
        data: {
          coupons,
          pagination: {
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
          }
        }
      });
    } catch (error) {
      console.error('获取所有优惠券失败:', error);
      res.status(500).json({ message: '获取所有优惠券失败' });
    }
  }

  // 创建优惠券（管理员接口）
  static async create(req, res) {
    try {
      const { name, type, value, min_amount, start_time, end_time, total, description } = req.body;
      
      const couponId = await Coupon.create({
        name,
        type,
        value,
        min_amount,
        start_time,
        end_time,
        total,
        description,
        used_count: 0
      });

      res.status(201).json({
        message: '创建成功',
        data: { coupon_id: couponId }
      });
    } catch (error) {
      console.error('创建优惠券失败:', error);
      res.status(500).json({ message: '创建优惠券失败' });
    }
  }

  // 更新优惠券（管理员接口）
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, type, value, min_amount, start_time, end_time, total, description } = req.body;

      const success = await Coupon.update(id, {
        name,
        type,
        value,
        min_amount,
        start_time,
        end_time,
        total,
        description
      });

      if (!success) {
        return res.status(404).json({ message: '优惠券不存在' });
      }

      res.json({ message: '更新成功' });
    } catch (error) {
      console.error('更新优惠券失败:', error);
      res.status(500).json({ message: '更新优惠券失败' });
    }
  }

  // 删除优惠券（管理员接口）
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await Coupon.delete(id);

      if (!success) {
        return res.status(404).json({ message: '优惠券不存在' });
      }

      res.json({ message: '删除成功' });
    } catch (error) {
      console.error('删除优惠券失败:', error);
      res.status(500).json({ message: '删除优惠券失败' });
    }
  }
}

module.exports = CouponController; 