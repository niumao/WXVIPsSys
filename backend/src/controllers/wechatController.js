const axios = require('axios');
const config = require('../config/config');

class WechatController {
    // 获取微信授权URL
    static getAuthUrl(req, res) {
        const redirectUri = encodeURIComponent(config.wechat.redirectUri);
        const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.wechat.appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        res.json({ url });
    }

    // 处理微信授权回调
    static async handleCallback(req, res) {
        try {
            const { code } = req.query;
            if (!code) {
                return res.status(400).json({ error: '缺少授权码' });
            }

            // 通过code获取access_token
            const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wechat.appId}&secret=${config.wechat.appSecret}&code=${code}&grant_type=authorization_code`;
            const tokenResponse = await axios.get(tokenUrl);
            const { access_token, openid } = tokenResponse.data;

            // 获取用户信息
            const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
            const userInfoResponse = await axios.get(userInfoUrl);
            const userInfo = userInfoResponse.data;

            // 这里可以处理用户信息，比如保存到数据库或创建会话
            // TODO: 根据业务需求处理用户信息

            res.json({
                success: true,
                data: userInfo
            });
        } catch (error) {
            console.error('微信授权处理错误:', error);
            res.status(500).json({
                error: '微信授权处理失败',
                details: error.message
            });
        }
    }
}

module.exports = WechatController; 