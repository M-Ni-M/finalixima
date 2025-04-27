import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleGoogleCallback } from '../services/auth';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    if (token) {
      handleGoogleCallback(token);
      toast.success("Authentication successful!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      navigate('/product', { replace: true });
    } else {
      toast.error("Authentication failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="text-center font-[MuseoModerno]">
        <h2 className="text-2xl font-bold mb-4">Processing your authentication...</h2>
        <p>Please wait while we complete the login process.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;