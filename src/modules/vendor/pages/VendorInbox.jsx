import React, { useState } from "react";
import { FiMessageSquare, FiSearch, FiClock, FiUser } from "react-icons/fi";
import useVendorInbox from "../hooks/useVendorInbox";
import VendorChat from "../components/VendorChat";

const VendorInbox = () => {
    const { inbox, isLoading, refetch } = useVendorInbox();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredInbox = inbox.filter((conversation) =>
        conversation.user_id.toString().includes(searchQuery)
    );

    const handleSelectConversation = (conversation) => {
        setSelectedUser(conversation);
    };

    const handleCloseChat = () => {
        setSelectedUser(null);
        refetch(); // Refresh inbox to update unread counts
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <FiMessageSquare className="text-indigo-600" />
                        Messages
                    </h1>
                    <p className="text-gray-600">Manage your customer conversations</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Inbox List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-400">Loading conversations...</div>
                        </div>
                    ) : filteredInbox.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <FiMessageSquare className="text-gray-300 mb-4" size={64} />
                            <p className="text-gray-400 text-lg">No conversations yet</p>
                            <p className="text-gray-400 text-sm">Messages from customers will appear here</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredInbox.map((conversation) => (
                                <div
                                    key={conversation.user_id}
                                    onClick={() => handleSelectConversation(conversation)}
                                    className="p-5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* User Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                <FiUser size={24} />
                                            </div>
                                            {conversation.unread_count > 0 && (
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                                    {conversation.unread_count}
                                                </div>
                                            )}
                                        </div>

                                        {/* Conversation Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    User #{conversation.user_id}
                                                </h3>
                                                {conversation.last_message_at && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <FiClock size={12} />
                                                        {new Date(conversation.last_message_at).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`text-sm truncate ${conversation.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                                {conversation.last_message || "No messages yet"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Modal */}
            {selectedUser && (
                <VendorChat
                    isOpen={!!selectedUser}
                    onClose={handleCloseChat}
                    userId={selectedUser.user_id}
                    userName={`User #${selectedUser.user_id}`}
                />
            )}
        </div>
    );
};

export default VendorInbox;
