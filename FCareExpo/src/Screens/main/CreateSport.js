import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import supportApi from '../../utils/supportApi';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_CONFIG } from '../../utils/apiConfig';

export default function SupportScreen() {
  const navigation = useNavigation();
  const user = useSelector(state => state.user.user);
  const [title, setTitle] = useState('');
  const [messege, setMessege] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 5,
    });
    if (!result.canceled && result.assets) {
      setImages([...images, ...result.assets.map(a => a.uri)]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !messege.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề và nội dung!');
      return;
    }
    setLoading(true);
    try {
      // Upload ảnh trước nếu có
      let uploadedImages = [];
      if (images.length > 0) {
        for (let uri of images) {
          const formData = new FormData();
          formData.append('image', {
            uri,
            type: 'image/jpeg',
            name: 'support.jpg',
          });
          const response = await axios.post(`${API_CONFIG.baseURL}/images/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (response.data && response.data.url) {
            uploadedImages.push(response.data.url);
          } else {
            Alert.alert('Lỗi', 'Không nhận được url ảnh từ server!');
          }
        }
      }
      // Gửi ticket
      const res = await supportApi.createSupportTicket({
        user_id: user._id,
        title,
        messege,
        images: uploadedImages,
      });
      if (res && res._id) {
        Alert.alert('Thành công', 'Đã gửi yêu cầu hỗ trợ!');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Gửi yêu cầu thất bại!');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi yêu cầu!');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hỗ trợ</Text>
        <Ionicons name="chatbubbles-outline" size={28} color="#222" />
  
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tiêu đề hỗ trợ"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Nội dung hỗ trợ</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Nhập nội dung cần hỗ trợ"
          value={messege}
          onChangeText={setMessege}
          multiline
        />
        <Text style={styles.label}>Ảnh chi tiết (tối đa 5 ảnh)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
          {images.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.imageThumb} />
          ))}
          {images.length < 5 && (
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
              <Ionicons name="add" size={28} color="#3B5BFE" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitBtnText}>{loading ? 'Đang gửi...' : 'Gửi hỗ trợ'}</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  label: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 8,
  },
  imageThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  addImageBtn: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#E8EDFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  submitBtn: {
    backgroundColor: '#3B5BFE',
    borderRadius: 24,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 