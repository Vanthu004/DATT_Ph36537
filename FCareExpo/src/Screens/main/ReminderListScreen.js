import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChildrenByUser,
  fetchAllAssignedChildrenForParent,
  clearChildren,
} from '../../store/childSlice';
import {
  fetchRemindersByChild,
  setSelectedChild,
  clearReminders,
} from '../../store/reminderSlice';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ReminderListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const assignedChildren = useSelector((state) => state.child?.assignedChildren || []);
  const childrenLoading = useSelector((state) => state.child?.loading || false);
  const childrenError = useSelector((state) => state.child?.error || null);
  const { reminders = [], selectedChild = null, loading: remindersLoading = false, error: remindersError = null } = useSelector((state) => state.reminder || {});
  
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [hasFetchedChildren, setHasFetchedChildren] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Memoize dispatch functions to prevent infinite loops
  const fetchChildrenForParent = useCallback(() => {
    dispatch(fetchAllAssignedChildrenForParent());
  }, [dispatch]);

  const fetchChildrenForSub = useCallback((userId) => {
    dispatch(fetchChildrenByUser(userId));
  }, [dispatch]);

  const handleRetryFetchChildren = useCallback(() => {
    if (user && user.role === 'parent_main') {
      dispatch(fetchAllAssignedChildrenForParent());
    } else if (user && user.role === 'parent_sub') {
      dispatch(fetchChildrenByUser(user._id || user.id));
    }
  }, [user, dispatch]);

  const handleRetryFetchReminders = useCallback(() => {
    if (selectedChild && selectedChild._id) {
      dispatch(fetchRemindersByChild(selectedChild._id));
    }
  }, [selectedChild, dispatch]);

  useEffect(() => {
    if (user && user.role && !hasFetchedChildren) {
      console.log('ReminderListScreen - User:', user);
      // Nếu là parent_main, lấy tất cả trẻ của họ
      if (user.role === 'parent_main') {
        console.log('ReminderListScreen - Fetching all children for parent_main');
        // Parent_main sẽ xem tất cả trẻ của họ
        fetchChildrenForParent();
        setHasFetchedChildren(true);
      } else if (user.role === 'parent_sub') {
        // Nếu là parent_sub, lấy trẻ được gán cho mình
        console.log('ReminderListScreen - Fetching children assigned to me for parent_sub');
        fetchChildrenForSub(user._id || user.id);
        setHasFetchedChildren(true);
      } else {
        console.log('ReminderListScreen - Unknown user role:', user.role);
      }
    }
  }, [user, fetchChildrenForParent, fetchChildrenForSub, hasFetchedChildren]);

  useFocusEffect(
    React.useCallback(() => {
      // Nếu là parent_main
      if (user && user.role === 'parent_main') {
        dispatch(fetchAllAssignedChildrenForParent());
      }
      // Nếu là parent_sub
      else if (user && user.role === 'parent_sub') {
        dispatch(fetchChildrenByUser(user._id || user.id));
      }
    }, [user, dispatch])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (selectedChild && selectedChild._id) {
        dispatch(fetchRemindersByChild(selectedChild._id));
      }
    }, [selectedChild, dispatch])
  );

  // Reset hasFetchedChildren when user changes
  useEffect(() => {
    if (!user) {
      setHasFetchedChildren(false);
      dispatch(clearChildren());
    }
  }, [user]);

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (childrenError) {
      Alert.alert('Lỗi', childrenError);
    }
  }, [childrenError]);

  useEffect(() => {
    if (remindersError) {
      Alert.alert('Lỗi', remindersError);
    }
  }, [remindersError]);

  // Clear reminders when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearReminders());
    };
  }, []);

  const handleChildSelect = useCallback((child) => {
    console.log('ReminderListScreen - Selected child:', child);
    if (child && child._id) {
      dispatch(setSelectedChild(child));
      dispatch(fetchRemindersByChild(child._id));
      setShowChildSelector(false);
    } else {
      console.error('ReminderListScreen - Invalid child data:', child);
      Alert.alert('Lỗi', 'Dữ liệu trẻ không hợp lệ');
    }
  }, [dispatch]);

  const formatDateTime = (dateTime) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const getRepeatLabel = (repeatType) => {
    switch (repeatType) {
      case 'daily': return 'Hằng ngày';
      case 'weekly': return 'Hàng tuần';
      case 'monthly': return 'Hàng tháng';
      default: return null;
    }
  };

  const formatTime = (dateTime) => {
    try {
      const date = new Date(dateTime);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'chiều' : 'sáng';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 => 12
      const strTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      return strTime;
    } catch {
      return '';
    }
  };

  const isToday = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  const formatDateLabel = (dateTime) => {
    if (isToday(dateTime)) return 'Hôm nay';
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const renderReminderItem = useCallback(({ item }) => {
    // Kiểm tra ngày đang xem đã hoàn thành chưa
    const ymd = new Date(selectedDate).toISOString().slice(0,10);
    const isCompleted = Array.isArray(item.completedDates) && item.completedDates.some(d => new Date(d).toISOString().slice(0,10) === ymd);
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ReminderDetail', { reminder: item, childName: selectedChild?.full_name || selectedChild?.name })}>
        <View style={[styles.reminderCard, isCompleted && { backgroundColor: '#B2F2BB' }]}> 
          <View style={styles.reminderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderTitle}>{item.title}</Text>
            </View>
            <Text style={styles.reminderTime}>{formatTime(item.time)}</Text>
          </View>
          <Text style={styles.reminderDescription}>{item.description}</Text>
          <View style={styles.reminderFooterRow}>
            <Ionicons name="calendar-outline" size={16} color="#888" style={{ marginRight: 4 }} />
            <Text style={styles.reminderDateLabel}>{formatDateLabel(selectedDate)}</Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation, selectedChild, selectedDate]);

  const renderChildItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.childItem}
      onPress={() => handleChildSelect(item)}
    >
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{item.name || item.full_name}</Text>
        <Text style={styles.childAge}>{item.age} tuổi</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  ), [handleChildSelect]);

  const ChildSelectorModal = useCallback(() => (
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
          
          {childrenLoading ? (
            <ActivityIndicator size="large" color="#0047FF" />
          ) : childrenError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
              <Text style={styles.errorText}>{childrenError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetryFetchChildren}
              >
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : assignedChildren && assignedChildren.length > 0 ? (
            <FlatList
              data={assignedChildren}
              keyExtractor={(item) => item._id}
              renderItem={renderChildItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="person-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {user && user.role === 'parent_main' 
                  ? 'Chưa có trẻ nào được tạo' 
                  : 'Chưa có trẻ nào được gán cho bạn'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  ), [showChildSelector, childrenLoading, childrenError, assignedChildren, user, handleRetryFetchChildren, renderChildItem]);

  const handleCalendarPress = () => {
    setShowDatePicker(true);
  };

  // Hàm kiểm tra reminder có hiển thị cho ngày hôm nay không
  const isReminderForToday = (reminder) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reminderTime = new Date(reminder.time);
    const endDate = reminder.endDate ? new Date(reminder.endDate) : null;

    // Nếu có endDate và đã hết hạn thì không hiển thị
    if (endDate && endDate < today) return false;

    // Nếu là daily: luôn hiển thị nếu chưa hết hạn
    if (reminder.repeat_type === 'daily') return true;

    // Nếu là weekly: kiểm tra thứ trong tuần
    if (reminder.repeat_type === 'weekly') {
      return reminderTime.getDay() === now.getDay();
    }

    // Nếu là monthly: kiểm tra ngày trong tháng
    if (reminder.repeat_type === 'monthly') {
      return reminderTime.getDate() === now.getDate();
    }

    // Nếu không lặp lại: chỉ hiển thị nếu đúng ngày hôm nay
    return (
      reminderTime.getDate() === now.getDate() &&
      reminderTime.getMonth() === now.getMonth() &&
      reminderTime.getFullYear() === now.getFullYear()
    );
  };

  // Sửa hàm lọc reminder để dùng selectedDate
  const isReminderForSelectedDate = (reminder) => {
    const date = new Date(selectedDate);
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // Sử dụng startDate nếu có, nếu không thì dùng time
    const baseDate = reminder.startDate ? new Date(reminder.startDate) : new Date(reminder.time);
    const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const endDate = reminder.endDate ? new Date(reminder.endDate) : null;

    if (endDate) {
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      if (target > end) return false;
    }
    if (target < startDate) return false;

    if (reminder.repeat_type === 'daily') {
      return true;
    }
    if (reminder.repeat_type === 'weekly') {
      // Hiển thị vào đúng thứ trong tuần, cho tất cả các tuần sau startDate
      if (startDate.getDay() !== target.getDay()) return false;
      // Số ngày giữa target và startDate
      const diffDays = Math.floor((target - startDate) / (1000 * 60 * 60 * 24));
      return diffDays % 7 === 0 && diffDays >= 0;
    }
    if (reminder.repeat_type === 'monthly') {
      // Hiển thị vào đúng ngày trong tháng, cho tất cả các tháng sau startDate
      if (startDate.getDate() !== target.getDate()) return false;
      // target phải >= startDate
      return target >= startDate;
    }
    if (reminder.repeat_type === 'custom' && Array.isArray(reminder.customDates)) {
      return reminder.customDates.some(dateStr => {
        const custom = new Date(dateStr);
        const customYMD = custom.toISOString().slice(0,10);
        const targetYMD = target.toISOString().slice(0,10);
        return customYMD === targetYMD;
      });
    }
    // Không lặp lại: chỉ hiển thị đúng ngày
    return (
      baseDate.getDate() === target.getDate() &&
      baseDate.getMonth() === target.getMonth() &&
      baseDate.getFullYear() === target.getFullYear()
    );
  };

  // Chỉ cho phép parent_sub xem lịch của ngày hôm nay
  useEffect(() => {
    if (user && user.role === 'parent_sub') {
      setSelectedDate(new Date());
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch nhắc nhở</Text>
        {/* Nút chọn ngày chỉ cho phép nếu không phải parent_sub */}
        {user?.role !== 'parent_sub' && (
          <TouchableOpacity onPress={handleCalendarPress}>
            <Ionicons name="calendar-outline" size={25} color="#000" style={{ marginRight: 4 }} />
          </TouchableOpacity>
        )}
      </View>
      {showDatePicker && user?.role !== 'parent_sub' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}
      {/* Nút quay lại hôm nay nếu đang xem ngày khác */}
      {selectedDate && !isToday(selectedDate) && user?.role !== 'parent_sub' && (
        <TouchableOpacity style={{ alignSelf: 'center', marginVertical: 8 }} onPress={() => setSelectedDate(new Date())}>
          <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>Quay về hôm nay</Text>
        </TouchableOpacity>
      )}
      {/* Loading state when user is not loaded */}
      {!user ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0047FF" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      ) : user && user.role !== 'parent_main' && user.role !== 'parent_sub' ? (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
          <Text style={styles.emptyText}>Bạn không có quyền truy cập tính năng này</Text>
        </View>
      ) : (
        <>
          {/* Child Selector */}
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

          {/* Reminders List */}
          {selectedChild ? (
            <View style={styles.remindersContainer}>
              <View style={styles.remindersHeader}>
                <Text style={styles.remindersTitle}>
                  Lịch nhắc nhở của {selectedChild.name || selectedChild.full_name}
                </Text>
                {/* Nút thêm nhắc lịch chỉ cho phép nếu không phải parent_sub */}
                {user?.role !== 'parent_sub' && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddReminder', { childId: selectedChild._id })}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>

              {remindersLoading ? (
                <ActivityIndicator size="large" color="#0047FF" style={styles.loader} />
              ) : remindersError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
                  <Text style={styles.errorText}>{remindersError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleRetryFetchReminders}
                  >
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                  </TouchableOpacity>
                </View>
              ) : reminders && reminders.length > 0 ? (
                <FlatList
                  data={reminders.filter(isReminderForSelectedDate)}
                  keyExtractor={(item) => item._id}
                  renderItem={renderReminderItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.remindersList}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="calendar-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyText}>Chưa có lịch nhắc nhở nào</Text>
                  {/* Nút tạo nhắc nhở đầu tiên chỉ cho phép nếu không phải parent_sub */}
                  {user?.role !== 'parent_sub' && (
                    <TouchableOpacity
                      style={styles.addFirstButton}
                      onPress={() => navigation.navigate('AddReminder', { childId: selectedChild._id })}
                    >
                      <Text style={styles.addFirstButtonText}>Tạo lịch nhắc nhở đầu tiên</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="person-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Vui lòng chọn trẻ để xem lịch nhắc nhở</Text>
            </View>
          )}
        </>
      )}

      <ChildSelectorModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  headerRight: {
    width: 40,
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
  remindersContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  remindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  remindersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  addButton: {
    backgroundColor: '#0047FF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remindersList: {
    paddingBottom: 20,
  },
  reminderItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  addFirstButton: {
    backgroundColor: '#0047FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0047FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  reminderCard: {
    backgroundColor: 'rgba(150, 150, 150, 0.5)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderTime: {
    color: '#3B5BFE',
    fontWeight: '500',
    fontSize: 15,
  },
  reminderFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  reminderDateLabel: {
    color: '#444',
    fontSize: 14,
  },
});
