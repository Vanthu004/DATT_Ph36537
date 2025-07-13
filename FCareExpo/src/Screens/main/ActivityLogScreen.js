import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Modal, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { childApi } from '../../utils/childApi';
import apiService from '../../utils/apiService';
import { API_ENDPOINTS } from '../../utils/apiConfig';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';

export default function ActivityLogScreen({ navigation }) {
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const user = useSelector(state => state.user.user);

  // Fetch danh sách trẻ
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        let children = [];
        if (user && user.role === 'parent_sub') {
          const res = await childApi.getChildrenByUser(user._id || user.id);
          if (res.success && Array.isArray(res.data)) {
            children = res.data;
          }
        } else if (user && user.role === 'parent_main') {
          const res = await childApi.getAllAssignedChildrenForParent();
          if (res.success && Array.isArray(res.data)) {
            children = res.data;
          }
        }
        setChildrenList(children);
        if (children.length > 0) setSelectedChild(children[0]);
      } catch (err) {
        console.error('Error fetching children:', err);
      }
    };
    fetchChildren();
  }, [user]);

  // Refetch logs khi màn hình focus, đổi selectedChild hoặc selectedDate
  useFocusEffect(
    useCallback(() => {
      if (!selectedChild) return;
      let isActive = true;
      const fetchLogs = async () => {
        setLoading(true);
        try {
          const params = { childId: selectedChild._id };
          if (selectedDate) {
            // Gửi ngày dạng yyyy-mm-dd
            params.date = selectedDate.toISOString().slice(0, 10);
          }
          const data = await apiService.get(API_ENDPOINTS.GET_ACTIVITY_LOGS, params);
          let logs = [];
          if (Array.isArray(data)) {
            logs = data;
          } else if (data && data.data && Array.isArray(data.data)) {
            logs = data.data;
          }
          if (isActive) setActivityLogs(logs);
        } catch (err) {
          console.error('Error fetching activity logs:', err);
        }
        setLoading(false);
      };
      fetchLogs();
      return () => { isActive = false; };
    }, [selectedChild, selectedDate])
  );

  const handleChildSelect = useCallback((child) => {
    setSelectedChild(child);
    setShowChildSelector(false);
  }, []);

  // Chọn ngày
  const handleCalendarPress = () => {
    setShowDatePicker(true);
  };
  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) setSelectedDate(date);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.activityItem}
      onPress={() => navigation.navigate('DetailActivityLog', { log: item })}
    >
      <View>
        <Text style={styles.activityTime}>{item.time}</Text>
        <Text style={styles.activityDesc}>{item.description || item.activityType}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhật ký hoạt động</Text>
        <TouchableOpacity onPress={handleCalendarPress}>
          <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Date picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Child Selector giống ReminderListScreen */}
      <TouchableOpacity
        style={styles.childSelector}
        onPress={() => setShowChildSelector(true)}
      >
        <View style={styles.selectorContent}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.selectorText}>
            {selectedChild ? (selectedChild.name || selectedChild.full_name) : 'Chọn trẻ'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      {/* Hiển thị ngày đã chọn */}
      <View style={styles.selectedDateBox}>
        <Text style={styles.selectedDateText}>
          Ngày: {selectedDate.toLocaleDateString()}
        </Text>
      </View>

      {/* Modal chọn trẻ */}
      <Modal
        visible={showChildSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChildSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn trẻ</Text>
              <TouchableOpacity
                onPress={() => setShowChildSelector(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={childrenList}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.childItem}
                  onPress={() => handleChildSelect(item)}
                >
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{item.name || item.full_name}</Text>
                    <Text style={styles.childAge}>{item.age ? `${item.age} tuổi` : ''}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Tiêu đề và nút thêm */}
      <View style={styles.activitiesHeader}>
        <Text style={styles.sectionTitle}>
          Các hoạt động{selectedChild ? ` - ${selectedChild.name || selectedChild.full_name}` : ''}
        </Text>
        <TouchableOpacity
          style={styles.addIconButton}
          onPress={() => selectedChild && navigation.navigate('AddActivityLog', { childId: selectedChild._id, childName: selectedChild.name || selectedChild.full_name })}
        >
          <Ionicons name="add" size={24} color="#3B5BFE" />
        </TouchableOpacity>
      </View>
      {/* Activity List */}
      <View style={styles.activityListBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#3B5BFE" />
        ) : (
          <FlatList
            data={activityLogs}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginVertical: 20 }}>Chưa có nhật ký nào</Text>}
            contentContainerStyle={{ paddingBottom: 20, }}
          />
        )}
      </View>
      {/* Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Ghi lại nhật ký hoạt động mới</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#222',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    padding: 4,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  childAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#222',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 20,
    fontWeight: '500',
  },
  activitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  addIconButton: {
    backgroundColor: '#E8EDFF',
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityListBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginHorizontal: 12,
    padding: 8,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  activityTime: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
  },
  activityDesc: {
    color: '#222',
    fontSize: 15,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 2,
    marginLeft: 0,
  },
  addButton: {
    backgroundColor: '#3B5BFE',
    borderRadius: 24,
    marginHorizontal: 32,
    marginTop: 8,
    marginBottom: 70,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectedDateBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 14,
    color: '#222',
  },
}); 