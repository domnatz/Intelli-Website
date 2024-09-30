// App.js

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import LoginPage from './pages/LoginForm';
import SignUpPage from './pages/SignupForm';

import StaffHomePage from './pages/admin/staffHome';
import SchedManagerPage from './pages/admin/ScheduleManager';
import TherapistSchedulePage from './pages/admin/TherapistSchedule';
import UpcomingAppStaffPage from './pages/admin/UpcomingAppStaff';

import AppointmentPage from './pages/guardian/Appointments';

export default function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize to false initially
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check localStorage on initial render and update state if needed
    const storedUserRole = localStorage.getItem('userRole');
    const storedAuthToken = localStorage.getItem('authToken');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
    if (storedAuthToken) {
      setAuthToken(storedAuthToken);
    }

    // Now initialize isLoggedIn after isGuardianAndLoggedIn is defined
    setIsLoggedIn(isGuardianAndLoggedIn()); 
  }, []);

  const isStaff = () => userRole === 'staff';
  const isGuardianAndLoggedIn = () => userRole === 'guardian' && !!authToken;

 // const navigate = useNavigate();

  const handleSuccessfulLogin = () => {
    // Force a re-render to update isLoggedIn in LandingPage
    setUserRole(localStorage.getItem('userRole'));
    setAuthToken(localStorage.getItem('authToken'));
    setIsLoggedIn(isGuardianAndLoggedIn());
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setAuthToken(null);
    setUserRole(null);
    setIsLoggedIn(false);
  //  navigate('/');
  };

    return (
      <div>
        <BrowserRouter>
          <Routes>
            {/* Public Routes (accessible to all users) */}
            <Route
              index
              element={
                <LandingPage
                key={refreshKey}
                  isLoggedIn={isLoggedIn}
                  onLogout={handleLogout}
                />
              }
            />
            <Route path="/register" element={<SignUpPage />} />
            <Route
              path="/login"
              element={
                <LoginPage
                  setUserRole={setUserRole}
                  setAuthToken={setAuthToken}
                  onSuccessfulLogin={handleSuccessfulLogin}
                />
              }
            />
  
            {/* Protected Routes for Staff */}
            <Route
              path="/home"
              element={isStaff() ? <StaffHomePage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/scheduleManager"
              element={isStaff() ? <SchedManagerPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/therapistSchedule"
              element={isStaff() ? <TherapistSchedulePage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/upcomingAppStaff"
              element={isStaff() ? <UpcomingAppStaffPage /> : <Navigate to="/login" replace />}
            />
  
            {/* Protected Route for Guardians */}
            <Route
              path="/appointment"
              element={isGuardianAndLoggedIn() ? <AppointmentPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }