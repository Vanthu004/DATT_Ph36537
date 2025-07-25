import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch } from 'react-redux';
import store from './src/store';
import { setUser } from './src/store/userSlice';
import { userApi } from './src/utils';
import { Platform, Alert } from 'react-native';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenAndUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await userApi.getCurrentUser();
          if (response.success && response.data) {
            dispatch(setUser(response.data));
            // Nếu user bị block thì logout và thông báo
            if (response.data.is_blocked) {
              let message = response.data.block_reason || 'Tài khoản của bạn đã bị khóa.';
              if (response.data.block_until) {
                const date = new Date(response.data.block_until);
                const dateStr = date.toLocaleString();
                message += `\nThời gian bị khóa đến: ${dateStr}`;
              }
              Alert.alert('Tài khoản bị khóa', message, [
                { text: 'OK', onPress: async () => {
                  await AsyncStorage.removeItem('token');
                  setIsLoggedIn(false);
                  dispatch(setUser(null));
                }}
              ]);
              return;
            }
          }
        } catch (err) {}
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setUserReady(true);
    };
    checkTokenAndUser();
    // Định kỳ kiểm tra user bị block
    let interval = null;
    if (isLoggedIn) {
      interval = setInterval(checkTokenAndUser, 15000); // 15s kiểm tra 1 lần
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dispatch, isLoggedIn]);

  const handleLogin = async (token, userData) => {
    await AsyncStorage.setItem('token', token);
    setIsLoggedIn(true);
    dispatch(setUser(userData));
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    dispatch(setUser(null));
  };

  if (isLoggedIn === null || !userReady) return null; // loading indicator

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

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}