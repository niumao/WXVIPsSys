import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, AccountBalance, Stars } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = () => {
    const path = location.pathname;
    if (path.includes('/member')) return 0;
    if (path.includes('/recharge')) return 1;
    if (path.includes('/points')) return 2;
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
              navigate('/member');
              break;
            case 1:
              navigate('/recharge');
              break;
            case 2:
              navigate('/points');
              break;
            default:
              navigate('/member');
          }
        }}
      >
        <BottomNavigationAction label="会员中心" icon={<Home />} />
        <BottomNavigationAction label="储值" icon={<AccountBalance />} />
        <BottomNavigationAction label="积分" icon={<Stars />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;