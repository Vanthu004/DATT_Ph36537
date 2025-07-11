import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { childApi } from '../../utils';

const defaultAvatar = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

export default function ChildCreateScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [hobby, setHobby] = useState('');
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [loading, setLoading] = useState(false);

  const handleChangeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0].base64) {
        setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const validateDate = (dateString) => {
    // Kiểm tra format dd/mm/yyyy
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
      return { isValid: false, message: 'Định dạng ngày phải là dd/mm/yyyy' };
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Kiểm tra ngày hợp lệ
    if (day < 1 || day > 31) {
      return { isValid: false, message: 'Ngày phải từ 01 đến 31' };
    }
    
    if (month < 1 || month > 12) {
      return { isValid: false, message: 'Tháng phải từ 01 đến 12' };
    }
    
    if (year < 1900 || year > new Date().getFullYear()) {
      return { isValid: false, message: 'Năm phải từ 1900 đến hiện tại' };
    }
    
    // Kiểm tra ngày thực tế
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return { isValid: false, message: 'Ngày không hợp lệ' };
    }
    
    return { isValid: true };
  };

  const handleDateChange = (text) => {
    // Chỉ cho phép nhập số và dấu /
    const cleaned = text.replace(/[^0-9/]/g, '');
    
    // Tự động thêm dấu /
    let formatted = cleaned;
    if (cleaned.length >= 2 && !cleaned.includes('/')) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (formatted.length >= 5 && formatted.split('/').length === 2) {
      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
    }
    
    // Giới hạn độ dài
    if (formatted.length <= 10) {
      setDob(formatted);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên trẻ!');
      return;
    }

    if (!dob.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập ngày sinh!');
      return;
    }

    // Validate ngày sinh
    const dateValidation = validateDate(dob);
    if (!dateValidation.isValid) {
      Alert.alert('Lỗi', dateValidation.message);
      return;
    }

    setLoading(true);
    try {
      // Lấy user ID từ AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      console.log('User ID từ AsyncStorage:', userId);
      
      if (!userId) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      // Chuyển đổi ngày sinh từ dd/mm/yyyy về Date object
      const [day, month, year] = dob.split('/');
      const dobDate = new Date(year, month - 1, day);

      const childData = {
        parent_id: userId,
        full_name: name.trim(),
        dob: dobDate,
        gender,
        note: hobby.trim(),
        avatar,
      };

      console.log('Dữ liệu tạo trẻ:', childData);

      const res = await childApi.createChild(childData);
      console.log('Response createChild:', res);
      
      if (res.success && res.data) {
        Alert.alert('Thành công', 'Đã thêm trẻ!', [
          { text: 'OK', onPress: () => {
            // Refresh danh sách trẻ
            navigation.goBack();
          }}
        ]);
      } else {
        console.log('Lỗi createChild:', res);
        let errorMessage = 'Thêm trẻ thất bại!';
        if (res.error) {
          errorMessage = res.error;
        } else if (res.message) {
          errorMessage = res.message;
        }
        Alert.alert('Lỗi', errorMessage);
      }
    } catch (err) {
      console.log('Lỗi khi tạo trẻ:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm trẻ!');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Thêm trẻ</Text>
        <View style={{width: 24}} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.avatarBox} onPress={handleChangeAvatar}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.changeAvatar}>Thay đổi</Text>
          </TouchableOpacity>
          
          <Text style={styles.label}>Tên trẻ *</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Nhập tên trẻ"
          />
          
          <Text style={styles.label}>Ngày sinh *</Text>
          <TextInput 
            style={styles.input} 
            value={dob} 
            onChangeText={handleDateChange} 
            placeholder="dd/mm/yyyy" 
            keyboardType="numeric"
            maxLength={10}
          />
          
          <Text style={styles.label}>Giới tính *</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={styles.picker}
            >
              <Picker.Item label="Nam" value="male" />
              <Picker.Item label="Nữ" value="female" />
              <Picker.Item label="Khác" value="other" />
            </Picker>
          </View>
          
          <Text style={styles.label}>Sở thích</Text>
          <TextInput 
            style={[styles.input, {height: 60}]} 
            value={hobby} 
            onChangeText={setHobby} 
            multiline 
            placeholder="Nhập sở thích của trẻ (không bắt buộc)" 
          />
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.addBtn, loading && styles.addBtnDisabled]} 
        onPress={handleCreate} 
        disabled={loading}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addBtnText}>
          {loading ? 'Đang thêm...' : 'Thêm trẻ'}
        </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
    paddingHorizontal: 16,
    width: '90%',
  },
  avatarBox: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
  },
  changeAvatar: {
    color: '#1976D2',
    fontSize: 13,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#222',
    marginTop: 8,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    marginBottom: 4,
  },
  pickerBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 4,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  addBtnDisabled: {
    backgroundColor: '#ccc',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
}); 