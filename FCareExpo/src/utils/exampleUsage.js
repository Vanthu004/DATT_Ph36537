// Example usage of API functions in React Native components
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { userApi, postApi, childApi, reminderApi } from './index';

// Example: Login Screen
export const LoginScreenExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await userApi.login(email, password);
      if (response.success) {
        // Store token
        userApi.setToken(response.data.token);
        // Navigate to home screen
        console.log('Login successful:', response.data);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Your login form components */}
    </View>
  );
};

// Example: Home Screen with Posts
export const HomeScreenExample = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postApi.getAllPosts();
      if (response.success) {
        setPosts(response.data);
      } else {
        console.error('Failed to load posts:', response.error);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await postApi.createPost(postData);
      if (response.success) {
        // Refresh posts list
        loadPosts();
        Alert.alert('Success', 'Post created successfully');
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>
              <Text>{item.content}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

// Example: Children Management Screen
export const ChildrenScreenExample = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const response = await childApi.getAllChildren();
      if (response.success) {
        setChildren(response.data);
      } else {
        console.error('Failed to load children:', response.error);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
    }
  };

  const addChild = async (childData) => {
    try {
      const response = await childApi.createChild(childData);
      if (response.success) {
        loadChildren(); // Refresh list
        Alert.alert('Success', 'Child added successfully');
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add child');
    }
  };

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={children}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
              <Text>Age: {item.age}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

// Example: Reminders Screen
export const RemindersScreenExample = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const response = await reminderApi.getAllReminders();
      if (response.success) {
        setReminders(response.data);
      } else {
        console.error('Failed to load reminders:', response.error);
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReminder = async (reminderData) => {
    try {
      const response = await reminderApi.createReminder(reminderData);
      if (response.success) {
        loadReminders(); // Refresh list
        Alert.alert('Success', 'Reminder created successfully');
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create reminder');
    }
  };

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default {
  LoginScreenExample,
  HomeScreenExample,
  ChildrenScreenExample,
  RemindersScreenExample,
}; 