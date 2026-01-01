
import React, { useState, useEffect, useRef } from "react";
import { FiX, FiSend, FiPaperclip } from "react-icons/fi";

const ChatModal = ({ isOpen, onClose, vendorName, vendorImage }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Hello! I'm interested in your services for a wedding on October 20th. Are you available?`,
            sender: "me",
            time: "10:41 AM",
        },
        {
            id: 2,
            text: "Absolutely! We have several packages available. I can send you a brochure with all the options if you'd like.",
            sender: "vendor",
            time: "10:42 AM",
        },
        {
            id: 3,
            text: "That sounds great. I've sent over the details. Let me know what you think!",
            sender: "me",
            time: "10:45 AM",
        },
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: message,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMessage]);
        setMessage("");

        // Simulate basic reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "Thanks for your message! We'll get back to you shortly.",
                sender: "vendor",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }])
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                                {vendorImage ? <img src={vendorImage} alt="" className="w-full h-full object-cover" /> : vendorName?.[0] || "V"}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{vendorName || "Vendor Name"}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>Photography</span> • <span className="text-yellow-500 font-bold">★ 4.8</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Date Divider */}
                <div className="text-center py-4">
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Today</span>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl p-4 shadow-sm text-sm relative group ${msg.sender === "me"
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none"
                                        : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                                    }`}
                            >
                                <p className="leading-relaxed">{msg.text}</p>
                                <div className={`text-[10px] mt-1 text-right opacity-70`}>
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <button type="button" className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
                            <FiPaperclip size={20} />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                        >
                            <FiSend size={18} className={message.trim() ? "ml-0.5" : ""} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
