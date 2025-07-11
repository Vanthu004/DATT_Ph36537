import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { userApi, childApi } from '../../utils';

export default function SubAccountDetailScreen({ route, navigation }) {
  const { subAccountId } = route.params;
  const [subAccount, setSubAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [children, setChildren] = useState([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);
  const [allChildren, setAllChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

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
        // Load danh sách trẻ với thông tin gán
        await loadAllChildren();
      } else {
        Alert.alert('Lỗi', res.error || res.message || 'Không thể tải thông tin tài khoản');
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
            const res = await userApi.deleteUser(subAccountId);
            if (res.success) {
              navigation.goBack();
            } else {
              Alert.alert('Lỗi', res.error || 'Xóa tài khoản thất bại');
            }
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

  const loadAllChildren = async () => {
    setLoadingChildren(true);
    try {
      const res = await childApi.getChildrenWithAssignment(subAccountId);
      if (res.success) {
        setAllChildren(res.data);
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể tải danh sách trẻ');
      }
    } catch (error) {
      console.error('Error loading children:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách trẻ');
    }
    setLoadingChildren(false);
  };

  const handleToggleChildAssignment = async (childId, isCurrentlyAssigned) => {
    try {
      let res;
      if (isCurrentlyAssigned) {
        // Hủy gán
        res = await childApi.unassignChildFromUser(childId, subAccountId);
      } else {
        // Gán trẻ
        res = await childApi.assignChildToUser(childId, subAccountId);
      }
      
      if (res.success) {
        // Reload danh sách trẻ
        await loadAllChildren();
      } else {
        Alert.alert('Lỗi', res.message || 'Thao tác thất bại');
      }
    } catch (error) {
      console.error('Error toggling child assignment:', error);
      Alert.alert('Lỗi', 'Thao tác thất bại');
    }
  };

  const showChildrenSelectionModal = () => {
    loadAllChildren();
    setShowChildrenModal(true);
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
      // Không cần gửi children array vì chúng ta đã sử dụng hệ thống gán
    };
    const res = await userApi.updateUser(subAccountId, updateData);
    setLoading(false);
    if (res.success) {
      Alert.alert('Thành công', 'Cập nhật tài khoản phụ thành công!');
      setEditMode(false);
      setSubAccount(res.data);
    } else {
      Alert.alert('Lỗi', res.error || res.message || 'Cập nhật thất bại');
    }
  };

  // Helper: Tính tuổi từ ngày sinh
  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
              <TouchableOpacity style={styles.selectChildrenBtn} onPress={showChildrenSelectionModal}>
                <Ionicons name="people-outline" size={18} color="#1976D2" />
                <Text style={styles.selectChildrenText}>Chọn trẻ phụ thuộc</Text>
              </TouchableOpacity>
              <Text style={styles.selectedChildrenText}>
                {allChildren.filter(child => child.isAssigned).map(child => child.full_name).join(', ') || 'Chưa chọn trẻ nào'}
              </Text>
            </>
          ) : (
            <View style={styles.childrenDisplayContainer}>
              <Text style={styles.childrenDisplayText}>
                {allChildren.filter(child => child.isAssigned).map(child => child.full_name).join(', ') || 'Chưa có trẻ nào được gán'}
              </Text>
            </View>
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

      {/* Modal chọn trẻ */}
      <Modal
        visible={showChildrenModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChildrenModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn trẻ phụ thuộc</Text>
              <TouchableOpacity onPress={() => setShowChildrenModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {loadingChildren ? (
              <View style={styles.loadingContainer}>
                <Text>Đang tải...</Text>
              </View>
            ) : (
              <FlatList
                data={allChildren}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.childItem, item.isAssigned && styles.childItemAssigned]}
                    onPress={() => handleToggleChildAssignment(item._id, item.isAssigned)}
                  >
                    <View style={styles.childInfo}>
                      <Text style={[styles.childName, item.isAssigned && styles.childNameAssigned]}>
                        {item.full_name}
                      </Text>
                      <Text style={styles.childDetails}>
                        {item.gender === 'male' ? 'Nam' : 'Nữ'} • {calculateAge(item.dob)} tuổi
                      </Text>
                    </View>
                    <View style={styles.assignmentStatus}>
                      {item.isAssigned ? (
                        <View style={styles.assignedBadge}>
                          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                          <Text style={styles.assignedText}>Đã gán</Text>
                        </View>
                      ) : (
                        <View style={styles.unassignedBadge}>
                          <Ionicons name="add-circle-outline" size={20} color="#1976D2" />
                          <Text style={styles.unassignedText}>Chưa gán</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.childrenList}
              />
            )}
          </View>
        </View>
      </Modal>
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
  selectChildrenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  selectChildrenText: {
    color: '#1976D2',
    fontSize: 14,
    marginLeft: 8,
  },
  selectedChildrenText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    height: '700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  childrenList: {
    flex: 1,
  },
  childItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  childItemAssigned: {
    backgroundColor: '#E8F5E9', // Light green background for assigned items
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  childNameAssigned: {
    color: '#4CAF50', // Green color for assigned items
  },
  childDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  assignmentStatus: {
    alignItems: 'center',
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 5,
  },
  assignedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  unassignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F7', // Light blue background for unassigned items
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 5,
  },
  unassignedText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childrenDisplayContainer: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  childrenDisplayText: {
    fontSize: 14,
    color: '#555',
  },
}); 