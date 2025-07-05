import apiService from './apiService';
import { API_ENDPOINTS } from './apiConfig';

// Payment API functions
export const paymentApi = {
  // Get all payments
  getAllPayments: async (params = {}) => {
    const response = await apiService.get(API_ENDPOINTS.GET_PAYMENTS, params);
    return response;
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const endpoint = API_ENDPOINTS.GET_PAYMENT_BY_ID.replace(':id', paymentId);
    const response = await apiService.get(endpoint);
    return response;
  },

  // Create new payment
  createPayment: async (paymentData) => {
    const response = await apiService.post(API_ENDPOINTS.CREATE_PAYMENT, paymentData);
    return response;
  },

  // Get payments by user
  getPaymentsByUser: async (userId) => {
    const response = await apiService.get(API_ENDPOINTS.GET_PAYMENTS, { userId });
    return response;
  },

  // Get payments by status
  getPaymentsByStatus: async (status) => {
    const response = await apiService.get(API_ENDPOINTS.GET_PAYMENTS, { status });
    return response;
  },

  // Get payments by date range
  getPaymentsByDateRange: async (startDate, endDate) => {
    const response = await apiService.get(API_ENDPOINTS.GET_PAYMENTS, { 
      startDate, 
      endDate 
    });
    return response;
  },
};

export default paymentApi; 