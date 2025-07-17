import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../services/userService';
import './PostApprovalPage.css';

interface UserAccount {
  _id: string;
  email: string;
  name: string;
  role: 'parent_main' | 'parent_sub';
  is_active: boolean;
  is_blocked: boolean;
}

const statusMap: Record<string, { label: string; color: string }> = {
  active: { label: 'Tích cực', color: '#4caf50' },
  blocked: { label: 'Bị cấm', color: '#f44336' },
};

const roleMap: Record<string, string> = {
  parent_main: 'Tài khoản chính',
  parent_sub: 'Tài khoản phụ',
};

const UserAccountPage: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  // Modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockUntil, setBlockUntil] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllUsers();
    let data = res?.data || res;
    if (Array.isArray(data)) {
      data = data.filter((u: any) => u.role === 'parent_main' || u.role === 'parent_sub');
      setUsers(data);
    } else {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = (user: UserAccount) => {
    setSelectedUser(user);
    setBlockReason('');
    setBlockUntil('');
    setShowBlockModal(true);
  };
  const handleBlockConfirm = async () => {
    if (!selectedUser) return;
    await updateUser(selectedUser._id, {
      is_blocked: true,
      block_reason: blockReason,
      block_until: blockUntil ? new Date(blockUntil) : null
    });
    setShowBlockModal(false);
    setSelectedUser(null);
    fetchUsers();
  };
  const handleUnblock = async (user: UserAccount) => {
    await updateUser(user._id, { is_blocked: false, block_reason: '', block_until: null });
    fetchUsers();
  };
  const handleDelete = async (user: UserAccount) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      await deleteUser(user._id);
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'active') return !u.is_blocked;
    if (filter === 'blocked') return u.is_blocked;
    return true;
  }).filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="approval-container">
      <h2>Quản lý tài khoản người dùng</h2>
      <div className="approval-toolbar">
        <input
          className="approval-search"
          placeholder="Tìm kiếm theo Email ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="approval-filter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">Tất cả các trạng thái</option>
          <option value="active">Tích cực</option>
          <option value="blocked">Bị cấm</option>
        </select>
      </div>
      <div className="approval-table-wrapper">
        <table className="approval-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
            ) : filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{roleMap[user.role]}</td>
                <td>
                  <span
                    className="approval-status"
                    style={{ background: user.is_blocked ? statusMap.blocked.color : statusMap.active.color }}
                  >
                    {user.is_blocked ? statusMap.blocked.label : statusMap.active.label}
                  </span>
                </td>
                <td>
                  {user.is_blocked ? (
                    <button className="approval-action approve" onClick={() => handleUnblock(user)}>Mở khóa</button>
                  ) : (
                    <button className="approval-action view" onClick={() => handleBlock(user)}>Khóa</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal nhập lý do và thời gian khóa */}
      {showBlockModal && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <h3>Khóa tài khoản</h3>
            <div style={{ margin: '16px 0' }}>
              <label>Lý do khóa:</label>
              <textarea value={blockReason} onChange={e => setBlockReason(e.target.value)} rows={3} style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, marginTop: 4 }} />
            </div>
            <div style={{ margin: '16px 0' }}>
              <label>Thời gian khóa đến:</label>
              <input type="datetime-local" value={blockUntil} onChange={e => setBlockUntil(e.target.value)} style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, marginTop: 4 }} />
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>(Để trống nếu muốn khóa vĩnh viễn)</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="approval-action" style={{ background: '#eee', color: '#222' }} onClick={() => setShowBlockModal(false)}>Hủy</button>
              <button className="approval-action reject" onClick={handleBlockConfirm}>Xác nhận khóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountPage; 