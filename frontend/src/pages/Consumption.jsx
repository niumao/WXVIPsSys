import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { mockConsumptionRecords } from '../utils/mockData';

const Consumption = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        {/* 消费统计卡片 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>本月消费统计</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" color="primary">¥450</Typography>
              <Typography variant="body2" color="textSecondary">本月消费</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="primary">3</Typography>
              <Typography variant="body2" color="textSecondary">消费笔数</Typography>
            </Box>
          </Box>
        </Paper>

        {/* 消费记录列表 */}
        <Paper elevation={3}>
          <List>
            {mockConsumptionRecords.map((record, index) => (
              <React.Fragment key={record.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">{record.type}</Typography>
                        <Typography variant="subtitle1" color="error">
                          -¥{record.amount}
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
                {index < mockConsumptionRecords.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* 导出按钮 */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            size="large" 
            fullWidth
            onClick={() => {
              // TODO: 实现导出功能
              console.log('导出消费记录');
            }}
          >
            导出消费记录
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Consumption; 