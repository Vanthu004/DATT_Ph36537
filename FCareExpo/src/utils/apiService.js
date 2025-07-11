import { API_CONFIG, API_ENDPOINTS } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.headers = API_CONFIG.headers;
  }

  // Helper method to get auth token
  async getAuthToken() {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.log('Lỗi khi lấy token:', error);
      return null;
    }
  }

  // Helper method to set auth token
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    // Lấy token trước khi gọi API
    const token = await this.getAuthToken();
    if (token) {
      this.setAuthToken(token);
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.headers,
      ...options,
    };

    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      body: options.body,
      headers: this.headers
    });

    try {
      const response = await fetch(url, config);
      
      console.log('API Response Status:', response.status);
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', data);
        // Trả về object với error thay vì throw
        return { 
          success: false, 
          error: data.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          data: data
        };
      }
      
      console.log('API Success Response:', data);
      // Trả về data trực tiếp nếu backend đã có format success/data
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.makeRequest(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService; 