
import React from 'react';
import { AppView } from '../types';

interface AIToolsHubProps {
  onSelectView: (view: AppView) => void;
}

const AIToolsHub: React.FC<AIToolsHubProps> = ({ onSelectView }) => {
  const tools = [
    { id: 'tournament', label: 'Tournament Arena', icon: 'fa-trophy', color: 'bg-indigo-600', desc: 'Live жарыстар' },
    { id: 'career-advisor', label: 'Career Advisor', icon: 'fa-user-tie', color: 'bg-indigo-600', desc: 'Мамандық таңдау' },
    { id: 'arena', label: 'Arena Battle', icon: 'fa-bolt', color: 'bg-red-500', desc: 'Ботпен жарысу' },
    { id: 'scanner', label: 'AI Сканер', icon: 'fa-camera', color: 'bg-emerald-500', desc: 'Есепті суретке түсір' },
    { id: 'ai-tutor', label: 'AI Тьютор', icon: 'fa-robot', color: 'bg-indigo-600', desc: '24/7 сұрақ-жауап' },
    { id: 'flashcards', label: 'Карточкалар', icon: 'fa-clone', color: 'bg-orange-500', desc: 'Жылдам жаттау' },
    { id: 'reaction-balancer', label: 'Реакция Теңестіру', icon: 'fa-equals', color: 'bg-pink-500', desc: 'Коэффициенттерді қою' },
    { id: 'periodic-table', label: 'Периодтық кесте', icon: 'fa-table-cells', color: 'bg-amber-500', desc: 'Химиялық элементтер' },
    { id: 'solubility-table', label: 'Ерігіштік кестесі', icon: 'fa-vial', color: 'bg-blue-500', desc: 'Судағы ерігіштік' },
    { id: 'reactivity-series', label: 'Белсенділік қатары', icon: 'fa-bolt', color: 'bg-red-500', desc: 'Металдар қатары' },
    { id: 'glossary', label: 'Терминдер', icon: 'fa-spell-check', color: 'bg-teal-500', desc: 'Анықтамалар жинағы' },
    { id: 'formulas', label: 'Формулалар', icon: 'fa-square-root-variable', color: 'bg-cyan-600', desc: 'Негізгі заңдар' },
  ];

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      <header className="px-2">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">AI Көмекші ✨</h2>
        <p className="text-gray-500 dark:text-slate-500 text-sm mt-1 font-medium">Оқуға көмектесетін интеллектуалды құралдар мен кестелер.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectView(tool.id as AppView)}
            className="bg-white dark:bg-slate-800 p-6 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all text-left group"
          >
            <div className={`${tool.color} w-16 h-16 rounded-[24px] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
              <i className={`fas ${tool.icon}`}></i>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-gray-900 dark:text-slate-100 text-base font-outfit">{tool.label}</h4>
              <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mt-0.5 uppercase tracking-widest">{tool.desc}</p>
            </div>
            <i className="fas fa-arrow-right text-gray-200 dark:text-slate-700 group-hover:translate-x-1 transition-transform text-xs"></i>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[45px] text-white shadow-xl relative overflow-hidden mx-2">
        <i className="fas fa-brain absolute -right-6 -top-6 text-9xl opacity-10 rotate-12"></i>
        <h4 className="text-xl font-black font-outfit mb-2">AI Тьютор жаңалықтары</h4>
        <p className="text-sm text-indigo-100 opacity-90 leading-relaxed font-medium">
          Біздің AI енді химиялық есептерді суреттен 98% дәлдікпен тани алады. Байқап көрдіңіз бе?
        </p>
        <button 
          onClick={() => onSelectView('scanner')}
          className="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
        >
          Сканерді ашу
        </button>
      </div>
    </div>
  );
};

export default AIToolsHub;
