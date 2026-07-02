import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FeedItem from "../components/Feed/FeedItem";
import Post from "../components/Feed/Post";
import Sidebar from "../components/Common/Sidebar";
import SearchBar from "../components/Common/SearchBar";
import RightSidebar from "../components/Common/RightSidebar";
import Stories from "../components/Feed/Stories";
import Reels from "../components/Feed/Reels";
import CreatePostCard from "../components/Feed/CreatePostCard";
import GroupsGrid from "../components/Feed/GroupsGrid";
import EditProfileView from "../components/Feed/EditProfileView";
import PrivacySettingsView from "../components/Feed/PrivacySettingsView";
import AdminDashboardView from "../components/Feed/AdminDashboardView";
import GroupDetailView from "../components/Feed/GroupDetailView";
import NotFoundView from "../components/Feed/NotFoundView";
import ComingSoonView from "../components/Feed/ComingSoonView";
import { useNavigate } from "react-router-dom";
import { FeedApi } from "../utils/ultis";
import "../styles/feed.css";

const FeedPage = ({
  userId,
  isDark,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("home");
  const [selectedPost, setSelectedPost] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const link = "/api/feed/";
      let api;
      switch (currentView) {
        case "home":
          api = link + `home`;
          break;
        case "popular":
          api = link + `popular`;
          break;
        case "discussion":
          api = link + `discussion`;
          break;
        default:
          api = link + `home`;
      }

      const response = await FeedApi.getFeedFrom(api);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setFeed(data);
        } else {
          console.error("Feed data is not an array:", data);
        }
      } else {
        console.error("Failed to fetch feed, status:", response.status);
      }
    } catch (error) {
      console.error("There was an error fetching the feed data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentView !== "post") {
      fetchFeed();
    }
  }, [currentView, userId, refreshKey]);

  useEffect(() => {
    const handlePostCreated = () => {
      fetchFeed();
    };
    window.addEventListener('postCreated', handlePostCreated);
    return () => window.removeEventListener('postCreated', handlePostCreated);
  }, [currentView, userId]);

  useEffect(() => {
    const handlePostCreated = () => {
      fetchFeed();
    };
    window.addEventListener('postCreated', handlePostCreated);
    return () => window.removeEventListener('postCreated', handlePostCreated);
  }, [currentView, userId]);

  const handleCreatePost = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const openPost = (post) => {
    setSelectedPost(post);
    setCurrentView("post");
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setCurrentView("home");
    setSelectedPost(null);
  };

  return (
    <div className={`app grid ${isDark ? "dark" : "light"}`} style={{ height: '100vh', overflow: 'hidden' }}>
      <SearchBar userId={userId} onCreatePost={handleCreatePost} currentView={currentView} setCurrentView={setCurrentView} />
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={onLogout}
      />
      {currentView === "home" || currentView === "post" || currentView === "reels" || currentView === "near_hotel" ? (
        <>
          <div className="feed-container" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', boxSizing: 'border-box' }}>
            {currentView === "near_hotel" && <ComingSoonView />}
            {currentView === "reels" && <Reels userId={userId} />}

            {/* New Feeds view specific rendering */}
            {["home", "popular", "discussion"].includes(currentView) ? (
              <>
                {loading ? (
                  <div className="loading" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                ) : (
                  <>
                    <div style={{ flexShrink: 0 }}>
                      <Stories />
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <CreatePostCard onCreatePost={handleCreatePost} userId={userId} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {feed.map((post) => (
                        <FeedItem key={post.id} userId={userId} post={post} openPost={openPost} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : currentView === "post" ? (
              <Post userId={userId} post={selectedPost} goBack={goBack} />
            ) : null}
          </div>
          <RightSidebar onOpenChat={() => navigate("/messenger")} />
        </>
      ) : currentView === "popular_groups" ? (
        <div style={{ gridColumn: 'span 2', overflowY: 'auto', background: '#f0f2f5', height: 'calc(100vh - 65px)' }}>
          <GroupsGrid />
        </div>
      ) : currentView === "author_profile" ? (
        <div style={{ gridColumn: 'span 2', overflowY: 'auto', background: '#f0f2f5', height: 'calc(100vh - 65px)' }}>
          <EditProfileView user={null} />
        </div>
      ) : currentView === "settings" ? (
        <div style={{ gridColumn: 'span 2', overflowY: 'auto', background: '#f0f2f5', height: 'calc(100vh - 65px)' }}>
          <PrivacySettingsView />
        </div>
      ) : currentView === "dashboard" ? (
        <div style={{ gridColumn: 'span 2', overflowY: 'auto', background: '#f0f2f5', height: 'calc(100vh - 65px)' }}>
          <AdminDashboardView />
        </div>
      ) : currentView === "group_detail" ? (
        <div style={{ gridColumn: 'span 2', overflowY: 'auto', background: '#f0f2f5', height: 'calc(100vh - 65px)' }}>
          <GroupDetailView userId={userId} />
        </div>
      ) : (
        <div style={{ gridColumn: 'span 2', overflowY: 'auto', background: '#f0f2f5', height: 'calc(100vh - 65px)' }}>
          <ComingSoonView title={currentView.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} />
        </div>
      )}
    </div>
  );
};

export default FeedPage;
