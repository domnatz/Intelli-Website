import "./staffHome.css"; // Import the CSS file
import Sidebar from "./Sidebar";
import intelliHome from "../../images/weareintelli.jpg";

// Import necessary components for the links
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function StaffHome({ userRole, onLogout }) {
  return (
    <div className="Staff-home">
      <Sidebar />
      <div className="content">
        <img src={intelliHome} alt="ItelliSpeech" className="intelliH" />

        {/* Add a container for the links */}
        <div className="staff-home-links">
          {userRole === "admin" && (
            // Conditionally render "Register Staff" for admins
            <Link to="/SignupStaff" className="staff-home-link">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 20px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  mr: 2, // Add margin-right between links
                }}
              >
                <Typography variant="p">Register Staff</Typography>
              </Box>
            </Link>
          )}

          <Link to="/login" className="staff-home-link" onClick={onLogout}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <Typography variant="p">Logout</Typography>
            </Box>
          </Link>
        </div>
      </div>
    </div>
  );
}