import { useEffect, useState } from 'react';
import { connectSocket, disconnectSocket, subscribeNotifications } from '../services/chatSocket';
import api from '../services/api';
import { CONFIG } from '../config/constants';

export default function useNotifications(user) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    let mounted = true;
    let subscription = null;

    const init = async () => {
      try {
        // 1. Fetch initial unread count
        const countData = await api.getUnreadNotificationCount();
        if (mounted) setUnreadCount(countData.count);

        // 2. Connect WebSocket for real-time
        const wsUrl = CONFIG.WS_URL;
        const { token } = await api.getWebSocketToken();
        
        const client = await connectSocket(wsUrl, {
          connectHeaders: { Authorization: `Bearer ${token}` }
        });

        if (!mounted) return;

        // 3. Subscribe
        subscription = subscribeNotifications(user.username, (newNotif) => {
          if (!mounted) return;
          console.log("New Notification received:", newNotif);
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          // Optionally trigger a toast here
          // toast.info(`New notification: ${newNotif.type}`);
        });

      } catch (err) {
        console.error("Failed to initialize notifications:", err);
      }
    };

    init();

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [user]);

  return { notifications, unreadCount, setUnreadCount, setNotifications };
}
