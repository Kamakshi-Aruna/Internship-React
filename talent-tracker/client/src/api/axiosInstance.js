import axios from 'axios';
import { auth } from '../firebase/firebaseConfig';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request interceptor — attach Firebase ID token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — sign out and let ProtectedRoute redirect
      auth.signOut();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;