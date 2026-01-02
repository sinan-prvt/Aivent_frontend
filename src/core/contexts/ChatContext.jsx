import React, { createContext, useContext, useState, useEffect } from "react";
import chatAxios from "../api/chatAxios";
import { CHAT } from "../constants/api-routes";

const ChatContext = createContext();

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within ChatProvider");
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("access");
            if (!token) return;

            const response = await chatAxios.get(CHAT.UNREAD_COUNT);
            setUnreadCount(response.data.unread_count || 0);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const incrementUnreadCount = () => {
        setUnreadCount((prev) => prev + 1);
    };

    const decrementUnreadCount = (count = 1) => {
        setUnreadCount((prev) => Math.max(0, prev - count));
    };

    const resetUnreadCount = () => {
        setUnreadCount(0);
    };

    useEffect(() => {
        // Fetch unread count on mount
        fetchUnreadCount();

        // Poll for unread count every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    const value = {
        unreadCount,
        isLoading,
        fetchUnreadCount,
        incrementUnreadCount,
        decrementUnreadCount,
        resetUnreadCount,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
