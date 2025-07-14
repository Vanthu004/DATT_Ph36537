import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import postApi from '../../utils/postApi';

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const res = await postApi.getPostById(postId);
      setPost(res);
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#3B5BFE" style={{ marginTop: 40 }} />;
  }
  if (!post) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Không tìm thấy bài viết</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết bài viết</Text>
        <Ionicons name="ellipsis-vertical" size={22} color="#222" />
      </View>
      {/* Ảnh */}
      {post.images && post.images.length > 0 && (
        <Image source={{ uri: post.images[0] }} style={styles.image} />
      )}
      {/* Tiêu đề */}
      <Text style={styles.title}>{post.title}</Text>
      {/* Thông tin người đăng và ngày đăng */}
      <Text style={styles.meta}>
        Được đăng bởi {post.user_id?.name || 'Ẩn danh'} - {post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}
      </Text>
      {/* Nội dung */}
      <Text style={styles.content}>{post.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  content: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
    marginBottom: 30,
  },
});

export default PostDetailScreen; 