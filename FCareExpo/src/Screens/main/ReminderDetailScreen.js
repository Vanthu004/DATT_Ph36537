import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { deleteReminder, fetchRemindersByChild } from '../../store/reminderSlice';

export default function ReminderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { reminder, childName } = route.params; // reminder: object, childName: string
  const [completed, setCompleted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Format time
  const formatTime = (dateTime) => {
    try {
      const date = new Date(dateTime);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'chiều' : 'sáng';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } catch {
      return '';
    }
  };

  // Format date
  const isToday = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };
  const formatDateLabel = (dateTime) => {
    if (isToday(dateTime)) return 'Hôm nay';
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Hàm chuyển repeat_type sang tiếng Việt
  const getRepeatLabel = (repeatType) => {
    switch (repeatType) {
      case 'daily': return 'Hằng ngày';
      case 'weekly': return 'Hàng tuần';
      case 'monthly': return 'Hàng tháng';
      default: return 'Không lặp lại';
    }
  };

  // Xử lý xóa reminder
  const handleDelete = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa lời nhắc này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        setDeleting(true);
        await dispatch(deleteReminder(reminder._id));
        // Sau khi xóa, load lại danh sách reminders của trẻ
        dispatch(fetchRemindersByChild(reminder.child_id));
        setDeleting(false);
        navigation.goBack();
      }}
    ]);
  };

  // Xử lý hoàn thành
  const handleComplete = () => {
    setCompleted(true);
    // Có thể dispatch action cập nhật trạng thái nếu muốn lưu vào DB
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lời nhắc nhở</Text>
        <View style={{ width: 28 }} />
      </View>
      {/* Card */}
      <View style={[styles.reminderCard, completed && styles.reminderCardCompleted]}>
        <Text style={styles.label}>Tiêu đề</Text>
        <Text style={styles.title}>{reminder.title}</Text>
        <Text style={styles.label}>Thời gian</Text>
        <Text style={styles.time}>{formatTime(reminder.time)}</Text>
        <Text style={styles.label}>Miêu tả</Text>
        <Text style={styles.desc}>{reminder.description}</Text>
        <Text style={styles.label}>Lặp lại</Text>
        <Text style={styles.repeat}>{getRepeatLabel(reminder.repeat_type)}</Text>
        <Text style={styles.label}>Ngày</Text>
        <Text style={styles.date}>{formatDateLabel(reminder.time)}</Text>
        <Text style={styles.label}>Đứa Trẻ</Text>
        <Text style={styles.childName}>{childName}</Text>
      </View>
      {/* Actions */}
      <TouchableOpacity
        style={styles.completeBtn}
        onPress={handleComplete}
        disabled={completed}
      >
        <Ionicons name="thumbs-up" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.completeBtnText}>Đánh dấu đã hoàn thành</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={handleDelete}
        disabled={deleting}
      >
        <Ionicons name="trash" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.deleteBtnText}>Xóa lời nhắc</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop:30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  reminderCard: {
    backgroundColor: '#F3F2F4',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    
  },
  reminderCardCompleted: {
    backgroundColor: '#B2F2BB', // xanh nhạt
  },
  label: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
  },
  time: {
    color: '#3B5BFE',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    color: '#222',
    fontSize: 15,
    marginBottom: 4,
  },
  repeat: {
    color: '#222',
    fontSize: 15,
    marginBottom: 4,
  },
  date: {
    color: '#222',
    fontSize: 15,
    marginBottom: 4,
  },
  childName: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  completeBtn: {
    backgroundColor: '#1976FF',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  completeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: '#FF5630',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 