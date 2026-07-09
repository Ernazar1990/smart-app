import React, { useState } from 'react';
import { UserProgress, Subject, NewsItem } from '../types';
import { motion } from 'motion/react';

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
  const [expandedSmart, setExpandedSmart] = useState(false);
  const [expandedJunior, setExpandedJunior] = useState(false);
  const [expandedPackage, setExpandedPackage] = useState(false);

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
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4 animate-in fade-in duration-700 text-slate-800 dark:text-slate-100">
      
      {/* Premium Info Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400"></div>
            
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
              id="close-premium-modal-btn"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl flex items-center justify-center text-amber-500 text-3xl mx-auto shadow-inner">
                <i className="fas fa-crown"></i>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">Premium Мүмкіндіктері</h3>
                <p className="text-slate-400 dark:text-slate-400 text-xs font-semibold">Оқуда керемет нәтижелерге қол жеткіз</p>
              </div>

              <div className="space-y-2.5 text-left">
                {[
                  { icon: 'fa-check', text: 'Барлық 177 сабаққа толықтай шексіз кіру' },
                  { icon: 'fa-brain', text: 'Күрделенген тақырыптар бойынша смарт AI көмекшісі' },
                  { icon: 'fa-cubes', text: 'Шектеусіз жедел тесттер, марафондар мен сұрақтар' },
                  { icon: 'fa-road', text: 'Жеке мақсатыңызға негізделген арнайы оқу жоспары' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-500 dark:text-sky-450 flex items-center justify-center text-xs flex-shrink-0">
                      <i className={`fas ${item.icon}`}></i>
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.text}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setShowPremiumModal(false);
                  onSelectView('subscription');
                }}
                className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                id="view-rates-modal-btn"
              >
                Тарифтерді көру
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header & Greeting Section */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 rounded-[24px] p-4 md:p-5 text-white relative overflow-hidden shadow-lg shadow-indigo-100 dark:shadow-none">
        {/* Subtle, smaller greeting in the top-right corner */}
        <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black text-amber-300 border border-white/10 flex items-center gap-1 shadow-sm">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
          {homeConfig.greetingTitle || "Сәлем, Оқушы! 👋"}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5 mt-2 md:mt-0 max-w-xl">
            <span className="inline-flex bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider">
              ҚҰТТЫҚТАЙМЫЗ!
            </span>
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight leading-tight font-sans">
              ҰБТ-ға дайындалудың ең тиімді жолы 🚀
            </h1>
            <p className="text-[11px] text-indigo-200 font-medium leading-relaxed">
              Бұл платформа – ҰБТ-дан ең жоғары ұпай жинап, қалаған мамандығыңыз бен грантыңызды жеңіп алуға арналған заманауи интеллектуалды дайындық жүйесі.
            </p>
            {/* Attractive Informative Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[9px] font-semibold text-indigo-100">
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                <i className="fas fa-check-circle text-emerald-400"></i> Жүйелі жоспар
              </span>
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                <i className="fas fa-university text-sky-300"></i> ЖОО базасы
              </span>
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                <i className="fas fa-robot text-amber-300 animate-pulse"></i> AI Тьютор көмегі
              </span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center min-w-[120px] md:min-w-[140px] shadow-sm flex flex-col gap-0.5 justify-center self-stretch md:self-auto">
             <div className="text-lg md:text-xl font-black mb-0.5 flex items-center justify-center gap-1.5 text-amber-300">
               <i className="fas fa-medal text-sm md:text-base drop-shadow-sm"></i>
               {user.points}
             </div>
             <p className="text-[8px] font-bold uppercase tracking-widest opacity-85">Жалпы ұпайыңыз</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute -left-16 -top-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl"></div>
      </section>

      {/* Күнделікті Белсенділік және Серия (Daily Activity and Streak Widget) */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent dark:from-orange-950/20 dark:via-amber-950/15 border border-orange-500/20 dark:border-orange-500/10 rounded-[32px] p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-[0_10px_30px_rgba(249,115,22,0.05)]">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row w-full md:w-auto">
          <div className="relative">
            <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-white text-2xl shadow-md ${
              user.lastActiveDate === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/20 animate-pulse'
                : 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-orange-500/20 animate-bounce'
            }`}>
              <i className={`fas ${
                user.lastActiveDate === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
                  ? 'fa-calendar-check'
                  : 'fa-fire'
              }`}></i>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-slate-900 dark:bg-orange-500 text-white dark:text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
              {user.streak || 0}d
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-warm-50 font-sans flex items-center gap-2 justify-center md:justify-start">
              Күнделікті белсенділік
              {user.lastActiveDate === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` ? (
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-emerald-500/20">Орындалды</span>
              ) : (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-500/20">Күтілуде</span>
              )}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed max-w-md">
              {user.lastActiveDate === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
                ? "Құттықтаймыз! Бүгін кем дегенде 1 сұраққа жауап беріп, серияңызды сақтап қалдыңыз және +25 Ұпай, +100 XP сыйлығын алдыңыз!"
                : "Серияңызды сақтап қалу және күнделікті сыйлықтар алу үшін бүгін кез келген сабақтан кем дегенде бір сұраққа жауап беріңіз."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          {user.lastActiveDate === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` ? (
            <div className="flex gap-2">
              <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1.5">
                <i className="fas fa-coins text-xs"></i> +25 Ұпай
              </span>
              <span className="bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-200/20 text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1.5">
                <i className="fas fa-bolt text-xs"></i> +100 XP
              </span>
            </div>
          ) : (
            <button 
              onClick={() => onSelectView('roadmap')}
              className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/15 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-play text-[10px]"></i>
              Тапсырманы бастау
            </button>
          )}
        </div>
      </div>

      {/* Quick Navigation Section - "Жоспар, ЖОО, Мамандық" in bright, light colors to stand out beautifully */}
      <section className="space-y-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 md:p-5 rounded-[24px] shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
        <div>
          <h3 className="text-xs font-black text-slate-800 dark:text-warm-100 uppercase tracking-widest flex items-center gap-1.5">
            <span className="inline-flex w-2 h-2 rounded-full bg-indigo-500"></span>
            Жылдам қол жеткізу құралдары ⚡
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
            Дайындық барысын жеделдетуге және қажетті ақпаратты тез табуға арналған ашық түсті навигациялық батырмалар
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Жоспар */}
          <button
            onClick={() => onSelectView('roadmap')}
            className="group relative overflow-hidden rounded-2xl p-4 text-left border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 via-yellow-50/30 to-orange-50/20 dark:from-amber-950/25 dark:via-yellow-950/10 dark:to-orange-950/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[110px]"
            id="quick-nav-roadmap"
          >
            <div className="flex justify-between items-start w-full">
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <i className="fas fa-map-marked-alt text-sm"></i>
              </div>
              <span className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider bg-amber-100 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full">
                ЖОЛ КАРТАСЫ
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-warm-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors uppercase tracking-wider">
                Оқу Жоспары 📅
              </h4>
              <p className="text-[9px] text-slate-500 dark:text-warm-300 font-semibold mt-0.5">
                Күнделікті қызықты сабақтар, бейне конспектілер
              </p>
            </div>
          </button>

          {/* Card 2: ЖОО */}
          <button
            onClick={() => onSelectView('uni-list')}
            className="group relative overflow-hidden rounded-2xl p-4 text-left border border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 via-teal-50/30 to-emerald-50/10 dark:from-emerald-950/25 dark:via-teal-950/10 dark:to-emerald-950/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[110px]"
            id="quick-nav-unis"
          >
            <div className="flex justify-between items-start w-full">
              <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                <i className="fas fa-university text-sm"></i>
              </div>
              <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                ГРАНТ БАЗАСЫ
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-warm-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-wider">
                ЖОО Тізімі 🏛️
              </h4>
              <p className="text-[9px] text-slate-500 dark:text-warm-300 font-semibold mt-0.5">
                Грант шекті балдары, факультеттер мен ЖОО іздеу
              </p>
            </div>
          </button>

          {/* Card 3: Мамандық */}
          <button
            onClick={() => onSelectView('subject-selection')}
            className="group relative overflow-hidden rounded-2xl p-4 text-left border border-sky-200 dark:border-sky-900/50 bg-gradient-to-br from-sky-50 via-indigo-50/30 to-sky-50/10 dark:from-sky-950/25 dark:via-indigo-950/10 dark:to-sky-950/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[110px]"
            id="quick-nav-subjects"
          >
            <div className="flex justify-between items-start w-full">
              <div className="p-2 rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
                <i className="fas fa-graduation-cap text-sm"></i>
              </div>
              <span className="text-[9px] font-black uppercase text-sky-700 dark:text-sky-400 tracking-wider bg-sky-100 dark:bg-sky-950/50 px-2.5 py-0.5 rounded-full">
                КӘСІПТИК
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-warm-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors uppercase tracking-wider">
                Мамандық Таңдау 🎓
              </h4>
              <p className="text-[9px] text-slate-500 dark:text-warm-300 font-semibold mt-0.5">
                Пән комбинациялары және болашақ бағыттар
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 2. Pricing / Tariffs section */}
      <section className="space-y-5" id="pricing-section">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Дайындық Тарифтері</h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">ҰБТ-ға немесе мектепте оқуда үздік нәтиже көрсетуге арналған білім пакеттері</p>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-5 lg:gap-6 w-full overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 md:pb-0 px-1 md:px-0">
          {/* Card 1: Smart */}
          <div className="bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col justify-between group min-w-[280px] md:min-w-0 flex-shrink-0 w-[85%] md:w-auto snap-start">
            <div className="absolute top-0 left-0 w-full h-1 bg-sky-400"></div>
            
            <div className="space-y-3.5 flex-1 pb-4">
              <div className="inline-block border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 rounded-full px-2.5 py-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                11-сынып түлектеріне
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Курс басталуы: 1 шілде</span>
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                  Smart <span className="inline-block text-xs md:text-sm font-bold text-slate-505">топ 🔥</span>
                </h3>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-bold">35 000 KZT</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-sky-500">18 333 KZT</span>
                  <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold">*бір пән бағасы</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-455 leading-tight">
                  бұл баға 3 пәнді бірге сатып алғанда болады
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>

              <div className="space-y-1.5">
                <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Негізгі бағалар</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-sky-50/40 dark:bg-sky-955/10 rounded-lg">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[9px] font-black">I</span> 1 пән</span>
                    <span className="text-slate-750 dark:text-slate-300 font-bold">35 000 KZT</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-sky-50/40 dark:bg-sky-955/10 rounded-lg">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[9px] font-black">II</span> 2 пән</span>
                    <span className="text-slate-750 dark:text-slate-300 font-bold">45 000 KZT</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-sky-100/10 dark:bg-sky-955/20 rounded-lg border border-sky-200/20">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-sky-200 dark:bg-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[9px] font-black">III</span> 3 пән</span>
                    <span className="text-sky-600 dark:text-sky-400 font-extrabold">55 000 KZT</span>
                  </div>
                </div>
              </div>

              {/* Accordion link */}
              <button 
                onClick={() => setExpandedSmart(!expandedSmart)}
                className="flex items-center gap-1.5 text-sky-500 hover:text-sky-600 text-[10px] font-black focus:outline-none transition-colors pt-1"
                id="expanded-smart-accordion"
              >
                <i className={`fas ${expandedSmart ? 'fa-minus-circle' : 'fa-plus-circle'}`}></i>
                Артықшылықтар
              </button>

              {expandedSmart && (
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800 text-[9px] text-slate-500 dark:text-slate-400 animate-in slide-in-from-top-1 duration-200">
                  <div className="flex gap-1.5"><i className="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i> <span>Тақырыптық бейнелер мен конспектілер</span></div>
                  <div className="flex gap-1.5"><i className="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i> <span>Апталық деңгейлік тесттер мен жеке есеп</span></div>
                  <div className="flex gap-1.5"><i className="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i> <span>Қолдау көрсететін жеке куратор</span></div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 mt-auto">
              <button 
                onClick={() => onSelectView('subscription')}
                className="w-full py-2 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-455 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border border-sky-100 dark:border-sky-900"
              >
                Толығырақ білу
              </button>
              <button 
                onClick={() => onSelectView('subscription')}
                className="w-full py-2.5 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-sky-450/15 active:scale-95 transition-all text-center"
              >
                Сатып алу
              </button>
            </div>
          </div>
          {/* Card 2: Junior */}
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col justify-between group min-w-[280px] md:min-w-0 flex-shrink-0 w-[85%] md:w-auto snap-start">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-505"></div>

            <div className="space-y-3.5 flex-1 pb-4">
              <div className="inline-block border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-full px-2.5 py-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                8, 9, 10-сынып оқушыларына
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Курс басталуы: 1 шілде</span>
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                  Junior <span className="inline-block text-xs md:text-sm font-bold text-slate-505">топ 🌟</span>
                </h3>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-bold">30 000 KZT</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-indigo-500">16 666 KZT</span>
                  <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold">*бір пән бағасы</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-455 leading-tight">
                  бұл баға 3 пәнді бірге сатып алғанда болады
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>

              <div className="space-y-1.5">
                <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Негізгі бағалар</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-indigo-50/40 dark:bg-indigo-955/10 rounded-lg">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[9px] font-black">I</span> 1 пән</span>
                    <span className="text-slate-750 dark:text-slate-300 font-bold">30 000 KZT</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-indigo-50/40 dark:bg-indigo-955/10 rounded-lg">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[9px] font-black">II</span> 2 пән</span>
                    <span className="text-slate-750 dark:text-slate-300 font-bold">40 000 KZT</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-indigo-100/10 dark:bg-indigo-955/20 rounded-lg border border-indigo-200/20">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[9px] font-black">III</span> 3 пән</span>
                    <span className="text-indigo-600 dark:text-indigo-455 font-extrabold">50 000 KZT</span>
                  </div>
                </div>
              </div>

              {/* Accordion link */}
              <button 
                onClick={() => setExpandedJunior(!expandedJunior)}
                className="flex items-center gap-1.5 text-indigo-500 hover:text-indigo-600 text-[10px] font-black focus:outline-none transition-colors pt-1"
                id="expanded-junior-accordion"
              >
                <i className={`fas ${expandedJunior ? 'fa-minus-circle' : 'fa-plus-circle'}`}></i>
                Артықшылықтар
              </button>

              {expandedJunior && (
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800 text-[9px] text-slate-500 dark:text-slate-400 animate-in slide-in-from-top-1 duration-200">
                  <div className="flex gap-1.5"><i className="fas fa-check text-indigo-550 mt-0.5 flex-shrink-0"></i> <span>Мектеп бағдарламасын толық меңгеру</span></div>
                  <div className="flex gap-1.5"><i className="fas fa-check text-indigo-550 mt-0.5 flex-shrink-0"></i> <span>Нәтижелі деңгейлік практикалық жұмыстар</span></div>
                  <div className="flex gap-1.5"><i className="fas fa-check text-indigo-550 mt-0.5 flex-shrink-0"></i> <span>Тәжірибелі кураторлардың тұрақты қолдауы</span></div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 mt-auto">
              <button 
                onClick={() => onSelectView('subscription')}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border border-indigo-100 dark:border-indigo-900"
              >
                Толығырақ білу
              </button>
              <button 
                onClick={() => onSelectView('subscription')}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-indigo-450/15 active:scale-95 transition-all text-center"
              >
                Сатып алу
              </button>
            </div>
          </div>

          {/* Card 3: Пакет */}
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col justify-between group min-w-[280px] md:min-w-0 flex-shrink-0 w-[85%] md:w-auto snap-start">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

            <div className="space-y-3.5 flex-1 pb-4">
              <div className="inline-block border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-full px-2.5 py-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                11-сынып түлектеріне
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Курс басталуы: 1 шілде</span>
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                  Пакет <span className="inline-block text-xs md:text-sm font-bold text-slate-505">топ 🌟</span>
                </h3>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-bold">30 000 KZT</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-emerald-500">7 500 KZT</span>
                  <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold">*бір пән бағасы</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-455 leading-tight">
                  бұл баға 4 пәнді бірге сатып алғанда болады
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>

              <div className="space-y-1.5">
                <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Негізгі бағалар</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-emerald-50/40 dark:bg-emerald-955/10 rounded-lg">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[9px] font-black">I</span> 1 пән</span>
                    <span className="text-slate-750 dark:text-slate-300 font-bold">18 000 KZT</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-emerald-50/40 dark:bg-emerald-955/10 rounded-lg">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[9px] font-black">II</span> 2 пән</span>
                    <span className="text-slate-755 dark:text-slate-300 font-bold">24 000 KZT</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold p-1.5 bg-emerald-100/10 dark:bg-emerald-955/20 rounded-lg border border-emerald-200/20">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[9px] font-black">IV</span> 4 пән</span>
                    <span className="text-emerald-600 dark:text-emerald-455 font-extrabold">30 000 KZT</span>
                  </div>
                </div>
              </div>

              {/* Accordion link */}
              <button 
                onClick={() => setExpandedPackage(!expandedPackage)}
                className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-600 text-[10px] font-black focus:outline-none transition-colors pt-1"
                id="expanded-package-accordion"
              >
                <i className={`fas ${expandedPackage ? 'fa-minus-circle' : 'fa-plus-circle'}`}></i>
                Артықшылықтар
              </button>

              {expandedPackage && (
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800 text-[9px] text-slate-500 dark:text-slate-400 animate-in slide-in-from-top-1 duration-200">
                  <div className="flex gap-1.5"><i className="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i> <span>Шексіз консультациялар мен ұпай талдамалары</span></div>
                  <div className="flex gap-1.5"><i className="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i> <span>ҰБТ-ға қажетті 4 таңдау пәндерін толық дайындау</span></div>
                  <div className="flex gap-1.5"><i className="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i> <span>Ортақ оқушылар чаты мен жеке қолдау көрсету</span></div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 mt-auto">
              <button 
                onClick={() => onSelectView('subscription')}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-455 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border border-emerald-100 dark:border-emerald-900"
              >
                Толығырақ білу
              </button>
              <button 
                onClick={() => onSelectView('subscription')}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-emerald-450/15 active:scale-95 transition-all text-center"
              >
                Сатып алу
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Subject Grid (Cleaned and harmonized) */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Қолжетімді Пәндер</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {subjects.map((sub) => {
            const isChosen = !sub.isElective || user.chosenElectives.includes(sub.id);
            const isPaid = user.subscription === 'Free' || (user.activeSubjects || []).includes(sub.id);
            const hasAccess = isChosen && isPaid;

            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] shadow-xs flex flex-col items-center gap-5 hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-md transition-all group relative overflow-hidden text-center focus:outline-none ${
                  hasAccess 
                    ? 'border-emerald-500/10' 
                    : 'opacity-90'
                }`}
                id={`subject-${sub.id}-btn`}
              >
                <div className={`w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-105 duration-300 shadow-inner`}>
                  <i className={`fas ${sub.icon} ${sub.color.replace('bg-', 'text-')}`}></i>
                </div>
                
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs leading-tight uppercase tracking-wider">{sub.name}</h3>
                  <div className="flex flex-col gap-1 items-center">
                    {hasAccess ? (
                      <span className="text-[8px] font-black text-emerald-600 bg-emerald-55/40 dark:bg-emerald-900/20 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100/20">
                        Оқу
                      </span>
                    ) : !isPaid ? (
                      <span className="text-[8px] font-black text-amber-600 bg-amber-55/40 dark:bg-amber-900/20 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-amber-100/20">
                        Жазылым
                      </span>
                    ) : (
                      <span className="text-[8px] font-black text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-slate-100/10">
                        Таңдалмаған
                      </span>
                    )}
                  </div>
                </div>

                {hasAccess && (
                  <div className="absolute top-3.5 right-3.5 text-emerald-500 text-xs">
                    <i className="fas fa-check-circle"></i>
                  </div>
                )}
                {!isPaid && (
                  <div className="absolute top-3.5 right-3.5 text-amber-500 text-xs">
                    <i className="fas fa-lock"></i>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Weekly Challenge & Premium Banner (Cleaned up font combination) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly AI Test */}
        <section 
          className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer hover:scale-[1.01] transition-all"
          onClick={() => onSelectView('weekly-test')}
          id="weekly-test-card"
        >
          <div className="relative z-10 space-y-4">
            <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">ЖАҢА МҮМКІНДІК</span>
            <h2 className="text-xl font-extrabold tracking-tight">Апталық AI Тест</h2>
            <p className="text-rose-50/90 text-xs leading-relaxed max-w-[85%]">Осы аптада өткен тақырыптардың негізінде AI сіз үшін арнайы 40 сұрақтан тұратын жеке тест дайындады.</p>
            <button className="bg-white text-rose-600 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              Тестіні бастау
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <i className="fas fa-brain absolute -right-6 -bottom-6 text-9xl text-white/10 rotate-12 group-hover:rotate-6 transition-transform duration-500"></i>
        </section>

        {/* Premium Banner */}
        <section 
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer hover:scale-[1.01] transition-all" 
          onClick={() => onSelectView('subscription')}
          id="premium-promo-card"
        >
          <div className="relative z-10 space-y-4">
            <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">PREMIUM PREP</span>
            <h2 className="text-xl font-extrabold tracking-tight">{homeConfig.premiumTitle || "Платформаға шектеусіз рұқсат"}</h2>
            <p className="text-amber-50/90 text-xs line-clamp-2 leading-relaxed max-w-[85%]">{homeConfig.premiumDesc || "Сертификатталған ҰБТ теориялары, AI сұрақ талдауы және артықшылықтар."}</p>
            <button 
              className="bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 hover:bg-slate-900 transition-all shadow-sm active:scale-95"
            >
              <i className="fas fa-crown text-amber-300"></i>
              Толық мүмкіндік
            </button>
          </div>
          <i className="fas fa-graduation-cap absolute -right-6 -bottom-6 text-9xl opacity-20 drop-shadow-lg group-hover:scale-105 transition-transform duration-500"></i>
        </section>
      </div>

      {/* 6. News Section */}
      <section className="space-y-5">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">ҰБТ Жаңалықтары</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
          {displayNews.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[280px] md:min-w-[320px] bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:border-indigo-405 transition-all"
            >
              <div className="relative overflow-hidden h-40">
                {item.image ? (
                  <img referrerPolicy="no-referrer" src={item.image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="h-full w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    <i className="fas fa-newspaper text-3xl text-slate-200 dark:text-slate-700"></i>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="text-[7px] font-black text-white bg-slate-950/50 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">{item.date}</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-slate-950 dark:text-white text-xs uppercase tracking-wider line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-normal">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomeView;
