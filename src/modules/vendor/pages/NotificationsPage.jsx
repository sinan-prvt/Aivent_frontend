import React, { useEffect, useState } from "react";
import { fetchNotifications, markAsRead } from "../api/notification.api";
import { useNotifications } from "../../../app/providers/NotificationProvider";
import { FiBell, FiCheck, FiInbox, FiClock } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { loadUnreadCount } = useNotifications();

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const { data } = await fetchNotifications();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
            loadUnreadCount();
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <FiBell className="text-indigo-600" /> Notifications
                    </h1>
                    <p className="text-gray-500 mt-1">Stay updated with your latest alerts and activities.</p>
                </div>
                <button
                    onClick={loadNotifications}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                    Refresh
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <FiInbox size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                    <p className="text-gray-500">You don't have any notifications at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`group bg-white p-6 rounded-3xl border transition-all hover:shadow-md flex items-start gap-4 ${n.is_read ? "border-gray-100 opacity-75" : "border-indigo-100 shadow-sm"
                                }`}
                        >
                            <div className={`mt-1 h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${n.is_read ? "bg-gray-100 text-gray-400" : "bg-indigo-50 text-indigo-600"
                                }`}>
                                <FiBell size={20} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className={`font-bold text-gray-900 truncate ${!n.is_read ? "text-indigo-900" : ""}`}>
                                        {n.title}
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
                                        <FiClock /> {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                            </div>

                            {!n.is_read && (
                                <button
                                    onClick={() => handleMarkRead(n.id)}
                                    className="h-8 w-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                                    title="Mark as read"
                                >
                                    <FiCheck size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
