import './Login.css';
import logo from '../images/logo.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); 

    try {
      const response = await fetch('http://localhost:3001/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Login successful!', userData);

        // Store user data and role in local storage 
        localStorage.setItem('authToken', userData.token); 
        localStorage.setItem('userRole', userData.user.role);

        // Redirect based on user role
        if (userData.user.role === 'guardian') {
          navigate('/appointment');
        } else if (userData.user.role === 'staff') {
          navigate('/home'); 
        } else {
          console.error('Unknown user role:', userData.user.role);
        }
      } else {
        // Enhanced error handling
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            setError(errorData.error);
          } else {
            setError('An error occurred during login. Please try again later.');
          }
        } catch (parseError) {
          setError('Unexpected response from the server. Please try again later.');
          console.error('Error parsing server response:', parseError);
        }
      }
    } catch (error) {
      setError('Network error. Please try again later.');
      console.error('Network error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <img src={logo} alt="Logo" className="intelliLogo" />

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="email">Username:</label> 
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

          <label htmlFor="password" className="password">Password:</label> 
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

          <button className="login-btn" type="submit">LOGIN</button>
          <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
        </form>
      </div>
    </div>
  );
}