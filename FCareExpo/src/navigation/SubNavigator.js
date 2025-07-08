import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import ActivityLogScreen from '../Screens/main/ActivityLogScreen';
import PostListScreen from '../Screens/main/PostListScreen';
import ReminderListScreen from '../Screens/main/ReminderListScreen';

const Tab = createBottomTabNavigator();

export default function SubNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Nhật ký') {
            return <MaterialIcons name="history" size={size} color={color} />;
          } else if (route.name === 'Bài viết') {
            return <FontAwesome5 name="newspaper" size={size} color={color} />;
          } else if (route.name === 'Nhắc lịch') {
            return <Ionicons name="alarm" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Nhật ký" component={ActivityLogScreen} />
      <Tab.Screen name="Bài viết" component={PostListScreen} />
      <Tab.Screen name="Nhắc lịch" component={ReminderListScreen} />
    </Tab.Navigator>
  );
} 