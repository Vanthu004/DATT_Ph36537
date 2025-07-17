import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSupportTicketById, resolveSupportTicket } from '../services/supportService';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../services/authService';

interface SupportTicketDetail {
  _id: string;
  user_id: { name: string; email: string } | string;
  title: string;
  messege: string;
  status: string;
  created_at: string;
  updated_at?: string;
  type?: string;
  note?: string;
  images?: string[]; // Add images field
  resolved_by?: { _id: string; name: string; email: string }; // Add resolved_by field
  response_message?: string; // Add response_message field
}

const statusMap: Record<string, { label: string; color: string }> = {

  resolved: { label: 'Đã giải quyết', color: '#4caf50' },
  processing: { label: 'Đang tiến hành', color: '#1890ff' },
};

const SupportRequestDetailPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!requestId) return;
      setLoading(true);
      const res = await getSupportTicketById(requestId);
      let data = res?.data || res;
      setTicket(data);
      setLoading(false);
    };
    fetchDetail();
  }, [requestId]);

  if (loading) return <div>Đang tải...</div>;
  if (!ticket) return <div>Không tìm thấy yêu cầu hỗ trợ</div>;

  const userName = typeof ticket.user_id === 'object' ? `@${ticket.user_id.name}` : ticket.user_id;
  const createdAt = ticket.created_at ? ticket.created_at.slice(0, 16).replace('T', ' ') : '';
  const statusInfo = statusMap[ticket.status] || statusMap['processing'];

  const handleResolve = async () => {
    console.log('B1: Bắt đầu handleResolve');
    const currentUser = getCurrentUser();
    const adminId = currentUser?._id || currentUser?.id;
    if (!adminId) {
      console.log('B2: Không có user._id hoặc user.id');
      setError('Không xác định được tài khoản admin!');
      return;
    }
    if (!ticket) {
      console.log('B3: Không có ticket');
      return;
    }
    setSubmitting(true);
    setError(null);
    console.log('B4: Trước khi gọi API', ticket._id, adminId, responseMessage);
    const res = await resolveSupportTicket(ticket._id, adminId, responseMessage);
    console.log('B5: API response:', res);
    // Sửa điều kiện kiểm tra lỗi
    if (res && res.message && res.status && res.status !== 200) {
      setError(res.message);
      setSubmitting(false);
      return;
    }
    if (res && res.message && !res._id) { // Nếu trả về lỗi dạng object
      setError(res.message);
      setSubmitting(false);
      return;
    }
    setTicket({ ...ticket, status: 'resolved', resolved_by: currentUser, response_message: responseMessage });
    setSubmitting(false);
    setResolveDialogOpen(false);
    setResponseMessage('');
  };

  return (
    <div style={{ padding: 32, background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&larr;</button>
        <h2 style={{ fontWeight: 700, fontSize: 24, margin: 0 }}>
          Chi tiết yêu cầu hỗ trợ: <span style={{ letterSpacing: 2 }}>{ticket._id}</span>
        </h2>
      </div>
      <div style={{ background: '#f5f6f7', borderRadius: 16, padding: 28, maxWidth: 950, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>ID YÊU CẦU</div>
            <div style={{ fontWeight: 600, fontSize: 16, letterSpacing: 1 }}># {ticket._id}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>NGƯỜI DÙNG</div>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 16 }}>
              <span style={{ marginRight: 6, fontSize: 18 }}>👤</span>{userName}
            </div>
          </div>
          {/* <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>LOẠI</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{ticket.type || 'Kỹ thuật'}</div>
          </div> */}
          <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>NGÀY GỬI</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{createdAt}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>TRẠNG THÁI</div>
            <span style={{ background: statusInfo.color, color: '#fff', borderRadius: 8, padding: '4px 16px', fontWeight: 600, fontSize: 15 }}>{statusInfo.label}</span>
          </div>
        </div>
        <div style={{ margin: '24px 0 0 0' }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Chủ đề</div>
          <div style={{ fontSize: 15, color: '#222', background: '#fff', borderRadius: 8, padding: 12, minHeight: 40 }}>{ticket.title}</div>
        </div>
        <div style={{ margin: '24px 0 0 0' }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Mô tả</div>
          <div style={{ fontSize: 15, color: '#222', background: '#fff', borderRadius: 8, padding: 12, minHeight: 60 }}>{ticket.messege}</div>
        </div>
        {/* Hiển thị ảnh đính kèm nếu có */}
        {ticket.images && ticket.images.length > 0 && (
          <div style={{ margin: '24px 0 0 0' }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Ảnh đính kèm</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {ticket.images.map((img, idx) => (
                <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                  <img src={img} alt={`support-img-${idx}`} style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, boxShadow: '0 2px 8px #0001', objectFit: 'cover' }} />
                </a>
              ))}
            </div>
          </div>
        )}
        {/* Ghi chú & giao tiếp */}
        {/* <div style={{ margin: '24px 0 0 0' }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Ghi chú & Giao tiếp</div>
          <div style={{ fontSize: 15, color: '#888', background: '#f0f7ff', borderRadius: 8, padding: 12, minHeight: 40 }}>
            {ticket.note || 'Chưa có ghi chú.'}
          </div>
        </div> */}
        {/* Nút hành động */}
        <div style={{ display: 'flex', gap: 16, marginTop: 32,justifyContent:'center'}}>
          <button
            style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15 }}
            onClick={() => setResolveDialogOpen(true)}
            disabled={ticket.status === 'resolved'}
          >
            Giải quyết yêu cầu
          </button>
          <button style={{ background: '#ff9800', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15 }}>Đóng yêu cầu</button>
          {/* <button style={{ background: '#ff7043', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15 }}>Leo thang</button> */}
        </div>
        {/* Dialog giải quyết yêu cầu */}
        {resolveDialogOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: '90vw', boxShadow: '0 4px 24px #0002' }}>
              <h3 style={{ margin: 0, marginBottom: 18 }}>Giải quyết yêu cầu hỗ trợ</h3>
              <div style={{ marginBottom: 16 }}>
                <textarea
                  value={responseMessage}
                  onChange={e => setResponseMessage(e.target.value)}
                  placeholder="Nhập nội dung giải quyết..."
                  style={{ width: '100%', minHeight: 80, borderRadius: 8, border: '1px solid #ccc', padding: 10, fontSize: 15 }}
                  disabled={submitting}
                />
              </div>
              {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setResolveDialogOpen(false)} style={{ padding: '7px 18px', borderRadius: 8, border: '1px solid #bbb', background: '#fff', color: '#222', fontWeight: 500, fontSize: 15 }} disabled={submitting}>Hủy</button>
                <button
                  onClick={() => { console.log('CLICK BUTTON'); handleResolve(); }}
                  style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: '#4caf50', color: '#fff', fontWeight: 500, fontSize: 15 }}
                  disabled={submitting || !responseMessage.trim()}
                >
                  {submitting ? 'Đang gửi...' : 'Xác nhận giải quyết'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportRequestDetailPage; 