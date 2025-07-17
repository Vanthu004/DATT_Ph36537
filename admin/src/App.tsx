import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css';
import PostApprovalDetailPage from './pages/PostApprovalDetailPage';
import SupportRequestDetailPage from './pages/SupportRequestDetailPage';

const MainScreen: React.FC = () => {
  const [selectedPage, setSelectedPage] = React.useState('Dashboard');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8fa' }}>
      <Sidebar onMenuClick={setSelectedPage} selectedPage={selectedPage} />
      <div style={{ marginLeft: 240, flex: 1 }}>
        <Dashboard selectedPage={selectedPage} />
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}>Đang tải...</div>;
  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><MainScreen /></ProtectedRoute>} />
    <Route path="/approvals/:postId" element={<ProtectedRoute><PostApprovalDetailPage /></ProtectedRoute>} />
    <Route path="/support-requests/:requestId" element={<ProtectedRoute><SupportRequestDetailPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
