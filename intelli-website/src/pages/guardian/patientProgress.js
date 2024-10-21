import React, { useState, useEffect } from "react";
import "./patientProgress.css";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";

import logo from "../../images/logo.png";

export default function ChildProgress({ isLoggedIn, onLogout }) {
  const [patients, setPatients] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progressReports, setProgressReports] = useState([]);
  const [error, setError] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Error downloading report:", error);
      setError(error.message);
    }
  };
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
      <header>
        <img className="Logo" src={logo} alt="Logo" />

        <div className="nav-cnt">
          <nav>
            <li className="apt-list">
              <Link to="/" className="guardianHome">
                Home
              </Link>
            </li>
            <li className="apt-list">
              <Link to="/appointment" className="AppointmentsPage">
                Appointment
              </Link>
            </li>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="patients-info-container">
          {isLoading && <div className="loading-indicator">Loading...</div>}
          {!isLoading && !error && (
            <div className="patients-info">
              {patients.length > 0 && (
                <div className="patient" key={patients[currentPatient]._id}>
                  <div className="patients-lessons">
                    <div className="patient-info">
                      <h3>Patient Information</h3>
                      <p>Patient Name: {patients[currentPatient].patient_name}</p>
                      <p>Age: {patients[currentPatient].patient_age}</p>
                      <p>Gender: {patients[currentPatient].patient_sex}</p>
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
    {progressReports.map((progress) => (
      <div key={progress._id}>
        <p>Report File: {progress.report_file.filename}</p>
        <button onClick={() => handleDownloadReport(patients[currentPatient]._id, progress._id)}>
          Download Report
        </button>
      </div>
    ))}
  </div>

                    <div className="remarks">
                      <h3>Remarks from the Therapist:</h3>
                      {progressReports.map((progress) => (
                        <p key={progress._id}>{progress.remarks}</p>
                      ))}
                    </div>
                  </div>

                  <div className="patient-navigation">
                    <div className="button-wrapper">
                      {currentPatient > 0 && (
                        <button
                          className="prev-patient-btn"
                          onClick={handlePrevPatient}
                        >
                          Previous
                        </button>
                      )}
                    </div>
                    <div className="button-wrapper">
                      {currentPatient < patients.length - 1 && (
                        <button
                          className="next-patient-btn"
                          onClick={handleNextPatient}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </div>
      </main>
    </div>
  );
}