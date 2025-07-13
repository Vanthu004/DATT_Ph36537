import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import apiService from '../../utils/apiService';
import { API_ENDPOINTS } from '../../utils/apiConfig';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BACKEND_URL = 'http://192.168.1.7:3000/api'; // Đổi thành URL backend thực tế của bạn

export default function AddActivityLogScreen({ navigation, route }) {
  const { childId, childName } = route.params || {};
  const user = useSelector(state => state.user.user);
  const [activityType, setActivityType] = useState('');
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Upload ảnh qua backend NodeJS (Cloudinary) dùng axios và endpoint /images/upload
  const uploadToServer = async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'activity.jpg',
    });
    try {
      const response = await axios.post(`${BACKEND_URL}/images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        Alert.alert('Lỗi', 'Không nhận được url ảnh từ server!');
        return '';
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể upload ảnh.');
      console.log('Upload image error:', err);
      return '';
    }
  };

  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (pickerResult.cancelled) return;
    // Lấy uri đúng chuẩn expo-image-picker v14+
    const localUri = pickerResult.assets ? pickerResult.assets[0].uri : pickerResult.uri;
    setImage(localUri);
  };

  const handleSave = async () => {
    if (!activityType || !amount || !time || !date) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (!user?._id && !user?.id) {
      alert('Không xác định được người dùng!');
      return;
    }
    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadToServer(image);
      }
      // Format date và time
      const dateStr = date.toISOString().slice(0, 10); // yyyy-mm-dd
      const timeStr = time.toTimeString().slice(0, 5); // HH:mm
      const dateObj = new Date(`${dateStr}T${timeStr}:00`);
      const logData = {
        child_id: childId,
        user_id: user?._id || user?.id,
        date: dateObj,
        time: timeStr,
        activityType,
        amount,
        note,
        image: imageUrl,
      };
      const res = await apiService.post(API_ENDPOINTS.CREATE_ACTIVITY_LOG, logData);
      if (res && !res.error) {
        alert('Đã lưu hoạt động!');
        navigation.goBack();
      } else {
        alert('Lưu thất bại!');
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu hoạt động!');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ghi lại hoạt động của {childName || ''}</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.formBox}>
        <TextInput
          style={styles.input}
          placeholder="Loại hoạt động\nvd Uống thuốc"
          value={activityType}
          onChangeText={setActivityType}
        />
        <TextInput
          style={styles.input}
          placeholder="Số lượng\nvd 1,5 viên thuốc"
          value={amount}
          onChangeText={setAmount}
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
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Ghi chú\nvd dùng sau khi ăn"
          value={note}
          onChangeText={setNote}
          multiline
        />
        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
          <Text style={styles.addImageText}>Thêm ảnh</Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.saveBtnText}>Lưu hoạt động</Text>
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
    paddingTop: 8,
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
  formBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    margin: 16,
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  addImageBtn: {
    alignItems: 'center',
    marginVertical: 10,
  },
  addImageText: {
    color: '#222',
    fontSize: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#3B5BFE',
    borderRadius: 24,
    marginHorizontal: 32,
    marginTop: 8,
    marginBottom: 40,
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