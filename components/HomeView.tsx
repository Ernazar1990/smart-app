
import React, { useState, useEffect } from 'react';
import { UserProgress, Subject, NewsItem } from '../types';
import { supabase } from '../supabaseClient';

interface HomeViewProps {
  user: UserProgress;
  subjects: Subject[];
  onSelectView: (view: any) => void;
  onSelectSubject: (subjectId: string) => void;
  homeConfig: any;
  news: NewsItem[];
}

const HomeView: React.FC<HomeViewProps> = ({ user, subjects, onSelectView, onSelectSubject, homeConfig, news }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const displayNews = news.length > 0 ? news.slice(0, 3) : [
    { 
      id: 'sample-1', 
      title: 'ҰБТ-2026: Жаңа өзгерістер мен дайындық жоспары', 
      content: 'Биылғы ҰБТ-дағы басты жаңалықтар мен пәндер бойынша дайындық кеңестерін оқыңыз.', 
      date: new Date().toLocaleDateString('kk-KZ'),
      image: 'https://picsum.photos/seed/news1/800/400'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* Premium Info Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
            
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-amber-600 text-4xl mx-auto shadow-xl shadow-amber-100 dark:shadow-none">
                <i className="fas fa-crown"></i>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black font-outfit text-slate-800 dark:text-white">Premium Мүмкіндіктері</h3>
                <p className="text-slate-400 text-sm font-medium">Оқуыңызды жаңа деңгейге көтеріңіз</p>
              </div>

              <div className="space-y-3 text-left">
                {[
                  { icon: 'fa-check-circle', text: 'Барлық 177 сабаққа шексіз кіру' },
                  { icon: 'fa-check-circle', text: 'Күрделі тақырыптарға AI көмегі' },
                  { icon: 'fa-check-circle', text: 'Шексіз тесттер мен марафондар' },
                  { icon: 'fa-check-circle', text: 'Жеке дайындық жоспары' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <i className={`fas ${item.icon} text-emerald-500`}></i>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.text}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setShowPremiumModal(false);
                  onSelectView('subscription');
                }}
                className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                Тарифтерді көру
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Greeting Card */}
      <section className={`${homeConfig.bannerColor} rounded-[32px] p-6 md:p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none`}>
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-black font-outfit tracking-tight leading-tight">{homeConfig.greetingTitle}</h1>
            <p className="text-indigo-100 font-bold text-xs md:text-sm opacity-80 uppercase tracking-widest">{user.email}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] p-3 md:p-4 text-center min-w-[90px] md:min-w-[120px]">
             <div className="text-xl md:text-3xl font-black font-outfit mb-0.5 flex items-center justify-center gap-2">
               <i className="fas fa-medal text-amber-400 text-lg md:text-xl"></i>
               {user.points}
             </div>
             <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Ұпай саны</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </section>

      {/* 2. Premium Banner */}
      <section className={`bg-gradient-to-br ${homeConfig.premiumColor} rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-orange-100 dark:shadow-none group`}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">PREMIUM</div>
            <h2 className="text-xl md:text-2xl font-black font-outfit leading-tight">{homeConfig.premiumTitle}</h2>
            <p className="text-orange-50 font-medium text-[11px] md:text-xs opacity-90 max-w-md">{homeConfig.premiumDesc}</p>
            <button 
              onClick={() => onSelectView('subscription')}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl active:scale-95 mt-2"
            >
              <i className="fas fa-crown text-amber-400"></i>
              Қосылу
            </button>
          </div>
          <div className="relative hidden md:block">
             <i className="fas fa-graduation-cap text-7xl md:text-9xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
          </div>
        </div>
      </section>

      {/* 3. News Section (Moved up) */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-lg font-black font-outfit text-slate-800 dark:text-white uppercase tracking-tight">Жаңалықтар</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
          {displayNews.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[260px] md:min-w-[300px] bg-white dark:bg-slate-800 rounded-[28px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:border-indigo-500 transition-all"
            >
              {item.image ? (
                <img src={item.image} alt="" className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="h-36 w-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
                  <i className="fas fa-newspaper text-3xl text-slate-200 dark:text-slate-700"></i>
                </div>
              )}
              <div className="p-5 space-y-2">
                <span className="text-[7px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg uppercase tracking-widest">{item.date}</span>
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-xs font-outfit line-clamp-2 leading-tight">{item.title}</h3>
                <p className="text-[9px] text-slate-400 font-medium line-clamp-2 leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Subject Grid */}
      <section className="space-y-6">
        <div className="px-2">
          <h2 className="text-lg font-black font-outfit text-slate-800 dark:text-white uppercase tracking-tight">Пәндер</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {subjects.map((sub) => {
            const isChosen = !sub.isElective || user.chosenElectives.includes(sub.id);
            const isPaid = user.subscription === 'Free' || (user.activeSubjects || []).includes(sub.id);
            const hasAccess = isChosen && isPaid;

            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[28px] border dark:border-slate-700 shadow-sm flex flex-col items-center gap-4 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all group relative overflow-hidden text-center ${
                  hasAccess ? 'border-emerald-500/20' : 'border-gray-50 opacity-70'
                }`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <i className={`fas ${sub.icon} ${sub.color.replace('bg-', 'text-')}`}></i>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-black text-slate-800 dark:text-slate-100 text-xs md:text-sm font-outfit leading-tight">{sub.name}</h3>
                  <div className="flex flex-col gap-1 items-center">
                    {hasAccess ? (
                      <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                        Қолжетімді
                      </span>
                    ) : !isPaid ? (
                      <span className="text-[7px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                        Жазылым қажет
                      </span>
                    ) : (
                      <span className="text-[7px] font-black text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                        Таңдалмаған
                      </span>
                    )}
                  </div>
                </div>

                {hasAccess && (
                  <div className="absolute top-3 right-3 text-emerald-500 text-[10px]">
                    <i className="fas fa-check-circle"></i>
                  </div>
                )}
                {!isPaid && (
                  <div className="absolute top-3 right-3 text-amber-500 text-[10px]">
                    <i className="fas fa-lock"></i>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
