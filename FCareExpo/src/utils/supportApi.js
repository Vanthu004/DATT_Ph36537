import apiService from './apiService';
import { API_ENDPOINTS } from './apiConfig';

// Support API functions
export const supportApi = {
  // Get all support tickets
  getAllSupportTickets: async (params = {}) => {
    const response = await apiService.get(API_ENDPOINTS.GET_SUPPORT_TICKETS, params);
    return response;
  },

  // Get support ticket by ID
  getSupportTicketById: async (ticketId) => {
    const endpoint = API_ENDPOINTS.GET_SUPPORT_TICKET_BY_ID.replace(':id', ticketId);
    const response = await apiService.get(endpoint);
    return response;
  },

  // Create new support ticket
  createSupportTicket: async (ticketData) => {
    const response = await apiService.post(API_ENDPOINTS.CREATE_SUPPORT_TICKET, ticketData);
    return response;
  },

  // Update support ticket
  updateSupportTicket: async (ticketId, ticketData) => {
    const endpoint = API_ENDPOINTS.UPDATE_SUPPORT_TICKET.replace(':id', ticketId);
    const response = await apiService.put(endpoint, ticketData);
    return response;
  },

  // Get support tickets by user
  getSupportTicketsByUser: async (userId) => {
    const response = await apiService.get(API_ENDPOINTS.GET_SUPPORT_TICKETS, { userId });
    return response;
  },

  // Get support tickets by status
  getSupportTicketsByStatus: async (status) => {
    const response = await apiService.get(API_ENDPOINTS.GET_SUPPORT_TICKETS, { status });
    return response;
  },

  // Get support tickets by priority
  getSupportTicketsByPriority: async (priority) => {
    const response = await apiService.get(API_ENDPOINTS.GET_SUPPORT_TICKETS, { priority });
    return response;
  },
};

export default supportApi; 