import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { userApi } from '../../utils';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      const response = await userApi.login(email, password);
      if (response.success) {
        // Nếu tài khoản bị khóa, không cho đăng nhập
        if (response.data && response.data.is_blocked) {
          setLoading(false);
          Alert.alert('Tài khoản bị khóa tt ', response.data.block_reason || 'Tài khoản của bạn đã bị khóa.');
          return;
        }
        userApi.setToken(response.token);
        // Gọi API lấy user chi tiết (nếu cần)
        const userInfo = await userApi.getCurrentUser();
        if (userInfo && userInfo.success && userInfo.data) {
          // Nếu userInfo trả về user bị block (token còn hạn nhưng bị block sau đó)
          if (userInfo.data.is_blocked) {
            setLoading(false);
            let message = userInfo.data.block_reason || 'Tài khoản của bạn đã bị khóa.';
            if (userInfo.data.block_until) {
              const date = new Date(userInfo.data.block_until);
              const dateStr = date.toLocaleString();
              message += `\nThời gian bị khóa đến: ${dateStr}`;
            }
            Alert.alert('Tài khoản bị khóa', message);
            return;
          }
          dispatch(setUser(userInfo.data));
        } else {
          dispatch(setUser(response.data)); // fallback nếu không có API getCurrentUser
        }
        if (onLogin) onLogin(response.token, response.data);
        setLoading(false);
        // navigation.replace('Home');
      } else {
        setLoading(false);
        // Nếu response trả về lỗi do bị block
        if (
          response.status === 403 &&
          (response.block_reason || (response.data && response.data.block_reason))
        ) {
          // Lấy thời gian block_until nếu có
          const blockUntil = response.block_until || (response.data && response.data.block_until);
          let message = response.block_reason || (response.data && response.data.block_reason) || 'Tài khoản của bạn đã bị khóa.';
          if (blockUntil) {
            // Format ngày giờ cho dễ đọc
            const date = new Date(blockUntil);
            const dateStr = date.toLocaleString();
            message += `\nThời gian bị khóa đến: ${dateStr}`;
          }
          Alert.alert(
            'Tài khoản bị khóa',
            "Lý do:" + message
          );
        } else {
          Alert.alert('Lỗi', response.error || 'Đăng nhập thất bại');
        }
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi', 'Đăng nhập thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/Logo.png')} style={styles.logo} />
      <Text style={styles.title}>Đăng nhập</Text>
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginButtonText}>{loading ? 'Đang đăng nhập...' : 'Tiếp tục'}</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        Chưa có Tài khoản?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>Tạo ngay!</Text>
      </Text>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../../assets/google.png')} style={styles.socialIcon} />
        <Text style={styles.socialText}>Tiếp tục với Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../../assets/facebook.png')} style={styles.socialIcon} />
        <Text style={styles.socialText}>Tiếp tục với Facebook</Text>
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
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
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
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#0047FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  registerLink: {
    color: '#0047FF',
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    height: 44,
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  socialText: {
    fontSize: 16,
    color: '#222',
  },
}); 