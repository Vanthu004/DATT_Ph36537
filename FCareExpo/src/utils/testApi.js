// Test file để kiểm tra các API functions
import { userApi, postApi, childApi, reminderApi } from './index';

// Test đăng ký user
export const testRegister = async () => {
  console.log('Testing register...');
  const userData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'parent'
  };
  
  try {
    const response = await userApi.register(userData);
    console.log('Register response:', response);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: error.message };
  }
};

// Test đăng nhập
export const testLogin = async () => {
  console.log('Testing login...');
  try {
    const response = await userApi.login('test@example.com', 'password123');
    console.log('Login response:', response);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// Test lấy danh sách posts
export const testGetPosts = async () => {
  console.log('Testing get posts...');
  try {
    const response = await postApi.getAllPosts();
    console.log('Get posts response:', response);
    return response;
  } catch (error) {
    console.error('Get posts error:', error);
    return { success: false, error: error.message };
  }
};

// Test lấy danh sách children
export const testGetChildren = async () => {
  console.log('Testing get children...');
  try {
    const response = await childApi.getAllChildren();
    console.log('Get children response:', response);
    return response;
  } catch (error) {
    console.error('Get children error:', error);
    return { success: false, error: error.message };
  }
};

// Test lấy danh sách reminders
export const testGetReminders = async () => {
  console.log('Testing get reminders...');
  try {
    const response = await reminderApi.getAllReminders();
    console.log('Get reminders response:', response);
    return response;
  } catch (error) {
    console.error('Get reminders error:', error);
    return { success: false, error: error.message };
  }
};

// Test tất cả API
export const testAllApis = async () => {
  console.log('=== Testing All APIs ===');
  
  // Test register
  await testRegister();
  
  // Test login
  await testLogin();
  
  // Test get posts
  await testGetPosts();
  
  // Test get children
  await testGetChildren();
  
  // Test get reminders
  await testGetReminders();
  
  console.log('=== API Testing Complete ===');
};

export default {
  testRegister,
  testLogin,
  testGetPosts,
  testGetChildren,
  testGetReminders,
  testAllApis
}; 