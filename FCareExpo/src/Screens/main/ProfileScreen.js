import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { userApi } from '../../utils';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const menuItems = [
  { id: '1', label: 'Quản lý tài khoản phụ' },
  { id: '2', label: 'Quản lý trẻ em' },
  { id: '3', label: 'Nạp tiền' },
  { id: '4', label: 'Giới thiệu về chúng tôi' },
];

export default function ProfileScreen({ onLogout }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await userApi.getCurrentUser();
      console.log('ProfileScreen - getCurrentUser response:', response);
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        console.log('ProfileScreen - Failed to get user info:', response);
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.log('ProfileScreen - Error fetching user info:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: async () => {
            await userApi.logout();
            if (onLogout) onLogout();
          }
        },
      ]
    );
  };

  const handleMenuPress = (item) => {
    if (item.label === 'Quản lý tài khoản phụ') {
      navigation.navigate('SubAccount');
    } else if (item.label === 'Quản lý trẻ em') {
      navigation.navigate('ChildManagement');
    }
    // Có thể xử lý các menu khác ở đây
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="settings-outline" size={22} color="#222" />
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <TouchableOpacity onPress={fetchUserInfo} disabled={loading}>
            <Ionicons name="refresh-outline" size={22} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileBox}>
          <ActivityIndicator size="large" color="#3B5BFE" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
        <View style={styles.menuBox}>
          {menuItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuPress(item)}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="settings-outline" size={22} color="#222" />
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <TouchableOpacity onPress={fetchUserInfo} disabled={loading}>
            <Ionicons name="refresh-outline" size={22} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileBox}>
          <Ionicons name="person-circle-outline" size={70} color="#ccc" />
          <Text style={styles.name}>Không thể tải thông tin</Text>
          <Text style={styles.email}>Vui lòng thử lại</Text>
        </View>
        <View style={styles.menuBox}>
          {menuItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuPress(item)}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={22} color="#222" />
        <Text style={styles.headerTitle}>Hồ sơ</Text>
        <TouchableOpacity onPress={fetchUserInfo} disabled={loading}>
          <Ionicons name="refresh-outline" size={22} color="#222" />
        </TouchableOpacity>
      </View>
      {/* Profile Box */}
      <View style={styles.profileBox}>
        <Image 
          source={{ 
            uri: user.avata_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' 
          }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      {/* Menu */}
      <View style={styles.menuBox}>
        {menuItems.map(item => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuPress(item)}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        ))}
      </View>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  profileBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: '#888',
  },
  menuBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 20,
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuLabel: {
    fontSize: 15,
    color: '#222',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  logoutText: {
    color: '#FF3333',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 11,
    color: '#222',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 11,
    color: '#3B5BFE',
    marginTop: 2,
    fontWeight: 'bold',
  },
}); 