
import React from 'react';
import { AppView } from '../types';

interface AIToolsHubProps {
  onSelectView: (view: AppView) => void;
}

const AIToolsHub: React.FC<AIToolsHubProps> = ({ onSelectView }) => {
  const tools = [
    { id: 'flashcards', label: 'Карточкалар', icon: 'fa-clone', color: 'bg-orange-500', desc: 'Жылдам жаттау' },
    { id: 'reaction-balancer', label: 'Реакция Теңестіру', icon: 'fa-equals', color: 'bg-pink-500', desc: 'Коэффициенттерді қою' },
    { id: 'periodic-table', label: 'Периодтық кесте', icon: 'fa-table-cells', color: 'bg-amber-500', desc: 'Химиялық элементтер' },
    { id: 'solubility-table', label: 'Ерігіштік кестесі', icon: 'fa-vial', color: 'bg-blue-500', desc: 'Судағы ерігіштік' },
    { id: 'reactivity-series', label: 'Белсенділік қатары', icon: 'fa-bolt', color: 'bg-red-500', desc: 'Металдар қатары' },
    { id: 'glossary', label: 'Терминдер', icon: 'fa-spell-check', color: 'bg-teal-500', desc: 'Анықтамалар жинағы' },
    { id: 'formulas', label: 'Формулалар', icon: 'fa-square-root-variable', color: 'bg-cyan-600', desc: 'Негізгі заңдар' },
    { id: 'multiplication-table', label: 'Көбейту кестесі', icon: 'fa-calculator', color: 'bg-rose-500', desc: 'Математика негіздері' },
    { id: 'arena', label: 'Arena Battle', icon: 'fa-bolt', color: 'bg-red-500', desc: 'Ботпен жарысу' },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <header className="px-2">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">AI Көмекші ✨</h2>
        <p className="text-gray-500 dark:text-slate-500 text-xs mt-0.5 font-medium">Оқуға көмектесетін интеллектуалды құралдар мен кестелер.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectView(tool.id as AppView)}
            className="bg-white dark:bg-slate-800 p-4 rounded-[30px] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all text-left group"
          >
            <div className={`${tool.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
              <i className={`fas ${tool.icon}`}></i>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-gray-900 dark:text-slate-100 text-sm font-outfit">{tool.label}</h4>
              <p className="text-[9px] font-black text-gray-400 dark:text-slate-500 mt-0.5 uppercase tracking-widest">{tool.desc}</p>
            </div>
            <i className="fas fa-arrow-right text-gray-200 dark:text-slate-700 group-hover:translate-x-1 transition-transform text-[10px]"></i>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[35px] text-white shadow-xl relative overflow-hidden mx-2">
        <i className="fas fa-lightbulb absolute -right-6 -top-6 text-8xl opacity-10 rotate-12"></i>
        <h4 className="text-lg font-black font-outfit mb-1">Пайдалы кеңес</h4>
        <p className="text-xs text-indigo-100 opacity-90 leading-relaxed font-medium">
          Кестелер мен формулаларды күнделікті қайталап отыру жадыңызды жақсартады. "Карточкалар" бөлімін қолданып көріңіз!
        </p>
        <button 
          onClick={() => onSelectView('flashcards')}
          className="mt-4 bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
        >
          Карточкаларды ашу
        </button>
      </div>
    </div>
  );
};

export default AIToolsHub;
