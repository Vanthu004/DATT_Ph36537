import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import childApi from '../../utils/childApi';
import reminderApi from '../../utils/reminderApi';
import { useSelector } from 'react-redux';

export default function AddReminderScreen({ navigation }) {
  // Lấy userId chắc chắn từ Redux
  const userId = useSelector(state => state.user.user?._id || state.user.user?.id);
  const reduxSelectedChild = useSelector(state => state.reminder.selectedChild);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [repeat, setRepeat] = useState('daily'); // Giá trị mặc định là 'daily'
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startCustomDate, setStartCustomDate] = useState(null);
  const [endCustomDate, setEndCustomDate] = useState(null);
  const [showStartCustomDatePicker, setShowStartCustomDatePicker] = useState(false);
  const [showEndCustomDatePicker, setShowEndCustomDatePicker] = useState(false);

  useEffect(() => {
    if (reduxSelectedChild) {
      setSelectedChild(reduxSelectedChild);
    } else if (userId) {
      childApi.getChildrenByUser(userId)
        .then(res => {
          setChildren(res.data || []);
          if (res.data && res.data.length > 0) setSelectedChild(res.data[0]);
        })
        .catch(err => console.log(err));
    }
  }, [userId, reduxSelectedChild]);

  const mapRepeatValue = (value) => {
    switch (value) {
      case 'daily': return 'daily';
      case 'weekly': return 'weekly';
      case 'monthly': return 'monthly';
      case 'custom': return 'custom'; // BỔ SUNG DÒNG NÀY
      default: return 'none';
    }
  };

  const scheduleReminderNotification = async (reminder) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Nhắc nhở: ${reminder.title}`,
          body: reminder.description || 'Bạn có một hoạt động cần làm',
          sound: true,
        },
        trigger: new Date(reminder.time),
      });
    } catch (err) {
      console.log('Lỗi đặt lịch thông báo:', err);
    }
  };

  const handleSave = async () => {
    if (!title || !selectedChild) {
      alert('Vui lòng nhập tiêu đề và chọn trẻ liên quan!');
      return;
    }
    try {
      // Gộp ngày và giờ thành 1 đối tượng Date
      const reminderTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );
      const reminderData = {
        title,
        description,
        time: reminderTime.toISOString(),
        repeat_type: mapRepeatValue(repeat),
        child_id: selectedChild._id,
        created_by: userId,
      };
      if (repeat === 'custom') {
        if (startCustomDate && endCustomDate) {
          const dates = [];
          let current = new Date(startCustomDate);
          const end = new Date(endCustomDate);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
          reminderData.customDates = dates.map(d => d.toISOString());
          reminderData.startDate = startCustomDate.toISOString();
          reminderData.endDate = endCustomDate.toISOString();
        } else {
          alert('Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc!');
          return;
        }
      } else {
        if (endDate) reminderData.endDate = endDate.toISOString();
        // Thêm startDate cho các repeat_type lặp lại
        if (["daily", "weekly", "monthly"].includes(repeat)) {
          // startDate chỉ lấy ngày, không lấy giờ
          const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          reminderData.startDate = startDate.toISOString();
        }
      }
      // Thêm log kiểm tra
      console.log('userId:', userId);
      console.log('selectedChild:', selectedChild);
      console.log('reminderData:', reminderData);
      const res = await reminderApi.createReminder(reminderData);
      if (res && res.success !== false) {
        // Đặt lịch thông báo local
        await scheduleReminderNotification(res.data || reminderData);
        navigation.goBack();
      } else {
        alert('Tạo lời nhắc thất bại!');
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi tạo lời nhắc!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#222" />
      </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm lời nhắc nhở</Text>
        <View style={{ width: 32 }} />
      </View>
      {/* Form */}
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        placeholder="Ví dụ uống thuốc buổi sáng"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Miêu tả</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Cho trẻ uống 200ml thuốc buổi sáng và buổi tối"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Thời Gian</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(Platform.OS === 'ios');
            if (selectedDate) setTime(selectedDate);
          }}
        />
      )}
      <Text style={styles.label}>Ngày</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
      <Text style={styles.label}>Lặp lại</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={repeat}
          onValueChange={setRepeat}
          style={{ height: 60 }}
        >
          <Picker.Item label="Hằng ngày" value="daily" />
          <Picker.Item label="Hàng tuần" value="weekly" />
          <Picker.Item label="Hàng tháng" value="monthly" />
          <Picker.Item label="Không lặp lại" value="none" />
          <Picker.Item label="Tự chọn ngày" value="custom" />
        </Picker>
      </View>
      {repeat === 'custom' && (
        <>
          <Text style={styles.label}>Chọn ngày bắt đầu</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowStartCustomDatePicker(true)}>
            <Text>{startCustomDate ? startCustomDate.toLocaleDateString() : 'Chọn ngày bắt đầu'}</Text>
          </TouchableOpacity>
          {showStartCustomDatePicker && (
            <DateTimePicker
              value={startCustomDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartCustomDatePicker(Platform.OS === 'ios');
                if (selectedDate) setStartCustomDate(selectedDate);
              }}
            />
          )}
          <Text style={styles.label}>Chọn ngày kết thúc</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowEndCustomDatePicker(true)}>
            <Text>{endCustomDate ? endCustomDate.toLocaleDateString() : 'Chọn ngày kết thúc'}</Text>
          </TouchableOpacity>
          {showEndCustomDatePicker && (
            <DateTimePicker
              value={endCustomDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndCustomDatePicker(Platform.OS === 'ios');
                if (selectedDate) setEndCustomDate(selectedDate);
              }}
            />
          )}
        </>
      )}
      <Text style={styles.label}>Trẻ em liên quan</Text>
      <View style={styles.input}>
        <Text>{selectedChild ? (selectedChild.name || selectedChild.full_name) : 'Chưa chọn trẻ'}</Text>
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Lưu nhắc nhở</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    fontSize: 25,
    color: '#222',
    width: 32,
    textAlign: 'left',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  label: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    marginBottom: 4,
  },
  pickerWrapper: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 4,
  },
  saveBtn: {
    backgroundColor: '#3B5BFE',
    borderRadius: 24,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 