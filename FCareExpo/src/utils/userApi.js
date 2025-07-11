import apiService from './apiService';
import { API_ENDPOINTS } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User API functions
export const userApi = {
  // Login user
  login: async (email, password) => {
    const response = await apiService.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response;
  },

  // Register user
  register: async (userData) => {
    const response = await apiService.post(API_ENDPOINTS.REGISTER, userData);
    return response;
  },

  // Create sub account
  createSubAccount: async (userData) => {
    const response = await apiService.post(API_ENDPOINTS.CREATE_SUB_ACCOUNT, userData);
    return response;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const endpoint = API_ENDPOINTS.GET_USER_BY_ID.replace(':id', userId);
    const response = await apiService.get(endpoint);
    return response;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const endpoint = API_ENDPOINTS.UPDATE_USER.replace(':id', userId);
    const response = await apiService.put(endpoint, userData);
    return response;
  },

  // Delete user
  deleteUser: async (userId) => {
    const endpoint = API_ENDPOINTS.DELETE_USER.replace(':id', userId);
    const response = await apiService.delete(endpoint);
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiService.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await apiService.post(API_ENDPOINTS.RESET_PASSWORD, { 
      token, 
      newPassword 
    });
    return response;
  },

  // Logout user (clear token)
  logout: async () => {
    apiService.setAuthToken(null);
    await AsyncStorage.removeItem('token');
  },

  // Set authentication token
  setToken: (token) => {
    apiService.setAuthToken(token);
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await apiService.get('/users', params);
    return response;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await apiService.get(API_ENDPOINTS.GET_CURRENT_USER);
    return response;
  },
};

export default userApi; 