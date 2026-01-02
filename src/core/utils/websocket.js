
class ChatWebSocket {
    constructor() {
        this.ws = null;
        this.listeners = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.isIntentionallyClosed = false;
    }

    generateUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    connect(vendorId, token) {
        if (!vendorId || !token) {
            console.error("Cannot connect: vendorId or token missing", { vendorId, token });
            this.notifyListeners({ type: "connection", status: "error", error: "Missing parameters" });
            return;
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log("WebSocket already connected");
            return;
        }

        this.isIntentionallyClosed = false;
        const wsUrl = `ws://localhost:8005/ws/chat/?vendor_id=${vendorId}&token=${token}`;
        console.log("ChatWebSocket: Attempting connection to:", wsUrl.split("&token=")[0] + "&token=***");

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log("ChatWebSocket: Connection established ✅");
                this.reconnectAttempts = 0;
                this.notifyListeners({ type: "connection", status: "connected" });
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("ChatWebSocket: Message received:", data);
                    this.notifyListeners(data);
                } catch (error) {
                    console.error("ChatWebSocket: Error parsing message:", error);
                }
            };

            this.ws.onerror = (error) => {
                console.error("ChatWebSocket: Socket error ❌", error);
                this.notifyListeners({ type: "connection", status: "error", error });
            };

            this.ws.onclose = (event) => {
                console.log("ChatWebSocket: Connection closed 🚪", { code: event.code, reason: event.reason });
                this.notifyListeners({ type: "connection", status: "disconnected" });

                // Auto-reconnect if not intentionally closed
                if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
                    setTimeout(() => {
                        this.connect(vendorId, token);
                    }, this.reconnectDelay);
                }
            };
        } catch (error) {
            console.error("Error creating WebSocket:", error);
        }
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const messageId = this.generateUUID();
            const payload = {
                message_id: messageId,
                message: message,
            };
            this.ws.send(JSON.stringify(payload));
            return messageId;
        } else {
            console.error("WebSocket is not connected");
            return null;
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter((listener) => listener !== callback);
    }

    notifyListeners(data) {
        this.listeners.forEach((listener) => listener(data));
    }

    disconnect() {
        this.isIntentionallyClosed = true;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.listeners = [];
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

export default ChatWebSocket;
