import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/apiConfig';

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    const user = data.user || data.data;
    if (data.success && data.token && user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { ...data, user };
  } catch (err) {
    return handleApiError(err);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (!user || user === 'undefined') return null;
  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
}; 