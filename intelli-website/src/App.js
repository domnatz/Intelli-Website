import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/LoginForm";
import SignUpPage from "./pages/SignupForm";
import VerificationPage from "./VerificationPage";
import StaffHomePage from "./pages/admin/staffHome";
import SchedManagerPage from "./pages/admin/ScheduleManager";
import LessonDetailsPage from './pages/admin/LessonDetails';
import TherapistSchedulePage from "./pages/admin/TherapistSchedule";
import UpcomingAppStaffPage from "./pages/admin/UpcomingAppStaff";
import Sidebar from "./pages/admin/Sidebar";
import AppointmentPage from "./pages/guardian/Appointments";
import StaffRegistrationPage from "./pages/SignupStaff";
import ProgressReport from "./pages/admin/ProgressReport";
import PatientProfilesPage from "./pages/admin/Profiles";

import { useNavigate } from "react-router-dom";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    const storedAuthToken = localStorage.getItem("authToken");

    if (storedUserRole && storedAuthToken) {
      setUserRole(storedUserRole);
      setAuthToken(storedAuthToken);
      setIsAuthenticated(true);
    } else {
      setUserRole(null); // Ensure role is reset if not found
      setIsAuthenticated(false);
    }

    setIsLoading(false); // Set loading to false after checking localStorage
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");

    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const isAdmin = () => userRole === "admin";
  const isStaff = () => userRole === "staff";
  const isGuardianAndLoggedIn = () =>
    userRole === "guardian" && isAuthenticated;

  // Conditionally render based on loading state
  if (isLoading) {
    return <div>Loading...</div>; // Show loading spinner or message
  }

  return (
    <div>
      <Routes>
        {/* Public Routes (accessible to all users) */}
        <Route index element={<LandingPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/verify/:token" element={<VerificationPage />} /> 
        <Route
          path="/login"
          element={
            <LoginPage
              setUserRole={setUserRole}
              setAuthToken={setAuthToken}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        {/* Protected Routes for Staff and Admin - Wrap in a layout component */}
        <Route
          element={isAuthenticated && (isStaff() || isAdmin()) ? <Outlet /> : <Navigate to="/login" replace />}
        >
         <Route
    path="/home"
    element={
        <div>
            <Sidebar
                userRole={userRole}
                onLogout={handleLogout}
                isAuthenticated={isAuthenticated}
            />
            <StaffHomePage 
                userRole={userRole} 
                onLogout={handleLogout} 
            />
        </div>
    }
/>
          <Route path="/scheduleManager" element={<SchedManagerPage />} />
          <Route path="/LessonDetails" element={<LessonDetailsPage />} />
          <Route path="/ProgressReport/:patientId" element={<ProgressReport />} />
          <Route path="/therapistSchedule" element={<TherapistSchedulePage />} />
          <Route path="/upcomingAppStaff" element={<UpcomingAppStaffPage />} />
          <Route path="/Profiles" element={<PatientProfilesPage />} />
        </Route>

        {/* Protected Route for Staff Registration (accessible only to admins) */}
        <Route path="/SignupStaff" element={<StaffRegistrationPage />} />

        {/* Protected Route for Guardians */}
        <Route
          path="/appointment"
          element={
            isGuardianAndLoggedIn() ? (
              <AppointmentPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}