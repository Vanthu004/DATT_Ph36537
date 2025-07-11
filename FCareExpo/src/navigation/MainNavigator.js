import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from '../Screens/main/HomeScreen';
import ActivityLogScreen from '../Screens/main/ActivityLogScreen';
import PostListScreen from '../Screens/main/PostListScreen';
import ProfileScreen from '../Screens/main/ProfileScreen';
import ReminderListScreen from '../Screens/main/ReminderListScreen';
import SubAccountScreen from '../Screens/main/SubAccountScreen';
import SubAccountDetailScreen from '../Screens/main/SubAccountDetailScreen';
import SubAccountCreateScreen from '../Screens/main/SubAccountCreateScreen';
import ChildManagementScreen from '../Screens/main/ChildManagementScreen';
import ChildDetailScreen from '../Screens/main/ChildDetailScreen';
import ChildCreateScreen from '../Screens/main/ChildCreateScreen';
import AddReminderScreen from '../Screens/main/AddReminderScreen';
import ReminderDetailScreen from '../Screens/main/ReminderDetailScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const ReminderStack = createStackNavigator();

function ProfileStackScreen({ onLogout }) {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain">
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen name="SubAccount" component={SubAccountScreen} />
      <ProfileStack.Screen name="SubAccountDetail" component={SubAccountDetailScreen} />
      <ProfileStack.Screen name="SubAccountCreate" component={SubAccountCreateScreen} />
      <ProfileStack.Screen name="ChildManagement" component={ChildManagementScreen} />
      <ProfileStack.Screen name="ChildDetail" component={ChildDetailScreen} />
      <ProfileStack.Screen name="ChildCreate" component={ChildCreateScreen} />
    </ProfileStack.Navigator>
  );
}

function ReminderStackScreen() {
  return (
    <ReminderStack.Navigator screenOptions={{ headerShown: false }}>
      <ReminderStack.Screen name="ReminderList" component={ReminderListScreen} />
      <ReminderStack.Screen name="AddReminder" component={AddReminderScreen} />
      <ReminderStack.Screen name="ReminderDetail" component={ReminderDetailScreen} />
    </ReminderStack.Navigator>
  );
}

export default function MainNavigator({ onLogout }) {
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
      <Tab.Screen name="Nhắc lịch" component={ReminderStackScreen} />
      <Tab.Screen name="Cá nhân">
        {props => <ProfileStackScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
} 