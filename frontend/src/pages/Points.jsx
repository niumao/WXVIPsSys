import React from 'react';
import { Box, Container, Typography, Paper, Tabs, Tab, List, ListItem, ListItemText, Divider, Button, Grid, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import { mockPointsRecords } from '../utils/mockData';

// 模拟商品数据
const mockGoods = [
  {
    id: 1,
    name: '精美保温杯',
    points: 1200,
    image: 'https://via.placeholder.com/150',
    description: '304不锈钢内胆，保温12小时'
  },
  {
    id: 2,
    name: '时尚帆布包',
    points: 300,
    image: 'https://via.placeholder.com/150',
    description: '环保材质，大容量设计'
  },
  {
    id: 3,
    name: '多功能充电宝',
    points: 1500,
    image: 'https://via.placeholder.com/150',
    description: '10000mAh大容量，支持快充'
  },
  {
    id: 4,
    name: '无线蓝牙耳机',
    points: 3800,
    image: 'https://via.placeholder.com/150',
    description: '高清音质，持久续航'
  }
];

const Points = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExchange = (goods) => {
    // TODO: 实现积分兑换逻辑
    console.log('兑换商品:', goods);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        {/* 积分余额卡片 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            450
          </Typography>
          <Typography variant="body1" color="textSecondary">
            当前积分余额
          </Typography>
        </Paper>

        {/* 积分记录标签页 */}
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="全部" />
            <Tab label="获得" />
            <Tab label="使用" />
          </Tabs>

          <List>
            {mockPointsRecords.map((record, index) => (
              <React.Fragment key={record.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">{record.type}</Typography>
                        <Typography 
                          variant="subtitle1" 
                          color={record.points > 0 ? 'success.main' : 'error.main'}
                        >
                          {record.points > 0 ? '+' : ''}{record.points}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          {record.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {record.date}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < mockPointsRecords.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* 积分兑换商品列表 */}
        <Typography variant="h6" gutterBottom>积分兑换</Typography>
        <Grid container spacing={2}>
          {mockGoods.map((goods) => (
            <Grid item xs={6} key={goods.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={goods.image}
                  alt={goods.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {goods.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {goods.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {goods.points} 积分
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    size="small"
                    onClick={() => handleExchange(goods)}
                    disabled={goods.points > 450}
                  >
                    立即兑换
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Points;