import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const mockActivities = [
  {
    id: '1',
    time: '10h sáng',
    description: 'Cho bé uống 120ml sữa tươi nguyên chất',
  },
  {
    id: '2',
    time: '10h sáng',
    description: 'Cho bé uống 120ml sữa tươi nguyên chất',
  },
  {
    id: '3',
    time: '10h sáng',
    description: 'Cho bé uống 120ml sữa tươi nguyên chất',
  },
  {
    id: '4',
    time: '10h sáng',
    description: 'Cho bé uống 120ml sữa tươi nguyên chất',
  },
];

export default function ActivityLogScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.activityItem}>
      <View>
        <Text style={styles.activityTime}>{item.time}</Text>
        <Text style={styles.activityDesc}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhật ký của Mie</Text>
        <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#222" />
      </View>
      <Text style={styles.sectionTitle}>Các hoạt động</Text>
      {/* Activity List */}
      <View style={styles.activityListBox}>
        <FlatList
          data={mockActivities}
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
  sectionTitle: {
    fontSize: 15,
    color: '#222',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 20,
    fontWeight: '500',
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