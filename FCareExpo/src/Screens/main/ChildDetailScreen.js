import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { userApi, childApi } from '../../utils';
import { API_CONFIG } from '../../utils/apiConfig';

const defaultAvatar = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

export default function ChildDetailScreen({ route, navigation }) {
  const { child } = route.params;
  // child: { _id, full_name, dob, gender, avatar, note }
  const [name, setName] = useState(child.full_name || '');
  const [dob, setDob] = useState(child.dob ? new Date(child.dob).toLocaleDateString('vi-VN') : '');
  const [gender, setGender] = useState(child.gender || '');
  const [hobby, setHobby] = useState(child.note || '');
  const [avatar, setAvatar] = useState(child.avata_url || defaultAvatar);
  const [subAccountList, setSubAccountList] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Cập nhật dữ liệu khi component mount hoặc khi quay lại màn hình
  useEffect(() => {
    const fetchData = async () => {
      // Lấy danh sách tài khoản phụ
      const res = await userApi.getAllUsers({ role: 'parent_sub' });
      if (res.success && res.data) {
        setSubAccountList(res.data);
      }

      // Lấy thông tin trẻ mới nhất
      const childRes = await childApi.getChildById(child._id);
      if (childRes.success && childRes.data) {
        const updatedChild = childRes.data;
        setName(updatedChild.full_name || '');
        setDob(updatedChild.dob ? new Date(updatedChild.dob).toLocaleDateString('vi-VN') : '');
        setGender(updatedChild.gender || '');
        setHobby(updatedChild.note || '');
        setAvatar(updatedChild.avata_url || defaultAvatar);
      }

      // Lấy danh sách tài khoản phụ đã được gán cho trẻ này
      const assignedRes = await childApi.getUsersByChild(child._id);
      if (assignedRes.success && assignedRes.data) {
        setAssignedUsers(assignedRes.data.map(item => item.user_id));
      }
    };
    fetchData();
  }, [child._id]);

  // Thêm listener để cập nhật khi quay lại màn hình
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Cập nhật dữ liệu khi quay lại màn hình
      const fetchData = async () => {
        const childRes = await childApi.getChildById(child._id);
        if (childRes.success && childRes.data) {
          const updatedChild = childRes.data;
          setName(updatedChild.full_name || '');
          setDob(updatedChild.dob ? new Date(updatedChild.dob).toLocaleDateString('vi-VN') : '');
          setGender(updatedChild.gender || '');
          setHobby(updatedChild.note || '');
          setAvatar(updatedChild.avata_url || defaultAvatar);
        }

        const assignedRes = await childApi.getUsersByChild(child._id);
        if (assignedRes.success && assignedRes.data) {
          setAssignedUsers(assignedRes.data.map(item => item.user_id));
        }
      };
      fetchData();
    });

    return unsubscribe;
  }, [navigation, child._id]);

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
      // Chuyển đổi ngày sinh từ dd/mm/yyyy về Date object
      let dobDate = null;
      if (dob) {
        const [day, month, year] = dob.split('/');
        dobDate = new Date(year, month - 1, day);
      }

      // Cập nhật thông tin trẻ
      const res = await childApi.updateChild(child._id, {
        full_name: name,
        dob: dobDate,
        gender,
        note: hobby,
        avata_url: avatar,
      });

      if (res.success) {
        // Xử lý gán/hủy gán tài khoản phụ
        try {
          // await handleAssignUnassignUsers(); // Xóa hàm này
        } catch (assignError) {
          console.log('Lỗi khi xử lý gán/hủy gán:', assignError);
          // Vẫn hiển thị thành công nếu cập nhật thông tin trẻ thành công
        }
        
        Alert.alert('Thành công', 'Cập nhật thông tin trẻ thành công!', [
          { text: 'OK', onPress: handleEditSuccess }
        ]);
      } else {
        Alert.alert('Lỗi', res.message || 'Cập nhật thất bại!');
      }
    } catch (err) {
      console.log('Lỗi khi cập nhật:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật! Vui lòng thử lại.');
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };


  const handleChangeAvatar = async () => {
    // Chỉ cho phép khi đang chỉnh sửa
    if (!isEditing) return;
    // Xin quyền truy cập thư viện ảnh
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      Alert.alert('Quyền bị từ chối', 'Bạn cần cấp quyền truy cập ảnh để thay đổi ảnh đại diện.');
      return;
    }
    // Mở picker chọn ảnh
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (pickerResult.cancelled || !pickerResult.assets || !pickerResult.assets[0]) return;
    const localUri = pickerResult.assets[0].uri;
    // Chuẩn bị dữ liệu gửi lên server
    const formData = new FormData();
    formData.append('image', {
      uri: localUri,
      name: 'avatar.jpg',
      type: 'image/jpeg',
    });
    try {
      // Gửi ảnh lên server (API NodeJS /upload)
      const response = await axios.post(`${API_CONFIG.baseURL}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.url) {
        setAvatar(response.data.url);
        Alert.alert('Thành công', 'Đã thay đổi ảnh đại diện!');
      } else {
        Alert.alert('Lỗi', 'Không nhận được url ảnh từ server!');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể upload ảnh.');
      console.log('Upload avatar error:', err);
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
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.avatarBox} onPress={isEditing ? handleChangeAvatar : undefined} activeOpacity={isEditing ? 0.7 : 1}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            {isEditing && <Text style={styles.changeAvatar}>Thay đổi</Text>}
          </TouchableOpacity>
          <Text style={styles.label}>Tên trẻ</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} editable={isEditing} />
          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput 
            style={styles.input} 
            value={dob} 
            onChangeText={setDob} 
            placeholder="dd/mm/yyyy" 
            editable={isEditing}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.pickerBox} pointerEvents={isEditing ? 'auto' : 'none'}>
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={styles.picker}
              enabled={isEditing}
            >
              <Picker.Item label="Nam" value="male" />
              <Picker.Item label="Nữ" value="female" />
              <Picker.Item label="Khác" value="other" />
            </Picker>
          </View>
          <Text style={styles.label}>Sở thích</Text>
          <TextInput style={[styles.input, {height: 60}]} value={hobby} onChangeText={setHobby} multiline placeholder="Chưa thiết lập" editable={isEditing} />
          
          <Text style={styles.label}>Tài khoản phụ được gán</Text>
          <View style={styles.assignedUsersContainer}>
            {assignedUsers.length > 0 ? (
              assignedUsers.map(userId => {
                const user = subAccountList.find(u => u._id === userId);
                return user ? (
                  <View key={userId} style={styles.assignedUserItem}>
                    <Text style={styles.assignedUserName}>{user.name}</Text>
                  </View>
                ) : null;
              })
            ) : (
              <Text style={styles.noAssignedText}>Chưa có tài khoản phụ nào được gán</Text>
            )}
          </View>
        </View>
      </ScrollView>
      
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
  assignedUsersContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 4,
    height:100,
  },
  assignedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
        height:100,
  },
  assignedUserName: {
    fontSize: 14,
    color: '#222',
    flex: 1,
  },
  unassignButton: {
    padding: 4,
  },
  noAssignedText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  pendingChangesContainer: {
    width: '100%',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    padding: 12,
    marginTop: 8,
  },
  pendingChangesTitle: {
    fontSize: 12,
    color: '#856404',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pendingChangeText: {
    fontSize: 12,
    color: '#856404',
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