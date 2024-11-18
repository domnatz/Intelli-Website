import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';
import { Grid, Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';

// Register ChartJS modules
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const MonthlyReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screens
  const isTablet = useMediaQuery(theme.breakpoints.down('md')); // Detect tablet screens

  // Sample data - Replace with real data if necessary
  const patientsData = [20, 30, 25, 45, 55, 35, 50, 70, 65, 40, 85, 100];

  // Chart data configuration
  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Patients',
        data: patientsData,
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(255,99,132,1)',
      },
    ],
  };

  // Chart options configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Conditionally render Sidebar for larger screens */}
      isMobile && <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          ml: '210px',
          overflowY: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
                          <Typography 
                  variant="h4" 
                  gutterBottom 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 0, // Adjust margin bottom
                    color: '#3F4662', 
                    mt: 5 // Add margin top
                  }} 
                >
                  Monthly Patients
                </Typography>
                
                <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1}}>
                  <Grid item xs={12} md={11}>
                    <Box
                      sx={{
                        height: isMobile ? 300 : 500,
                        width: '100%',
                        m: 0, // Remove margin
                        p: 0, // Remove padding
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <Line data={data} options={options} />
                    </Box>
                  </Grid>
                </Grid>
      </Box>
    </Box>
  );
};

export default MonthlyReport;