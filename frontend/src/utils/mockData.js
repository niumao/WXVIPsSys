// 用户信息
export const mockUser = {
  id: 1,
  name: '张三',
  phone: '13800138000',
  level: '黄金会员',
  points: 450,
  balance: 1000.00,
  avatar: 'https://via.placeholder.com/150',
  levelProgress: 75, // 当前等级进度百分比
  nextLevel: '铂金会员',
  nextLevelPoints: 600,
};

// 会员等级
export const mockLevels = [
  { name: '青铜会员', minPoints: 0, maxPoints: 100, benefits: ['基础会员权益'] },
  { name: '白银会员', minPoints: 101, maxPoints: 300, benefits: ['基础会员权益', '生日礼遇'] },
  { name: '黄金会员', minPoints: 301, maxPoints: 600, benefits: ['基础会员权益', '生日礼遇', '专属优惠'] },
  { name: '铂金会员', minPoints: 601, maxPoints: 1000, benefits: ['基础会员权益', '生日礼遇', '专属优惠', '积分加速'] },
  { name: '钻石会员', minPoints: 1001, maxPoints: 1500, benefits: ['基础会员权益', '生日礼遇', '专属优惠', '积分加速', '专属客服'] },
  { name: '星耀会员', minPoints: 1501, maxPoints: 2000, benefits: ['基础会员权益', '生日礼遇', '专属优惠', '积分加速', '专属客服', 'VIP活动'] },
  { name: '王者会员', minPoints: 2001, maxPoints: Infinity, benefits: ['所有会员权益'] },
];

// 储值套餐
export const mockRechargePackages = [
  { id: 1, amount: 100, gift: 0, description: '基础储值' },
  { id: 2, amount: 500, gift: 50, description: '赠送50元' },
  { id: 3, amount: 1000, gift: 150, description: '赠送150元' },
  { id: 4, amount: 2000, gift: 400, description: '赠送400元' },
];

// 储值记录
export const mockRechargeRecords = [
  { id: 1, amount: 500, gift: 50, date: '2024-03-15', status: '已完成' },
  { id: 2, amount: 1000, gift: 150, date: '2024-03-10', status: '已完成' },
  { id: 3, amount: 200, gift: 0, date: '2024-03-05', status: '已完成' },
];

// 积分记录
export const mockPointsRecords = [
  { id: 1, points: 100, type: '消费获得', date: '2024-03-15', description: '购物消费' },
  { id: 2, points: -50, type: '积分兑换', date: '2024-03-10', description: '兑换优惠券' },
  { id: 3, points: 200, type: '活动奖励', date: '2024-03-05', description: '会员日活动' },
];

// 消费记录
export const mockConsumptionRecords = [
  { id: 1, amount: 100, date: '2024-03-15', type: '商品消费', description: '购买商品A' },
  { id: 2, amount: 200, date: '2024-03-10', type: '服务消费', description: '使用服务B' },
  { id: 3, amount: 150, date: '2024-03-05', type: '商品消费', description: '购买商品C' },
];

// 优惠券
export const mockCoupons = [
  { id: 1, name: '满100减10', type: '满减券', value: 10, minAmount: 100, expireDate: '2024-04-15', status: '未使用' },
  { id: 2, name: '满200减30', type: '满减券', value: 30, minAmount: 200, expireDate: '2024-04-10', status: '未使用' },
  { id: 3, name: '8折优惠券', type: '折扣券', value: 0.8, minAmount: 0, expireDate: '2024-04-05', status: '已使用' },
]; 