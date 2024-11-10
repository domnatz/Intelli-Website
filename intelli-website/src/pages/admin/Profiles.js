import Sidebar from './Sidebar';
import React, { useState, useEffect } from 'react';
import './Profiles.css';
import { Link } from 'react-router-dom';

import { Grid, Card, CardContent, Typography, Avatar, CardHeader, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/patients`); // Replace with your actual API endpoint
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error('Error fetching patients:', response.status);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '55px', 
          width: { xs: '100%', md: 'calc(100% - 280px)' }, 
          maxWidth: '100vw', 
          boxSizing: 'border-box', 
          marginLeft: '280px',
        }}
      >
        {/* Grid Layout for Patient Cards */}
        <Grid container spacing={3}>
          {patients.map((patient) => (
            <Grid item key={patient._id} xs={12} sm={6} md={3}> 
              <Link to={`/ProgressReport/${patient._id}`} style={{ textDecoration: 'none' }}> 
                <Card sx={{ p: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', height: 160 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ backgroundColor: '#d3d3d3' }}>
                        <PersonIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3F4662'}}>
                        {patient.patient_name} {/* Assuming your patient data has a patient_name field */}
                      </Typography>
                    }
                  />
                  <CardContent>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
