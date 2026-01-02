import { useState, useEffect, useRef } from "react";
import ChatWebSocket from "../../../core/utils/websocket";

const useVendorChat = (userId, isOpen) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);

    useEffect(() => {
        console.log("useVendorChat: Lifecycle update", { userId, isOpen });

        if (isOpen) {
            console.log("useVendorChat: Modal opened, resetting state...");
            setIsConnected(false);
            setMessages([]);
        }

        if (!isOpen || !userId) {
            console.log("useVendorChat: Blocked or closing", { isOpen, userId });
            return;
        }

        const token = localStorage.getItem("access");
        if (!token) {
            console.error("No access token found");
            return;
        }

        // For vendor, we connect using the user_id as the vendor_id parameter
        // The backend will identify the vendor from the JWT token
        wsRef.current = new ChatWebSocket();

        const handleMessage = (data) => {
            if (data.type === "connection") {
                setIsConnected(data.status === "connected");
            } else if (data.type === "chat.message") {
                const newMessage = {
                    id: data.message_id,
                    text: data.message,
                    sender: data.sender === "vendor" ? "me" : "customer",
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };
                setMessages((prev) => {
                    if (prev.find((msg) => msg.id === newMessage.id)) {
                        return prev;
                    }
                    return [...prev, newMessage];
                });
            }
        };

        wsRef.current.addListener(handleMessage);
        wsRef.current.connect(userId, token);

        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
            }
        };
    }, [userId, isOpen]);

    const sendMessage = (message) => {
        if (wsRef.current && wsRef.current.isConnected()) {
            const messageId = wsRef.current.sendMessage(message);

            const newMessage = {
                id: messageId,
                text: message,
                sender: "me",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, newMessage]);

            return messageId;
        }
        return null;
    };

    return {
        messages,
        setMessages,
        sendMessage,
        isConnected,
    };
};

export default useVendorChat;
