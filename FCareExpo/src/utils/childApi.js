import apiService from './apiService';
import { API_ENDPOINTS } from './apiConfig';

// Child API functions
export const childApi = {
  // Get all children
  getAllChildren: async (params = {}) => {
    const response = await apiService.get(API_ENDPOINTS.GET_CHILDREN, params);
    return response;
  },

  // Get child by ID
  getChildById: async (childId) => {
    const endpoint = API_ENDPOINTS.GET_CHILD_BY_ID.replace(':id', childId);
    const response = await apiService.get(endpoint);
    return response;
  },

  // Create new child
  createChild: async (childData) => {
    const response = await apiService.post(API_ENDPOINTS.CREATE_CHILD, childData);
    return response;
  },

  // Update child
  updateChild: async (childId, childData) => {
    const endpoint = API_ENDPOINTS.UPDATE_CHILD.replace(':id', childId);
    const response = await apiService.put(endpoint, childData);
    return response;
  },

  // Delete child
  deleteChild: async (childId) => {
    const endpoint = API_ENDPOINTS.DELETE_CHILD.replace(':id', childId);
    const response = await apiService.delete(endpoint);
    return response;
  },

  // Get children by parent
  getChildrenByParent: async (parentId) => {
    const response = await apiService.get(API_ENDPOINTS.GET_CHILDREN, { parentId });
    return response;
  },

  // Get children with assignment info for a specific sub account
  getChildrenWithAssignment: async (userId) => {
    const endpoint = API_ENDPOINTS.GET_CHILDREN_WITH_ASSIGNMENT.replace(':user_id', userId);
    const response = await apiService.get(endpoint);
    return response;
  },

  // Assign child to user
  assignChildToUser: async (childId, userId) => {
    const response = await apiService.post(API_ENDPOINTS.ASSIGN_CHILD, { child_id: childId, user_id: userId });
    return response;
  },

  // Unassign child from user
  unassignChildFromUser: async (childId, userId) => {
    const response = await apiService.post(API_ENDPOINTS.UNASSIGN_CHILD, { child_id: childId, user_id: userId });
    return response;
  },

  getUsersByChild: async (childId) => {
    const endpoint = API_ENDPOINTS.GET_USERS_BY_CHILD.replace(':child_id', childId);
    const response = await apiService.get(endpoint);
    return response;
  },

  getChildrenByUser: async (userId) => {
    const endpoint = API_ENDPOINTS.GET_CHILDREN_BY_USER.replace(':user_id', userId);
    const response = await apiService.get(endpoint);
    return response;
  },

  // Get all assigned children for parent_main
  getAllAssignedChildrenForParent: async () => {
    const response = await apiService.get(API_ENDPOINTS.GET_ALL_ASSIGNED_FOR_PARENT);
    return response;
  },
};

export default childApi; 