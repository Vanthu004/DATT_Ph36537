import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/apiConfig';

// Post services
export const getAllPosts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POSTS}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getPostById = async (postId: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POSTS}/${postId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const deletePost = async (postId: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POSTS}/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

// Post approval services
export const getAllPostApprovals = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POST_APPROVALS}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const approvePost = async (approvalId: string, status: 'approved' | 'rejected', reason?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POST_APPROVALS}/${approvalId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, reason })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getAllCommunityPosts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POSTS}?visibility=community`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getApprovalById = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POST_APPROVALS}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return handleApiError(err);
  }
}; 