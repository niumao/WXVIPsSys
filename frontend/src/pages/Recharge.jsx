import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Button, Card, CardContent, CardActions, TextField } from '@mui/material';
import { mockRechargePackages, mockRechargeRecords } from '../utils/mockData';

const Recharge = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRecharge = (pkg) => {
    setSelectedPackage(pkg);
    // TODO: 实现储值逻辑
  };

  const handleCouponCheck = () => {
    // TODO: 实现优惠券验证逻辑
    if (!couponCode) {
      setErrorMessage('请输入优惠券码');
      return;
    }
    
    // 模拟验证失败
    setErrorMessage('优惠券验证失败，请检查优惠券码是否正确');
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
    setErrorMessage(''); // 清除错误提示
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>储值套餐</Typography>
        
        {/* 储值套餐列表 */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {mockRechargePackages.map((pkg) => (
            <Grid item xs={6} key={pkg.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedPackage?.id === pkg.id ? '2px solid #1976d2' : 'none'
                }}
                onClick={() => handleRecharge(pkg)}
              >
                <CardContent>
                  <Typography variant="h6" color="primary">
                    ¥{pkg.amount}
                  </Typography>
                  {pkg.gift > 0 && (
                    <Typography variant="body2" color="error">
                      赠送¥{pkg.gift}
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    {pkg.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 优惠券输入 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>优惠券</Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <TextField
                  fullWidth
                  label="优惠券码"
                  variant="outlined"
                  value={couponCode}
                  onChange={handleCouponChange}
                  size="small"
                  error={!!errorMessage}
                  helperText={errorMessage}
                />
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  onClick={handleCouponCheck}
                  disabled={!couponCode}
                >
                  验证
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* 储值记录 */}
        <Typography variant="h5" gutterBottom>储值记录</Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          {mockRechargeRecords.map((record) => (
            <Box key={record.id} sx={{ py: 2, borderBottom: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1">储值金额</Typography>
                <Typography variant="subtitle1">¥{record.amount}</Typography>
              </Box>
              {record.gift > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">赠送金额</Typography>
                  <Typography variant="body2" color="error">¥{record.gift}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">{record.date}</Typography>
                <Typography variant="body2" color="textSecondary">{record.status}</Typography>
              </Box>
            </Box>
          ))}
        </Paper>

        {/* 确认储值按钮 */}
        {selectedPackage && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large" 
              fullWidth
              onClick={() => {
                // TODO: 实现确认储值逻辑
                console.log('确认储值:', selectedPackage);
              }}
            >
              确认储值
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Recharge;