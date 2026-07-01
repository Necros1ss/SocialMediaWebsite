import React, { useState, useEffect } from "react";
import { Settings, Shield, Lock, Bell, User, CreditCard } from "lucide-react";
import api from "../../services/api";

export default function PrivacySettingsView() {
  const [subView, setSubView] = useState("privacy");
  const [visibility, setVisibility] = useState(true);
  const [activity, setActivity] = useState(true);
  const [sharing, setSharing] = useState(false);

  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("(GMT-05:00) Eastern Time");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await api.me();
        if (user) {
          if (user.profileVisibility !== undefined) setVisibility(user.profileVisibility);
          if (user.activityStatus !== undefined) setActivity(user.activityStatus);
          if (user.dataSharing !== undefined) setSharing(user.dataSharing);
          if (user.language) setLanguage(user.language);
          if (user.timezone) setTimezone(user.timezone);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    }
    loadProfile();
  }, []);

  const sidebarItems = [
    { id: "general", name: "General", icon: Settings },
    { id: "privacy", name: "Privacy", icon: Shield },
    { id: "security", name: "Security", icon: Lock },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "account", name: "Account", icon: User },
    { id: "billing", name: "Billing", icon: CreditCard }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("profileVisibility", visibility);
      data.append("activityStatus", activity);
      data.append("dataSharing", sharing);
      data.append("language", language);
      data.append("timezone", timezone);
      await api.updateUserProfile(data);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '24px', boxSizing: 'border-box', maxWidth: '960px', margin: '0 auto', display: 'flex', gap: '30px' }}>
      
      {/* Settings sub-sidebar matching Image 6 */}
      <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = subView === item.id;
          return (
            <div 
              key={item.id}
              onClick={() => setSubView(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', background: isActive ? '#e0f2fe' : 'transparent', color: isActive ? '#1064ea' : '#4b5563', transition: 'all 0.2s' }}
            >
              <Icon size={18} />
              <span style={{ fontSize: '14px', fontWeight: isActive ? 'bold' : '600' }}>{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div style={{ flex: 1, background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', boxSizing: 'border-box', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1064ea', borderBottom: '1px solid #f3f4f6', paddingBottom: '14px', margin: '0 0 24px 0' }}>Account Settings</h2>
        
        {/* Privacy Settings Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>Privacy Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Profile Visibility */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>Profile Visibility</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Your profile allows and reveals to anyone in public.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>{visibility ? "Public" : "Private"}</span>
                <label className="switch" style={{ width: '40px', height: '22px', position: 'relative', display: 'inline-block' }}>
                  <input type="checkbox" checked={visibility} onChange={() => setVisibility(!visibility)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: visibility ? '#1064ea' : '#ccc', borderRadius: '34px', transition: '0.3s' }}>
                    <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: visibility ? '20px' : '3px', bottom: '3px', background: '#fff', borderRadius: '50%', transition: '0.3s' }}></span>
                  </span>
                </label>
              </div>
            </div>

            {/* Activity Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>Activity Status</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Show when you are active on the platform.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>{activity ? "On" : "Off"}</span>
                <label className="switch" style={{ width: '40px', height: '22px', position: 'relative', display: 'inline-block' }}>
                  <input type="checkbox" checked={activity} onChange={() => setActivity(!activity)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: activity ? '#1064ea' : '#ccc', borderRadius: '34px', transition: '0.3s' }}>
                    <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: activity ? '20px' : '3px', bottom: '3px', background: '#fff', borderRadius: '50%', transition: '0.3s' }}></span>
                  </span>
                </label>
              </div>
            </div>

            {/* Data Sharing */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>Data Sharing</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Share anonymous usage statistics. <span style={{ color: '#1064ea', cursor: 'pointer' }}>Learn more</span></p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>{sharing ? "On" : "Off"}</span>
                <label className="switch" style={{ width: '40px', height: '22px', position: 'relative', display: 'inline-block' }}>
                  <input type="checkbox" checked={sharing} onChange={() => setSharing(!sharing)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: sharing ? '#1064ea' : '#ccc', borderRadius: '34px', transition: '0.3s' }}>
                    <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: sharing ? '20px' : '3px', bottom: '3px', background: '#fff', borderRadius: '50%', transition: '0.3s' }}></span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '24px', marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>Preferences</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '8px' }}>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#f9fafb' }}>
                <option>English (US)</option>
                <option>Tiếng Việt</option>
                <option>Español</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '8px' }}>Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#f9fafb' }}>
                <option>(GMT-05:00) Eastern Time</option>
                <option>(GMT+07:00) Indochina Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Changes button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '12px 28px', background: '#1064ea', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
