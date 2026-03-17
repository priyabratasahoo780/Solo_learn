import axios from 'axios';

// Create axios instance
let apiURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Auto-fix for Vercel deployment: if they provided the Render URL without /api, add it
if (import.meta.env.PROD && !apiURL.endsWith('/api')) {
  // Trim trailing slash if present before appending /api
  apiURL = apiURL.replace(/\/$/, '') + '/api';
}

if (import.meta.env.DEV) console.log('🌐 API Target:', apiURL);

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // We expect the token to be in localStorage if using Header based auth
    // But our backend setup sends a cookie for refresh token and a JSON token for access.
    // Let's store the access token in localStorage for simplicity in this setup.
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Optional: Handle 401s globally)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        // Note: this endpoint relies on the httpOnly cookie
        const { data } = await api.post('/auth/refresh');
        
        // Save new access token
        localStorage.setItem('token', data.token);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, user is logged out
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Or handle via Context
        return Promise.reject(refreshError);
      }
    }
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message
      });
    }
    return Promise.reject(error);
  }
);

export default api;
