import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import childApi from '../../utils/childApi';
import reminderApi from '../../utils/reminderApi';

export default function ReminderListScreen({ navigation }) {
  const userId = useSelector(state => state.user.user?._id);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách trẻ đã gán cho user
  useEffect(() => {
    if (!userId) return;
    console.log('👤 userId đang đăng nhập:', userId); // kiểm tra đúng user chưa
    childApi.getChildrenByUser(userId)
      .then(res => {
        console.log('🎯 Dữ liệu trả về:', res.data);
        const childList = res.data.data || [];
        setChildren(childList);
        if (childList.length > 0) {
          setSelectedChild(childList[0]._id);
        }
      })
      .catch(err => console.log('❌ Lỗi khi gọi API:', err));
  }, [userId]);
  

  // Lấy danh sách nhắc nhở của trẻ được chọn
  useEffect(() => {
    if (!selectedChild) return;
    setLoading(true);
    reminderApi.getRemindersByChild(selectedChild)
      .then(res => {
        setReminders(res.data || []);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [selectedChild]);

  // Hiển thị alert danh sách trẻ khi nhấn vào dropdown
  const handleShowChildren = () => {
    if (!children.length) {
      Alert.alert('Danh sách trẻ', 'Không có trẻ nào được gán!');
      return;
    }
    const names = children.map(child => child.full_name).join('\n');
    Alert.alert('Danh sách trẻ đã gán', names);
  };

  // Render từng item nhắc nhở
  const renderReminder = ({ item }) => (
    <View style={styles.reminderCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderTime}>{item.time}</Text>
      </View>
      <Text style={styles.reminderDesc}>{item.description}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <Ionicons name="calendar-outline" size={14} color="#888" style={{ marginRight: 4 }} />
        <Text style={styles.reminderDate}>{item.date === new Date().toISOString().split('T')[0] ? 'Hôm nay' : item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch nhắc nhở</Text>
      </View>
      {/* Dropdown chọn trẻ */}
      <View style={styles.childPickerRow}>
        <Text style={styles.childPickerLabel}>Lịch của trẻ</Text>
        <TouchableOpacity onPress={handleShowChildren} style={{ flex: 1 }}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedChild}
              onValueChange={setSelectedChild}
              style={{ height: 36 }}
            >
              {children.map(child => (
                <Picker.Item label={child.full_name} value={child._id} key={child._id} />
              ))}
            </Picker>
          </View>
        </TouchableOpacity>
      </View>
      {/* Danh sách nhắc nhở */}
      <FlatList
        data={reminders}
        keyExtractor={item => item._id}
        renderItem={renderReminder}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
        ListEmptyComponent={!loading && (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Chưa có nhắc nhở nào</Text>
        )}
        refreshing={loading}
        onRefresh={() => selectedChild && reminderApi.getRemindersByChild(selectedChild).then(res => setReminders(res.data || []))}
      />
      {/* Button tạo mới */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddReminder')}>
        <Text style={styles.addButtonText}>Ghi lời nhắc nhở mới</Text>
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
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  childPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  childPickerLabel: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginRight: 8,
  },
  pickerWrapper: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    flex: 1,
  },
  reminderCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: 16,
    padding: 14,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  reminderTime: {
    fontSize: 13,
    color: '#3B5BFE',
    fontWeight: 'bold',
  },
  reminderDesc: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  reminderDate: {
    fontSize: 12,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#3B5BFE',
    borderRadius: 24,
    marginHorizontal: 32,
    marginTop: 8,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
