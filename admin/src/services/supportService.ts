import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/apiConfig';

export const getAllSupportTickets = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SUPPORT}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getSupportTicketById = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SUPPORT}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const resolveSupportTicket = async (ticketId: string, resolved_by: string, response_message: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SUPPORT}/${ticketId}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resolved_by, response_message })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return handleApiError(err);
  }
}; 