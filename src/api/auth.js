import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Sign in a user
export const signIn = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/signin', credentials);
    const { token } = response.data;
    
    // Store token in localStorage
    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data;
  } catch (error) {
    handleApiError('Error signing in', error);
    throw error;
  }
};

// Sign out a user
export const signOut = async () => {
  try {
    // Remove token from localStorage
    localStorage.removeItem('token');
    const response = await axiosInstance.get('/auth/signout');
    // Or redirect the user to a login page, etc.
    return response.data;
  } catch (error) {
    handleApiError('Error signing out', error);
    throw error;
  }
};
