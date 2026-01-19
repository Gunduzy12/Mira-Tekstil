"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  // FIX: Replaced NodeJS.Timeout with the more portable ReturnType<typeof setTimeout> to ensure browser compatibility.
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setNotification({ message, type });
    const id = setTimeout(() => {
      setNotification(null);
    }, 3000);
    setTimeoutId(id);
  }, [timeoutId]);

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
