import React from 'react';
import { Box, Container, Typography, Paper, LinearProgress, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mockUser, mockLevels } from '../utils/mockData';

const MemberCenter = () => {
  const navigate = useNavigate();
  const currentLevel = mockLevels.find(level => level.name === mockUser.level);
  const nextLevel = mockLevels.find(level => level.name === mockUser.nextLevel);

  const handleRecharge = () => {
    navigate('/recharge');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        {/* 用户信息卡片 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <img src={mockUser.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', marginRight: 16 }} />
            <Box>
              <Typography variant="h6">{mockUser.name}</Typography>
              <Typography color="textSecondary">{mockUser.level}</Typography>
            </Box>
          </Box>
          
          {/* 等级进度 */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              距离{nextLevel.name}还需{mockUser.nextLevelPoints - mockUser.points}积分
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={mockUser.levelProgress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          {/* 会员信息 */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{mockUser.points}</Typography>
                  <Typography color="textSecondary">积分</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">¥{mockUser.balance}</Typography>
                  <Typography color="textSecondary">余额</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* 会员权益 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>会员权益</Typography>
          {currentLevel.benefits.map((benefit, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              • {benefit}
            </Typography>
          ))}
        </Paper>

        {/* 充值按钮 */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleRecharge}
          sx={{ mb: 3 }}
        >
          优惠储蓄
        </Button>
      </Box>
    </Container>
  );
};

export default MemberCenter; 