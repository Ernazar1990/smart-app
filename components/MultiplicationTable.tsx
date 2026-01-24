
import React from 'react';

interface MultiplicationTableProps {
  onBack?: () => void;
}

const MultiplicationTable: React.FC<MultiplicationTableProps> = ({ onBack }) => {
  const nums = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="px-2 text-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Көбейту кестесі 🧮</h2>
        <p className="text-gray-500 text-xs uppercase tracking-widest font-black">Математикалық сауаттылық</p>
      </header>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-xl overflow-x-auto">
        <div className="grid grid-cols-11 gap-1 min-w-[320px]">
          <div className="bg-gray-50 dark:bg-slate-900 rounded-lg"></div>
          {nums.map(n => <div key={n} className="p-2 text-center font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-xs">{n}</div>)}
          
          {nums.map(row => (
            <React.Fragment key={row}>
              <div className="p-2 text-center font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-xs">{row}</div>
              {nums.map(col => (
                <div key={col} className="p-2 text-center font-bold text-gray-700 dark:text-slate-300 border border-gray-50 dark:border-slate-700 rounded-lg text-xs hover:bg-emerald-500 hover:text-white transition-colors">
                  {row * col}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiplicationTable;
