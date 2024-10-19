import "./Login.css";
import logo from "../images/logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material"; 

export default function LoginForm({ setUserRole, setAuthToken, setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);   

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
        credentials: 'include'
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.user.role);

        setAuthToken(data.token);
        setUserRole(data.user.role);
        setIsAuthenticated(true);

        setFormData({ username: "", password: "" });

        if (data.user.role === "guardian") {
            navigate("/appointment", { replace: true });
        } else if (data.user.role === "staff" || data.user.role === "admin") {
            navigate("/home", { replace: true });
        }

        // Set Snackbar state for success
        setSnackbarSeverity('success');
        setSnackbarMessage('Login successful!');
        setOpenSnackbar(true); 

    } else {
        // More specific error handling
        if (response.status === 401) {
         //   setError("Invalid username or password");
        } else {
            const errorData = await response.json();
           // setError(errorData.error || "Failed to log in");
        }

        // Set Snackbar state for error
        setSnackbarSeverity('error');
        setSnackbarMessage(error || 'Invalid username or password'); 
        setOpenSnackbar(true); 
    }
} catch (error) {
    setIsLoading(false);
    setError("Network error. Please try again later.");
    console.error("Network error:", error);

    // Set Snackbar state for network error
    setSnackbarSeverity('error');
    setSnackbarMessage('Network error. Please try again later.');
    setOpenSnackbar(true); 
}
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <img src={logo} alt="Logo" className="logoa" />

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="email">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
          <br />

          <label htmlFor="password" className="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <br />

          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "LOGIN"}
          </button>
            <p className="register-link">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </form>
      </div>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}