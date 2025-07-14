import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput, Image, ActivityIndicator, Modal } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import postApi from '../../utils/postApi';
import { useSelector } from 'react-redux';

const FILTERS = [
  { label: 'Cộng đồng', value: 'community' },
  { label: 'Gia đình', value: 'family' },
];

export default function PostListScreen({navigation}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useSelector(state => state.user.user);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchPosts = async () => {
        setLoading(true);
        let res = [];
        if (filter.value === 'community') {
          res = await postApi.getAllPosts({ visibility: 'community' });
        } else if (filter.value === 'family') {
          if (!user || !user._id) {
            setPosts([]);
            setLoading(false);
            return;
          }
          // Lấy tất cả bài viết family, lọc ở FE theo user_id
          res = await postApi.getAllPosts({ visibility: 'family' });
        }
        if (isActive && Array.isArray(res)) {
          setPosts(res);
        } else if (isActive) {
          setPosts([]);
        }
        setLoading(false);
      };
      fetchPosts();
      return () => { isActive = false; };
    }, [user, filter])
  );

  // Lọc lại ở FE cho family/community: chỉ hiển thị bài viết family của user chính và các tài khoản phụ, và community đã duyệt
  const filteredPosts = React.useMemo(() => {
    if (filter.value === 'family' && user) {
      return posts.filter(
        post => post.user_id && (post.user_id._id === user._id || post.user_id.parent_id === user._id || post.user_id._id === user.parent_id)
      );
    }
    if (filter.value === 'community') {
      return posts.filter(post => post.visibility === 'community' && post.status === 'approved');
    }
    return posts;
  }, [posts, filter, user]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: item._id })}>
      <View style={styles.postCard}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.postImage} />
        ) : (
          <View style={[styles.postImage, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}> 
            <MaterialCommunityIcons name="image-off-outline" size={40} color="#bbb" />
          </View>
        )}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postMeta}>
            {item.user_id?.name ? item.user_id.name : 'Ẩn danh'} - {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
          </Text>
          <Text style={styles.postSummary} numberOfLines={2}>{item.content}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.sectionTitle}>{filter.label === 'community' ? 'Bài viết cộng đồng' : 'Bài viết gia đình'}</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowDropdown(true)}>
          <Text style={styles.filterText}>{filter.label}</Text>
          <Ionicons name="chevron-down" size={16} color="#222" />
        </TouchableOpacity>
      </View>
      {/* Dropdown */}
      <Modal visible={showDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdownMenu}>
            {FILTERS.map(opt => (
              <TouchableOpacity key={opt.value} style={styles.dropdownItem} onPress={() => { setFilter(opt); setShowDropdown(false); }}>
                <Text style={{ color: filter.value === opt.value ? '#3B5BFE' : '#222', fontWeight: filter.value === opt.value ? 'bold' : 'normal' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Post List */}
      {loading ? (
        <ActivityIndicator size="large" color="#3B5BFE" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* Button */}
      <TouchableOpacity style={styles.addButton}
      onPress={() => navigation.navigate("AddPost")}> 
        <Text style={styles.addButtonText}>Tạo bài viết mới</Text>
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
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
}); 