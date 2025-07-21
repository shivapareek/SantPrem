import React, { useState, useEffect, useRef } from "react";
import { Send, RefreshCcw } from "lucide-react";

const API_URL = "http://localhost:4000/chat";

const ChatbotZone = () => {
  const initialMessage = {
    type: "bot",
    text: " श्रीजी की कृपा से संतप्रेम में आपका स्वागत है ।",
    timestamp: formatTime(),
  };

  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [animatedText, setAnimatedText] = useState(null);
  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, animatedText]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function formatTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const handleSend = async () => {
    if (!input.trim() || loading || animatedText) return;

    setError(null);

    const userMessage = {
      type: "user",
      text: input.trim(),
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentInput }),
      });

      const data = await response.json();
      const fullText = data.reply || "याचना: कृपा के अभाव से उत्तर नाहीं मिला ।";

      let i = 0;
      setAnimatedText({ text: "", index: 0, fullText });

      setTimeout(() => {
        const interval = setInterval(() => {
          i++;
          setAnimatedText({ text: fullText.slice(0, i), index: i, fullText });

          if (i >= fullText.length) {
            clearInterval(interval);
            setMessages((prev) => [...prev, {
              type: "bot",
              text: fullText,
              timestamp: formatTime(),
            }]);
            setAnimatedText(null);
            setIsTyping(false);
          }
        }, 10);
      }, 500);

    } catch (err) {
      console.error(err);
      setError("कुछ तकनीकी समस्या हो गई है। कृपया पुनः प्रयास करें।");
      setIsTyping(false);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([initialMessage]);
    setInput("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-amber-100 flex justify-center px-2 sm:px-4 overflow-hidden">


      <div className="absolute inset-0 bg-gradient-to-br from-yellow-950 via-black to-yellow-950 opacity-10 animate-gradient z-0" />

      <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow bg-black relative z-10 rounded-lg shadow-lg border border-yellow-500/20 overflow-hidden">

        <header className="bg-black border-b border-yellow-500/30 py-3 px-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-yellow-400">SantPrem AI</h1>
              <p className="text-yellow-300 text-xs sm:text-sm mt-1">आत्मा की आवाजा में आत्मा का संवाद</p>
            </div>
            <button onClick={resetChat} className="text-yellow-400 hover:text-yellow-300 transition">
              <RefreshCcw className="w-5 h-5" title="Reset Chat" />
            </button>
          </div>
        </header>

        <div className="chat-scroll flex-1 overflow-y-auto px-3 py-4 space-y-4 min-h-0" aria-live="polite">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-md px-4 py-2 rounded-2xl text-sm shadow-md ${
                msg.type === "user"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 border border-yellow-500/20 text-amber-100"
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <div className="text-xs text-right mt-1 opacity-60">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {animatedText && (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-md px-4 py-2 bg-gray-800 border border-yellow-500/20 text-amber-100 rounded-2xl text-sm shadow-md">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {animatedText.text}<span className="animate-pulse">|</span>
                </p>
              </div>
            </div>
          )}

          {isTyping && !animatedText && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-gray-800 rounded-2xl border border-yellow-500/30">
                <div className="w-36 h-4 bg-yellow-700/30 animate-pulse rounded" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center pt-2">
              {error} <button onClick={handleSend} className="underline ml-2">Retry</button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <footer className="p-3 border-t border-yellow-500/20 bg-black flex-shrink-0">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="अपना प्रश्न यहां लिखें..."
                aria-label="अपना प्रश्न यहां लिखें"
                className="w-full max-h-[120px] overflow-y-auto bg-black text-amber-100 placeholder:text-yellow-400/70 px-4 py-3 rounded-lg border border-yellow-500/30 resize-none outline-none focus:ring-2 focus:ring-yellow-500/40 text-sm"
                rows={1}
              />
              <p className="text-xs text-yellow-400 text-right mt-1">Enter to send • Shift+Enter for newline</p>
            </div>
            <button
              onClick={handleSend}
              disabled={loading || !input.trim() || animatedText}
              aria-label="Send message"
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black font-semibold p-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 20s ease infinite;
        }
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(234, 179, 8, 0.5);
          border-radius: 3px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(234, 179, 8, 0.5) transparent;
        }
        html, body {
          height: 100%;
          margin: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ChatbotZone;
