import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import supportApi from '../../utils/supportApi';

export default function SupportListScreen() {
  const navigation = useNavigation();
  const user = useSelector(state => state.user.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sử dụng useFocusEffect để reload khi quay lại màn hình
  useFocusEffect(
    React.useCallback(() => {
      fetchTickets();
    }, [user])
  );

  const fetchTickets = async () => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const res = await supportApi.getSupportTicketsByUser(user._id);
      if (res && res.success && res.data) {
        setTickets(res.data);
      } else {
        setTickets([]);
      }
    } catch (err) {
      setTickets([]);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.ticketItem} onPress={() => navigation.navigate('SupportDetailScreen', { ticket: item })}>
      <Text style={styles.ticketTitle}>{item.title}</Text>
      <Text style={styles.ticketMsg} numberOfLines={1}>{item.messege}</Text>
      <View style={styles.ticketFooter}>
        <Text style={[styles.ticketStatus, { color: item.status === 'Đang giải quyết' ? '#FF9900' : '#3B5BFE' }]}>
          Trạng thái: {item.status || 'Đang giải quyết'}
        </Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.ticketTime}>
            {item.createdAt ? new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
          </Text>
          <Text style={styles.ticketDate}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" style={{ position: 'absolute', right: 12, top: 18 }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hỗ trợ</Text>
      </View>
      <Text style={styles.sectionTitle}>Hỗ trợ người dùng</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3B5BFE" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Chưa có phiếu hỗ trợ nào</Text>}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        />
      )}
      <TouchableOpacity style={styles.newBtn} onPress={() => navigation.navigate('CreateSupportScreen')}>
        <Text style={styles.newBtnText}>Yêu cầu hỗ trợ mới</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  sectionTitle: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  ticketItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  ticketMsg: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  ticketTime: {
    fontSize: 13,
    color: '#888',
  },
  ticketDate: {
    fontSize: 12,
    color: '#888',
  },
  newBtn: {
    backgroundColor: '#3B5BFE',
    borderRadius: 24,
    margin: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
  },
  newBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 