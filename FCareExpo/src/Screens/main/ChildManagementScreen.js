import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { childApi } from '../../utils';
import { useFocusEffect } from '@react-navigation/native';

export default function ChildManagementScreen({ navigation }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Helper function để tính tuổi
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Helper function để format giới tính
  const formatGender = (gender) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return 'Chưa rõ';
    }
  };

  const handleDeleteChild = async (childId, childName) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa trẻ "${childName}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            const res = await childApi.deleteChild(childId);
            if (res.success) {
              Alert.alert('Thành công', 'Đã xóa trẻ thành công!');
              fetchChildren(); // Refresh danh sách
            } else {
              Alert.alert('Lỗi', res.error || res.message || 'Xóa trẻ thất bại!');
            }
          } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa trẻ!');
          }
        }},
      ]
    );
  };

  const fetchChildren = async () => {
    setLoading(true);
    console.log('ChildManagementScreen - fetching children');
    const res = await childApi.getAllChildren();
    console.log('ChildManagementScreen - getAllChildren response:', res);
    if (res.success && Array.isArray(res.data)) {
      console.log('ChildManagementScreen - Found children:', res.data.length);
      setChildren(res.data);
    } else {
      console.log('ChildManagementScreen - No children found or error:', res);
      setChildren([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchChildren();
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchChildren();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => {
    const age = calculateAge(item.dob);
    const gender = formatGender(item.gender);
    
    return (
      <View style={styles.childItem}>
        <TouchableOpacity 
          style={styles.childContent} 
          onPress={() => navigation.navigate('ChildDetail', { child: item })}
        >
          <Image 
            source={{ 
              uri: item.avata_url || item.avatar || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' 
            }} 
            style={styles.avatar} 
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.childName}>{item.full_name}</Text>
            <Text style={styles.childInfo}>
              Độ tuổi: <Text style={styles.link}>{age ? `${age} tuổi` : 'Chưa rõ'}</Text>
            </Text>
            <Text style={styles.childInfo}>
              Giới tính: <Text style={styles.link}>{gender}</Text>
            </Text>
            {item.note && (
              <Text style={styles.childInfo}>
                Sở thích: <Text style={styles.link}>{item.note}</Text>
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={() => handleDeleteChild(item._id, item.full_name)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3333" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Quản lý trẻ em</Text>
        <TouchableOpacity onPress={fetchChildren} disabled={loading} style={{padding: 4}}>
          <Ionicons name="refresh-outline" size={24} color="#222" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 32 }} />
        ) : (
          <FlatList
            data={children}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8 }}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            ListEmptyComponent={<Text style={styles.emptyText}>Chưa có trẻ nào</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ChildCreate')}>
        <Ionicons name="add-circle-outline" size={20} color="#1976D2" />
        <Text style={styles.addBtnText}>Thêm trẻ mới</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 4,
  },
  childContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eee',
  },
  childName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  childInfo: {
    fontSize: 13,
    color: '#888',
  },
  link: {
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
  deleteBtn: {
    padding: 8,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  addBtnText: {
    color: '#1976D2',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
}); 