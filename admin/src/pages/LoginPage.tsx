import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (!data.success) {
        setError(data.message || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }
      const user = data.user || data.data;
      if (user && (user.role === 'admin' || user.role === 'ADMIN')) {
        navigate('/dashboard');
      } else {
        setError('Chỉ tài khoản admin mới được truy cập!');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Đăng nhập tài khoản</h2>
        <p className="login-desc">Nhập email và mật khẩu để tiếp tục</p>
        <label>Địa chỉ email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder=""
          required
        />
        <label>Mật khẩu:</label>
        <div className="password-row">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="checkbox"
            checked={showPassword}
            onChange={e => setShowPassword(e.target.checked)}
            style={{ marginLeft: 8 }}
          />
          <span style={{ marginLeft: 4, fontSize: 13 }}>Nhớ mật khẩu</span>
        </div>
        <div className="login-row">
          <a href="#" style={{ fontSize: 13 }}>Quên mật khẩu?</a>
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <div className="login-bottom">
          Chưa có tài khoản? <a href="#" style={{ color: '#1976d2' }}>Tạo tài khoản</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 