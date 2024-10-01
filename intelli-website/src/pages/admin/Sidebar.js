import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom'; 
import intelli from '../../images/IntelliSpeech.png';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AddchartIcon from '@mui/icons-material/Addchart';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'; 
import { Box, Typography } from '@mui/material';

export default function Sidebar() {

  const handleLogout = () => {
    // 1. Clear user session data (replace with your actual implementation)
    localStorage.removeItem('userToken'); // Example using local storage

    // 2. Redirect to login page (replace '/login' with your actual login route)
    window.location.href = '/login'; 
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={intelli} alt="IntelliSpeech" className="intelli" />
      </div>

      {/* HOME*/}
      <ul className="sidebar-menu">
      <li>
          <Link to="/home" className="sidebar-link">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 3 }} />
              <Typography variant="p">Home</Typography>
            </Box>
          </Link>
        </li>

        {/* APPOINTMENTS */}
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventNoteIcon sx={{ mr: 3 }} />
            <Typography variant="p">Appointments</Typography>
          </Box>
          <ul className="dropdown">
            <li>
              <Link to="/upcomingAppStaff" className="sidebar-link">
                Upcoming Appointments
              </Link>
            </li>
            <li>
              <Link to="/therapistSchedule" className="sidebar-link">
                Therapist Schedule
              </Link>
            </li>
          </ul>
        </li>

        {/* PATIENT PROFILES */}
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RecentActorsIcon sx={{ mr: 3 }} />
            <Typography variant="p">Patient Profiles</Typography>
          </Box>
        </li>

        {/* PROGRESS REPORT*/}
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PublishedWithChangesIcon sx={{ mr: 3 }} />
            <Typography variant="p">Progress Report</Typography>
          </Box>
        </li>

        {/* SCHEDULE MANAGER */}
        <li>
          <Link to="/ScheduleManager" className="sidebar-link">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditCalendarIcon sx={{ mr: 3 }} />
            <Typography variant="p">Schedule Manager</Typography>
          </Box>
          </Link>
        </li>

        {/* MONTHLY REPORT */}
        <li>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AddchartIcon sx={{ mr: 3 }} />
            <Typography variant="p">Monthly Report</Typography>
          </Box>
        </li>

        {/* USER PROFILE */}
        <div className="sidebar-bottom">
          <li>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountCircleOutlinedIcon sx={{ mr: 3 }} />
              <Typography variant="p">User Profile</Typography>
            </Box>
          </li>

          {/* User Profile and Logout */}
          <li onClick={handleLogout}> 
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LogoutOutlinedIcon sx={{ mr: 3 }} />
              <Typography variant="p">Logout</Typography>
            </Box>
          </li>
        </div>
      </ul>
    </div>
  );
}