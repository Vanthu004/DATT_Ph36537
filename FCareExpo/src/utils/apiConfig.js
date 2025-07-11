// API Configuration
const API_BASE_URL = 'http://192.168.1.7:3000/api'; // Thay đổi URL theo server của bạn

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: '/users/login',
  REGISTER: '/users',
  CREATE_SUB_ACCOUNT: '/users/sub-account',
  GET_USER_BY_ID: '/users/:id',
  GET_CURRENT_USER: '/users/me',
  UPDATE_USER: '/users/:id',
  DELETE_USER: '/users/:id',
  FORGOT_PASSWORD: '/users/forgot-password',
  RESET_PASSWORD: '/users/reset-password',
  
  // Post endpoints
  GET_POSTS: '/posts',
  CREATE_POST: '/posts',
  GET_POST_BY_ID: '/posts/:id',
  UPDATE_POST: '/posts/:id',
  DELETE_POST: '/posts/:id',
  
  // Child endpoints
  GET_CHILDREN: '/children',
  CREATE_CHILD: '/children',
  GET_CHILD_BY_ID: '/children/:id',
  UPDATE_CHILD: '/children/:id',
  DELETE_CHILD: '/children/:id',
  
  // Assigned Child endpoints
  ASSIGN_CHILD: '/assigned-child/assign',
  UNASSIGN_CHILD: '/assigned-child/unassign',
  GET_CHILDREN_BY_USER: '/assigned-child/by-user/:user_id',
  GET_USERS_BY_CHILD: '/assigned-child/by-child/:child_id',
  GET_CHILDREN_WITH_ASSIGNMENT: '/assigned-child/children-with-assignment/:user_id',
  GET_ALL_ASSIGNED_FOR_PARENT: '/assigned-child/all-assigned-for-parent',
  
  // Payment endpoints
  GET_PAYMENTS: '/payments',
  CREATE_PAYMENT: '/payments',
  GET_PAYMENT_BY_ID: '/payments/:id',
  
  // Reminder endpoints
  GET_REMINDERS: '/reminders',
  CREATE_REMINDER: '/reminders',
  GET_REMINDER_BY_ID: '/reminders/:id',
  UPDATE_REMINDER: '/reminders/:id',
  DELETE_REMINDER: '/reminders/:id',
  GET_REMINDERS_BY_CHILD: '/reminders/child/:child_id',
  
  // Support endpoints
  GET_SUPPORT_TICKETS: '/support',
  CREATE_SUPPORT_TICKET: '/support',
  GET_SUPPORT_TICKET_BY_ID: '/support/:id',
  UPDATE_SUPPORT_TICKET: '/support/:id',
  
  // Activity log endpoints
  GET_ACTIVITY_LOGS: '/activity-logs',
  CREATE_ACTIVITY_LOG: '/activity-logs',
  
  // Post approval endpoints
  GET_POST_APPROVALS: '/approvals',
  CREATE_POST_APPROVAL: '/approvals',
  UPDATE_POST_APPROVAL: '/approvals/:id',
};

export default API_CONFIG; 