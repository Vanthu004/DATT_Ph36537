import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApprovalById, getPostById, approvePost, deletePost, deletePostApproval } from '../services/postService';

interface PostDetail {
  _id: string;
  author: string;
  createdAt: string;
  status: string;
  content: string;
  images?: string[];
  note?: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chưa giải quyết', color: '#ff9800' },
  approved: { label: 'Chấp nhận', color: '#1890ff' },
  rejected: { label: 'Từ chối', color: '#ff4d4f' },
};

const PostApprovalDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'approved' | 'rejected' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Xóa bài viết
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [postRawId, setPostRawId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      setLoading(true);
      const approval = await getApprovalById(postId);
      let postData: any = {};
      let rawId = null;
      if (approval && approval.post_id && typeof approval.post_id === 'object') {
        if (approval.post_id.content && approval.post_id.created_at && approval.post_id.user_id) {
          postData = approval.post_id;
          rawId = approval.post_id._id;
        } else if (approval.post_id._id) {
          const detail = await getPostById(approval.post_id._id);
          postData = detail;
          rawId = approval.post_id._id;
        }
      }
      setPost({
        _id: approval._id,
        author: postData.user_id?.name || postData.user_id || 'Ẩn danh',
        createdAt: postData.created_at || '',
        status: approval.status,
        content: postData.content || postData.title || '',
        images: postData.images || [],
        note: approval.note || '',
      });
      setPostRawId(rawId);
      setLoading(false);
    };
    fetchData();
  }, [postId]);

  const handleOpenDialog = (type: 'approved' | 'rejected') => {
    setDialogType(type);
    setFeedback('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
    setFeedback('');
  };

  const handleSubmit = async () => {
    if (!postId || !dialogType) return;
    setSubmitting(true);
    await approvePost(postId, dialogType, feedback); // feedback sẽ lưu vào note
    setSubmitting(false);
    setDialogOpen(false);
    setDialogType(null);
    setFeedback('');
    window.location.reload();
  };

  // Xử lý xóa bài viết
  const handleDelete = async () => {
    if (!postRawId || !postId) return;
    setDeleting(true);
    setErrorMessage(null);
    // Xóa bài viết trước
    const postResult = await deletePost(postRawId);
    if (postResult?.success === false) {
      setErrorMessage(postResult.message || 'Xóa bài viết thất bại.');
      setDeleting(false);
      return;
    }
    // Xóa record PostApproval
    const approvalResult = await deletePostApproval(postId);
    if (approvalResult?.success === false) {
      setErrorMessage(approvalResult.message || 'Xóa kiểm duyệt thất bại.');
      setDeleting(false);
      return;
    }
    setDeleting(false);
    setDeleteDialog(false);
    navigate(-1); // Quay lại sau khi xóa
  };

  const handleBack = () => {
    navigate('/post-approval');
  };

  if (loading) return <div>Đang tải...</div>;
  if (!post) return <div>Không tìm thấy bài đăng</div>;

  const author = post.author || '@user_alpha';
  const createdAt = post.createdAt ? post.createdAt.slice(0, 10) : '2023-10-25';
  const status = post.status || 'pending';
  const statusInfo = statusMap[status] || statusMap['pending'];

  return (
    <div style={{ padding: 32, background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={handleBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&larr;</button>
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
        {/* Hiển thị ảnh nếu có */}
        {post.images && post.images.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            {post.images.map((img, idx) => (
              <img key={idx} src={img} alt={`Ảnh ${idx + 1}`} style={{ maxHeight: 180, borderRadius: 8, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
            ))}
          </div>
        )}
        <div style={{ margin: '24px 0 0 0' }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Nội dung bài đăng</div>
          <div style={{ fontSize: 15, color: '#222', background: '#fff', borderRadius: 8, padding: 12, minHeight: 60 }}>{post.content}</div>
        </div>
        {/* Hiển thị phản hồi của admin nếu có */}
        {post.status !== 'pending' && post.note && (
          <div style={{ margin: '24px 0 0 0' }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Phản hồi của admin</div>
            <div style={{ fontSize: 15, color: '#1890ff', background: '#f0f7ff', borderRadius: 8, padding: 12 }}>{post.note}</div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 32 }}>
          <button onClick={() => setDeleteDialog(true)} style={{ border: '1px solid #ff4d4f', background: '#fff', color: '#ff4d4f', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>🗑️</span> Xóa
          </button>
          {status === 'pending' && (
            <>
              <button onClick={() => handleOpenDialog('approved')} style={{ background: '#1890ff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15 }}>Chấp thuận</button>
              <button onClick={() => handleOpenDialog('rejected')} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15 }}>Từ chối</button>
            </>
          )}
        </div>
      </div>
      {/* Dialog phản hồi */}
      {dialogOpen && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: 0, marginBottom: 16, fontWeight: 700, fontSize: 20 }}>
              {dialogType === 'approved' ? 'Phản hồi khi chấp thuận' : 'Phản hồi khi từ chối'}
            </h3>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Nhập phản hồi cho người dùng..."
              rows={5}
              style={{ width: '100%', borderRadius: 8, border: '1px solid #ccc', padding: 10, fontSize: 15, resize: 'vertical', marginBottom: 18 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={handleCloseDialog} style={{ padding: '7px 18px', borderRadius: 8, border: '1px solid #bbb', background: '#fff', color: '#222', fontWeight: 500, fontSize: 15 }}>Hủy</button>
              <button onClick={handleSubmit} disabled={submitting} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: dialogType === 'approved' ? '#1890ff' : '#ff4d4f', color: '#fff', fontWeight: 500, fontSize: 15 }}>
                {submitting ? 'Đang gửi...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Dialog xác nhận xóa */}
      {deleteDialog && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: 0, marginBottom: 16, fontWeight: 700, fontSize: 20, color: '#ff4d4f' }}>Xác nhận xóa bài viết</h3>
            <div style={{ marginBottom: 18, color: '#222', fontSize: 15 }}>Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</div>
            {errorMessage && <div style={{ color: '#ff4d4f', marginBottom: 12 }}>{errorMessage}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setDeleteDialog(false)} style={{ padding: '7px 18px', borderRadius: 8, border: '1px solid #bbb', background: '#fff', color: '#222', fontWeight: 500, fontSize: 15 }}>Hủy</button>
              <button onClick={handleDelete} disabled={deleting} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: '#ff4d4f', color: '#fff', fontWeight: 500, fontSize: 15 }}>
                {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostApprovalDetailPage; 