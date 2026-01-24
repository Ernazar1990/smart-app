
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const CareerAdvisorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Сәлем! Мен сенің AI кеңесшіңмін. Болашақта кім болғың келетінін немесе қандай пәндерді ұнататыныңды айтсаң, мен саған ең қолайлы мамандықтар мен университеттерді тауып беремін. ✨' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Create new instance of GoogleGenAI right before calling generateContent.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Сен Қазақстандағы жоғары оқу орындары мен ҰБТ мамандықтары бойынша сарапшысың. Оқушының қызығушылығына байланысты (мысалы: ${userMsg}) оған Қазақстандағы ең үздік 3 мамандық пен 3 университетті ұсын. Жауапты қазақ тілінде, нақты және жігерлендіретін стильде жаз.`;
      
      const response = await ai.models.generateContent({
        // Upgraded to 'gemini-3-pro-preview' for complex career reasoning tasks.
        model: 'gemini-3-pro-preview',
        contents: prompt
      });
      // Extract text from property .text
      setMessages(prev => [...prev, { role: 'ai', content: response.text || "Кешіріңіз, қате кетті." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "Байланыс орнату мүмкін болмады." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500">
      <header className="bg-indigo-600 p-6 rounded-t-[40px] text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-arrow-left text-xs"></i>
          </button>
          <div>
            <h3 className="font-black font-outfit">Career Advisor</h3>
            <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Кәсіби бағдар беру</p>
          </div>
        </div>
        <i className="fas fa-user-tie text-2xl opacity-30"></i>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-slate-900/50 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                : 'bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700'
            }`}>
              <p className="text-sm font-medium leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl animate-pulse flex gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 rounded-b-[40px]">
        <div className="flex gap-2 p-2 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Сұрағыңды жаз..." 
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium" 
          />
          <button onClick={handleSend} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerAdvisorView;
