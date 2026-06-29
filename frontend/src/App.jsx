import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Messenger from './pages/Messenger';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import OAuth2Callback from './pages/OAuth2Callback';
import GalaxyBackground from './components/Background/GalaxyBackground';
import ProtectedRoute from './components/Common/ProtectedRoute';
import './styles/base.css';
import './styles/responsive.css';
import api from './services/api';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem('autoLogin');
    setUser(null);
    navigate('/login');
  };

  const handleAuthSuccess = async () => {
    const me = await api.me();
    if (me) {
      setUser(me);
    }
    navigate('/');
  };

  // Restores session/authentication on load or refresh
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await api.me();
        if (mounted) {
          if (me) {
            setUser(me);
          } else {
            setUser(null);
          }
        }
      } catch (e) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Sync dark mode with localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (loadingAuth) {
    return <div className="loading" style={{ color: '#fff', textAlign: 'center', marginTop: '20%' }}>Loading...</div>;
  }

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      {isAuthRoute && <GalaxyBackground isDark={isDark} />}
      <div className="app-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage isDark={isDark} onToggleDark={() => setIsDark(!isDark)} initialMode="login" onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <AuthPage isDark={isDark} onToggleDark={() => setIsDark(!isDark)} initialMode="register" onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/oauth2/success" element={<OAuth2Callback onAuthSuccess={handleAuthSuccess} />} />
          
          <Route path="/" element={
            <ProtectedRoute user={user} loadingAuth={loadingAuth}>
              <FeedPage
                userId={user?.userId || user?.id}
                isDark={isDark}
                setIsDark={setIsDark}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } />

          <Route path="/messenger" element={
            <ProtectedRoute user={user} loadingAuth={loadingAuth}>
              <Messenger />
            </ProtectedRoute>
          } />

          <Route path="/profile/:username" element={
            <ProtectedRoute user={user} loadingAuth={loadingAuth}>
              <ProfilePage user={user} />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
