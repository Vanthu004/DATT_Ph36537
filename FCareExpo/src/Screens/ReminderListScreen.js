import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const mockReminders = [
  {
    id: '1',
    title: 'Thuốc buổi sáng',
    description: 'Cho con uống 2 viên thuốc palaisatamom',
    time: '08:00 sáng',
    date: 'Hôm nay',
  },
  {
    id: '2',
    title: 'Thuốc buổi sáng',
    description: 'Cho con uống 2 viên thuốc palaisatamom',
    time: '08:00 sáng',
    date: 'Hôm nay',
  },
  {
    id: '3',
    title: 'Thuốc buổi sáng',
    description: 'Cho con uống 2 viên thuốc palaisatamom',
    time: '08:00 sáng',
    date: 'Hôm nay',
  },
  {
    id: '4',
    title: 'Thuốc buổi sáng',
    description: 'Cho con uống 2 viên thuốc palaisatamom',
    time: '08:00 sáng',
    date: 'Hôm nay',
  },
];

const mockChildren = ['trẻ A', 'trẻ B', 'trẻ C'];

export default function ReminderListScreen() {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.reminderItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderDesc}>{item.description}</Text>
        <View style={styles.reminderMetaRow}>
          <MaterialCommunityIcons name="calendar-blank-outline" size={14} color="#888" style={{ marginRight: 4 }} />
          <Text style={styles.reminderMeta}>{item.date}</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.reminderTime}>{item.time}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" style={{ marginTop: 16 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch nhắc nhở</Text>
        <Ionicons name="add-circle-outline" size={26} color="#222" />
      </View>
      {/* Filter chọn trẻ */}
      <View style={styles.childFilterRow}>
        <Text style={styles.childFilterLabel}>Lịch của trẻ</Text>
        <TouchableOpacity style={styles.childFilterBtn}>
          <Text style={styles.childFilterText}>{selectedChild}</Text>
          <Ionicons name="chevron-down" size={16} color="#222" />
        </TouchableOpacity>
      </View>
      {/* Reminder List */}
      <View style={styles.reminderListBox}>
        <FlatList
          data={mockReminders}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
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
  childFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  childFilterLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    marginRight: 12,
  },
  childFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  childFilterText: {
    fontSize: 13,
    color: '#222',
    marginRight: 2,
  },
  reminderListBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginHorizontal: 12,
    padding: 8,
    marginBottom: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  reminderTitle: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reminderDesc: {
    color: '#444',
    fontSize: 13,
    marginBottom: 4,
  },
  reminderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reminderMeta: {
    color: '#888',
    fontSize: 12,
  },
  reminderTime: {
    color: '#3B5BFE',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 11,
    color: '#222',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 11,
    color: '#3B5BFE',
    marginTop: 2,
    fontWeight: 'bold',
  },
}); 