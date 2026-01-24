
import React, { useState, useRef, useEffect } from 'react';
import { getChemistryExplanation } from '../geminiService';
import { ChatMessage } from '../types';

interface AITutorProps {
  onBack?: () => void;
}

const AITutor: React.FC<AITutorProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Сәлем! Мен EasyUBT AI тьюторымын. Химиядан кез келген сұрағың болса қоя бер. Реакция теңдеуін түсіндіру немесе есеп шығаруға көмектесемін.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU'; // Kazakh is often not supported well, RU fallback or custom TTS needed
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatChemicalText = (text: string) => {
    const subscriptMap: any = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
    return text.replace(/([A-Z][a-z]?|\))(\d+)/g, (match, p1, p2) => {
      const formattedDigits = p2.split('').map((d: string) => subscriptMap[d] || d).join('');
      return p1 + formattedDigits;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await getChemistryExplanation(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setLoading(false);
    
    // Auto-speak the response
    speakText(response);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in">
      <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors mr-1">
              <i className="fas fa-arrow-left text-xs"></i>
            </button>
          )}
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i className="fas fa-robot text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-sm">Химия Тьюторы (AI)</h3>
            <p className="text-[10px] text-emerald-100">{isSpeaking ? 'Сөйлеп тұр...' : 'Желіде • Түсіндіруге дайын'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => window.speechSynthesis.cancel()} 
             className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}
           >
             <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-volume-up'} text-[10px]`}></i>
           </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-slate-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm relative group ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 border border-gray-100 dark:border-slate-700 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{formatChemicalText(m.content)}</p>
              {m.role === 'model' && (
                <button 
                  onClick={() => speakText(m.content)} 
                  className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-emerald-500 transition-all"
                >
                  <i className="fas fa-volume-up"></i>
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
        <div className="flex gap-2 p-2 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 focus-within:border-emerald-500 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Сұрағыңды жаз..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-gray-800 dark:text-slate-100 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-10 h-10 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">AI қателіктер жіберуі мүмкін.</p>
      </div>
    </div>
  );
};

export default AITutor;
