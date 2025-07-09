import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { childApi } from '../../utils';

const defaultAvatar = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

export default function ChildCreateScreen({ navigation }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Nam');
  const [hobby, setHobby] = useState('');
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [loading, setLoading] = useState(false);

  const handleChangeAvatar = () => {
    // TODO: chọn ảnh mới
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên trẻ!');
      return;
    }
    setLoading(true);
    try {
      const res = await childApi.createChild({
        full_name: name,
        dob,
        gender,
        hobby,
        avatar,
      });
      if (res.success) {
        Alert.alert('Thành công', 'Đã thêm trẻ!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Lỗi', res.message || 'Thêm trẻ thất bại!');
      }
    } catch (err) {
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
      <View style={styles.card}>
        <TouchableOpacity style={styles.avatarBox} onPress={handleChangeAvatar}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.changeAvatar}>Thay đổi</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Tên trẻ</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="dd/mm/yy" />
        <Text style={styles.label}>Giới tính</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            style={styles.picker}
          >
            <Picker.Item label="Nam" value="Nam" />
            <Picker.Item label="Nữ" value="Nữ" />
            <Picker.Item label="Khác" value="Khác" />
          </Picker>
        </View>
        <Text style={styles.label}>Sở thích</Text>
        <TextInput style={[styles.input, {height: 60}]} value={hobby} onChangeText={setHobby} multiline placeholder="" />
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={handleCreate} disabled={loading}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addBtnText}>Thêm trẻ</Text>
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
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
    paddingHorizontal: 16,
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
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
}); 