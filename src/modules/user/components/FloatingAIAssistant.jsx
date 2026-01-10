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
        <div className="fixed bottom-10 left-10 z-[9999] flex flex-col items-start translate-y-[-20%] sm:translate-y-0">
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="-mb-18 w-[340px] sm:w-[420px] h-[800px] max-h-[90vh] bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.4)] border border-white/50 flex flex-col overflow-hidden animate-slideUp ml-14 ">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-700 via-indigo-900 to-purple-900 p-2 text-white flex items-center justify-between backdrop-blur-lg">
                        <div className="flex items-center gap-4">

                            <div>
                                <h3 className="font-black text-2xs uppercase  opacity-80 mb-1 ml-30">Aivent Assistant</h3>
                                <div className="flex items-center ml-32 gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-pulse" />
                                    <span className="text-xs font-black text-white  uppercase tracking-widest">System Online</span>
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
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-transparent">
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
                                                    className="w-full h-full object-contain filter drop-shadow-md "
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
                                    <div className={`p-5 rounded-3xl text-[13.5px] font-medium leading-[1.6] shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white/60 backdrop-blur-sm text-slate-700 border border-white/40 rounded-tl-none'
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
                                                            src={(() => {
                                                                if (!product.image) return "https://via.placeholder.com/100";

                                                                let url = product.image;

                                                                // Handle internal Docker hostnames
                                                                if (url.includes('catalog-service:8000')) {
                                                                    url = url.replace('catalog-service:8000', 'localhost:8003');
                                                                }

                                                                // If it's already an absolute URL (after hostname fix), use it
                                                                if (url.startsWith('http')) return url;

                                                                // Otherwise, build the full URL from the base
                                                                const base = "http://localhost:8003";
                                                                const hasMedia = url.includes('/media/');
                                                                const leadingSlash = url.startsWith('/') ? '' : '/';
                                                                const mediaPrefix = hasMedia ? '' : 'media/';

                                                                return `${base}${leadingSlash}${mediaPrefix}${url}`;
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
                    <div className="px-8 py-6 bg-transparen relative">

                        {/* Suggestions Area */}
                        {suggestions.length > 0 && !isTyping && (
                            <div className="flex flex-wrap gap-2 mb-4 animate-fadeIn">
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 transition-all active:scale-95"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Subtle glow */}
                        <div className="absolute inset-x-0 -top-6 h-12 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 blur-2xl opacity-70 pointer-events-none" />

                        <form onSubmit={handleSend} className="relative flex items-center gap-4">

                            {/* Input shell */}
                            <div className="flex-1 flex items-center bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_10px_-20px_rgba(0,0,0,0.4)] border border-black/40 px-6 py-4  transition-all">



                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ask Aivent AI..."
                                    className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder-slate-400"
                                />
                            </div>

                            {/* Send button */}
                            <button
                                type="submit"
                                disabled={!message.trim() || isTyping}
                                className="w-14 h-14 rounded-2xl bg-gradient-to-r from-gray-700 via-indigo-900 to-purple-900 text-white flex items-center justify-center shadow-[0_15px_35px_-10px_rgba(79,70,229,0.6)] hover:scale-110 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale"
                            >
                                <FiSend size={20} />
                            </button>

                        </form>

                        {/* Footer */}

                    </div>

                </div>
            )}

            {/* FLOAT BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-20 h-20 flex items-center justify-center transition-all duration-500 group relative -ml-4 ${isOpen
                    ? 'bg-slate-900 text-white rotate-[135deg] scale-60 rounded-full shadow-lg'
                    : 'bg-transparent text-white hover:scale-110 !shadow-none'
                    }`}
            >
                {isOpen ? <FiX size={32} /> : (
                    <div className="relative w-full h-full flex items-center justify-center ">
                        <img
                            src="/ai-chat.png"
                            alt="Chat"
                            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />

                        <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 border-[3px] border-white rounded-full flex items-center justify-center shadow-md">
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
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideUp {
                    animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default FloatingAIAssistant;
