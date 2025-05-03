import React from 'react';
import { Box, Container, Typography, Paper, Tabs, Tab, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import { mockCoupons } from '../utils/mockData';

const Coupons = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabChange(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '未使用':
        return 'success';
      case '已使用':
        return 'default';
      case '已过期':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        {/* 优惠券标签页 */}
        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="可用" />
            <Tab label="已使用" />
            <Tab label="已过期" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {mockCoupons.map((coupon) => (
                <Grid item xs={12} key={coupon.id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      opacity: coupon.status === '已使用' ? 0.7 : 1
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">{coupon.name}</Typography>
                        <Chip 
                          label={coupon.status} 
                          color={getStatusColor(coupon.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        使用条件：满{coupon.minAmount}元可用
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary">
                        有效期至：{coupon.expireDate}
                      </Typography>
                    </CardContent>

                    {coupon.status === '未使用' && (
                      <CardActions>
                        <Button 
                          variant="contained" 
                          fullWidth
                          onClick={() => {
                            // TODO: 实现使用优惠券逻辑
                            console.log('使用优惠券:', coupon);
                          }}
                        >
                          立即使用
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Coupons; 