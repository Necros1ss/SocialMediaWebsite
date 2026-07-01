import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Zap, Video, User, ShoppingBag, Bell, MessageCircle, Settings, Search } from "lucide-react";
import Modal from "./Modal";
import api from "../../services/api";
import "../../styles/searchbar.css";

const Header = ({ userId, onCreatePost, currentView, setCurrentView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate();
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const countData = await api.getUnreadNotificationCount();
        setUnreadCount(countData.count);
      } catch (err) {}
    };
    const fetchUser = async () => {
      try {
        const user = await api.me();
        if (user) setCurrentUser(user);
      } catch (err) {}
    };
    fetchNotifs();
    fetchUser();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async () => {
    if (!showNotifications) {
      try {
        const data = await api.getNotifications(0, 10);
        setNotifications(data.content || []);
      } catch (err) {}
    }
    setShowNotifications(!showNotifications);
  };

  const handleMarkRead = async (notifId) => {
    try {
      await api.markNotificationRead(notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
  };

  const handlePostCreated = () => {
    setModalOpen(false);
    if (onCreatePost) onCreatePost();
  };

  const handleTabClick = (view) => {
    if (setCurrentView) {
      setCurrentView(view);
    } else {
      if (view === "home") {
        navigate("/");
      }
    }
  };

  return (
    <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxSizing: 'border-box', height: '65px' }}>
      {/* Brand logo matching image */}
      <div className="header__left" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => handleTabClick("home")}>
        <svg viewBox="0 0 24 24" style={{ width: '28px', height: '28px', fill: '#10b981' }}>
          <polygon points="12,2 2,12 9,12 9,22 15,22 15,12 22,12" />
        </svg>
        <span className="header__brand" style={{ fontSize: '22px', fontWeight: 'bold', color: '#1064ea', letterSpacing: '-0.5px' }}>Sociala.</span>
      </div>

      {/* Rounded search box matching image */}
      <form className="header__search" onSubmit={handleSearch} style={{ position: 'relative', width: '300px', display: 'flex', alignItems: 'center' }}>
        <Search size={16} style={{ position: 'absolute', left: '16px', color: '#9ca3af' }} />
        <input
          type="text"
          placeholder="Start typing to search.."
          value={searchQuery}
          onChange={async (e) => {
            const query = e.target.value;
            setSearchQuery(query);
            if (query.trim().length > 0) {
              try {
                const results = await api.searchUsers(query);
                setSearchResults(results);
              } catch (err) {
                console.error(err);
              }
            } else {
              setSearchResults([]);
            }
          }}
          className="header__search-input"
          style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: '30px', border: 'none', background: '#f0f2f5', fontSize: '13px', outline: 'none', color: '#1f2937' }}
          aria-label="Search"
        />
        {searchResults.length > 0 && searchQuery && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginTop: '8px', zIndex: 50, maxHeight: '300px', overflowY: 'auto' }}>
            {searchResults.map((user) => (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }} onClick={() => { setSearchQuery(''); setSearchResults([]); handleTabClick("author_profile"); }}>
                <img src={user.profilePictureURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{user.fullName || user.username}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>@{user.username}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Navigation tabs in center */}
      <div className="header__tabs" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button 
          onClick={() => handleTabClick("home")} 
          style={{ background: currentView === "home" ? '#e0f2fe' : 'none', border: 'none', padding: '10px', borderRadius: '50%', color: currentView === "home" ? '#1064ea' : '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
        >
          <Home size={20} />
        </button>
        <button 
          onClick={() => handleTabClick("dashboard")} 
          style={{ background: currentView === "dashboard" ? '#e0f2fe' : 'none', border: 'none', padding: '10px', borderRadius: '50%', color: currentView === "dashboard" ? '#1064ea' : '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Zap size={20} />
        </button>
        <button 
          onClick={() => handleTabClick("reels")} 
          style={{ background: currentView === "reels" ? '#e0f2fe' : 'none', border: 'none', padding: '10px', borderRadius: '50%', color: currentView === "reels" ? '#1064ea' : '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Video size={20} />
        </button>
        <button 
          onClick={() => handleTabClick("author_profile")} 
          style={{ background: currentView === "author_profile" ? '#e0f2fe' : 'none', border: 'none', padding: '10px', borderRadius: '50%', color: currentView === "author_profile" ? '#1064ea' : '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <User size={20} />
        </button>
        <button 
          onClick={() => handleTabClick("popular_groups")} 
          style={{ background: currentView === "popular_groups" ? '#e0f2fe' : 'none', border: 'none', padding: '10px', borderRadius: '50%', color: currentView === "popular_groups" ? '#1064ea' : '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ShoppingBag size={20} />
        </button>
      </div>

      {/* Right Action Icons */}
      <div className="header__right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button onClick={handleNotificationClick} style={{ background: '#f0f2f5', border: 'none', padding: '8px', borderRadius: '50%', color: '#1064ea', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#f97316', color: '#fff', fontSize: '9px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div style={{ position: 'absolute', top: '100%', right: 0, width: '320px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginTop: '8px', zIndex: 100, maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontWeight: 'bold', fontSize: '15px' }}>Notifications</div>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>No notifications yet.</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} onClick={() => !notif.read && handleMarkRead(notif.id)} style={{ padding: '12px 16px', display: 'flex', gap: '12px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: notif.read ? '#fff' : '#f0fdf4' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#1f2937' }}>
                        <strong>{notif.actor?.username || 'Someone'}</strong> {notif.notificationType.replace('NEW_', '').toLowerCase()}
                      </p>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    {!notif.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', alignSelf: 'center' }}></div>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button onClick={() => navigate("/messenger")} style={{ background: '#f0f2f5', border: 'none', padding: '8px', borderRadius: '50%', color: '#1064ea', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle size={20} />
        </button>
        <button onClick={() => handleTabClick("settings")} style={{ background: '#f0f2f5', border: 'none', padding: '8px', borderRadius: '50%', color: '#1064ea', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={20} />
        </button>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '2px solid #e5e7eb' }} onClick={() => handleTabClick("author_profile")}>
          <img src={currentUser?.profilePictureURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      <Modal
        userId={userId}
        isOpen={modalOpen}
        onClose={handlePostCreated}
      />
    </header>
  );
};

export default Header;
