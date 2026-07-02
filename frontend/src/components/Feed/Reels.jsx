import React, { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import api from "../../services/api";

export default function Reels({ userId }) {
  const [reels, setReels] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchReels = async () => {
    try {
      const data = await api.getReels();
      setReels(data.content || []);
    } catch (err) {
      console.error("Error fetching reels:", err);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleAddReelClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const caption = prompt("Enter a caption for your reel:");
      await api.createReel(file, caption);
      await fetchReels(); // Refresh reels list
    } catch (err) {
      console.error("Error creating reel:", err);
      alert("Failed to upload reel.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Reels</h2>
        <button 
          onClick={handleAddReelClick}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1064ea', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}
          disabled={uploading}
        >
          <Plus size={16} />
          {uploading ? "Uploading..." : "Create Reel"}
        </button>
        <input 
          type="file" 
          accept="video/*" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileChange} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '400px' }}>
        {reels.map((reel) => (
          <div key={reel.reelId} style={{ background: '#000', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '700px', width: '100%' }}>
            <video 
              src={reel.videoUrl} 
              autoPlay={false} 
              controls 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <img src={reel.userAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${reel.username}`} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <span style={{ fontWeight: 'bold' }}>{reel.username}</span>
              </div>
              <p style={{ fontSize: '14px', margin: 0 }}>{reel.caption}</p>
            </div>
          </div>
        ))}
        {reels.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
            No reels found. Be the first to create one!
          </div>
        )}
      </div>
    </div>
  );
}
