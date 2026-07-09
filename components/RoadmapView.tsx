
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
    <div className="space-y-6 pt-10 pb-20 animate-in fade-in duration-700">
      {/* Upper Info Section */}
      <header className="space-y-6">
        <div className="bg-white dark:bg-warm-800 p-6 md:p-8 rounded-[40px] border border-warm-100 dark:border-warm-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-amber-100 dark:shadow-none">
                <i className="fas fa-calendar-check line-clamp-1"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-warm-50 font-outfit tracking-tight">Дайындық жоспары</h2>
                <p className="text-warm-400 dark:text-warm-500 text-[10px] font-bold uppercase tracking-widest mt-1">Барлық пәндер бойынша апталық кесте</p>
              </div>
           </div>
           
           {/* Subject Selector inside Roadmap */}
           <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 max-w-full">
             {mySubjects.map(sub => (
               <button
                 key={sub.id}
                 onClick={() => setActiveSubjectId(sub.id)}
                 className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 flex items-center gap-3 ${
                   activeSubjectId === sub.id
                   ? `bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200 dark:shadow-none`
                   : `bg-warm-50/50 dark:bg-warm-900 text-warm-400 border-warm-100 dark:border-warm-800 hover:border-primary-400`
                 }`}
               >
                 <i className={`fas ${sub.icon} text-xs`}></i>
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
                className={`px-7 py-4 rounded-[28px] text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 shrink-0 ${
                  selectedWeek === (i + 1) 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                    : 'bg-warm-50 text-warm-500 border-warm-100 dark:bg-warm-900 dark:border-warm-800 hover:bg-warm-100'
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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-warm-800 p-6 md:p-8 rounded-[40px] border border-warm-100 dark:border-warm-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-warm-50 dark:border-warm-700/50 pb-5">
              <div>
                <p className="text-[10px] font-black text-warm-400 uppercase tracking-widest">Модуль {selectedWeek}</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-warm-50 font-outfit line-clamp-1">{currentModule?.title.replace(/^\d+-тарау\.\s*/, '')}</h4>
              </div>
              <button onClick={() => setSelectedWeek(selectedWeek + 1)} className="bg-warm-50 dark:bg-warm-900 px-4 py-2 rounded-xl text-warm-500 text-[11px] font-bold hover:text-primary-600 transition-colors">Келесі <i className="fas fa-chevron-right ml-1"></i></button>
            </div>

            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-warm-400 uppercase tracking-widest ml-3">Сабақтар</h5>
              {currentModule?.lessons.length === 0 ? (
                <p className="text-center py-10 text-warm-400 text-[11px] font-black uppercase tracking-widest">Сабақтар әлі қосылмаған</p>
              ) : (
                currentModule?.lessons.map((lesson) => (
                  <div key={lesson.id} className="bg-warm-50/50 dark:bg-warm-900/50 p-5 rounded-[28px] flex items-center justify-between group hover:bg-white dark:hover:bg-warm-800 transition-all border border-transparent hover:border-warm-100 dark:hover:border-warm-700 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-md border-2 ${user.completedLessons.includes(lesson.id) ? 'bg-emerald-500 border-emerald-500' : 'border-warm-200 dark:border-warm-700'}`}>
                        {user.completedLessons.includes(lesson.id) && <i className="fas fa-check text-[10px] text-white flex items-center justify-center h-full"></i>}
                      </div>
                      <div>
                        <h6 className="font-extrabold text-slate-800 dark:text-warm-50 text-sm">{lesson.title}</h6>
                        <p className="text-[10px] text-warm-400 font-bold uppercase tracking-tight mt-1">40-60 минут • Бейне-сабақ</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSelectLesson(lesson)}
                      className="bg-white dark:bg-warm-700 px-6 py-2.5 rounded-xl text-primary-600 dark:text-warm-200 font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-primary-600 hover:text-white transition-all border border-warm-50 dark:border-warm-600"
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
        <div className="space-y-6 lg:mt-10">
          <div className="bg-white dark:bg-warm-800 p-6 md:p-8 rounded-[40px] border border-warm-100 dark:border-warm-700 shadow-sm space-y-6">
            <h5 className="text-[10px] font-black text-warm-400 uppercase tracking-widest px-2">Апталық міндеттер</h5>
            <div className="space-y-4">
              {[
                { title: 'Апталық тест', desc: 'Тестті орындау міндетті', icon: 'fa-vial' },
                { title: 'Үй жұмысы', desc: 'Куратор тексереді', icon: 'fa-tasks' },
                { title: 'Қатемен жұмыс', desc: 'Түзетсеңіз — прогресс артады', icon: 'fa-history' },
              ].map((duty, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-[28px] bg-warm-50/50 dark:bg-warm-900/30 border border-warm-50 dark:border-warm-800">
                   <div className="w-5 h-5 rounded-md border-2 border-warm-200 dark:border-warm-700"></div>
                   <div className="flex-1">
                     <h6 className="font-extrabold text-slate-800 dark:text-warm-50 text-[12px]">{duty.title}</h6>
                     <p className="text-[10px] text-warm-400 font-medium leading-tight">{duty.desc}</p>
                   </div>
                   <i className={`fas ${duty.icon} text-warm-300 dark:text-warm-700 text-sm`}></i>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-warm-50 dark:border-warm-700">
               <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-2xl flex items-start gap-3">
                  <i className="fas fa-lightbulb text-primary-400 mt-1 text-sm"></i>
                  <p className="text-[10px] font-bold text-primary-900 dark:text-primary-200 leading-relaxed">
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
