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
        window.location.href = '/login';
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
    const response = await apiClient.get(`/users/profile/${username}`);
    return response.data;
  },
  updateUserProfile: async (formData) => {
    const response = await apiClient.post('/users/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getUserPosts: async (userId, page = 0, size = 10) => {
    const response = await apiClient.get(`/posts/user/${userId}`, {
      params: { page, size }
    });
    return response.data;
  },
};

export default api;