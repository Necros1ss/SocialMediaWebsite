import React, { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import api from "../../services/api";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchStories = async () => {
    try {
      const data = await api.getStories();
      setStories(data);
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleAddStoryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await api.createStory(file, "IMAGE");
      await fetchStories(); // Refresh stories list
    } catch (err) {
      console.error("Error creating story:", err);
      alert("Failed to upload story.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="stories-list" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch', height: '200px', minHeight: '200px' }}>
      
      {/* Add Story Card */}
      <div 
        onClick={handleAddStoryClick}
        style={{ position: 'relative', minWidth: '110px', height: '180px', borderRadius: '12px', background: '#374151', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, opacity: uploading ? 0.7 : 1 }}
      >
        <div style={{ background: '#fff', padding: '10px', borderRadius: '50%', color: '#1064ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <Plus size={20} strokeWidth={3} />
        </div>
        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>{uploading ? "Uploading..." : "Add Story"}</span>
        <input 
          type="file" 
          accept="image/*,video/*" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileChange} 
        />
      </div>

      {/* Users Story Cards */}
      {stories.map((story) => (
        <div key={story.id} style={{ position: 'relative', minWidth: '110px', height: '180px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}>
          <img src={story.mediaUrl} alt="Story cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}></div>
          
          {/* User profile photo overlay at bottom center */}
          <div style={{ position: 'absolute', bottom: '34px', left: '50%', transform: 'translateX(-50%)', width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #fff', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
            <img src={story.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* User name */}
          <span style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {story.username}
          </span>
        </div>
      ))}

    </div>
  );
}
