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
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CardGiftcard as CardGiftcardIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { mockRechargePackages } from '../../utils/mockData';
import AdminLayout from '../../components/AdminLayout';

const PackageManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenDialog = (pkg = null) => {
    setSelectedPackage(pkg);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPackage(null);
  };

  const handleSave = () => {
    // TODO: 实现保存逻辑
    handleCloseDialog();
  };

  const handleDelete = (pkg) => {
    // TODO: 实现删除逻辑
    console.log('删除套餐:', pkg);
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
          <Typography variant="h4">套餐管理</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            fullWidth={isMobile}
          >
            创建套餐
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索套餐..."
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
          {mockRechargePackages.map((pkg, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CardGiftcardIcon color="primary" />
                      <Typography variant="h6">¥{pkg.amount}</Typography>
                    </Box>
                    <FormControlLabel
                      control={<Switch checked={true} size="small" />}
                      label="启用"
                      labelPlacement="start"
                    />
                  </Box>

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        赠送金额：¥{pkg.gift}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {pkg.description}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(pkg)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(pkg)}
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
            {selectedPackage ? '编辑套餐' : '创建套餐'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="金额"
                  type="number"
                  defaultValue={selectedPackage?.amount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="赠送金额"
                  type="number"
                  defaultValue={selectedPackage?.gift}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="描述"
                  multiline
                  rows={3}
                  defaultValue={selectedPackage?.description}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="启用套餐"
                />
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

export default PackageManagement; 