const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/auth');
const UserController = require('../controllers/userController');
const RechargeController = require('../controllers/rechargeController');
const PointsController = require('../controllers/pointsController');
const ConsumptionController = require('../controllers/consumptionController');
const CouponController = require('../controllers/couponController');
const WechatController = require('../controllers/wechatController');

// 微信授权相关路由
router.get('/wechat/auth/url', WechatController.getAuthUrl);
router.get('/wechat/auth/callback', WechatController.handleCallback);

// 用户相关路由
router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);
router.get('/user/info', auth, UserController.getUserInfo);
router.put('/user/info', auth, UserController.updateUserInfo);
router.get('/user/balance', auth, UserController.getBalance);
router.get('/user/points', auth, UserController.getPointsBalance);

// 储值相关路由
router.get('/recharge/packages', auth, RechargeController.getPackages);
router.post('/recharge/create', auth, RechargeController.createOrder);
router.post('/recharge/success', auth, RechargeController.handlePaymentSuccess);
router.get('/recharge/records', auth, RechargeController.getRecords);

// 积分相关路由
router.get('/points/balance', auth, PointsController.getBalance);
router.get('/points/records', auth, PointsController.getRecords);
router.post('/points/exchange', auth, PointsController.exchange);
router.get('/points/rules', auth, PointsController.getRules);

// 消费相关路由
router.post('/consumption/create', auth, ConsumptionController.create);
router.get('/consumption/records', auth, ConsumptionController.getRecords);
router.get('/consumption/statistics', auth, ConsumptionController.getStatistics);

// 优惠券相关路由
router.get('/coupons', auth, CouponController.getCoupons);
router.post('/coupons/receive', auth, CouponController.receive);
router.get('/coupons/user', auth, CouponController.getUserCoupons);
router.post('/coupons/use', auth, CouponController.use);
router.get('/coupons/records', auth, CouponController.getRecords);

// 管理员路由
router.get('/admin/users', adminAuth, UserController.getAllUsers);
router.get('/admin/recharge/records', adminAuth, RechargeController.getAllRecords);
router.get('/admin/points/records', adminAuth, PointsController.getAllRecords);
router.get('/admin/consumption/records', adminAuth, ConsumptionController.getAllRecords);
router.get('/admin/coupons', adminAuth, CouponController.getAllCoupons);
router.post('/admin/coupons', adminAuth, CouponController.create);
router.put('/admin/coupons/:id', adminAuth, CouponController.update);
router.delete('/admin/coupons/:id', adminAuth, CouponController.delete);

module.exports = router; 