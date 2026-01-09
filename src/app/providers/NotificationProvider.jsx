import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { fetchUnreadCount } from "../../modules/vendor/api/notification.api";
import toast from "react-hot-toast";

const NotificationContext = createContext({
    unreadCount: 0,
    setUnreadCount: () => { },
    loadUnreadCount: () => { }
});

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);

    const loadUnreadCount = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await fetchUnreadCount();
            setUnreadCount(data.unread_count);
        } catch (err) {
            console.error("Failed to load unread count", err);
        }
    }, [user]);

    useEffect(() => {
        loadUnreadCount();
    }, [loadUnreadCount]);

    useEffect(() => {
        if (!token || !user) return;

        // Connect to WebSocket
        const wsUrl = `ws://localhost:8002/ws/notifications/?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => console.log("Connected to Notifications WebSocket");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "notify_new") {
                setUnreadCount((prev) => prev + 1);
                toast.success(data.notification.title, {
                    description: data.notification.message,
                    icon: '🔔',
                });
            }
        };

        ws.onclose = () => console.log("Disconnected from Notifications WebSocket");
        ws.onerror = (err) => console.error("WebSocket Error", err);

        setSocket(ws);

        return () => ws.close();
    }, [token, user]);

    return (
        <NotificationContext.Provider value={{ unreadCount, setUnreadCount, loadUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
