import vendorApi from "@/core/api/vendorAxios";

/* Get all notifications */
export const fetchNotifications = (params = {}) =>
    vendorApi.get("notifications/", { params });

/* Get unread count */
export const fetchUnreadCount = () =>
    vendorApi.get("notifications/unread-count/");

/* Mark as read */
export const markAsRead = (id) =>
    vendorApi.patch(`notifications/${id}/read/`);
