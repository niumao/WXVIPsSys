curl -X POST "http://localhost:3000/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "openid": "test_openid_001",
    "nickname": "测试用户",
    "avatar": "https://example.com/avatar.png",
    "phone": "13800138000"
  }'
