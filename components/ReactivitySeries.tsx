
import React from 'react';

interface ReactivitySeriesProps {
  onBack?: () => void;
}

const ReactivitySeries: React.FC<ReactivitySeriesProps> = ({ onBack }) => {
  const metals = [
    { s: 'Li', n: 'Литий', active: true }, { s: 'K', n: 'Калий', active: true }, { s: 'Ba', n: 'Барий', active: true }, 
    { s: 'Ca', n: 'Кальций', active: true }, { s: 'Na', n: 'Натрий', active: true }, { s: 'Mg', n: 'Магний', active: true },
    { s: 'Al', n: 'Алюминий', active: true }, { s: 'Zn', n: 'Цинк', active: false }, { s: 'Fe', n: 'Темір', active: false }, 
    { s: 'Ni', n: 'Никель', active: false }, { s: 'Sn', n: 'Қалайы', active: false }, { s: 'Pb', n: 'Қорғасын', active: false },
    { s: 'H', n: 'Сутегі', active: false, special: true }, { s: 'Cu', n: 'Мыс', active: false, noble: true }, 
    { s: 'Hg', n: 'Сынап', active: false, noble: true }, { s: 'Ag', n: 'Күміс', active: false, noble: true }, 
    { s: 'Pt', n: 'Платина', active: false, noble: true }, { s: 'Au', n: 'Алтын', active: false, noble: true }
  ];

  return (
    <div className="space-y-8 pb-24 animate-in slide-in-from-bottom">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="px-2">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Белсенділік қатары ⚡</h2>
        <p className="text-gray-500 text-xs">Металдардың электрохимиялық кернеу қатары.</p>
      </header>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[45px] border border-gray-100 dark:border-slate-700 shadow-xl space-y-8 overflow-hidden">
        <div className="flex flex-wrap justify-center gap-3">
          {metals.map((m, i) => (
            <div key={m.s} className="flex flex-col items-center gap-1 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all group-hover:scale-110 ${
                m.special ? 'bg-indigo-600 border-indigo-200 text-white' :
                m.noble ? 'bg-amber-50 border-amber-200 text-amber-700' :
                'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
              }`}>
                {m.s}
              </div>
              <span className="text-[8px] font-black uppercase text-gray-400 dark:text-slate-500">{m.n}</span>
            </div>
          ))}
        </div>

        <div className="relative h-2 bg-gray-100 dark:bg-slate-900 rounded-full">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 w-full rounded-full opacity-50"></div>
          <div className="absolute -top-6 left-0 text-[10px] font-black text-emerald-600">БЕЛСЕНДІ</div>
          <div className="absolute -top-6 right-0 text-[10px] font-black text-red-500">ИНЕРТТІ</div>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
        <h4 className="text-xs font-black text-indigo-800 dark:text-indigo-400 uppercase tracking-widest mb-2">Ереже:</h4>
        <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
          Сол жақта орналасқан металл оң жақтағы металды оның тұздарының ерітіндісінен ығыстырып шығарады. Сутегіге дейінгі металдар қышқылдардан сутегіні ығыстырады.
        </p>
      </div>
    </div>
  );
};

export default ReactivitySeries;
