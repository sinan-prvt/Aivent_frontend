import chatAxios from "../../../core/api/chatAxios";
import { CHAT } from "../../../core/constants/api-routes";

export const chatApi = {
    getInbox: async () => {
        const response = await chatAxios.get(CHAT.INBOX);
        return response.data;
    },

    getChatHistory: async (userId) => {
        // For vendors, we need to get the vendor_id from the token
        // The backend will extract it from the JWT
        const response = await chatAxios.get(`${CHAT.MESSAGES}?user_id=${userId}`);
        return response.data;
    },

    markAsRead: async (userId) => {
        const response = await chatAxios.post(CHAT.MARK_READ, { user_id: userId });
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await chatAxios.get(CHAT.UNREAD_COUNT);
        return response.data;
    },
};
