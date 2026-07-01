import React, { useState } from 'react';
import { Mail, Key, Lock } from 'lucide-react';
import api from '../../services/api';
import '../../styles/form.css';

export default function ForgotPwdForm({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify & Reset
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', message: 'Vui lòng nhập địa chỉ email.' });
      return;
    }
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.forgotPassword(email, 'EMAIL');
      setStatus({ type: 'success', message: 'OTP đã được gửi đến email của bạn!' });
      setStep(2);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data || 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setStatus({ type: 'error', message: 'Vui lòng nhập mã OTP và mật khẩu mới.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
      return;
    }
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.resetPassword(email, 'EMAIL', otp, newPassword);
      setStatus({ type: 'success', message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.' });
      setTimeout(() => onBackToLogin(), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data || 'OTP không hợp lệ hoặc đã hết hạn.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container forgot-pwd-form" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', maxWidth: '400px', margin: 'auto' }}>
      {/* Brand logo matching image 4 */}
      <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <svg viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
          <polygon points="12,2 2,12 9,12 9,22 15,22 15,12 22,12" style={{ fill: '#10b981' }} />
        </svg>
        <span className="brand-text" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1064ea' }}>Sociala.</span>
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
        {step === 1 ? 'Forgot Password' : 'Reset Password'}
      </h2>
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
        {step === 1 ? 'Enter your email address to receive an OTP.' : 'Enter the OTP and your new password.'}
      </p>

      {status.message && (
        <div className={`status-msg ${status.type}`} style={{ padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', textAlign: 'center', backgroundColor: status.type === 'error' ? '#fde8e8' : '#def7ec', color: status.type === 'error' ? '#e13838' : '#03543f' }}>
          {status.message}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <div className="form-group" style={{ position: 'relative', marginBottom: '20px' }}>
            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '30px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', borderRadius: '30px', border: 'none', backgroundColor: '#1064ea', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', marginBottom: '16px' }}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="form-group" style={{ position: 'relative', marginBottom: '16px' }}>
            <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '30px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div className="form-group" style={{ position: 'relative', marginBottom: '20px' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '30px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', borderRadius: '30px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', marginBottom: '16px' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onBackToLogin}
          style={{ background: 'none', border: 'none', color: '#1064ea', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
