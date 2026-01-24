
import React, { useState } from 'react';

interface GlossaryViewProps {
  onBack?: () => void;
}

const GLOSSARY = [
  { term: 'Моль', desc: 'Зат мөлшерінің өлшем бірлігі.', subject: 'Химия' },
  { term: 'Валенттілік', desc: 'Атомның химиялық байланыс түзу қабілеті.', subject: 'Химия' },
  { term: 'Осмос', desc: 'Еріткіш молекулаларының жартылай өткізгіш мембрана арқылы өтуі.', subject: 'Биология' },
  { term: 'Митоз', desc: 'Жасушаның теңдей екіге бөлінуі.', subject: 'Биология' },
  { term: 'Ньютон', desc: 'Күштің өлшем бірлігі.', subject: 'Физика' },
  { term: 'Джоуль', desc: 'Энергия мен жұмыстың өлшем бірлігі.', subject: 'Физика' },
  { term: 'Абсцисса', desc: 'X осі бойындағы нүкте координаты.', subject: 'Математика' },
  { term: 'Логарифм', desc: 'Берілген санды алу үшін негізді дәрежелейтін көрсеткіш.', subject: 'Математика' },
];

const GlossaryView: React.FC<GlossaryViewProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Барлығы');

  const subjects = ['Барлығы', 'Химия', 'Биология', 'Физика', 'Математика'];
  
  const filtered = GLOSSARY.filter(item => 
    (activeTab === 'Барлығы' || item.subject === activeTab) &&
    (item.term.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-bottom">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mx-2">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="px-2">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Терминдер Хабы 📖</h2>
        <p className="text-gray-500 text-xs">Пәндер бойынша маңызды анықтамалар мен бірліктер.</p>
      </header>

      <div className="relative px-2">
        <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          type="text" 
          placeholder="Терминді іздеу..." 
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100 font-bold"
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-2">
        {subjects.map(s => (
          <button 
            key={s} 
            onClick={() => setActiveTab(s)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === s ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 px-2">
        {filtered.map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-black text-gray-900 dark:text-white font-outfit">{item.term}</h4>
              <span className="text-[9px] font-black text-indigo-500 uppercase bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{item.subject}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlossaryView;
