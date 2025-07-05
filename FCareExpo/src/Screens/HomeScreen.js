import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Chào buổi sáng,</Text>
          <Text style={styles.username}>Văn Thư</Text>
        </View>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.avatar}
        />
      </View>

      {/* Welcome Title */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeTitle}>Chào mừng quý phụ huynh!</Text>
        <Text style={styles.welcomeDesc}>
          Quản lý các hoạt động và thói quen chăm sóc con của bạn
        </Text>
      </View>

      {/* Feature Buttons */}
      <View style={styles.featuresRow}>
        <TouchableOpacity style={styles.featureBox}>
          <MaterialCommunityIcons name="notebook-outline" size={36} color="#3B5BFE" />
          <Text style={styles.featureText}>Ghi nhật ký hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureBox}>
          <MaterialCommunityIcons name="bell-outline" size={36} color="#3B5BFE" />
          <Text style={styles.featureText}>Đặt lời nhắc</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.featuresRow}>
        <TouchableOpacity style={styles.featureBox}>
          <MaterialCommunityIcons name="file-document-outline" size={36} color="#3B5BFE" />
          <Text style={styles.featureText}>Đọc bài viết</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureBox}>
          <MaterialCommunityIcons name="wallet-outline" size={36} color="#3B5BFE" />
          <Text style={styles.featureText}>Nạp tiền vào tài khoản</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    color: '#888',
    fontSize: 13,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  welcomeBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
  },
  welcomeDesc: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureBox: {
    flex: 1,
    backgroundColor: '#E6E3E3',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 6,
  },
  featureText: {
    marginTop: 8,
    color: '#222',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 11,
    color: '#222',
    marginTop: 2,
  },
}); 