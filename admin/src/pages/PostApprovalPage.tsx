import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPostApprovals, approvePost } from '../services/postService';
import type { PostApproval } from '../interface/PostApproval';
import './PostApprovalPage.css';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chưa giải quyết', color: '#ff9800' },
  approved: { label: 'Tán thành', color: '#4caf50' },
  rejected: { label: 'Vật bị loại', color: '#f44336' },
};

const PostApprovalPage: React.FC = () => {
  const [posts, setPosts] = useState<PostApproval[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchApprovals = async () => {
    setLoading(true);
    const res = await getAllPostApprovals();
    console.log('API DATA:', res);
    if (res && Array.isArray(res)) {
      setPosts(res.map((item: any) => ({
        id: item._id,
        author: item.approved_by?.name || 'Ẩn danh',
        content: item.post_id?.title || 'Không có tiêu đề', // Nếu chỉ có title, hiển thị title
        status: item.status,
        createdAt: item.approved_at || '',
      })));
    } else if (res && res.data && Array.isArray(res.data)) {
      setPosts(res.data.map((item: any) => ({
        id: item._id,
        author: item.approved_by?.name || 'Ẩn danh',
        content: item.post_id?.title || 'Không có tiêu đề',
        status: item.status,
        createdAt: item.approved_at || '',
      })));
    } else {
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id: string) => {
    await approvePost(id, 'approved');
    fetchApprovals();
  };
  const handleReject = async (id: string) => {
    await approvePost(id, 'rejected');
    fetchApprovals();
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.status === filter);

  return (
    <div className="approval-container">
      <h2>Kiểm duyệt bài đăng cộng đồng</h2>
      <div className="approval-toolbar">
        <input className="approval-search" placeholder="Tìm kiếm bài viết theo ID hoặc tác giả" />
        <select className="approval-filter" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Tất cả các trạng thái</option>
          <option value="pending">Chưa giải quyết</option>
          <option value="approved">Tán thành</option>
          <option value="rejected">Bị từ chối</option>
        </select>
      </div>
      <div className="approval-table-wrapper">
        <table className="approval-table">
          <thead>
            <tr>
              <th>ID PHIẾU DUYỆT</th>
              <th>ADMIN DUYỆT</th>
              <th>TIÊU ĐỀ BÀI ĐĂNG</th>
              <th>TRẠNG THÁI</th>
              <th>NGÀY DUYỆT</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : filteredPosts.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
            ) : filteredPosts.map(post => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.author}</td>
                <td style={{ maxWidth: 220, whiteSpace: 'pre-line' }}>{post.content}</td>
                <td>
                  <span className="approval-status" style={{ background: statusMap[post.status].color }}>
                    {statusMap[post.status].label}
                  </span>
                </td>
                <td>{post.createdAt ? post.createdAt.slice(0, 10) : ''}</td>
                <td>
                  <button className="approval-action view" onClick={() => navigate(`/approvals/${post.id}`)}>Xem</button>
                  <button className="approval-action approve" onClick={() => handleApprove(post.id)} disabled={post.status !== 'pending'}>Chấp thuận</button>
                  <button className="approval-action reject" onClick={() => handleReject(post.id)} disabled={post.status !== 'pending'}>Từ chối</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostApprovalPage; 