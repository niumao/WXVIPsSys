import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as LocalOfferIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { mockCoupons } from '../../utils/mockData';
import AdminLayout from '../../components/AdminLayout';

const CouponManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenDialog = (coupon = null) => {
    setSelectedCoupon(coupon);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCoupon(null);
  };

  const handleSave = () => {
    // TODO: 实现保存逻辑
    handleCloseDialog();
  };

  const handleDelete = (coupon) => {
    // TODO: 实现删除逻辑
    console.log('删除优惠券:', coupon);
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
    <AdminLayout>
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}>
          <Typography variant="h4">优惠券管理</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            fullWidth={isMobile}
          >
            创建优惠券
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索优惠券..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Grid container spacing={2}>
          {mockCoupons.map((coupon, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalOfferIcon color="primary" />
                      <Typography variant="h6">{coupon.name}</Typography>
                    </Box>
                    <Chip 
                      label={coupon.status} 
                      color={getStatusColor(coupon.status)}
                      size="small"
                    />
                  </Box>

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        满{coupon.minAmount}元可用
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        有效期至：{coupon.expireDate}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(coupon)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(coupon)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {selectedCoupon ? '编辑优惠券' : '创建优惠券'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="优惠券名称"
                  defaultValue={selectedCoupon?.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="使用条件"
                  type="number"
                  defaultValue={selectedCoupon?.minAmount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">满</InputAdornment>,
                    endAdornment: <InputAdornment position="end">元可用</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="有效期"
                  type="date"
                  defaultValue={selectedCoupon?.expireDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="状态"
                  defaultValue={selectedCoupon?.status || '未使用'}
                  select
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="未使用">未使用</option>
                  <option value="已使用">已使用</option>
                  <option value="已过期">已过期</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button onClick={handleSave} variant="contained">
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default CouponManagement; 