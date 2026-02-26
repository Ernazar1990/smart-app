
import React, { useState, useRef, useEffect } from 'react';
import { getProjectBotResponse } from '../geminiService';
import { ChatMessage } from '../types';

interface AITutorProps {
  onBack?: () => void;
}

const AITutor: React.FC<AITutorProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Сәлем! Мен Smart App көмекшісімін. Платформаның құрылымы, сабақтар немесе жазылым туралы сұрақтарың болса, жауап беруге дайынмын.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await getProjectBotResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[450px] bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in">
      <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="fas fa-arrow-left text-xs"></i>
            </button>
          )}
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
            <i className="fas fa-robot text-xl"></i>
          </div>
          <div>
            <h3 className="font-black text-sm font-outfit tracking-tight">Smart Көмекші</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest">Желіде</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50 dark:bg-slate-900/50 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-gray-100 dark:border-slate-700 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-800">
        <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 focus-within:ring-2 ring-emerald-500/20 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Сұрағыңды жаз..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-10 h-10 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center shadow-lg shadow-emerald-900/20"
          >
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
