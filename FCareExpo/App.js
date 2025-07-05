import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './src/Navigation/TabNavigation';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <TabNavigation />
      </NavigationContainer>
    </>
  );
}