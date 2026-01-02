import chatAxios from "../../../core/api/chatAxios";
import { CHAT } from "../../../core/constants/api-routes";

export const chatApi = {
    getChatHistory: async (id, isVendor = false) => {
        const param = isVendor ? `user_id=${id}` : `vendor_id=${id}`;
        const response = await chatAxios.get(`${CHAT.MESSAGES}?${param}`);
        return response.data;
    },

    markAsRead: async (id, isVendor = false) => {
        const payload = isVendor ? { user_id: id } : { vendor_id: id };
        const response = await chatAxios.post(CHAT.MARK_READ, payload);
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await chatAxios.get(CHAT.UNREAD_COUNT);
        return response.data;
    },
};
