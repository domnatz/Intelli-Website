import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import intelli from "../../images/IntelliSpeech.png";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AddchartIcon from "@mui/icons-material/Addchart";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Box, Typography } from "@mui/material";

const Sidebar = React.memo(({ userRole, onLogout }) => {
  const [internalUserRole, setInternalUserRole] = useState(userRole);

  useEffect(() => {
    setInternalUserRole(userRole); // Update internalUserRole when userRole changes
  }, [userRole]);


  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={intelli} alt="IntelliSpeech" className="intelli" />
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link to="/home" className="sidebar-link">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HomeIcon sx={{ mr: 3 }} />
              <Typography variant="p">Home</Typography>
            </Box>
          </Link>
        </li>

        <li>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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

        <li>
        <Link to="/Profiles" className="sidebar-link">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <RecentActorsIcon sx={{ mr: 3 }} />
            <Typography variant="p">Patient Profiles</Typography>
          </Box>
          </Link>
        </li>

        <li>
          <Link to="/LessonDetails" className="sidebar-link">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PostAddIcon sx={{ mr: 3 }} />
              <Typography variant="p">Lesson Details</Typography>
            </Box>
          </Link>
        </li>

        <li>
          <Link to="/ScheduleManager" className="sidebar-link">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EditCalendarIcon sx={{ mr: 3 }} />
              <Typography variant="p">Schedule Manager</Typography>
            </Box>
          </Link>
        </li>

        <li>
          <Link to="/MonthlyReport" className="sidebar-link">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AddchartIcon sx={{ mr: 3 }} />
              <Typography variant="p">Monthly Report</Typography>
            </Box>
          </Link>
          </li>
      </ul>
    </div>
  );
});

export default Sidebar;
