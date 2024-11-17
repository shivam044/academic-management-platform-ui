import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/user', userData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating user', error);
    throw error;
  }
};

// Get a user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting user by ID', error);
    throw error;
  }
};

// Update a user by ID
export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating user', error);
    throw error;
  }
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting user', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all users', error);
    throw error;
  }
};
