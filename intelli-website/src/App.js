import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import LoginPage from './pages/LoginForm';
import SignUpPage from './pages/SignupForm';

import StaffHomePage from './pages/admin/staffHome';
import SchedManagerPage from './pages/admin/ScheduleManager';
import TherapistSchedulePage from './pages/admin/TherapistSchedule';
import UpcomingAppStaffPage from './pages/admin/UpcomingAppStaff';

import AppointmentPage from './pages/guardian/Appointments';

// Helper functions to check user roles and login status
const isStaff = () => {
  const userRole = localStorage.getItem('userRole'); // Or get it from your state management solution
  return userRole === 'staff';
};

const isGuardianAndLoggedIn = () => {
  const userRole = localStorage.getItem('userRole'); 
  const token = localStorage.getItem('authToken'); // Or however you're storing authentication info
  return userRole === 'guardian' && !!token; 
};

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes (accessible to all users) */}
          <Route index element={<LandingPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

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
            element={isGuardianAndLoggedIn() ? <AppointmentPage /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}