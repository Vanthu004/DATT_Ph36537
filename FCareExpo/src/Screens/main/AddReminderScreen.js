import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import childApi from '../../utils/childApi';
import reminderApi from '../../utils/reminderApi';
import { useSelector } from 'react-redux';

export default function AddReminderScreen({ navigation }) {
  const userId = useSelector(state => state.user.user?._id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [repeat, setRepeat] = useState('Hằng ngày');
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!userId) return;
    childApi.getChildrenByUser(userId)
      .then(res => {
        setChildren(res.data || []);
        if (res.data && res.data.length > 0) setSelectedChild(res.data[0]._id);
      })
      .catch(err => console.log(err));
  }, [userId]);

  const handleSave = async () => {
    if (!title || !selectedChild) {
      alert('Vui lòng nhập tiêu đề và chọn trẻ liên quan!');
      return;
    }
    try {
      const reminderData = {
        title,
        description,
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: date.toISOString().split('T')[0],
        repeat,
        childId: selectedChild,
        userId,
      };
      const res = await reminderApi.createReminder(reminderData);
      if (res && res.success !== false) {
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
          <Picker.Item label="Hằng ngày" value="Hằng ngày" />
          <Picker.Item label="Hàng tuần" value="Hàng tuần" />
          <Picker.Item label="Hàng tháng" value="Hàng tháng" />
        </Picker>
      </View>
      <Text style={styles.label}>Trẻ em liên quan</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedChild}
          onValueChange={setSelectedChild}
          style={{ height: 60 }}
        >
          {children.map(child => (
            <Picker.Item label={child.name} value={child._id} key={child._id} />
          ))}
        </Picker>
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