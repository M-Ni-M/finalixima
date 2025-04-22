import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://auction-api-6aps.onrender.com/api/v1";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for auth headers
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});