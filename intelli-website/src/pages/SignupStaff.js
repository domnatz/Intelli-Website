import "./Signup.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 

export default function StaffRegistrationPage() {
    const [formData, setFormData] = useState({
        name: "",
        contact_number: "",
        username: "",
        email_address: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
        setSuccessMessage(null);
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_BACKEND_API}/api/staff`, 
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            setIsLoading(false);

            if (response.ok) {
                const savedUser = await response.json();
                console.log("Staff signup successful!", savedUser);
                setSuccessMessage("Staff signup successful!");
                setFormData({
                    name: "",
                    contact_number: "",
                    username: "",
                    email_address: "",
                    password: "",
                    confirmPassword: "",
                });
                navigate('/home', { replace: true }); 
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
                } catch (parseError) {
                    setError(
                        "Unexpected error from server. Please try again later."
                    );
                    console.error(
                        "Error parsing server response:",
                        parseError
                    );
                }
            }
        } catch (error) {
            setIsLoading(false);
            setError("Network error. Please try again later.");
            console.error("Network error:", error);
        }
    };

    return (
        <div className="signup-container"> 
            <div className="signup-box">
                <h2>Staff Sign up</h2>

                {error && (
                    <div className="error-message">{error}</div>
                )}
                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
        </div>
    );
}