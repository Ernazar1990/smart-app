import React from 'react';
import { UserProgress, Subject } from '../types';

interface HomeViewProps {
  user: UserProgress;
  subjects: Subject[];
  onSelectView: (view: any) => void;
  onSelectSubject: (subjectId: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, subjects, onSelectView, onSelectSubject }) => {
  // Рөлге байланысты атауды анықтау
  const getRoleGreeting = () => {
    const firstName = user.name.split(' ')[0];
    switch (user.role) {
      case 'super-admin':
        return `Админ ${firstName}`;
      case 'teacher':
        return `Куратор ${firstName}`;
      default:
        return `Оқушы ${firstName}`;
    }
  };

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-700">
      
      {/* 1. Header with Level & XP */}
      <section className="flex justify-between items-center px-2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white dark:border-slate-800">
            {user.level}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-gray-900 dark:text-white font-outfit tracking-tight leading-none">
              Сәлем, {getRoleGreeting()}! 👋
            </h1>
            <div className="flex items-center gap-2">
               <div className="w-24 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500" style={{ width: '65%' }}></div>
               </div>
               <span className="text-[9px] font-black text-gray-400 uppercase">lvl up: 65%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onSelectView('roadmap')} className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full flex items-center justify-center shadow-sm">
            <i className="fas fa-map-marked-alt"></i>
          </button>
          <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-800/50">
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">{user.points} <i className="fas fa-star text-[8px] ml-0.5"></i></span>
          </div>
        </div>
      </section>

      {/* 2. Tournament Banner */}
      <section 
        onClick={() => onSelectView('tournament')}
        className="bg-gradient-to-br from-amber-400 to-orange-600 rounded-[40px] p-6 text-white shadow-xl relative overflow-hidden cursor-pointer group"
      >
        <div className="absolute -right-4 -bottom-4 text-8xl text-white/20 rotate-12 group-hover:scale-110 transition-transform">
          <i className="fas fa-trophy"></i>
        </div>
        <div className="relative z-10 flex items-center gap-4">
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl animate-pulse">
             <i className="fas fa-bolt"></i>
           </div>
           <div>
             <h3 className="font-black font-outfit text-lg">Live Турнир: Химия</h3>
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Қазір қосыл, 1500+ оқушы жарысуда</p>
           </div>
        </div>
      </section>

      {/* 3. AI Smart Suggestion */}
      <section 
        onClick={() => onSelectView('module-list')}
        className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group cursor-pointer"
      >
        <i className="fas fa-magic absolute -right-6 -top-6 text-9xl opacity-10 rotate-12 group-hover:scale-110 transition-transform"></i>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
            <i className="fas fa-brain"></i> AI Ұсынысы
          </div>
          <h2 className="text-2xl font-black font-outfit leading-tight">Бүгінгі мақсат: <br/> "Зат мөлшері" тақырыбы</h2>
          <p className="text-indigo-100 text-xs font-medium opacity-90 max-w-[200px]">Білім картасы бойынша осы тақырыптан әлі балл жинамапсыз.</p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg group-hover:translate-x-1 transition-transform">
            САБАҚТЫ БАСТАУ
          </button>
        </div>
      </section>

      {/* 4. Progress Grid */}
      <div className="grid grid-cols-2 gap-3 px-1">
         <div className="bg-white dark:bg-slate-800 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-2">
            <i className="fas fa-calendar-check text-blue-500 text-xl"></i>
            <p className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{user.streak}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Күндік Strike</p>
         </div>
         <div className="bg-white dark:bg-slate-800 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-2">
            <i className="fas fa-chart-line text-emerald-500 text-xl"></i>
            <p className="text-2xl font-black text-gray-900 dark:text-white font-outfit">85%</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Меңгеру деңгейі</p>
         </div>
      </div>

      {/* 5. Support Shortcut */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[40px] border border-gray-100 dark:border-slate-700 mx-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
            <i className="fas fa-headset"></i>
          </div>
          <div>
            <h5 className="text-sm font-black text-gray-900 dark:text-white font-outfit">Көмек керек пе?</h5>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Куратормен байланысу</p>
          </div>
        </div>
        <a href="https://wa.me/87771902796" target="_blank" className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-none hover:scale-110 transition-transform">
          <i className="fas fa-chevron-right text-xs"></i>
        </a>
      </div>
    </div>
  );
};

export default HomeView;