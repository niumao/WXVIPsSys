import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { People, LocalOffer, CardGiftcard } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = () => {
    const path = location.pathname;
    if (path.includes('/admin/customers')) return 0;
    if (path.includes('/admin/coupons')) return 1;
    if (path.includes('/admin/packages')) return 2;
    return 0;
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={(event, newValue) => {
          switch (newValue) {
            case 0:
              navigate('/admin/customers');
              break;
            case 1:
              navigate('/admin/coupons');
              break;
            case 2:
              navigate('/admin/packages');
              break;
            default:
              navigate('/admin/customers');
          }
        }}
      >
        <BottomNavigationAction label="客户管理" icon={<People />} />
        <BottomNavigationAction label="优惠券管理" icon={<LocalOffer />} />
        <BottomNavigationAction label="套餐管理" icon={<CardGiftcard />} />
      </BottomNavigation>
    </Paper>
  );
};

export default AdminNav; 