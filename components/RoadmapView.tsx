
import React from 'react';
import { Module, UserProgress } from '../types';

interface RoadmapViewProps {
  onBack: () => void;
  modules: Module[];
  user: UserProgress;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ onBack, modules, user }) => {
  // Determine icon based on topic keyword
  const getIcon = (title: string) => {
    if (title.includes('Атом')) return 'fa-atom';
    if (title.includes('Органика')) return 'fa-leaf';
    if (title.includes('Металл')) return 'fa-hammer';
    if (title.includes('Есеп')) return 'fa-calculator';
    if (title.includes('Период')) return 'fa-table-cells';
    return 'fa-flask';
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      <header className="flex items-center gap-4 px-2">
        <button onClick={onBack} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left text-gray-400"></i>
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Химия: Даму жолы 🗺️</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Барлығы: {modules.length} модуль</p>
        </div>
      </header>

      <div className="relative px-6">
        {/* Main path line */}
        <div className="absolute left-[51px] top-10 bottom-10 w-1.5 bg-gray-100 dark:bg-slate-800/50 -z-10 rounded-full"></div>

        <div className="space-y-10">
          {modules.map((mod, i) => {
            const isCompleted = mod.lessons.every(l => user.completedLessons.includes(l.id));
            const isActive = !isCompleted && (i === 0 || modules[i-1].lessons.every(l => user.completedLessons.includes(l.id)));
            const isLocked = !isCompleted && !isActive;

            return (
              <div key={mod.id} className="flex items-center gap-6 group">
                {/* Milestone Node */}
                <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center text-xl transition-all shadow-lg border-4 shrink-0 ${
                  isCompleted ? 'bg-emerald-500 border-emerald-100 text-white shadow-emerald-100' :
                  isActive ? 'bg-white dark:bg-slate-800 border-indigo-600 text-indigo-600 scale-110 shadow-indigo-100 ring-4 ring-indigo-50 dark:ring-indigo-900/20' :
                  'bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-300'
                }`}>
                  <i className={`fas ${getIcon(mod.title)}`}></i>
                </div>

                {/* Info Card */}
                <div className={`flex-1 p-5 rounded-[30px] border transition-all ${
                  isActive ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700 shadow-xl' :
                  isCompleted ? 'bg-white/50 dark:bg-slate-900/50 border-emerald-50 dark:border-emerald-900/20' :
                  'bg-white/30 dark:bg-slate-900/30 border-gray-50 dark:border-slate-800/50 opacity-60'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                      Модуль {i + 1}
                    </span>
                    {isCompleted && <i className="fas fa-check-circle text-emerald-500"></i>}
                    {isLocked && <i className="fas fa-lock text-gray-200 text-[10px]"></i>}
                  </div>
                  <h4 className={`font-black font-outfit text-sm leading-tight ${isLocked ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {mod.title.split('. ')[1] || mod.title}
                  </h4>
                  {isActive && (
                    <div className="mt-3 flex items-center gap-2">
                       <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: '0%' }}></div>
                       </div>
                       <span className="text-[8px] font-black text-indigo-600 uppercase">Бастау</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
