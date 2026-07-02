import React from "react";
import { useNavigate } from "react-router-dom";
import { Tv, Award, Globe, Users, User, Mail, MapPin, Calendar, Radio, LogOut } from "lucide-react";
import "../../styles/sidebar.css";

const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
  const navigate = useNavigate();

  const handleNavClick = (view) => {
    if (setCurrentView) {
      setCurrentView(view);
    }
  };

  return (
    <div className="sidebar" style={{ background: '#fff', borderRight: '1px solid #e5e7eb', height: 'calc(100vh - 65px)', padding: '24px 16px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* SECTION 1: New Feeds */}
      <div>
        <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>New Feeds</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            className={`sidebar-item ${currentView === "home" ? "active" : ""}`}
            onClick={() => handleNavClick("home")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "home" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#1064ea', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Tv size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Newsfeed</span>
          </div>

          <div
            className={`sidebar-item ${currentView === "badges" ? "active" : ""}`}
            onClick={() => handleNavClick("badges")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "badges" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#f97316', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Award size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Badges</span>
          </div>

          <div
            className={`sidebar-item ${currentView === "reels" ? "active" : ""}`}
            onClick={() => handleNavClick("reels")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "reels" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#ec4899', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Video size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Reels</span>
          </div>

          <div
            className={`sidebar-item ${currentView === "explore_stories" ? "active" : ""}`}
            onClick={() => handleNavClick("explore_stories")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "explore_stories" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#eab308', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Globe size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Explore Stories</span>
          </div>

          <div
            className={`sidebar-item ${currentView === "popular_groups" ? "active" : ""}`}
            onClick={() => handleNavClick("popular_groups")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "popular_groups" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#ef4444', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Users size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Popular Groups</span>
          </div>

          <div
            className={`sidebar-item ${currentView === "author_profile" ? "active" : ""}`}
            onClick={() => handleNavClick("author_profile")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "author_profile" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#1064ea', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <User size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Author Profile</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: More Pages */}
      <div>
        <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>More Pages</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            className={`sidebar-item ${currentView === "email_box" ? "active" : ""}`}
            onClick={() => handleNavClick("email_box")}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "email_box" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#e0f2fe', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1064ea' }}>
                <Mail size={16} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Email Box</span>
            </div>
            <span style={{ background: '#f97316', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>584</span>
          </div>

          <div
            className={`sidebar-item ${currentView === "near_hotel" ? "active" : ""}`}
            onClick={() => handleNavClick("near_hotel")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "near_hotel" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#e0f2fe', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1064ea' }}>
              <MapPin size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Near Hotel</span>
          </div>

          <div
            className={`sidebar-item ${currentView === "latest_event" ? "active" : ""}`}
            onClick={() => handleNavClick("latest_event")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "latest_event" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#e0f2fe', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1064ea' }}>
              <Calendar size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Latest Event</span>
          </div>

          <div
            className={`sidebar-item ${currentView === "live_stream" ? "active" : ""}`}
            onClick={() => handleNavClick("live_stream")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', background: currentView === "live_stream" ? '#f0f2f5' : 'transparent' }}
          >
            <div style={{ background: '#e0f2fe', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1064ea' }}>
              <Radio size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Live Stream</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ marginTop: 'auto' }}>
        <div
          onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', hover: { background: '#fee2e2' }, transition: 'background-color 0.2s' }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Logout</span>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
