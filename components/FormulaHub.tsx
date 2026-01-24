
import React, { useState } from 'react';

interface FormulaHubProps {
  onBack?: () => void;
}

const FORMULAS = [
  { category: 'Негізгі', title: 'Зат мөлшері', formula: 'n = m / M', desc: 'm - масса, M - молярлық масса' },
  { category: 'Ерітінділер', title: 'Массалық үлес', formula: 'ω = (m_зат / m_ерітінді) * 100%', desc: 'Еріген заттың пайыздық мөлшері' },
  { category: 'Газдар', title: 'Идеал газ күйі', formula: 'PV = nRT', desc: 'Менделеев-Клапейрон теңдеуі' },
  { category: 'Энергетика', title: 'Энтальпия өзгерісі', formula: 'ΔH = ΣH_өнім - ΣH_реак', desc: 'Гесс заңының салдары' },
];

const FormulaHub: React.FC<FormulaHubProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');

  const filtered = FORMULAS.filter(f => 
    f.title.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-bottom">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Формулалар Хабы 📐</h2>
          <p className="text-gray-500 text-sm">Барлық маңызды химиялық формулалар</p>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-2xl text-xs font-black">
          {FORMULAS.length} жинақ
        </div>
      </header>

      <div className="relative">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          type="text" 
          placeholder="Формуланы іздеу..." 
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-100"
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((f, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm group hover:border-emerald-500 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400 text-[9px] font-black px-2 py-1 rounded-full uppercase">{f.category}</span>
              <button className="text-gray-300 hover:text-emerald-500"><i className="far fa-star"></i></button>
            </div>
            <h4 className="font-black text-gray-900 dark:text-slate-100 mb-2">{f.title}</h4>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl text-center mb-3">
              <code className="text-emerald-700 dark:text-emerald-400 font-black text-lg">{f.formula}</code>
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500 font-medium italic">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormulaHub;
