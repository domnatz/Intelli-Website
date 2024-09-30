import './Signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    relationship_to_patient: '',
    role: 'guardian',
    username: '',
    email_address: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
   const handleNavigateToLogin = () => {
    navigate('/LoginForm'); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) 
      });

      setIsLoading(false);

      if (response.ok) {
        const savedUser = await response.json();
        console.log('Signup successful!', savedUser);
        setSuccessMessage('Signup successful! You can now log in.');
        setFormData({
          name: '',
          contact_number: '',
          relationship_to_patient: '',
          role: 'guardian',
          username: '',
          email_address: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            setError(errorData.error);
          } else {
            setError('An error occurred during signup. Please try again later.');
          }
        } catch (parseError) {
          setError('Unexpected error from server. Please try again later.');
          console.error('Error parsing server response:', parseError);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setError('Network error. Please try again later.');
      console.error('Network error:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign up</h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

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

          <label htmlFor="contact_number">Contact Number:</label>
          <input 
            type="tel" 
            id="contact_number" 
            name="contact_number" 
            value={formData.contact_number} 
            onChange={handleChange} 
            placeholder="Enter your contact number" 
          />
          <br />

          {/* Conditionally render relationship_to_patient field */}
          {formData.role === 'guardian' && (
            <>
              <label htmlFor="relationship_to_patient">Relationship to Patient:</label>
              <input 
                type="text" 
                id="relationship_to_patient" 
                name="relationship_to_patient" 
                value={formData.relationship_to_patient} 
                onChange={handleChange} 
                placeholder="Your relationship to patient" 
              />
              <br />
            </>
          )}

          <label htmlFor="role">Role:</label>
          <select 
            id="role" 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
          >
            <option value="guardian">Guardian</option>
            <option value="staff">Staff</option>
          </select> 
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

          <label htmlFor="confirmPassword">Re-enter Password:</label>
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
            {isLoading ? 'Signing up...' : 'SIGNUP'}
          </button>
          <p className="login-link"> 
                      Already have an account? <Link to="/login">Login</Link>
                    </p>
        </form>
      </div>
    </div>
  );
}