import { useState, useEffect } from "react";
import { chatApi } from "../api/chat.api";

const useUnreadCount = (refreshInterval = 30000) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUnreadCount = async () => {
        setIsLoading(true);
        try {
            const data = await chatApi.getUnreadCount();
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnreadCount();

        // Set up polling
        const interval = setInterval(fetchUnreadCount, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    return { unreadCount, isLoading, refetch: fetchUnreadCount };
};

export default useUnreadCount;
