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
};

export default childApi; 