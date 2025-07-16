import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../utils/apiService';
import { API_ENDPOINTS, API_CONFIG } from '../../utils/apiConfig';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useEffect } from 'react';
import { userApi } from '../../utils/userApi';

export default function ActivityLogDetailScreen({ route, navigation }) {
  const { log } = route.params || {};
  const [isEditing, setIsEditing] = useState(false);
  const [activityType, setActivityType] = useState(log.activityType || '');
  const [amount, setAmount] = useState(log.amount || '');
  const [time, setTime] = useState(log.time || '');
  const [date, setDate] = useState(log.date ? new Date(log.date).toLocaleDateString('vi-VN') : '');
  const [note, setNote] = useState(log.note || '');
  const [image, setImage] = useState(log.image || '');
  const [loading, setLoading] = useState(false);
  const [creatorName, setCreatorName] = useState('');

  useEffect(() => {
    const fetchCreator = async () => {
      if (log.user_id && typeof log.user_id === 'string') {
        const res = await userApi.getUserById(log.user_id);
        if (res.success && res.data) {
          setCreatorName(res.data.name || res.data.email || log.user_id);
        } else {
          setCreatorName(log.user_id);
        }
      } else if (log.user_id && typeof log.user_id === 'object') {
        setCreatorName(log.user_id.name || log.user_id.email || '');
      } else {
        setCreatorName('');
      }
    };
    fetchCreator();
  }, [log.user_id]);

  // Hàm chọn và upload ảnh mới
  const pickAndUploadImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (pickerResult.cancelled) return;
    const localUri = pickerResult.assets ? pickerResult.assets[0].uri : pickerResult.uri;
    // Upload lên backend
    const formData = new FormData();
    formData.append('image', {
      uri: localUri,
      type: 'image/jpeg',
      name: 'activity.jpg',
    });
    try {
      const response = await axios.post(`${API_CONFIG.baseURL}/images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data.url) {
        setImage(response.data.url);
        Alert.alert('Thành công', 'Đã thay đổi ảnh!');
      } else {
        Alert.alert('Lỗi', 'Không nhận được url ảnh từ server!');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể upload ảnh.');
      console.log('Upload image error:', err);
    }
  };

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setLoading(true);
    try {
      // Format lại ngày nếu có chỉnh sửa
      let dateObj = log.date;
      if (date && date !== new Date(log.date).toLocaleDateString('vi-VN')) {
        // Chuyển từ dd/mm/yyyy về Date object
        const [day, month, year] = date.split('/');
        dateObj = new Date(`${year}-${month}-${day}`);
      }
      const updateData = {
        activityType,
        amount,
        time,
        date: dateObj,
        note,
        image,
      };
      const res = await apiService.put(`${API_ENDPOINTS.GET_ACTIVITY_LOGS}/${log._id}`, updateData);
      if (res && !res.error) {
        Alert.alert('Thành công', 'Đã cập nhật hoạt động!');
        setIsEditing(false);
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Cập nhật thất bại!');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật!');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa hoạt động này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        setLoading(true);
        try {
          const res = await apiService.delete(`${API_ENDPOINTS.GET_ACTIVITY_LOGS}/${log._id}`);
          if (res && !res.error) {
            Alert.alert('Đã xóa!', 'Hoạt động đã được xóa.');
            navigation.goBack();
          } else {
            Alert.alert('Lỗi', 'Xóa thất bại!');
          }
        } catch (err) {
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa!');
        }
        setLoading(false);
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết về hoạt động</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.formBox}>
          <TextInput
            style={styles.input}
            placeholder="Loại hoạt động"
            value={activityType}
            onChangeText={setActivityType}
            editable={isEditing}
          />
          <TextInput
            style={styles.input}
            placeholder="Số lượng"
            value={amount}
            onChangeText={setAmount}
            editable={isEditing}
          />
          <TextInput
            style={styles.input}
            placeholder="Thời gian"
            value={time}
            onChangeText={setTime}
            editable={isEditing}
          />
          <TextInput
            style={styles.input}
            placeholder="Ngày"
            value={date}
            onChangeText={setDate}
            editable={isEditing}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Ghi chú"
            value={note}
            onChangeText={setNote}
            editable={isEditing}
            multiline
          />
          {image ? (
            isEditing ? (
              <TouchableOpacity
                onPress={pickAndUploadImage}
                activeOpacity={0.7}
                style={{ alignItems: 'center', marginVertical: 8 }}
              >
                <Image source={{ uri: image }} style={styles.previewImage} />
                <Text style={{ textAlign: 'center', color: '#3B5BFE', marginTop: 4 }}>Thay đổi ảnh</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ alignItems: 'center', marginVertical: 8 }}>
                <Image source={{ uri: image }} style={styles.previewImage} />
              </View>
            )
          ) : null}
      <View style={{ paddingHorizontal: 20, paddingBottom: 16, marginTop: 8 }}>
        <Text style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>
          Người tạo hoạt động: {creatorName || 'Không xác định'}
        </Text>
      </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 32, marginTop: 16 }}>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: isEditing ? '#3B5BFE' : '#E8EDFF' }]} onPress={handleEdit} disabled={loading}>
            <Ionicons name={isEditing ? 'checkmark-circle-outline' : 'create-outline'} size={22} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.saveBtnText}>{isEditing ? 'Lưu hoạt động' : 'Sửa'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#F44336' }]} onPress={handleDelete} disabled={loading}>
            <Ionicons name="trash-outline" size={22} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.saveBtnText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Hiển thị người tạo hoạt động */}

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
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 8,
    resizeMode:"contain"

  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#3B5BFE',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 18,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 