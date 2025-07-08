import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userApi } from '../utils';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    
    setLoading(true);
    try {
      const userData = {
        email,
        password,
        name: fullName,
        role: 'parent_main', // Sửa theo enum trong model
      };
      
      const response = await userApi.register(userData);
      if (response.success) {
        setLoading(false);
        Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập.', [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
      } else {
        setLoading(false);
        Alert.alert('Lỗi', response.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi', 'Đăng ký thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation && navigation.goBack && navigation.goBack()}> 
        <Ionicons name="chevron-back" size={28} color="#222" />
      </TouchableOpacity>
      <Text style={styles.title}>Tạo tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ email."
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.registerButtonText}>{loading ? 'Đang đăng ký...' : 'Tiếp tục'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    alignSelf: 'flex-start',
    marginTop: 48,
    marginLeft: 0,
  },
  input: {
    width: '100%',
    height: 44,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    fontSize: 16,
  },
  registerButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#0047FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 