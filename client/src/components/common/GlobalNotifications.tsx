'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function GlobalNotifications() {
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const notifications = await res.json();
          const unread = notifications.filter((n: any) => !n.read);
          
          unread.forEach((n: any) => {
            toast(n.message, {
              icon: n.type.includes('approved') ? '✅' : n.type.includes('rejected') ? '❌' : '🔔',
              duration: 6000,
            });
          });

          // Mark as read after showing them
          if (unread.length > 0) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read`, {
              method: 'PUT',
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotifications();
    
    // Poll every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [token, user]);

  return <Toaster position="bottom-right" />;
}
