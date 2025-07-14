import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/apiConfig';

export const getAllUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
}; 