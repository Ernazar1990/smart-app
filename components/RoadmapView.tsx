
import React, { useState, useEffect } from 'react';
import { Module, UserProgress, Lesson, Subject } from '../types';

interface RoadmapViewProps {
  onBack: () => void;
  allModules: Record<string, Module[]>;
  user: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  subjects: Subject[];
  initialSubjectId?: string | null;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ onBack, allModules, user, onSelectLesson, subjects, initialSubjectId }) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  
  useEffect(() => {
    const btn = document.getElementById(`week-btn-${selectedWeek}`);
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedWeek]);
  
  // Get all relevant subjects (3 mandatory + 2 electives)
  const mySubjects = subjects.filter(sub => 
    !sub.isElective || user.chosenElectives.includes(sub.id)
  );

  const [activeSubjectId, setActiveSubjectId] = useState(initialSubjectId || mySubjects[0]?.id || 'chem');
  
  // Update activeSubjectId if initialSubjectId changes
  useEffect(() => {
    if (initialSubjectId) {
      setActiveSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);
  
  const modules = allModules[activeSubjectId] || [];
  const currentModule = modules.find(m => m.weekNumber === selectedWeek) || modules[0];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-500">
      {/* Upper Info Section */}
      <header className="space-y-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-[30px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center text-lg shadow-lg shadow-amber-100">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white font-outfit">Дайындық жоспары</h2>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">Барлық пәндер бойынша апталық кесте</p>
              </div>
           </div>
           
           {/* Subject Selector inside Roadmap */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
             {mySubjects.map(sub => (
               <button
                 key={sub.id}
                 onClick={() => setActiveSubjectId(sub.id)}
                 className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 ${
                   activeSubjectId === sub.id
                   ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                   : 'bg-white dark:bg-slate-900 text-slate-400 border-gray-100 dark:border-slate-700'
                 }`}
               >
                 <i className={`fas ${sub.icon} text-[10px]`}></i>
                 {sub.name}
               </button>
             ))}
           </div>
        </div>

        {/* Weeks Selection Tabs - Скриншот стилі */}
        <div className="relative group flex items-center gap-2">
          <button 
            onClick={() => {
              const el = document.getElementById('weeks-container');
              if (el) el.scrollBy({ left: -200, behavior: 'smooth' });
            }}
            className="hidden md:flex w-8 h-8 items-center justify-center bg-white dark:bg-slate-800 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm text-slate-400 hover:text-indigo-600 shrink-0"
          >
            <i className="fas fa-chevron-left text-[10px]"></i>
          </button>

          <div id="weeks-container" className="flex-1 flex gap-2 overflow-x-auto pb-4 px-1 scroll-smooth custom-scrollbar no-scrollbar md:scrollbar-auto">
            {Array.from({ length: modules.length || 8 }).map((_, i) => (
              <button
                key={i}
                id={`week-btn-${i+1}`}
                onClick={() => setSelectedWeek(i + 1)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 ${
                  selectedWeek === (i + 1) 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                    : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                }`}
              >
                Апта {i + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              const el = document.getElementById('weeks-container');
              if (el) el.scrollBy({ left: 200, behavior: 'smooth' });
            }}
            className="hidden md:flex w-8 h-8 items-center justify-center bg-white dark:bg-slate-800 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm text-slate-400 hover:text-indigo-600 shrink-0"
          >
            <i className="fas fa-chevron-right text-[10px]"></i>
          </button>
          
          {/* Scroll Hint for mobile */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none md:hidden"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lessons List Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-[30px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Модуль {selectedWeek}</p>
                <h4 className="text-lg font-black text-slate-800 dark:text-white font-outfit line-clamp-1">{currentModule?.title.replace(/^\d+-тарау\.\s*/, '')}</h4>
              </div>
              <button onClick={() => setSelectedWeek(selectedWeek + 1)} className="bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg text-slate-400 text-[10px] font-bold hover:text-indigo-600 transition-colors">Келесі <i className="fas fa-chevron-right ml-1"></i></button>
            </div>

            <div className="space-y-2">
              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Сабақтар</h5>
              {currentModule?.lessons.length === 0 ? (
                <p className="text-center py-6 text-slate-400 text-[10px] font-black uppercase">Сабақтар әлі қосылмаған</p>
              ) : (
                currentModule?.lessons.map((lesson) => (
                  <div key={lesson.id} className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-[20px] flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border-2 ${user.completedLessons.includes(lesson.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}>
                        {user.completedLessons.includes(lesson.id) && <i className="fas fa-check text-[8px] text-white flex items-center justify-center h-full"></i>}
                      </div>
                      <div>
                        <h6 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{lesson.title}</h6>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">40-60 минут</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSelectLesson(lesson)}
                      className="bg-white dark:bg-slate-700 px-4 py-1.5 rounded-lg text-indigo-600 font-black text-[9px] uppercase tracking-widest shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      Ашу
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Weekly Tasks Sidebar - Скриншот стилі */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-[30px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Апталық міндеттер</h5>
            <div className="space-y-3">
              {[
                { title: 'Апталық тест', desc: 'Тестті орындау міндетті', icon: 'fa-vial' },
                { title: 'Үй жұмысы', desc: 'Куратор тексереді', icon: 'fa-tasks' },
                { title: 'Қатемен жұмыс', desc: 'Түзетсеңіз — прогресс артады', icon: 'fa-history' },
              ].map((duty, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-900/30 opacity-70">
                   <div className="w-4 h-4 rounded border-2 border-slate-200"></div>
                   <div className="flex-1">
                     <h6 className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{duty.title}</h6>
                     <p className="text-[8px] text-slate-400 font-medium">{duty.desc}</p>
                   </div>
                   <i className={`fas ${duty.icon} text-slate-300 text-[10px]`}></i>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t dark:border-slate-700">
               <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl flex items-start gap-2">
                  <i className="fas fa-lightbulb text-indigo-400 mt-0.5 text-xs"></i>
                  <p className="text-[8px] font-bold text-indigo-900 dark:text-indigo-200 leading-relaxed">
                    Ереже: Осы аптаның барлық тапсырмасын орындап, келесі аптаға жолдама ал.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
