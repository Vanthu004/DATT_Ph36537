import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { userApi } from '../../utils';

export default function SubAccountDetailScreen({ route, navigation }) {
  const { subAccountId } = route.params;
  const [subAccount, setSubAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const res = await userApi.getUserById(subAccountId);
      if (res.success && res.data) {
        setSubAccount(res.data);
        setEditData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone_number: res.data.phone_number || '',
          avata_url: res.data.avata_url || '',
        });
        setChildren(res.data.children || []);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [subAccountId]);

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa tài khoản phụ này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: async () => {
            await userApi.deleteUser(subAccountId);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setEditData({ ...editData, avata_url: `data:image/jpeg;base64,${result.assets[0].base64}` });
    }
  };

  const handleAddChild = () => {
    setChildren([...children, '']);
  };

  const handleChangeChild = (text, idx) => {
    const newChildren = [...children];
    newChildren[idx] = text;
    setChildren(newChildren);
  };

  const handleSave = async () => {
    if (!editData.name || !editData.email) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    const updateData = {
      ...editData,
      children: children.filter(c => c.trim() !== ''),
    };
    const res = await userApi.updateUser(subAccountId, updateData);
    setLoading(false);
    if (res.success) {
      Alert.alert('Thành công', 'Cập nhật tài khoản phụ thành công!');
      setEditMode(false);
      setSubAccount(res.data);
    } else {
      Alert.alert('Lỗi', res.error || 'Cập nhật thất bại');
    }
  };

  if (loading || !subAccount) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Đang tải...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{alignItems:'center'}}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#222" />
      </TouchableOpacity>
      <Text style={styles.header}>Chi tiết tài khoản phụ</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.avatarBox} onPress={editMode ? handlePickImage : undefined}>
          <Image source={editMode ? (editData.avata_url ? { uri: editData.avata_url } : require('../../../assets/Logo.png')) : (subAccount.avata_url ? { uri: subAccount.avata_url } : require('../../../assets/Logo.png'))} style={styles.avatar} />
          <Text style={styles.changeText}>{editMode ? 'Thay đổi' : ''}</Text>
        </TouchableOpacity>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên</Text>
          <TextInput style={styles.input} value={editMode ? editData.name : subAccount.name} editable={editMode} onChangeText={text => setEditData({ ...editData, name: text })} />
        </View>
        {/* <View style={styles.inputGroup}>
          <Text style={styles.label}>Vai trò</Text>
          <TextInput style={styles.input} value={subAccount.role === 'parent_sub' ? 'Người giúp việc' : subAccount.role} editable={false} />
        </View> */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={editMode ? editData.email : subAccount.email} editable={editMode} onChangeText={text => setEditData({ ...editData, email: text })} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput style={styles.input} value={editMode ? editData.phone_number : (subAccount.phone_number || '')} editable={editMode} onChangeText={text => setEditData({ ...editData, phone_number: text })} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Trẻ phụ thuộc</Text>
          {editMode ? (
            <>
              {children.map((child, idx) => (
                <TextInput
                  key={idx}
                  style={[styles.input, { marginBottom: 6 }]}
                  value={child}
                  onChangeText={text => handleChangeChild(text, idx)}
                  placeholder={`Tên trẻ ${idx + 1}`}
                />
              ))}
              <TouchableOpacity style={styles.addChildBtn} onPress={handleAddChild}>
                <Ionicons name="add-circle-outline" size={18} color="#1976D2" />
                <Text style={styles.addChildText}>Thêm trẻ</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TextInput style={styles.input} value={subAccount.children ? subAccount.children.join(', ') : ''} editable={false} />
          )}
        </View>
      </View>
      {editMode ? (
        <TouchableOpacity style={styles.editBtn} onPress={handleSave}>
          <Text style={styles.editBtnText}>Lưu</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
          <Text style={styles.editBtnText}>Sửa tài khoản phụ</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash" size={18} color="#fff" style={{marginRight:8}} />
        <Text style={styles.deleteBtnText}>Xóa tài khoản</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('SubAccountCreate')}>
        <Ionicons name="add-circle-outline" size={20} color="#1976D2" />
        <Text style={styles.addBtnText}>Thêm tài khoản phụ mới</Text>
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
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  addChildText: {
    color: '#1976D2',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  editBtn: {
    width: '90%',
    height: 44,
    backgroundColor: '#1976D2',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    width: '90%',
    height: 44,
    backgroundColor: '#FF3333',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    width: '90%',
    marginBottom: 24,
  },
  addBtnText: {
    color: '#1976D2',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
}); 