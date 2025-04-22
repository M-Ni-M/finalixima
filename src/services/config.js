import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // Set timeout to 10 seconds
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;  // This return was missing
}, (error) => {
    return Promise.reject(error);  // Adding error handling
});