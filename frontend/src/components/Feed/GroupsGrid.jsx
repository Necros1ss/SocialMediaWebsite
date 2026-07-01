import React, { useState, useEffect } from "react";
import { Plus, Users, Search } from "lucide-react";
import api from "../../services/api";

export default function GroupsGrid() {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });
  const [coverFile, setCoverFile] = useState(null);

  const fetchGroups = async () => {
    try {
      const data = await api.getAllGroups();
      setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    try {
      if (q.trim()) {
        const data = await api.searchGroups(q);
        setGroups(data);
      } else {
        await fetchGroups();
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleJoinLeave = async (groupId, isMember) => {
    try {
      if (isMember) {
        await api.leaveGroup(groupId);
      } else {
        await api.joinGroup(groupId);
      }
      // Re-fetch after action
      await fetchGroups();
    } catch (err) {
      console.error("Error joining/leaving group:", err);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const form = new FormData();
      form.append("name", newGroupData.name);
      form.append("description", newGroupData.description);
      if (coverFile) {
        form.append("cover", coverFile);
      }
      await api.createGroup(form);
      setShowCreateModal(false);
      setNewGroupData({ name: "", description: "" });
      setCoverFile(null);
      await fetchGroups();
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group.");
    }
  };

  return (
    <div style={{ padding: '24px', boxSizing: 'border-box', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Groups</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '9px', color: '#9ca3af' }} />
            <input 
              type="text" 
              placeholder="Search groups.." 
              value={searchQuery}
              onChange={handleSearch}
              style={{ padding: '8px 16px 8px 36px', borderRadius: '30px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none' }} 
            />
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ padding: '8px 16px', background: '#1064ea', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#fff', fontWeight: 'bold', fontSize: '13px', gap: '6px' }}
          >
            <Plus size={16} /> Create Group
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {groups.map((group) => (
          <div key={group.groupId} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            {/* Banner cover */}
            <div style={{ height: '120px', overflow: 'hidden', background: '#e5e7eb' }}>
              <img src={group.coverPictureURL || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=200&fit=crop"} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Profile info card body */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-36px', position: 'relative' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff', border: '4px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1064ea' }}>
                <Users size={32} />
              </div>
              <h4 style={{ margin: '8px 0 2px 0', fontSize: '15px', fontWeight: 'bold', color: '#1f2937' }}>{group.name}</h4>
              <span style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>{group.memberCount} members</span>
              <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {group.description}
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button 
                  onClick={() => handleJoinLeave(group.groupId, group.isMember)}
                  style={{ flex: 1, background: group.isMember ? '#f3f4f6' : '#1064ea', border: 'none', borderRadius: '20px', color: group.isMember ? '#4b5563' : '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '10px 0' }}
                >
                  {group.isMember ? 'LEAVE' : 'JOIN'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>Create New Group</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '8px' }}>Group Name</label>
              <input 
                type="text" 
                value={newGroupData.name}
                onChange={e => setNewGroupData({...newGroupData, name: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '8px' }}>Description</label>
              <textarea 
                value={newGroupData.description}
                onChange={e => setNewGroupData({...newGroupData, description: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', minHeight: '80px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '8px' }}>Cover Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setCoverFile(e.target.files[0])}
                style={{ fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '10px 16px', background: '#f3f4f6', border: 'none', borderRadius: '8px', color: '#4b5563', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup}
                disabled={!newGroupData.name.trim()}
                style={{ padding: '10px 16px', background: '#1064ea', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', opacity: !newGroupData.name.trim() ? 0.5 : 1 }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
