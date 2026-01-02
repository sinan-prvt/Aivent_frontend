import { useState, useEffect, useRef } from "react";
import ChatWebSocket from "../../../core/utils/websocket";

const useChat = (vendorId, isOpen) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);

    useEffect(() => {
        console.log("useChat: Lifecycle update", { vendorId, isOpen });

        if (isOpen) {
            console.log("useChat: Modal opened, resetting state...");
            setIsConnected(false);
            setMessages([]);
        }

        if (!isOpen || !vendorId) {
            console.log("useChat: Blocked or closing", { isOpen, vendorId });
            return;
        }

        const token = localStorage.getItem("access");
        if (!token) {
            console.error("useChat: No access token found in localStorage");
            return;
        }

        console.log("useChat: Initializing WebSocket connection to vendor:", vendorId);

        // Initialize WebSocket
        wsRef.current = new ChatWebSocket();

        // Add message listener
        const handleMessage = (data) => {
            console.log("useChat: WebSocket Event Received:", data);
            if (data.type === "connection") {
                console.log("useChat: Connection Status:", data.status);
                setIsConnected(data.status === "connected");
            } else if (data.type === "chat.message") {
                // Add incoming message to the list
                const newMessage = {
                    id: data.message_id || Date.now(),
                    text: data.message,
                    sender: data.sender === "customer" ? "me" : "vendor",
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
        wsRef.current.connect(vendorId, token);

        // Cleanup on unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
            }
        };
    }, [vendorId, isOpen]);

    const sendMessage = (message) => {
        if (wsRef.current && wsRef.current.isConnected()) {
            const messageId = wsRef.current.sendMessage(message);

            // Optimistically add message to UI
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

export default useChat;
