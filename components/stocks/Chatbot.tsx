"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([
    { role: "ai", text: "Hello! Main StockScan AI hu. Aap kis company ya stock ke baare me analysis chahte hain?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages as any);
    setInput("");
    setIsLoading(true);

    console.log("💬 [DEBUG] Sending message to backend:", input);

    try {
      // API call to your backend AI chat endpoint
      const res = await fetch("http://localhost:8000/ai-agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      console.log("🤖 [DEBUG] Response from backend:", data);
      setMessages([...newMessages, { role: "ai", text: data.reply || "API response me kuch issue hai." }] as any);
    } catch (error) {
      console.error("❌ [DEBUG] Fetch error in Chatbot:", error);
      setMessages([...newMessages, { role: "ai", text: "Backend server (port 8000) se connect nahi ho paaya." }] as any);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-[#111827] border border-slate-700 w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-amber-500 p-4 flex justify-between items-center shadow-md">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> StockScan AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-900 hover:text-slate-700 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-amber-500 text-slate-900 rounded-br-none font-medium' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 text-sm rounded-bl-none animate-pulse">Typing...</div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-800 bg-[#111827] flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Type a company name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={isLoading} className="bg-amber-500 p-2.5 rounded-xl text-slate-900 hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-sm">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center animate-bounce-once">
          <MessageCircle className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}