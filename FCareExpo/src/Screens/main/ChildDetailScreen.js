import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { userApi, childApi } from '../../utils';

const defaultAvatar = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

export default function ChildDetailScreen({ route, navigation }) {
  const { child } = route.params;
  // child: { _id, full_name, dob, gender, avatar, hobby, manager }
  const [name, setName] = useState(child.full_name || '');
  const [dob, setDob] = useState(child.dob || '');
  const [gender, setGender] = useState(child.gender || '');
  const [hobby, setHobby] = useState(child.note || '');
  const [manager, setManager] = useState(child.manager || '');
  const [avatar, setAvatar] = useState(child.avatar || defaultAvatar);
  const [managerList, setManagerList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      const res = await userApi.getAllUsers();
      if (res.success && res.data) {
        setManagerList(res.data.filter(u => u.role === 'parent_sub'));
      }
    };
    fetchManagers();
  }, []);

  const handleDelete = async () => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa trẻ này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        try {
          const res = await childApi.deleteChild(child._id);
          if (res.success) {
            Alert.alert('Thành công', 'Đã xóa trẻ!', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          } else {
            Alert.alert('Lỗi', res.message || 'Xóa thất bại!');
          }
        } catch (err) {
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa!');
        }
      }},
    ]);
  };

 
const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      // Có thể thêm loading state nếu muốn
      const res = await childApi.updateChild(child._id, {
        full_name: name,
        dob,
        gender,
        hobby,
        manager,
        avatar,
      });
      if (res.success) {
        Alert.alert('Thành công', 'Cập nhật thông tin trẻ thành công!', [
          { text: 'OK', onPress: () => setIsEditing(false) }
        ]);
      } else {
        Alert.alert('Lỗi', res.message || 'Cập nhật thất bại!');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật!');
    }
  };

  const handleChangeAvatar = () => {
    // TODO: chọn ảnh mới
  };

  const handleManagerChange = (value) => {
    if (value !== manager) {
      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đổi người quản lý?', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đồng ý', onPress: () => setManager(value) },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Chi tiết trẻ</Text>
        <TouchableOpacity onPress={handleDelete} style={{padding: 4}}>
          <Ionicons name="trash-outline" size={22} color="#222" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.avatarBox} onPress={isEditing ? handleChangeAvatar : undefined} activeOpacity={isEditing ? 0.7 : 1}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          {isEditing && <Text style={styles.changeAvatar}>Thay đổi</Text>}
        </TouchableOpacity>
        <Text style={styles.label}>Tên trẻ</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} editable={isEditing} />
        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="dd/mm/yy" editable={isEditing} />
        <Text style={styles.label}>Giới tính</Text>
        <View style={styles.pickerBox} pointerEvents={isEditing ? 'auto' : 'none'}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            style={styles.picker}
            enabled={isEditing}
          >
            <Picker.Item label="Nam" value="Nam" />
            <Picker.Item label="Nữ" value="Nữ" />
            <Picker.Item label="Khác" value="Khác" />
          </Picker>
        </View>
        <Text style={styles.label}>Sở thích</Text>
        <TextInput style={[styles.input, {height: 60}]} value={hobby} onChangeText={setHobby} multiline placeholder="Chưa thiết lập" editable={isEditing} />
        <Text style={styles.label}>Người quản lý</Text>
        <View style={styles.pickerBox} pointerEvents={isEditing ? 'auto' : 'none'}>
          <Picker
            selectedValue={manager}
            onValueChange={isEditing ? handleManagerChange : () => {}}
            style={styles.picker}
            enabled={isEditing}
          >
            <Picker.Item label="Chưa thiết lập" value="" />
            {/* TODO: render managerList */}
            {managerList.map(acc => (
              <Picker.Item key={acc._id} label={acc.name} value={acc._id} />
            ))}
          </Picker>
        </View>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
        <Ionicons name={isEditing ? 'save-outline' : 'create-outline'} size={20} color="#fff" />
        <Text style={styles.editBtnText}>{isEditing ? 'Lưu' : 'Chỉnh sửa trẻ'}</Text>
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
    color: '#222', // màu chữ rõ ràng
    fontSize: 16, // tăng kích thước chữ
    fontWeight: 'bold',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
}); 