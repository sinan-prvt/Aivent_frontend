import React, { useState, useEffect, useRef } from "react";
import { FiX, FiSend, FiMessageSquare, FiZap, FiChevronRight, FiUser, FiCpu } from "react-icons/fi";
import { askPlanner } from "../api/planner.api";
import { useNavigate } from "react-router-dom";

const FloatingAIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        { id: 1, role: "assistant", content: "Hello! I'm your Aivent AI Assistant. How can I help you plan your event today?", products: [] }
    ]);
    const [planningContext, setPlanningContext] = useState({ event_type: null, budget: null });
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [chatHistory, isOpen, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        const currentMsg = message.trim();
        if (!currentMsg || isTyping) return;

        const userMsg = { id: Date.now(), role: "user", content: currentMsg };
        setChatHistory(prev => [...prev, userMsg]);
        setMessage("");
        setIsTyping(true);

        try {
            const result = await askPlanner(currentMsg, {
                event_type: planningContext.event_type,
                budget: planningContext.budget
            });

            // Update persistent context
            if (result.context) {
                setPlanningContext({
                    event_type: result.context.event_type,
                    budget: result.context.budget
                });
            }

            let assistantContent = result.explanation || result.reason || "I found some great options for you!";

            // Handle cases where the backend doesn't return a clear explanation but has an answer or reason
            if (!result.explanation && result.answer) {
                assistantContent = result.answer;
            }

            if (result.error) {
                const lowMsg = currentMsg.toLowerCase();
                if (lowMsg === "hi" || lowMsg === "hy" || lowMsg === "hello" || lowMsg === "hey") {
                    assistantContent = "Hello! I'm your Aivent Assistant. I can help you find vendors like DJs, caterers, or decorators. What's on your mind?";
                } else {
                    assistantContent = result.message || "I couldn't quite identify the event or service. Try asking about a specific service like 'Find a DJ' or 'Plan a wedding'.";
                }
            }

            const assistantMsg = {
                id: Date.now() + 1,
                role: "assistant",
                content: assistantContent,
                products: result.products || []
            };

            setChatHistory(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error(err);
            setChatHistory(prev => [...prev, {
                id: Date.now() + 1,
                role: "assistant",
                content: "My connection to the AI engine is a bit unstable. Please try again or visit our Magic Planner page!"
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-10 left-10 z-[9999] flex flex-col items-start translate-y-[-20%] sm:translate-y-0">
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="mb-6 w-[340px] sm:w-[420px] h-[600px] max-h-[70vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-slideUp">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-2xl border border-white/20">
                                <FiZap className="animate-pulse text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="font-black text-xs uppercase tracking-[0.2em] opacity-80 mb-1">Aivent Assistant</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">System Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FDFDFF]">
                        {chatHistory.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-start gap-4 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user'
                                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                        : 'bg-purple-50 text-purple-600 border-purple-100'
                                        }`}>
                                        {msg.role === 'user' ? <FiUser size={18} /> : <FiCpu size={18} />}
                                    </div>
                                    <div className={`p-5 rounded-3xl text-[13.5px] font-medium leading-[1.6] shadow-[0_8px_30px_rgb(0,0,0,0.04)] whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-50 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>

                                {/* Product Cards */}
                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-5 w-full pl-14 space-y-4">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Our Top Matches</p>
                                        <div className="space-y-3">
                                            {msg.products.map(product => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => {
                                                        navigate(`/products/${product.id}`);
                                                        setIsOpen(false);
                                                    }}
                                                    className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group"
                                                >
                                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                                                        <img
                                                            src={product.image ? `http://localhost:8003${product.image}` : "https://via.placeholder.com/100"}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight mb-1">{product.name}</p>
                                                        <p className="text-xs font-black text-indigo-600">₹{parseFloat(product.price).toLocaleString()}</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        <FiChevronRight size={16} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                                    <FiCpu size={18} />
                                </div>
                                <div className="p-5 bg-white border border-slate-100 rounded-3xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-8 bg-white border-t border-slate-50">
                        <form onSubmit={handleSend} className="relative flex items-center gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Message Aivent AI..."
                                className="flex-1 bg-slate-50/80 text-slate-800 placeholder-slate-400 rounded-[1.5rem] px-7 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all font-bold border-none"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || isTyping}
                                className="w-14 h-14 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 active:scale-90 transition-all shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:grayscale"
                            >
                                <FiSend size={22} className="ml-1" />
                            </button>
                        </form>
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <div className="h-[1px] w-8 bg-slate-100" />
                            <p className="text-[7px] text-slate-300 font-black uppercase tracking-[0.3em]">Neural Engine v1.0</p>
                            <div className="h-[1px] w-8 bg-slate-100" />
                        </div>
                    </div>
                </div>
            )}

            {/* FLOAT BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(79,70,229,0.4)] transition-all duration-500 group relative border-4 border-white ${isOpen
                    ? 'bg-slate-900 text-white rotate-[135deg] scale-90 rounded-full'
                    : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white hover:scale-110'
                    }`}
            >
                {isOpen ? <FiX size={32} /> : (
                    <div className="relative">
                        <FiMessageSquare size={32} />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 border-[3px] border-white rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </div>
                    </div>
                )}
            </button>

            {/* Custom Styles */}
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(40px) scale(0.9); opacity: 0; filter: blur(10px); }
                    to { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
                }
                .animate-slideUp {
                    animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default FloatingAIAssistant;
