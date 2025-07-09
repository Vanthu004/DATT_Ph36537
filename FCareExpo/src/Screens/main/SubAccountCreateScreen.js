import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userApi } from '../../utils';

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
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      const userData = {
        name,
        email,
        role,
        password,
        avata_url: avatarUrl,
      };
      const res = await userApi.register(userData);
      setLoading(false);
      if (res.success) {
        Alert.alert('Thành công', 'Tạo tài khoản phụ thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Lỗi', res.error || 'Tạo tài khoản phụ thất bại');
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Lỗi', 'Tạo tài khoản phụ thất bại');
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