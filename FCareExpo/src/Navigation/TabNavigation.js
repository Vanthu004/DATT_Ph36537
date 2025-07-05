import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../Screens/HomeScreen';
import ActivityLogScreen from '../Screens/ActivityLogScreen';
import PostListScreen from '../Screens/PostListScreen';
import ReminderListScreen from '../Screens/ReminderListScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3B5BFE',
        tabBarInactiveTintColor: '#222',
        tabBarStyle: { height: 60, paddingBottom: 6, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'ActivityLog':
              iconName = 'notebook-outline';
              break;
            case 'Posts':
              iconName = 'file-document-outline';
              break;
            case 'Reminders':
              iconName = 'bell-outline';
              break;
            case 'Profile':
              iconName = 'account-outline';
              break;
            default:
              iconName = 'circle';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="ActivityLog" component={ActivityLogScreen} options={{ tabBarLabel: 'Nhật ký' }} />
      <Tab.Screen name="Posts" component={PostListScreen} options={{ tabBarLabel: 'Bài viết' }} />
      <Tab.Screen name="Reminders" component={ReminderListScreen} options={{ tabBarLabel: 'Nhắc nhở' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Hồ sơ' }} />
    </Tab.Navigator>
  );
} 