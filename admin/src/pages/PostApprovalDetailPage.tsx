import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApprovalById, getPostById } from '../services/postService';

interface PostDetail {
  _id: string;
  author: string;
  createdAt: string;
  status: string;
  content: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chưa giải quyết', color: '#ff9800' },
  approved: { label: 'Tán thành', color: '#1890ff' },
  rejected: { label: 'Từ chối', color: '#ff4d4f' },
};

const PostApprovalDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      setLoading(true);
      const approval = await getApprovalById(postId);
      let postData: any = {};
      if (approval && approval.post_id && typeof approval.post_id === 'object') {
        // Nếu đã populate đủ content, created_at, user_id
        if (approval.post_id.content && approval.post_id.created_at && approval.post_id.user_id) {
          postData = approval.post_id;
        } else if (approval.post_id._id) {
          // Gọi tiếp API lấy chi tiết bài đăng
          const detail = await getPostById(approval.post_id._id);
          postData = detail;
        }
      }
      setPost({
        _id: approval._id,
        author: postData.user_id?.name || postData.user_id || 'Ẩn danh',
        createdAt: postData.created_at || '',
        status: approval.status,
        content: postData.content || postData.title || '',
      });
      setLoading(false);
    };
    fetchData();
  }, [postId]);

  if (loading) return <div>Đang tải...</div>;
  if (!post) return <div>Không tìm thấy bài đăng</div>;

  const author = post.author || '@user_alpha';
  const createdAt = post.createdAt ? post.createdAt.slice(0, 10) : '2023-10-25';
  const status = post.status || 'pending';
  const statusInfo = statusMap[status] || statusMap['pending'];

  return (
    <div style={{ padding: 32, background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&larr;</button>
        <h2 style={{ fontWeight: 700, fontSize: 24, margin: 0 }}>Chi tiết bài đăng: <span style={{ letterSpacing: 2 }}>{post._id}</span></h2>
      </div>
      <div style={{ background: '#f5f6f7', borderRadius: 16, padding: 28, maxWidth: 950, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>ID BÀI ĐĂNG</div>
            <div style={{ fontWeight: 600, fontSize: 16, letterSpacing: 1 }}># {post._id}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>TÁC GIẢ</div>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 16 }}>
              <span style={{ marginRight: 6, fontSize: 18 }}>👤</span>{author}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>NGÀY ĐĂNG</div>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 16 }}>
              <span style={{ marginRight: 6, fontSize: 18 }}>📅</span>{createdAt}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>TRẠNG THÁI</div>
            <span style={{ background: statusInfo.color, color: '#fff', borderRadius: 8, padding: '4px 16px', fontWeight: 600, fontSize: 15 }}>{statusInfo.label}</span>
          </div>
        </div>
        <div style={{ margin: '24px 0 0 0' }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Nội dung bài đăng</div>
          <div style={{ fontSize: 15, color: '#222', background: '#fff', borderRadius: 8, padding: 12, minHeight: 60 }}>{post.content}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 32 }}>
          <button style={{ border: '1px solid #bbb', background: '#fff', color: '#222', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>✏️</span> Biên tập
          </button>
          <button style={{ background: '#1890ff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15 }}>Chấp thuận</button>
          <button style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15 }}>Từ chối</button>
        </div>
      </div>
    </div>
  );
};

export default PostApprovalDetailPage; 