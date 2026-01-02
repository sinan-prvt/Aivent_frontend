import { useState, useEffect } from "react";
import { chatApi } from "../api/chat.api";

const useChatHistory = (vendorId, isOpen) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !vendorId) return;

        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await chatApi.getChatHistory(vendorId);

                // Transform API data to UI format
                const formattedMessages = data.map((msg) => ({
                    id: msg.id,
                    text: msg.message,
                    sender: msg.sender === "customer" ? "me" : "vendor",
                    time: new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                }));

                setHistory(formattedMessages);
            } catch (err) {
                console.error("Error fetching chat history:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [vendorId, isOpen]);

    return { history, isLoading, error };
};

export default useChatHistory;
