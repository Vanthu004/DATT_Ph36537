import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userApi } from '../../utils';
import { useFocusEffect } from '@react-navigation/native';

export default function SubAccountScreen({ navigation }) {
  const [subAccounts, setSubAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubAccounts = async () => {
    setLoading(true);
    const res = await userApi.getAllUsers();
    if (res.success && res.data) {
      // Lọc ra các tài khoản phụ (role === 'parent_sub')
      setSubAccounts(res.data.filter(u => u.role === 'parent_sub'));
    } else {
      setSubAccounts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubAccounts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchSubAccounts();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.accountItem} onPress={() => navigation.navigate('SubAccountDetail', { subAccountId: item._id })}>
      <Text style={styles.accountName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#222" />
      </TouchableOpacity>
      <Text style={styles.header}>Quản lý tài khoản phụ</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tài khoản phụ hiện có</Text>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : (
          <FlatList
            data={subAccounts}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={<Text style={styles.emptyText}>Chưa có tài khoản phụ nào</Text>}
          />
        )}
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('SubAccountCreate')}>
        <Ionicons name="add-circle-outline" size={20} color="#1976D2" />
        <Text style={styles.addBtnText}>Thêm tài khoản phụ mới</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop:60,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 0,
    zIndex: 10,
    padding: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    color: '#222',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  accountName: {
    fontSize: 15,
    color: '#222',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    marginTop: 'auto',
  },
  addBtnText: {
    color: '#1976D2',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
}); 