import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import postApi from '../../utils/postApi';
import apiService from '../../utils/apiService';
import { API_ENDPOINTS } from '../../utils/apiConfig';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AddPostScreen = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('community');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Hàm upload ảnh lên server
  const uploadToServer = async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'post.jpg',
    });
    try {
      const response = await axios.post(
        apiService.baseURL + API_ENDPOINTS.CREATE_POST.replace('/posts', '/images/upload'),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        Alert.alert('Lỗi', 'Không nhận được url ảnh từ server!');
        return '';
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể upload ảnh.');
      console.log('Upload image error:', err);
      return '';
    }
  };

  // Chọn ảnh và upload lên server
  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (pickerResult.cancelled) return;
    const localUri = pickerResult.assets ? pickerResult.assets[0].uri : pickerResult.uri;
    setUploading(true);
    const url = await uploadToServer(localUri);
    setUploading(false);
    if (url) setImages([...images, url]);
  };

  // Xóa ảnh khỏi danh sách
  const removeImage = (url) => {
    setImages(images.filter(img => img !== url));
  };

  // Đăng bài viết
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }
    if (!user || !user._id) {
      Alert.alert('Lỗi', 'Không xác định được người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    setSubmitting(true);
    const user_id = user._id;
    // Xác định status theo visibility
    let status = 'pending';
    if (visibility === 'family') {
      status = 'approved';
    } else if (visibility === 'community') {
      status = 'pending';
    }
    const postData = {
      user_id,
      title,
      content,
      visibility,
      images
      // Không truyền status lên server
    };
    console.log('Images gửi lên:', images);
    console.log('postData gửi lên:', postData);
    const res = await postApi.createPost(postData);
    setSubmitting(false);
    if (res && res._id) {
      if (visibility === 'community') {
        Alert.alert('Thành công', 'Bài viết đang chờ duyệt!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Thành công', 'Đăng bài viết thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } else {
      Alert.alert('Lỗi', res?.error || 'Không đăng được bài viết');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.header}>Tạo bài viết mới</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phạm vi đăng bài</Text>
        <View style={styles.selectBox}>
          <TouchableOpacity onPress={() => setVisibility('family')} style={[styles.selectOption, visibility === 'family' && styles.selectedOption]}>
            <Text style={visibility === 'family' ? styles.selectedText : styles.optionText}>Gia đình</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVisibility('community')} style={[styles.selectOption, visibility === 'community' && styles.selectedOption]}>
            <Text style={visibility === 'community' ? styles.selectedText : styles.optionText}>Cộng đồng</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Tiêu đề bài viết</Text>
        <TextInput
          style={styles.input}
          placeholder="vd Cách cho trẻ ăn"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Ảnh tiêu đề bài viết</Text>
        <View style={styles.imageRow}>
          {images.map((img, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.image} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(img)}>
                <Text style={{ color: 'red', fontSize: 12 }}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={pickImage} style={styles.addImageBtn}>
            {uploading ? <ActivityIndicator size="small" color="#007bff" /> : <Text style={styles.addImageText}>Thêm ảnh</Text>}
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Nội dung bài viết</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Nhập nội dung bài viết"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
        />
      </View>
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Đăng bài viết</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
    marginTop:20,
  },
  formGroup: {
    backgroundColor: '#fafbfc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
  },
  selectBox: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  selectOption: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#007bff',
    backgroundColor: '#e6f0ff',
  },
  optionText: {
    color: '#333',
  },
  selectedText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addImageBtn: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f0f8ff',
  },
  addImageText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    minHeight: 100,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPostScreen; 