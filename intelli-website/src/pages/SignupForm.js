import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

export default function SignupForm() {
    const [formData, setFormData] = useState({
        name: "",
        contact_number: "",
        relationship_to_patient: "",
        // Removed role: 'guardian',
        username: "",
        email_address: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
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
    const handleNavigateToLogin = () => {
        navigate("/LoginForm");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_BACKEND_API}/api/users`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            setIsLoading(false);

            if (response.status === 201) {
                // Signup successful, show success message and redirect
              //  setSuccessMessage(
               //     "Signup successful! Please check your email to verify your account."
              //  );

                // Redirect to login page after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 3000);

                setFormData({
                    name: "",
                    contact_number: "",
                    relationship_to_patient: "",
                    username: "",
                    email_address: "",
                    password: "",
                    confirmPassword: "",
                });

                // Set Snackbar state for success
                setSnackbarSeverity('success');
                setSnackbarMessage('Signup successful! Please check your email.');
                setOpenSnackbar(true);

            } else {
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.error) {
                        setError(errorData.error);
                    } else {
                        setError(
                            "An error occurred during signup. Please try again later."
                        );
                    }

                    // Set Snackbar state for error (inside the catch block)
                    setSnackbarSeverity('error');
                    setSnackbarMessage(error || 'Signup failed.');
                    setOpenSnackbar(true);

                } catch (parseError) {
                    setError(
                        "Unexpected error from server. Please try again later."
                    );
                    console.error(
                        "Error parsing server response:",
                        parseError
                    );

                    // Set Snackbar state for parsing error
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Unexpected error from server.');
                    setOpenSnackbar(true);
                }
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
        <div className="signup-container">
            <div className="signup-box">
                <h2>Sign up</h2>

                {error && (
                    <div className="error-message">{error}</div>
                )}
                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Input fields */}
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                    <br />

                    <label htmlFor="contact_number">
                        Contact Number:
                    </label>
                    <input
                        type="tel"
                        id="contact_number"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        placeholder="Enter your contact number"
                    />
                    <br />

                    <label htmlFor="relationship_to_patient">
                        Relationship to Patient:
                    </label>
                    <input
                        type="text"
                        id="relationship_to_patient"
                        name="relationship_to_patient"
                        value={formData.relationship_to_patient}
                        onChange={handleChange}
                        placeholder="Your relationship to patient"
                    />
                    <br />

                    <label htmlFor="username">Username:</label>
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

                    <label htmlFor="email_address">Email:</label>
                    <input
                        type="email"
                        id="email_address"
                        name="email_address"
                        value={formData.email_address}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                    <br />

                    <label htmlFor="password">Password:</label>
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

                    <label htmlFor="confirmPassword">
                        Re-enter Password:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        required
                    />
                    <br />

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Signing up..." : "SIGNUP"}
                    </button>
                    <p className="login-link">
                        Already have an account?{" "}
                        <Link to="/login">Login</Link>
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