import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';
import { getAllChildren } from '../services/childService';
import { getAllPosts, getAllPostApprovals } from '../services/postService';
import PostApprovalPage from '../pages/PostApprovalPage';
// TODO: Thêm các service khác nếu cần

const Dashboard: React.FC<{ selectedPage: string }> = ({ selectedPage }) => {
  if (selectedPage === 'Kiểm duyệt đăng bài') {
    return <PostApprovalPage />;
  }
  const [userCount, setUserCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [profit, setProfit] = useState(89000); // Giả lập
  const [pendingPosts, setPendingPosts] = useState(0);
  const [pendingSupports, setPendingSupports] = useState(2040); // Giả lập

  useEffect(() => {
    // Lấy tổng số người dùng
    getAllUsers().then(res => {
      if (res && res.data) setUserCount(res.data.length);
    });
    // Lấy tổng số tài khoản phụ
    getAllChildren().then(res => {
      if (res && res.data) setChildCount(res.data.length);
    });
    // Lấy tổng số bài viết chưa xử lý
    getAllPostApprovals().then(res => {
      if (res && res.data) setPendingPosts(res.data.length);
    });
    // TODO: Lấy số yêu cầu hỗ trợ chưa xử lý từ supportService
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Dashboard</h2>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <DashboardCard
          label="Tổng số người dùng"
          value={userCount.toLocaleString()}
          icon={<span className="dashboard-icon user" />} // Thay icon bằng SVG hoặc icon lib nếu có
          color="#6C63FF"
        />
        <DashboardCard
          label="Tổng tài khoản phụ"
          value={childCount.toLocaleString()}
          icon={<span className="dashboard-icon child" />} 
          color="#FFD600"
        />
        <DashboardCard
          label="Tổng lợi nhuận"
          value={`$${profit.toLocaleString()}`}
          icon={<span className="dashboard-icon profit" />} 
          color="#4CAF50"
        />
        <DashboardCard
          label="Bài viết chưa xử lý"
          value={pendingPosts.toLocaleString()}
          icon={<span className="dashboard-icon post" />} 
          color="#00CFFF"
        />
        <DashboardCard
          label="Yêu cầu hỗ trợ chưa được xử lý"
          value={pendingSupports.toLocaleString()}
          icon={<span className="dashboard-icon support" />} 
          color="#FF7043"
        />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ label, value, icon, color }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: 20,
      minWidth: 220,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 12
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 20
      }}>{icon}</div>
      <span style={{ fontWeight: 600, fontSize: 16 }}>{label}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
  </div>
);

export default Dashboard; 