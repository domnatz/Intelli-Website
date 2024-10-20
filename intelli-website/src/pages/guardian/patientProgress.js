
import React, { useState, useEffect } from 'react';
import './patientProgress.css'; 
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';

import logo from '../../images/logo.png';

export default  function ChildProgress({ isLoggedIn, onLogout }) {
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
            
            const guardianId = sessionStorage.getItem('userId'); //gets the guardianID from the session storage

            if (!guardianId) {
                throw new Error('Guardian ID not found in session storage.');
            }
            console.log('Guardian ID:', guardianId);
            const response = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${guardianId}`); 
            console.log('Response:', response);
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText || response.statusText}`);
          }
          const data = await response.json();
          console.log('Data:', data);

          setPatients(data);
          setError(null); // Clear any previous errors

        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error.message); 
        } finally {
          setIsLoading(false);
        }
      };

      const fetchLessons = async (patientId) => {
        try {
          const response = await fetch(`${process.env.REACT_BACKEND_API}/api/lessons/${patientId}`); // Fetch lessons by patient ID
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText || response.statusText}`);
          }
          const data = await response.json();
          setLessons(data); 
        } catch (error) {
          console.error('Error fetching lessons:', error);
        }
      };

      const fetchProgressReports = async (patientId) => {
        try {
          const response = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${patientId}/progress`); 
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText || response.statusText}`);
          }
          const data = await response.json();
          setProgressReports(data); 
        } catch (error) {
          console.error('Error fetching progress reports:', error);
        }
      };

      fetchPatients();
    }, []);

    useEffect(() => {
      if (patients.length > 0) {
        fetchLessons(patients[currentPatient]._id);
        fetchProgressReports(patients[currentPatient]._id);
      }
    }, [patients, currentPatient]);

    const handleLogout = async () => {
      setError(null);

      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/logout`, {
          method: 'POST',
          credentials: 'include'
        });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          setError(errorData.error || 'An error occurred during logout. Please try again later.');
        } catch (parseError) {
          setError('Unexpected response from the server. Please try again later.');
          console.error('Error parsing server response:', parseError);
        }
      } else {

        sessionStorage.clear();
        onLogout();
        console.log('Logout successful!');
      }

      } catch (error) {
        setError('Network error. Please try again later.');
        console.error('Network error:', error);
      }
    };
    
  const handleNextPatient = () => {
    setCurrentPatient((prevIndex) => {
      if (prevIndex < patients.length - 1) {
        return prevIndex + 1; 
      } else {
        return prevIndex;
      }
    })

      console.log(patients[currentPatient]);
    }

    const handlePrevPatient = () => {
      setCurrentPatient((prevIndex) => {
        if (prevIndex > 0) {
          return prevIndex - 1;
        } else {
          return prevIndex;
        }  
      })
        console.log(patients[currentPatient]);
      }

    return (
        <div className="Appointment-pg-cnt">
          <header>
            <img className="Logo" src={logo} alt="Logo" />

            <div className="navigation-cnt">
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
                    <p> Patient Name: {patients[currentPatient].patient_name}</p>
                    <p> Age: {patients[currentPatient].patient_age}</p>
                    <p> Gender: {patients[currentPatient].patient_sex}</p>  
                  </div>

                  <div className="patient-lessons">
                    <h3>Current Lessons </h3>
                    {lessons.map((lesson) => ( 
                      <div key={lesson._id}> 
                        <p>Lesson Name: {lesson.lesson_name}</p>
                        <p>Complexity: {lesson.complexity}</p>
                        <p>Category: {lesson.category}</p>
                        <p>Description: {lesson.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="reports-remarks">
                  <div className="report-file">
                  <p> Report File </p>
                    <button>Show Full Report</button>
                  </div>

                  <div className="remarks">
                      <h3> Remarks from the Therapist: </h3>
                      {progressReports.map((progress) => ( 
                        <p>{progress.remarks}</p> 
                      ))}
                  </div>
                </div>
              </div>
                )}

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

            {error && (
              <Alert severity="error">{error}</Alert> 
            )}
          </div>
          </main>
        </div>
    )
}