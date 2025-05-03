require('dotenv').config();

module.exports = {
    // 数据库配置
    database: {
        url: process.env.DATABASE_URL
    },
    
    // JWT配置
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h'
    },
    
    // 微信配置
    wechat: {
        appId: process.env.WECHAT_APP_ID,
        appSecret: process.env.WECHAT_APP_SECRET,
        redirectUri: process.env.WECHAT_REDIRECT_URI // 例如：https://your-domain.com/api/wechat/auth/callback
    }
};