import apiService from './apiService';
import { API_ENDPOINTS } from './apiConfig';

// Post API functions
export const postApi = {
  // Get all posts
  getAllPosts: async (params = {}) => {
    const response = await apiService.get(API_ENDPOINTS.GET_POSTS, params);
    return response;
  },

  // Get post by ID
  getPostById: async (postId) => {
    const endpoint = API_ENDPOINTS.GET_POST_BY_ID.replace(':id', postId);
    const response = await apiService.get(endpoint);
    return response;
  },

  // Create new post
  createPost: async (postData) => {
    const response = await apiService.post(API_ENDPOINTS.CREATE_POST, postData);
    return response;
  },

  // Update post
  updatePost: async (postId, postData) => {
    const endpoint = API_ENDPOINTS.UPDATE_POST.replace(':id', postId);
    const response = await apiService.put(endpoint, postData);
    return response;
  },

  // Delete post
  deletePost: async (postId) => {
    const endpoint = API_ENDPOINTS.DELETE_POST.replace(':id', postId);
    const response = await apiService.delete(endpoint);
    return response;
  },

  // Get posts by user
  getPostsByUser: async (userId) => {
    const response = await apiService.get(API_ENDPOINTS.GET_POSTS, { userId });
    return response;
  },

  // Get posts by category
  getPostsByCategory: async (category) => {
    const response = await apiService.get(API_ENDPOINTS.GET_POSTS, { category });
    return response;
  },
};

export default postApi; 