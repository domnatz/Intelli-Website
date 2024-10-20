import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerificationPage = () => {
    const { token } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('verifying'); 
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                console.log('Verification token:', token); // Log the token
                const response = await fetch(`${process.env.REACT_BACKEND_API}/verify/${token}`);
                console.log('Verification response:', response); // Log the response object
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('Verification data:', data); // Log the response data
                    console.log('Redirect URL:', data.redirectUrl); // Log the redirect URL
    
                    setVerificationStatus('success');
    
                    setTimeout(() => {
                        window.location.replace(data.redirectUrl); 
                    }, 3000);
                } else {
                    console.error('Verification failed:', response.status, response.statusText); // Log the error
                    setVerificationStatus('failed');
                }
            } catch (error) {
                console.error('Error during verification:', error);
                setVerificationStatus('failed');
            }
        };
    
        verifyEmail();
    }, [token, navigate]);

    return (
        <div>
            <h1>Email Verification</h1>
            {verificationStatus === 'verifying' && <p>Verifying your email...</p>}
            {verificationStatus === 'success' && (
                <div>
                    <p>Email verified successfully!</p>
                    <p>Redirecting you back to the login page in 3 seconds...</p> 
                </div>
            )}
            {verificationStatus === 'failed' && <p>Verification failed. Please try again or contact support.</p>}
        </div>
    );
};

export default VerificationPage;