import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const handleLogin = async (token) => {
    await AsyncStorage.setItem('token', token);
    setIsLoggedIn(true);
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) return null; // hoặc loading indicator

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        {isLoggedIn ? (
          <MainNavigator onLogout={handleLogout} />
        ) : (
          <AuthNavigator onLogin={handleLogin} />
        )}
      </NavigationContainer>
    </>
  );
}