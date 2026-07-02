import axios from 'axios';
import { CONFIG } from '../config/constants';

const API_BASE = `${CONFIG.API_BASE_URL || ''}${CONFIG.API_PREFIX || ''}`;

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Auto attach cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept auth endpoints to avoid infinite deadlocks
    if (originalRequest && originalRequest.url && (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/register'))) {
      return Promise.reject(error);
    }

    // Check if error is 401 Unauthorized and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call /auth/refresh to refresh token
        await apiClient.post('/auth/refresh');
        isRefreshing = false;
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        try {
          localStorage.removeItem('autoLogin');
        } catch (e) {}
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  refresh: async () => {
    try {
      const resp = await apiClient.post('/auth/refresh');
      return resp.status === 200 || resp.status === 204;
    } catch (e) {
      return false;
    }
  },
  getConversations: async () => {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  },
  getMessages: async (conversationId, limit = 50, page = 1) => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`, {
      params: { size: limit, page }
    });
    return response.data;
  },
  me: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (e) {
      return null;
    }
  },
  register: async (data) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const message = errorData.message || 'Registration failed';
        throw new Error(`${message} (HTTP ${err.response.status})`);
      }
      throw err;
    }
  },
  login: async (data) => {
    try {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const message = errorData.message || 'Login failed';
        throw new Error(`${message} (HTTP ${err.response.status})`);
      }
      throw err;
    }
  },
  verifyOTP: async (data) => {
    try {
      const response = await apiClient.post('/verification/otp', data);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const message = errorData.message || 'OTP verification failed';
        throw new Error(`${message} (HTTP ${err.response.status})`);
      }
      throw err;
    }
  },
  resendOTP: async (data) => {
    try {
      const response = await apiClient.post('/verification/resend-otp', data);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const message = errorData.message || 'Resend OTP failed';
        throw new Error(`${message} (HTTP ${err.response.status})`);
      }
      throw err;
    }
  },
  sendChatMessage: async ({ jsonData, files }) => {
    const form = new FormData();
    form.append('data', jsonData);
    if (Array.isArray(files) && files.length > 0) {
      files.forEach((f) => {
        form.append('files', f);
      });
    }
    const response = await apiClient.post('/chat/send', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  markChatRead: async (payload) => {
    const response = await apiClient.post('/chat/read', payload);
    return response.data;
  },
  getWebSocketToken: async () => {
    const response = await apiClient.post('/chat/ws-token');
    return response.data;
  },
  reactToMessage: async ({ messageId, reactionType }) => {
    const response = await apiClient.post('/chat/reactions', {
      targetId: messageId,
      reactionType,
      targetType: 'MESSAGE',
    });
    return response.data;
  },
  getMessageReactions: async (messageId) => {
    const response = await apiClient.get(`/chat/messages/${messageId}/reactions`);
    return response.data;
  },
  logout: async () => {
    try {
      const resp = await apiClient.post('/auth/logout');
      return resp.status === 200 || resp.status === 204;
    } catch (e) {
      return false;
    }
  },
  put: async (endpoint, data) => {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  },
  getUserProfile: async (username) => {
    const response = await apiClient.get(`/api/users/profile/${username}`);
    return response.data;
  },
  updateUserProfile: async (formData) => {
    const response = await apiClient.post('/api/users/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  // Friend API
  sendFriendRequest: async (userId) => {
    const response = await apiClient.post(`/api/friends/request/${userId}`);
    return response.data;
  },
  acceptFriendRequest: async (userId) => {
    const response = await apiClient.post(`/api/friends/accept/${userId}`);
    return response.data;
  },
  declineFriendRequest: async (userId) => {
    const response = await apiClient.post(`/api/friends/decline/${userId}`);
    return response.data;
  },
  unfriend: async (userId) => {
    const response = await apiClient.delete(`/api/friends/unfriend/${userId}`);
    return response.data;
  },
  getFriends: async () => {
    const response = await apiClient.get('/api/friends/list');
    return response.data;
  },
  getIncomingFriendRequests: async () => {
    const response = await apiClient.get('/api/friends/requests/incoming');
    return response.data;
  },
  getFriendSuggestions: async () => {
    const response = await apiClient.get('/api/friends/suggestions');
    return response.data;
  },
  searchUsers: async (query) => {
    const response = await apiClient.get('/api/users/search', {
      params: { q: query }
    });
    return response.data;
  },
  getUserPosts: async (userId, page = 0, size = 10) => {
    const response = await apiClient.get(`/api/posts/user/${userId}`, {
      params: { page, size }
    });
    return response.data;
  },
  getStories: async () => {
    const response = await apiClient.get('/api/stories');
    return response.data;
  },
  createStory: async (file, mediaType) => {
    const formData = new FormData();
    formData.append('file', file);
    if (mediaType) {
      formData.append('mediaType', mediaType);
    }
    const response = await apiClient.post('/api/stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getReels: async (page = 0, size = 10) => {
    const response = await apiClient.get('/api/reels', {
      params: { page, size }
    });
    return response.data;
  },
  createReel: async (file, caption) => {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) {
      formData.append('caption', caption);
    }
    const response = await apiClient.post('/api/reels', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getReports: async () => {
    const response = await apiClient.get('/api/reports');
    return response.data;
  },
  updateReportStatus: async (reportId, status) => {
    const response = await apiClient.put(`/api/reports/${reportId}/status`, null, {
      params: { status }
    });
    return response.data;
  },
  getAllGroups: async () => {
    const response = await apiClient.get('/api/groups');
    return response.data;
  },
  getMyGroups: async () => {
    const response = await apiClient.get('/api/groups/my');
    return response.data;
  },
  searchGroups: async (query) => {
    const response = await apiClient.get('/api/groups/search', { params: { query } });
    return response.data;
  },
  getGroupById: async (groupId) => {
    const response = await apiClient.get(`/api/groups/${groupId}`);
    return response.data;
  },
  createGroup: async (formData) => {
    const response = await apiClient.post('/api/groups', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  joinGroup: async (groupId) => {
    const response = await apiClient.post(`/api/groups/${groupId}/join`);
    return response.data;
  },
  leaveGroup: async (groupId) => {
    const response = await apiClient.post(`/api/groups/${groupId}/leave`);
    return response.data;
  },
  getGroupMembers: async (groupId) => {
    const response = await apiClient.get(`/api/groups/${groupId}/members`);
    return response.data;
  },
  forgotPassword: async (identifier, channel) => {
    const response = await apiClient.post('/auth/forgot-password', { identifier, channel });
    return response.data;
  },
  resetPassword: async (identifier, channel, otp, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', { identifier, channel, otp, newPassword });
    return response.data;
  },
  getFriends: async () => {
    const response = await apiClient.get('/api/users/friends');
    return response.data;
  },
  getRecommendations: async () => {
    const response = await apiClient.get('/api/users/recommendations');
    return response.data;
  },
  searchUsers: async (query) => {
    const response = await apiClient.get('/api/users/search', { params: { q: query } });
    return response.data;
  },
  searchPosts: async (query) => {
    const response = await apiClient.get('/api/posts/search', { params: { q: query } });
    return response.data;
  },
  getNotifications: async (page = 0, size = 20) => {
    const response = await apiClient.get('/api/notifications', { params: { page, size } });
    return response.data;
  },
  getUnreadNotificationCount: async () => {
    const response = await apiClient.get('/api/notifications/unread-count');
    return response.data;
  },
  markNotificationRead: async (id) => {
    const response = await apiClient.post(`/api/notifications/${id}/read`);
    return response.data;
  },
  followUser: async (userId) => {
    const response = await apiClient.post(`/api/follows/${userId}`);
    return response.data;
  },
  unfollowUser: async (userId) => {
    const response = await apiClient.delete(`/api/follows/${userId}`);
    return response.data;
  },
  checkFollowStatus: async (userId) => {
    const response = await apiClient.get(`/api/follows/${userId}/status`);
    return response.data;
  },
};

export default api;