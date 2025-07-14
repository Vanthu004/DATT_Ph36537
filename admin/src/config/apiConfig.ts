export const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  LOGOUT: '/users/logout',
  
  // User endpoints
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  
  // Child endpoints
  CHILDREN: '/children',
  
  // Post endpoints
  POSTS: '/posts',
  POST_APPROVALS: '/approvals',
  
  // Reminder endpoints
  REMINDERS: '/reminders',
  
  // Activity log endpoints
  ACTIVITY_LOGS: '/activity-logs',
  
  // Payment endpoints
  PAYMENTS: '/payments',
  
  // Support endpoints
  SUPPORT: '/support',
  
  // Image endpoints
  IMAGES: '/images',
  
  // Assigned child endpoints
  ASSIGNED_CHILD: '/assigned-child'
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.message || 'Lỗi server',
      status: error.response.status
    };
  }
  return {
    success: false,
    message: 'Lỗi kết nối mạng',
    status: 0
  };
}; 