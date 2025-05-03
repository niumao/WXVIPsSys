import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MemberCenter from './pages/MemberCenter';
import Recharge from './pages/Recharge';
import Points from './pages/Points';
import Consumption from './pages/Consumption';
import CustomerManagement from './pages/admin/CustomerManagement';
import CouponManagement from './pages/admin/CouponManagement';
import PackageManagement from './pages/admin/PackageManagement';
import BottomNav from './components/BottomNav';
import AdminNav from './components/AdminNav';
import theme from './styles/theme';
import { isAdmin } from './utils/auth';

const App = () => {
  const isAdminUser = isAdmin();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {isAdminUser ? (
            // 管理员路由
            <>
              <Route path="/admin/customers" element={<CustomerManagement />} />
              <Route path="/admin/coupons" element={<CouponManagement />} />
              <Route path="/admin/packages" element={<PackageManagement />} />
              <Route path="/" element={<Navigate to="/admin/customers" replace />} />
            </>
          ) : (
            // 普通用户路由
            <>
              <Route path="/member" element={<MemberCenter />} />
              <Route path="/recharge" element={<Recharge />} />
              <Route path="/points" element={<Points />} />
              <Route path="/consumption" element={<Consumption />} />
              <Route path="/" element={<Navigate to="/member" replace />} />
            </>
          )}
        </Routes>
        {isAdminUser ? <AdminNav /> : <BottomNav />}
      </Router>
    </ThemeProvider>
  );
};

export default App;
