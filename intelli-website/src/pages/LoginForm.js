import './Login.css';
import logo from '../images/logo.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm({ setUserRole, setAuthToken, onSuccessfulLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('API URL:', `${process.env.REACT_BACKEND_API}/api/login`);
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setIsLoading(false);

      if (!response.ok) {
        try {
          const errorData = await response.json();
          setError(errorData.error || 'An error occurred during login. Please try again later.');
        } catch (parseError) {
          setError('Unexpected response from the server. Please try again later.');
          console.error('Error parsing server response:', parseError);
        }
      } else {
        const userData = await response.json();
        console.log('Raw response data:', userData);

        if (!userData || !userData.user || !userData.user.role) {
          setError('Invalid response from server. Missing user role information.');
          return;
        }

        console.log('Login successful!', userData);

        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('userRole', userData.user.role);
        setAuthToken(userData.token);
        setUserRole(userData.user.role);

        if (userData.user.role === 'guardian') {
          navigate('/appointment', { replace: true });
        } else if (userData.user.role === 'staff') {
          navigate('/home', { replace: true });
        } else {
          console.error('Unknown user role:', userData.user.role);
          setError('Invalid user role. Please contact support.');
        }
      }
    } catch (error) {
      setIsLoading(false);
      setError('Network error. Please try again later.');
      console.error('Network error:', error);
    }
    onSuccessfulLogin(); 
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

          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'LOGIN'}
          </button>
          <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
        </form>
      </div>
    </div>
  );
}