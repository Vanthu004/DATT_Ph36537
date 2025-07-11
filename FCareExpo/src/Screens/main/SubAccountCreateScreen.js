import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userApi } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubAccountCreateScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('parent_sub'); // mặc định là tài khoản phụ
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    setLoading(true);
    try {
      // Lấy userId từ AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      console.log('SubAccountCreate - userId from AsyncStorage:', userId);
      
      if (!userId) {
        // Thử lấy thông tin user từ API
        console.log('SubAccountCreate - No userId in AsyncStorage, trying to get from API');
        const currentUserRes = await userApi.getCurrentUser();
        if (currentUserRes.success && currentUserRes.data) {
          console.log('SubAccountCreate - Got user from API:', currentUserRes.data);
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }
      }

      const userData = {
        name,
        email,
        password,
        avata_url: avatarUrl,
        // Không cần gửi role và parent_id nữa, backend sẽ tự động xử lý
      };
      console.log('SubAccountCreate - userData being sent:', userData);
      
      const res = await userApi.createSubAccount(userData);
      console.log('SubAccountCreate - register response:', res);
      
      setLoading(false);
      
      if (res.success && res.data && res.data._id) {
        console.log('SubAccountCreate - Success: Tài khoản phụ được tạo thành công');
        Alert.alert('Thành công', 'Tạo tài khoản phụ thành công!', [
          { text: 'OK', onPress: () => {
            // Refresh danh sách tài khoản phụ
            navigation.goBack();
          }},
        ]);
      } else {
        console.log('SubAccountCreate - Error response:', res);
        // Xử lý lỗi từ API response
        let errorMessage = 'Tạo tài khoản phụ thất bại';
        
        if (res.error) {
          if (res.error.includes('duplicate key error') && res.error.includes('email')) {
            errorMessage = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
          } else if (res.error.includes('email')) {
            errorMessage = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
          } else {
            errorMessage = res.error;
          }
        } else if (res.data && res.data.message) {
          errorMessage = res.data.message;
        }
        
        Alert.alert('Lỗi', errorMessage);
      }
    } catch (e) {
      console.log('SubAccountCreate - error:', e);
      setLoading(false);
      Alert.alert('Lỗi', 'Tạo tài khoản phụ thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{alignItems:'center'}}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#222" />
      </TouchableOpacity>
      <Text style={styles.header}>Thêm tài khoản phụ mới</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.avatarBox}>
          <Image source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/Logo.png')} style={styles.avatar} />
          <Text style={styles.changeText}>Thay đổi</Text>
        </TouchableOpacity>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên tài khoản phụ</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Văn Thư" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa chỉ Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Example@gmail.com" keyboardType="email-address" autoCapitalize="none" />
        </View>
        {/* <View style={styles.inputGroup}>
          <Text style={styles.label}>Vai trò</Text>
          <TextInput style={styles.input} value={role === 'parent_sub' ? 'Ông' : role} editable={false} />
        </View> */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="******" secureTextEntry />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="******" secureTextEntry />
        </View>
      </View>
      <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={loading}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.createBtnText}>{loading ? 'Đang tạo...' : 'Tạo tài khoản phụ'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:40,
  },
  backBtn: {
    position: 'absolute',
    top: 8,
    left: 0,
    zIndex: 10,
    padding: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarBox: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  changeText: {
    color: '#1976D2',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    fontSize: 15,
    color: '#222',
  },
  createBtn: {
    width: '90%',
    height: 44,
    backgroundColor: '#1976D2',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
}); 