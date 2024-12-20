import MenuIcon from '@mui/icons-material/Menu';
import React, { useState, useEffect } from 'react';
import './patientProgress.css'; 
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton'; 

import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material'; 

import logo from '../../images/logo.png';

export default function ChildProgress({ isLoggedIn, onLogout }) {
  const [patients, setPatients] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progressReports, setProgressReports] = useState([]);
  const [error, setError] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); {/*New*/}
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const guardianId = sessionStorage.getItem("userId");

        if (!guardianId) {
          throw new Error("Guardian ID not found in session storage.");
        }

        const trimmedGuardianId = guardianId.trim();

        const url = `${process.env.REACT_BACKEND_API}/api/patients2/${trimmedGuardianId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleLogout = async () => {
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.error || "An error occurred during logout. Please try again later."
        );
      } else {
        sessionStorage.clear();
        onLogout();
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Network error:", error);
    }
  };
  const handleShowReport = async (patientId, progressId) => {
    try {
      const url = `${process.env.REACT_BACKEND_API}/api/patients/${patientId}/progress/${progressId}/file`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch report file");
      }

      // Get the file content as an ArrayBuffer
      const fileBuffer = await response.arrayBuffer();
      // Convert the ArrayBuffer to a Base64 string
      const base64Data = arrayBufferToBase64(fileBuffer);

      // Determine the file type from the contentType
      const fileType = response.headers.get("Content-Type");

      // Construct the data URL
      const dataURL = `data:${fileType};base64,${base64Data}`;

      // Open the file in a new window/tab
      window.open(dataURL, "_blank");
    } catch (error) {
      console.error("Error showing report:", error);
      setError(error.message);
    }
  };

  // Helper function to convert ArrayBuffer to Base64 string
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;   

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return   
 window.btoa(binary);
  }
  const handleNextPatient = () => {
    setCurrentPatient((prevIndex) =>
      prevIndex < patients.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevPatient = () => {
    setCurrentPatient((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const fetchLessons = async (patientId) => {
    try {
      const url = `${process.env.REACT_BACKEND_API}/api/patients/${patientId}/assigned-lessons`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch lessons");
      }
  
      const data = await response.json();
      // Ensure the API response includes complexity, category, and description
      setLessons(data); 
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setError(error.message);
    }
  };
  const handleDownloadReport = async (patientId, progressId) => {
    try {
      const url = `${process.env.REACT_BACKEND_API}/api/patients/${patientId}/progress/${progressId}/file`;
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch report file");
      }
  
      // Get the file content as a Blob
      const fileBlob = await response.blob();
  
      // Get the filename from the response headers (if available)
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'report.pdf';
  
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(fileBlob);
      link.download = filename; 
  
      // Programmatically trigger a click on the link to start the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);   
  
  
    } catch (error) {
      console.error("Error downloading report:",   
   error);
      setError(error.message);
    }
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  }; {/*New*/}

  const fetchProgressReports = async (patientId) => {
    try {
      const url = `${process.env.REACT_BACKEND_API}/api/patients/${patientId}/progress`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch progress reports");
      }

      const data = await response.json();
      setProgressReports(data);
    } catch (error) {
      console.error("Error fetching progress reports:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (patients.length > 0) {
      const patientId = patients[currentPatient]._id;
      fetchLessons(patientId);
      fetchProgressReports(patientId);
    }
  }, [currentPatient, patients]);

  return (
         <div className="Patient-pg-cnt">
          <div  className="Patient-pg-cnt"> {/*New*/}
      <AppBar position="fixed" sx={{ backgroundColor: '#94C5B5', zIndex: 1000 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center',  xs: 'none' }}>
            <img className="Logo" src={logo} alt="Logo" style={{ marginRight: 'px', width: '70px', height: '60px' }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '100px' }}>
            <nav>
                <li className="navbar-link" ><a href="/">Home</a></li>
                <li className="navbar-link"><a href="/appointment">Appointment</a></li>
                <li className="navbar-link">Child's Progress</li>
            </nav>
            
          </Box>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          </Box>

          <IconButton
        color="inherit"
        edge="end"
        onClick={() => toggleDrawer(true)}
        sx={{ display: { xs: 'block', md: 'none' }, 
          ml: 2,
          '&.MuiIconButton-root': { 
            minWidth: 0,
            minHeight: 0,
            padding: '0px',
            boxShadow: 'none',
            '& .MuiSvgIcon-root': { padding: '0px'}
          } 
        }}
      >
            <MenuIcon />
          </IconButton>

        </Toolbar>
      

        <Drawer
  className="Nav-bar-drawer"
  anchor="right"
  open={drawerOpen}
  onClose={() => toggleDrawer(false)}
  PaperProps={{
    sx: {
      zIndex: 1301, // Ensure the drawer is above the AppBar
    },
  }}
>
  <List sx={{ width: 250,  }}>
    <ListItem>
      <a href="/">
      <ListItemText
        primary="Home"
        primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px'}}
      />
      </a>
    </ListItem>

    <ListItem>
      <a href="/appointment">
      <ListItemText
        primary="Appointment"
        primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}
      />
      </a>
    </ListItem>

    <ListItem>
      <ListItemText
        primary="Child's Progress"
        primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}
      />
    </ListItem>
  </List>

    <div className="Nav-bar-drawer-footer">
      <p>&copy; IntelliSpeech Therapy Center</p>
    </div>
    </Drawer>
      </AppBar>
    </div> {/*New*/}

          <main>  
          
          <div className="title-heading"> Child's Progress Report </div> {/*New*/}
            <div className="patients-info-container">

              {isLoading && <div className="loading-indicator">Loading...</div>}
              {!isLoading && !error && (
                <div className="patients-info">
                {patients.length > 0 && (
                <div className="patient" key={patients[currentPatient]._id}>
                  <div className="patients-lessons">
                    <div className="patient-info">
                      <h3>Patient Information</h3>
                      <p> Patient Name: {patients[currentPatient].patient_name}</p>
                      <p> Age: {patients[currentPatient].patient_age}</p>
                      <p> Gender: {patients[currentPatient].patient_sex}</p>  
                    </div>

                    <div className="patient-lessons">
                      <h3>Current Lessons</h3>
                      {lessons.length > 0 ? ( // Check if there are any lessons
                        lessons.map((lesson) => (
                          <div key={lesson._id}>
                            <p>Lesson Name: {lesson.lesson_name}</p>
                            <p>Complexity: {lesson.lesson_complexity}</p>
                            <p>Category: {lesson.lesson_category}</p>
                            <p>Description: {lesson.lesson_desc}</p>
                          </div>
                        ))
                      ) : (
                        <p>No lessons assigned to this patient yet.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="reports-remarks">
                  <div className="report-file">
                                   <p> Report File </p>
                  {progressReports.map((progress, index) => (
                    <div key={progress._id} onClick={() => handleDownloadReport(patients[currentPatient]._id, progress._id)} style={{ cursor: 'pointer' }}>
                      {`${index + 1}. ${progress.report_file?.filename || "Download Report"}`} {/* Display the filename with numbering */}
                    </div>
                  ))}
                  </div>
                  <div className="remarks">
                    <h3> Remarks from the Therapist: </h3>
                    {progressReports.map((progress) => (
                      <div key={progress._id}>
                        <p>{progress.remarks}</p>
                        <p><small>{new Date(progress.createdAt).toLocaleString()}</small></p> {/* Display the timestamp */}
                      </div>
                    ))}
                  </div>
                  </div>

                  <div className="patient-navigation">
                    <div className="button-wrapper">
                    {currentPatient > 0 && ( // Conditionally render "Previous" button
                      <button className="prev-patient-btn" onClick={handlePrevPatient}>
                        Previous
                      </button>
                    )}
                    </div>
                    <div className="button-wrapper">
                    {currentPatient < patients.length - 1 && ( // Conditionally render "Next" button
                      <button className="next-patient-btn" onClick={handleNextPatient}>
                        Next
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              )}
              </div>
            )}
            {error && (
              <Alert severity="error">{error}</Alert> 
            )}
            </div>
          </main>
        </div>
    );
  }