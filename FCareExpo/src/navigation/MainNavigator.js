import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from '../Screens/main/HomeScreen';
import ActivityLogScreen from '../Screens/main/ActivityLogScreen';
import PostListScreen from '../Screens/main/PostListScreen';
import ProfileScreen from '../Screens/main/ProfileScreen';
import ReminderListScreen from '../Screens/main/ReminderListScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Trang chủ') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Nhật ký') {
            return <MaterialIcons name="history" size={size} color={color} />;
          } else if (route.name === 'Bài viết') {
            return <FontAwesome5 name="newspaper" size={size} color={color} />;
          } else if (route.name === 'Nhắc lịch') {
            return <Ionicons name="alarm" size={size} color={color} />;
          } else if (route.name === 'Cá nhân') {
            return <Ionicons name="person" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Nhật ký" component={ActivityLogScreen} />
      <Tab.Screen name="Bài viết" component={PostListScreen} />
      <Tab.Screen name="Nhắc lịch" component={ReminderListScreen} />
      <Tab.Screen name="Cá nhân" component={ProfileScreen} />
    </Tab.Navigator>
  );
} 