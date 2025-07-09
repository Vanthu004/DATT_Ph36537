import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { childApi } from '../../utils';
import { useFocusEffect } from '@react-navigation/native';

export default function ChildManagementScreen({ navigation }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChildren = async () => {
    setLoading(true);
    // TODO: Lấy parentId từ user hiện tại nếu cần
    const res = await childApi.getAllChildren();
    if (res.success && res.data) {
      setChildren(res.data);
    } else {
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.childItem} onPress={() => navigation.navigate('ChildDetail', { child: item })}>
      <Image source={{ uri: item.avatar || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.childName}>{item.full_name}</Text>
        <Text style={styles.childInfo}>Độ tuổi: <Text style={styles.link}>{item.dob ? `${item.age} tuổi` : 'Chưa rõ'}</Text></Text>
        <Text style={styles.childInfo}>Giới tính: <Text style={styles.link}>{item.gender || 'Chưa rõ'}</Text></Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Quản lý trẻ em</Text>
        <View style={{width: 24}} />
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