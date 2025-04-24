import { apiClient } from "./config";

export const apiSignup = async (payload) => {
  return apiClient.post("/user/register", payload);
};

export const apiLogin = async (payload) => {
  return apiClient.post("/user/login", payload);
};

export const apiVerifyEmail = async (payload) => {
  return apiClient.post("/user/verify-email", payload);
};

// Add this function to your existing auth.js service file

export const initiateGoogleAuth = () => {
    window.location.href = 'https://auction-api-6aps.onrender.com/api/v1/google';
  };
  
  // Add this function to handle the callback from Google OAuth
  export const handleGoogleCallback = (token) => {
    localStorage.setItem('authToken', token);
    return token;
  };
