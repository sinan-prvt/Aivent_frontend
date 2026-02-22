import React, { useState, useEffect, useRef } from "react";
import { FiX, FiSend, FiMessageSquare, FiZap, FiChevronRight, FiUser, FiCpu } from "react-icons/fi";
import { askPlanner } from "../api/planner.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

const FloatingAIAssistant = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState(["Hi", "Plan a Wedding", "Find a DJ", "Photography"]);
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

    // Hide for Vendors and Admins
    if (user?.role === 'vendor' || user?.role === 'admin') return null;

    const handleSend = async (e, forcedMsg = null) => {
        if (e) e.preventDefault();
        const currentMsg = (forcedMsg || message).trim();
        if (!currentMsg || isTyping) return;

        const userMsg = { id: Date.now(), role: "user", content: currentMsg };
        setChatHistory(prev => [...prev, userMsg]);
        setMessage("");
        setSuggestions([]); // Clear suggestions during processing

        // [GREETING INTERCEPTOR] Handle greetings locally
        const lowMsg = currentMsg.toLowerCase();
        if (["hi", "hello", "hey", "hy", "hola"].includes(lowMsg)) {
            setTimeout(() => {
                setChatHistory(prev => [...prev, {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: "Hello! I'm your Aivent Assistant. I can help you find vendors like DJs, caterers, or decorators. What's on your mind?"
                }]);
                // Reset context for a fresh start
                setPlanningContext({ event_type: null, budget: null });
                setSuggestions(["Plan a Wedding", "Find a DJ", "Magic Planner"]);
            }, 500); // Small delay for natural feel
            return;
        }

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

            // Update suggestions from backend if available
            if (result.suggestions) {
                setSuggestions(result.suggestions);
            } else {
                setSuggestions(["Find a DJ", "Catering", "Magic Planner"]);
            }

            let assistantContent = result.explanation || result.reason || "I found some great options for you!";

            // Handle cases where the backend doesn't return a clear explanation but has an answer or reason
            if (!result.explanation && result.answer) {
                assistantContent = result.answer;
            }

            // [RAG UPDATE] Show context info if available (Fallback)
            if (result.context_info) {
                assistantContent += "\n\n" + result.context_info;
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
            setSuggestions(["Try again", "Go Home"]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(null, suggestion);
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="fixed right-0 top-0 w-full sm:w-[480px] h-full bg-white/80 backdrop-blur-3xl shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.15)] border-l border-white/20 flex flex-col overflow-hidden animate-slideInRight pointer-events-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-3xl border border-white/20 shadow-inner">
                                <FiZap className="animate-pulse text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-[0.2em] opacity-90 mb-1">Aivent AI Assistant</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.6)] animate-pulse" />
                                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">Neural Engine Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all active:scale-95 group"
                        >
                            <FiX size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-transparent custom-scrollbar">
                        {chatHistory.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-start gap-4 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${msg.role === 'user'
                                        ? 'bg-indigo-600/10 text-indigo-600 border border-indigo-200/50 shadow-none'
                                        : 'bg-transparent text-purple-600'
                                        }`}>
                                        {msg.role === 'user' ? <FiUser size={18} /> : (
                                            <>
                                                <img
                                                    src="/ai-chat.png"
                                                    alt="AI"
                                                    className="w-full h-full object-contain filter drop-shadow-md"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center bg-transparent text-purple-600 rounded-xl">
                                                    <FiCpu size={20} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className={`p-5 rounded-3xl text-[14px] font-medium leading-[1.6] shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white/60 backdrop-blur-sm text-slate-700 border border-white/40 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>

                                {/* Product Cards */}
                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-5 w-full pl-14 space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 font-black uppercase tracking-[0.2em]">Our Top Matches</p>
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
                                                            src={(() => {
                                                                if (!product.image) return "https://via.placeholder.com/100";
                                                                let url = product.image;
                                                                if (url.includes('catalog-service:8000')) url = url.replace('catalog-service:8000', 'localhost:8003');
                                                                if (url.startsWith('http')) return url;
                                                                return `http://localhost:8003${url.startsWith('/') ? '' : '/'}${url.includes('/media/') ? '' : 'media/'}${url}`;
                                                            })()}
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
                                <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                                    <img
                                        src="/ai-chat.png"
                                        alt="AI"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div style={{ display: 'none' }} className="w-full h-full items-center justify-center bg-purple-50 text-purple-600 rounded-xl">
                                        <FiCpu size={20} />
                                    </div>
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
                    <div className="p-8 bg-white/40 backdrop-blur-md border-t border-white/20">
                        {suggestions.length > 0 && !isTyping && (
                            <div className="flex flex-wrap gap-2 mb-6 animate-fadeIn transition-all">
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-4 py-2 bg-white/80 hover:bg-indigo-600 hover:text-white text-indigo-600 text-[11px] font-black uppercase tracking-wider rounded-full border border-indigo-100 shadow-sm transition-all active:scale-95"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSend} className="relative flex items-center gap-4">
                            <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 px-6 py-4 shadow-inner">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Message Aivent AI..."
                                    className="w-full bg-transparent outline-none text-sm font-bold text-slate-800 placeholder-slate-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!message.trim() || isTyping}
                                className="w-14 h-14 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] flex items-center justify-center flex-shrink-0 disabled:opacity-50"
                            >
                                <FiSend size={22} className="ml-1" />
                            </button>
                        </form>
                        <div className="flex items-center justify-center gap-3 mt-6 opacity-40">
                            <div className="h-[1px] w-10 bg-slate-400" />
                            <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em]">Neural Engine v1.0</p>
                            <div className="h-[1px] w-10 bg-slate-400" />
                        </div>
                    </div>
                </div>
            )}

            {/* FLOAT BUTTON */}
            <div className="fixed bottom-10 right-10 pointer-events-auto">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-20 h-20 flex items-center justify-center transition-all duration-500 group relative ${isOpen
                        ? 'bg-slate-900 text-white rotate-[135deg] scale-0 opacity-0 pointer-events-none'
                        : 'bg-transparent text-white hover:scale-110 !shadow-none'
                        }`}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src="/ai-chat.png"
                            alt="Chat"
                            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div style={{ display: 'none' }} className="w-16 h-16 items-center justify-center bg-indigo-600 text-white rounded-2xl shadow-lg">
                            <FiMessageSquare size={32} />
                        </div>
                        <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 border-[3px] border-white rounded-full flex items-center justify-center shadow-md">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </div>
                    </div>
                </button>
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideInRight {
                    animation: slideInRight 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default FloatingAIAssistant;
