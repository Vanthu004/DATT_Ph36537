import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SupportDetailScreen({ navigation,route}) {
  const { ticket } = route.params || {};
  if (!ticket) return <View style={styles.container}><Text>Không tìm thấy phiếu hỗ trợ</Text></View>;

  // Giả sử các trường phản hồi là: resolved_by (object), response_message, response_images (array)
  // Nếu backend chưa có, bạn có thể điều chỉnh lại tên trường cho phù hợp

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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
    <Text style={styles.title}>Nội dung người dùng gửi</Text>
      {/* Tiêu đề */}
      
      {/* Nội dung */}
      <Text style={styles.label}>Nội dung yêu cầu</Text>
      <Text style={{fontSize:20}}>{ticket.title}</Text>
      <Text style={styles.content}>{ticket.messege}</Text>
      {/* Ảnh đính kèm */}
      {ticket.images && ticket.images.length > 0 && (
        <View style={styles.imageRow}>
          {ticket.images.map((img, idx) => (
            <Image key={idx} source={{ uri: img }} style={styles.image} />
          ))}
        </View>
      )}
      {/* Đường kẻ */}
      <View style={styles.divider} />
      <Text style={styles.title}>Nội dung người giải quyết</Text>
      {/* Người giải quyết */}
      <Text style={styles.label}>Người giải quyết</Text>
      <Text style={styles.resolver}>{ticket.resolved_by ? (ticket.resolved_by.name || ticket.resolved_by.email || 'Chưa có') : 'Chưa có'}</Text>
      {/* Nội dung phản hồi */}
      <Text style={styles.label}>Nội dung phản hồi</Text>
      <Text style={styles.response}>{ticket.response_message || 'Chưa có phản hồi'}</Text>
      {/* Ảnh phản hồi */}
      {ticket.response_images && ticket.response_images.length > 0 && (
        <View style={styles.imageRow}>
          {ticket.response_images.map((img, idx) => (
            <Image key={idx} source={{ uri: img }} style={styles.image} />
          ))}
        </View>
      )}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#3B5BFE',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 4,
  },
  content: {
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  resolver: {
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
  },
  response: {
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
  },
}); 