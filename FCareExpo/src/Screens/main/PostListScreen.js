import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const mockPosts = [
  {
    id: '1',
    title: 'Hiểu về sự phát triển của trẻ em',
    author: 'Bởi văn thư',
    time: '2 ngày trước',
    summary: 'Tìm hiểu về chu kỳ của em bé qua các giai đoạn khác nhau trong thời gian cần xử lý với các quy trình khác nhau ....',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    title: 'Hiểu về sự phát triển của trẻ em',
    author: 'Bởi văn thư',
    time: '2 ngày trước',
    summary: 'Tìm hiểu về chu kỳ của em bé qua các giai đoạn khác nhau trong thời gian cần xử lý với các quy trình khác nhau ....',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
];

export default function PostListScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Cộng đồng');

  const renderItem = ({ item }) => (
    <View style={styles.postCard}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postMeta}>{item.author} - {item.time}</Text>
        <Text style={styles.postSummary}>{item.summary}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài viết</Text>
        <Ionicons name="add-circle-outline" size={26} color="#222" />
      </View>
      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#888" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài viết"
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Filter */}
      <View style={styles.filterRow}>
        <Text style={styles.sectionTitle}>Bài viết gần đây</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>{filter}</Text>
          <Ionicons name="chevron-down" size={16} color="#222" />
        </TouchableOpacity>
      </View>
      {/* Post List */}
      <FlatList
        data={mockPosts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    marginLeft: 8,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterText: {
    fontSize: 13,
    color: '#222',
    marginRight: 2,
  },
  postCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 12,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  postMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  postSummary: {
    fontSize: 13,
    color: '#444',
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