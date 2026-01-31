import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

interface Notification {
  id: number;
  name: string;
  avatar: string;
  action: "join" | "leave";
}

interface PassengerNotificationProps {
  notifications: Notification[];
  onDismiss: (id: number) => void;
}

function NotificationItem({ notification, onDismiss }: { notification: Notification; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border" style={{ backgroundColor: 'var(--region-glow, rgba(168, 85, 247, 0.2))', borderColor: 'var(--color-primary, rgb(168, 85, 247))' }}>
        {notification.avatar}
      </div>
      <div>
        <p className="text-white text-sm font-medium">
          {notification.name}
        </p>
        <p className="text-white/50 text-xs">
          {notification.action === "join" ? "hopped on the bus!" : "left the bus"}
        </p>
      </div>
    </motion.div>
  );
}

export function PassengerNotification({ notifications, onDismiss }: PassengerNotificationProps) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function usePassengerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((name: string, avatar: string, action: "join" | "leave") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, name, avatar, action }]);
  }, []);

  const dismissNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, addNotification, dismissNotification };
}
