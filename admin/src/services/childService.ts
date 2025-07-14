import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/apiConfig';

export const getAllChildren = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHILDREN}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getChildById = async (childId: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHILDREN}/${childId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const createChild = async (childData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHILDREN}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(childData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const updateChild = async (childId: string, childData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHILDREN}/${childId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(childData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const deleteChild = async (childId: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHILDREN}/${childId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
}; 