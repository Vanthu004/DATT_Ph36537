import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApprovalById, approvePost } from '../services/postService';
import { FaUser, FaCalendarAlt, FaChevronLeft } from 'react-icons/fa';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chưa giải quyết', color: '#ff9800' },
  approved: { label: 'Tán thành', color: '#4caf50' },
  rejected: { label: 'Vật bị loại', color: '#f44336' },
};

const PostApprovalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [approval, setApproval] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const res = await getApprovalById(id!);
      setApproval(res);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleApprove = async () => {
    await approvePost(id!, 'approved');
    navigate(-1); // Quay lại trang trước
  };

  const handleReject = async () => {
    await approvePost(id!, 'rejected');
    navigate(-1);
  };

  if (loading) return <div>Đang tải...</div>;
  if (!approval) return <div>Không tìm thấy bài đăng</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: 'transparent', borderRadius: 0, padding: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '32px 0 24px 0' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, marginRight: 12, color: '#222' }}>
          <FaChevronLeft />
        </button>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Chi tiết bài đăng: <span style={{ fontFamily: 'monospace' }}>{approval.post_id?._id || approval._id}</span></h2>
      </div>
      {/* Main Box */}
      <div style={{ background: '#f6f8fa', borderRadius: 20, padding: '32px 36px', marginBottom: 0 }}>
        {/* Info Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>ID BÀI ĐĂNG</div>
            <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 17 }}># {approval.post_id?._id || approval._id}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>TÁC GIẢ</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 17 }}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}><FaUser color="#1976d2" /></span>@{approval.post_id?.user_id?.name || 'Ẩn danh'}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>NGÀY ĐĂNG</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 17 }}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}><FaCalendarAlt color="#1976d2" /></span>{approval.post_id?.created_at?.slice(0, 10) || ''}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>TRẠNG THÁI</div>
            <span style={{
              background: statusMap[approval.status].color,
              color: '#fff',
              borderRadius: 8,
              padding: '7px 22px',
              fontWeight: 700,
              fontSize: 15
            }}>
              {statusMap[approval.status].label}
            </span>
          </div>
        </div>
        {/* Content */}
        <div style={{ margin: '0 0 32px 0' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Nội dung bài đăng</div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 18, fontSize: 16, whiteSpace: 'pre-line', color: '#222', minHeight: 60, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
            {approval.post_id?.content || ''}
          </div>
        </div>
        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button style={{ border: '1px solid #888', borderRadius: 6, padding: '8px 18px', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 15 }}>
            <span role="img" aria-label="edit">✏️</span> Biên tập
          </button>
          <button
            style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 500, fontSize: 15 }}
            onClick={handleApprove}
            disabled={approval.status !== 'pending'}
          >Chấp thuận</button>
          <button
            style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 500, fontSize: 15 }}
            onClick={handleReject}
            disabled={approval.status !== 'pending'}
          >Từ chối</button>
        </div>
      </div>
    </div>
  );
};

export default PostApprovalDetailPage; 