import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import store from './src/store';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  // Để các màn hình khác có thể cập nhật trạng thái đăng nhập
  const handleLogin = async (token, userData) => {
    console.log('App - handleLogin called with:', { token: token ? 'exists' : 'null', userData });
    await AsyncStorage.setItem('token', token);
    if (userData && userData.id) {
      await AsyncStorage.setItem('userId', userData.id);
      console.log('App - Saved userId:', userData.id);
    } else {
      console.log('App - No userData or userData.id:', userData);
    }
    setIsLoggedIn(true);
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) return null; // hoặc loading indicator

  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <NavigationContainer>
        {isLoggedIn ? (
          <MainNavigator onLogout={handleLogout} />
        ) : (
          <AuthNavigator onLogin={handleLogin} />
        )}
      </NavigationContainer>
    </Provider>
  );
}