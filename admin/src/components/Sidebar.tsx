import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';

const menuItems = [
  { label: 'Dashboard', icon: '🏠' },
  { label: 'Quản lý tài khoản', icon: '👤' },
  { label: 'Quản lý giao dịch', icon: '💳' },
  { label: 'Kiểm duyệt đăng bài', icon: '📝' },
  { label: 'Quản lý yêu cầu hỗ trợ', icon: '🛠️' },
  { label: 'Thống kê', icon: '📊' },
];

const Sidebar: React.FC<{ onMenuClick: (label: string) => void; selectedPage: string }> = ({ onMenuClick, selectedPage }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div style={{
      width: 240,
      background: '#fff',
      minHeight: '100vh',
      boxShadow: '2px 0 8px rgba(255, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0
    }}>
      <div>
        <div style={{ padding: 24, borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
          <img src={logo} alt="FMCarer" style={{ width: 58, height: 48 }} />
        </div>
        <div>
          {menuItems.map(item => {
            const isSelected = selectedPage === item.label;
            return (
              <div
                key={item.label}
                onClick={() => onMenuClick(item.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 32px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 15,
                  color: isSelected ? '#1976d2' : '#222',
                  background: isSelected ? '#e3eafc' : 'transparent',
                  borderLeft: isSelected ? '4px solid #1976d2' : '4px solid transparent',
                  transition: 'background 0.2s, color 0.2s, border-left 0.2s',
                }}
                className="sidebar-menu-item"
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: 24, borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={user?.avatar || logo} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{user?.role || 'Admin'}</div>
          </div>
        </div>
        <div onClick={handleLogout} style={{ marginTop: 24, color: '#dc3545', cursor: 'pointer', fontWeight: 500 }}>
          Đăng xuất
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 