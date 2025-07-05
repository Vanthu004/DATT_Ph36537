import apiService from './apiService';
import { API_ENDPOINTS } from './apiConfig';

// Reminder API functions
export const reminderApi = {
  // Get all reminders
  getAllReminders: async (params = {}) => {
    const response = await apiService.get(API_ENDPOINTS.GET_REMINDERS, params);
    return response;
  },

  // Get reminder by ID
  getReminderById: async (reminderId) => {
    const endpoint = API_ENDPOINTS.GET_REMINDER_BY_ID.replace(':id', reminderId);
    const response = await apiService.get(endpoint);
    return response;
  },

  // Create new reminder
  createReminder: async (reminderData) => {
    const response = await apiService.post(API_ENDPOINTS.CREATE_REMINDER, reminderData);
    return response;
  },

  // Update reminder
  updateReminder: async (reminderId, reminderData) => {
    const endpoint = API_ENDPOINTS.UPDATE_REMINDER.replace(':id', reminderId);
    const response = await apiService.put(endpoint, reminderData);
    return response;
  },

  // Delete reminder
  deleteReminder: async (reminderId) => {
    const endpoint = API_ENDPOINTS.DELETE_REMINDER.replace(':id', reminderId);
    const response = await apiService.delete(endpoint);
    return response;
  },

  // Get reminders by user
  getRemindersByUser: async (userId) => {
    const response = await apiService.get(API_ENDPOINTS.GET_REMINDERS, { userId });
    return response;
  },

  // Get reminders by date
  getRemindersByDate: async (date) => {
    const response = await apiService.get(API_ENDPOINTS.GET_REMINDERS, { date });
    return response;
  },

  // Get upcoming reminders
  getUpcomingReminders: async (days = 7) => {
    const response = await apiService.get(API_ENDPOINTS.GET_REMINDERS, { upcoming: days });
    return response;
  },
};

export default reminderApi; 