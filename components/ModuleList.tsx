
import React, { useState } from 'react';
import { Module, UserProgress, Subject, Lesson } from '../types';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  BarChart3, 
  Coins, 
  ChevronDown, 
  Play, 
  Lock,
  Clock,
  Eye,
  ChevronRight
} from 'lucide-react';

interface ModuleListProps {
  user: UserProgress;
  onSelectLesson: (lesson: any) => void;
  modules: Module[];
  subjects: Subject[];
  selectedSubjectId: string | null;
  onSelectSubject: (id: string) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({ user, onSelectLesson, modules, subjects, selectedSubjectId, onSelectSubject }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const mySubjects = subjects.filter(sub => {
    // Show mandatory subjects and only the chosen elective subjects
    return !sub.isElective || user.chosenElectives.includes(sub.id);
  });

  const toggleModule = (modId: string) => {
    setExpandedModule(expandedModule === modId ? null : modId);
  };

  if (!selectedSubjectId) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <header className="px-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Дайындық</h2>
          <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Оқу жоспарыңыз бен таңдалған пәндеріңіз.</p>
        </header>

        <section className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Менің пәндерім</h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {mySubjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`p-6 rounded-[36px] border border-warm-100 dark:border-warm-800 shadow-sm flex items-center gap-6 hover:border-primary-400 dark:hover:border-primary-400 hover:shadow-xl hover:-translate-y-1 transition-all text-left group relative overflow-hidden ${
                  `bg-gradient-to-br ${sub.color.replace('bg-', 'from-')}/10 to-white dark:to-warm-900`
                }`}
              >
                {/* Decorative Icon Background */}
                <div className={`absolute -right-4 -bottom-4 opacity-[0.05] dark:opacity-[0.1] text-6xl rotate-12 group-hover:rotate-0 transition-transform duration-700 ${sub.color.replace('bg-', 'text-')}`}>
                  <i className={`fas ${sub.icon}`}></i>
                </div>

                <div className={`${sub.color} w-16 h-16 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg shadow-current/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-10`}>
                  <i className={`fas ${sub.icon}`}></i>
                </div>
                <div className="flex-1 z-10">
                  <h5 className="font-extrabold text-slate-900 dark:text-warm-50 text-lg font-outfit leading-tight">{sub.name}</h5>
                  <p className="text-[10px] text-warm-400 dark:text-warm-500 uppercase font-bold tracking-widest mt-1">Оқуды жалғастыру</p>
                </div>
                <ChevronRight size={20} className="text-warm-300 dark:text-warm-700 group-hover:translate-x-1 transition-transform z-10" />
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessonsCount = modules.reduce((acc, mod) => acc + mod.lessons.filter(l => user.completedLessons.includes(l.id)).length, 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const isSubjectChosen = currentSubject && (
    !currentSubject.isElective || 
    (user.chosenElectives.includes(currentSubject.id) && (user.subscription === 'Free' || (user.activeSubjects || []).includes(currentSubject.id)))
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      <header className="space-y-6">
        <button onClick={() => onSelectSubject('')} className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-widest mb-1 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Пәндерге оралу
        </button>
        
        {!isSubjectChosen && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[32px] border border-amber-100 dark:border-amber-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Eye size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white font-outfit">Шолу режимі</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Бұл пән сіздің таңдау пәндеріңізге кірмейді.</p>
              </div>
            </div>
            <button 
              onClick={() => onSelectSubject('')}
              className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
            >
              Пәнді таңдау
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Барлығы', value: totalLessons, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Аяқталды', value: completedLessonsCount, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Прогресс', value: `${progressPercent}%`, icon: BarChart3, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
            { label: 'Балл', value: user.points, icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-base font-black font-outfit">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black font-outfit text-slate-800 dark:text-white uppercase tracking-widest">Курс прогресі</h4>
            <span className="text-xs font-black text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {completedLessonsCount} / {totalLessons} сабақ аяқталды • {modules.length} тарау
          </p>
        </div>
      </header>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-black font-outfit text-slate-800 dark:text-white">Бағдарлама бөлімдері</h3>
          <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">{modules.length} тарау</span>
        </div>

        <div className="space-y-4">
          {modules.map((module, idx) => {
            const isExpanded = expandedModule === module.id;
            const completedInModule = module.lessons.filter(l => user.completedLessons.includes(l.id)).length;
            const moduleProgress = module.lessons.length > 0 ? Math.round((completedInModule / module.lessons.length) * 100) : 0;

            return (
              <div key={module.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      isExpanded ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                    }`}>
                      {idx + 1}-бөлім
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm font-outfit text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">
                        {module.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1 max-w-[120px] h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${moduleProgress}%` }}></div>
                        </div>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                          {moduleProgress}% <span className="text-slate-300 dark:text-slate-600 ml-1">{completedInModule} / {module.lessons.length}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ml-4 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-6 space-y-2 animate-in slide-in-from-top duration-300">
                    {module.lessons.length === 0 ? (
                      <p className="p-4 text-center text-[9px] font-black text-slate-400 uppercase">Сабақтар әлі қосылмаған</p>
                    ) : (
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => {
                          const lDone = user.completedLessons.includes(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                if (!isSubjectChosen && !lesson.isFree) {
                                  alert('Бұл сабақты көру үшін пәнді таңдауыңыз қажет немесе Premium жазылым алыңыз.');
                                  return;
                                }
                                onSelectLesson(lesson);
                              }}
                              className={`w-full p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all flex items-center gap-4 group relative ${
                                !isSubjectChosen && !lesson.isFree ? 'opacity-60 grayscale-[0.5]' : ''
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                                lDone ? 'bg-emerald-100 text-emerald-600' : 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm group-hover:scale-110'
                              }`}>
                                {lDone ? <CheckCircle size={18} /> : <Play size={16} className="fill-current" />}
                              </div>
                              <div className="flex-1 text-left">
                                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-tight mb-1">{lesson.title}</h5>
                                <div className="flex items-center gap-3">
                                  <span className="text-[8px] font-medium text-slate-400 flex items-center gap-1">
                                    <Clock size={10} /> 45 мин
                                  </span>
                                  <span className="text-[8px] font-black text-amber-500 flex items-center gap-1">
                                    <Coins size={10} /> 10 балл
                                  </span>
                                </div>
                              </div>
                              {!lesson.isFree && !lDone && (
                                <div className="text-slate-400">
                                  <Lock size={14} />
                                </div>
                              )}
                            </button>
                          );
                        })}

                        {/* Chapter Test Button */}
                        <button
                          onClick={() => {
                            if (user.subscription === 'Free') {
                              alert('Тараулық тест тек Premium оқушыларға қолжетімді.');
                              return;
                            }
                            // Trigger test view for this chapter
                            onSelectLesson({ id: `test-chapter-${module.id}`, title: `${module.title}: Тараулық тест`, isTest: true, testType: 'chapter', subjectId: selectedSubjectId });
                          }}
                          className="w-full p-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-between group hover:scale-[1.02] active:scale-95 transition-all mt-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                              <i className="fas fa-file-signature text-sm"></i>
                            </div>
                            <div className="text-left">
                              <h5 className="font-black text-xs uppercase tracking-wider">Тараулық тест</h5>
                              <p className="text-[9px] opacity-70 font-bold uppercase tracking-widest">Біліміңді тексер • 20 сұрақ</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Monthly Test Button (Every 4 weeks) */}
                        {module.weekNumber % 4 === 0 && (
                          <button
                            onClick={() => {
                              if (user.subscription === 'Free') {
                                alert('Айлық тест тек Premium оқушыларға қолжетімді.');
                                return;
                              }
                              onSelectLesson({ id: `test-monthly-${module.weekNumber}`, title: `${Math.floor(module.weekNumber/4)}-айлық қорытынды тест`, isTest: true, testType: 'monthly', subjectId: selectedSubjectId });
                            }}
                            className="w-full p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-between group hover:scale-[1.02] active:scale-95 transition-all mt-2"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <i className="fas fa-calendar-check text-sm"></i>
                              </div>
                              <div className="text-left">
                                <h5 className="font-black text-xs uppercase tracking-wider">Айлық тест</h5>
                                <p className="text-[9px] opacity-70 font-bold uppercase tracking-widest">Айлық қорытынды • 40 сұрақ</p>
                              </div>
                            </div>
                            <ChevronRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleList;
