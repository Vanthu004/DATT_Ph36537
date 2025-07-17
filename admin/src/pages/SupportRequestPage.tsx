import React, { useEffect, useState } from 'react';
import { getAllSupportTickets } from '../services/supportService';
import './PostApprovalPage.css';
import { useNavigate } from 'react-router-dom';

interface SupportTicket {
  _id: string;
  user_id: { name: string; email: string } | string;
  title: string;
  messege: string;
  status: string;
  created_at: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  // pending: { label: 'Mở', color: '#ff9800' },
  resolved: { label: 'Đã giải quyết', color: '#4caf50' },
  processing: { label: 'Đang tiến hành', color: '#1890ff' },
};

const SupportRequestPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const res = await getAllSupportTickets();
      let data = res?.data || res;
      if (Array.isArray(data)) setTickets(data);
      else setTickets([]);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  // Lọc dữ liệu
  const filteredTickets = tickets.filter(ticket => {
    if (filter !== 'all' && ticket.status !== filter) return false;
    if (search && !(
      ticket._id.toLowerCase().includes(search.toLowerCase()) ||
      (typeof ticket.user_id === 'object' ? ticket.user_id.name : ticket.user_id).toLowerCase().includes(search.toLowerCase())
    )) return false;
    // category filter có thể mở rộng nếu có trường category
    return true;
  });

  return (
    <div className="approval-container">
      <h2>Quản lý yêu cầu hỗ trợ</h2>
      <div className="approval-toolbar">
        <input
          className="approval-search"
          placeholder="Tìm kiếm theo ID yêu cầu hoặc người dùng..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="approval-filter" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Tất cả các trạng thái</option>
          {/* <option value="pending">Mở</option> */}
          <option value="processing">Đang tiến hành</option>
          <option value="resolved">Đã giải quyết</option>
        </select>
        {/* <select className="approval-filter" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">Tất cả các danh mục</option>
          /* Có thể thêm các danh mục cụ thể nếu có *
        </select> */}
      </div>
      <div className="approval-table-wrapper">
        <table className="approval-table">
          <thead>
            <tr>
              <th>Yêu cầu ID</th>
              <th>Người dùng</th>
              <th>Chủ đề</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : filteredTickets.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
            ) : filteredTickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket._id}</td>
                <td>{typeof ticket.user_id === 'object' ? `@${ticket.user_id.name}` : ticket.user_id}</td>
                <td>{ticket.title}</td>
                <td>
                  <span style={{ color: statusMap[ticket.status]?.color || '#222', fontWeight: 600 }}>
                    {statusMap[ticket.status]?.label || ticket.status}
                  </span>
                </td>
                <td>{ticket.created_at ? ticket.created_at.slice(0, 10) : ''}</td>
                <td>
                  <button className="approval-action view" onClick={() => navigate(`/support-requests/${ticket._id}`)}>Xem chi tiết</button>
                  {/* {ticket.status === 'pending' || ticket.status === 'processing' ? (
                    <button className="approval-action approve" style={{ background: '#4caf50', color: '#fff' }}>Giải quyết</button>
                  ) : (
                    <button className="approval-action" style={{ background: '#eee', color: '#222' }}>Đóng</button>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportRequestPage; 