import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerificationPage = () => {
    const { token } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('verifying'); 
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.REACT_BACKEND_API}/verify/${token}`);
                const data = await response.json(); 

                if (response.ok) {
                    setVerificationStatus('success');

                    setTimeout(() => {
                        navigate(data.redirectUrl);  
                    }, 3000);
                } else {
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