
import React, { useState, useEffect } from 'react';
import StudentLayout from './components/StudentLayout';
import AdminLayout from './components/AdminLayout';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import AuthScreen from './components/AuthScreen';
import SubscriptionView from './components/SubscriptionView';
import ModuleList from './components/ModuleList';
import LessonContent from './components/LessonContent';
import AITutor from './components/AITutor';
import AdminPanel from './components/AdminPanel';
import AIToolsHub from './components/AIToolsHub';
import SubjectSelectionView from './components/SubjectSelectionView';
import UniListView from './components/UniListView';
import RatingView from './components/RatingView';
import MarathonView from './components/MarathonView';
import PeriodicTable from './components/PeriodicTable';
import ScannerView from './components/ScannerView';
import FormulaHub from './components/FormulaHub';
import SolubilityTable from './components/SolubilityTable';
import ReactivitySeries from './components/ReactivitySeries';
import MultiplicationTable from './components/MultiplicationTable';
import GlossaryView from './components/GlossaryView';
import ReactionBalancer from './components/ReactionBalancer';
import Flashcards from './components/Flashcards';
import ArenaView from './components/ArenaView';
import CareerAdvisorView from './components/CareerAdvisorView';
import RoadmapView from './components/RoadmapView';
import TournamentView from './components/TournamentView';
import TestView from './components/TestView';
import WeeklyTestView from './components/WeeklyTestView';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, UserProgress, Lesson, Module, StaffMember, UserMarathon, NewsItem, SubscriptionConfig } from './types';
import { SUBJECTS, MODULES_BY_SUBJECT } from './constants';
import { supabase } from './supabaseClient';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('home');

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const [allModules, setAllModules] = useState<Record<string, Module[]>>(MODULES_BY_SUBJECT);
  const [staffList, setStaffList] = useState<StaffMember[]>([
    { email: 'nur.abuuadi@gmail.com', name: 'Бас Админ', role: 'super-admin', permissions: ['all'] },
    { email: 'test@mail.kz', name: 'Арман Құратор', role: 'teacher', permissions: ['chem'] }
  ]);

  const [user, setUser] = useState<UserProgress>({
    name: 'Қонақ', email: '', phone: '', class: '11', region: '', school: '', pin: '', points: 0, xp: 0, level: 1, streak: 0, estimatedScore: 0,
    completedLessons: [], totalLessons: 177, recentScores: [], categoryStrength: {}, totalSolved: 0, correctAnswers: 0,
    subscription: 'none', chosenElectives: ['chem', 'bio'], startDate: new Date().toISOString(), isAdmin: false,
    role: 'student', pointsHistory: []
  });

  const [news, setNews] = useState<NewsItem[]>([]);
  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionConfig>({
    bundles: [
      { id: 'single', name: '1 пән', priceMonth: '10 000 ₸', priceYear: '80 000 ₸', oldPriceMonth: '15 000 ₸', oldPriceYear: '120 000 ₸', desc: 'Таңдаған бір пәніңізге толық қолжетімділік.', color: 'border-gray-200' },
      { id: 'double', name: '2 пән', priceMonth: '15 000 ₸', priceYear: '120 000 ₸', oldPriceMonth: '25 000 ₸', oldPriceYear: '200 000 ₸', desc: 'Екі таңдау пәніңізге толық қолжетімділік.', color: 'border-blue-500 bg-blue-50/30' },
      { id: 'full', name: '5 пән (Толық пакет)', priceMonth: '40 000 ₸', priceYear: '320 000 ₸', oldPriceMonth: '60 000 ₸', oldPriceYear: '480 000 ₸', desc: 'Барлық 3 негізгі пән + 2 таңдау пәні. Ең тиімді таңдау!', color: 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100/50', badge: 'Ең тиімді' },
    ],
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kaspi.kz/pay/SMART_UBT',
    kaspiNumber: '8 777 190 27 96',
    kaspiName: 'Ерназар Н.',
    whatsappNumber: '77771902796'
  });
  const [homeConfig, setHomeConfig] = useState({
    greetingTitle: 'Сәлем, Оқушы! 👋',
    premiumTitle: 'Барлық сабақтарға қолжетімділік алыңыз! 🚀',
    premiumDesc: '177 сабақ • 12 пән • Шексіз тест • Балл жүйесі',
    bannerColor: 'bg-indigo-600',
    premiumColor: 'from-amber-500 to-orange-600'
  });

  const refreshData = async () => {
    try {
      // Fetch news
      const { data: newsData, error: newsError } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (!newsError && newsData) setNews(newsData);

      // Fetch home config
      const { data: configData, error: configError } = await supabase.from('home_config').select('*').eq('id', 'main').maybeSingle();
      if (!configError && configData) setHomeConfig(configData.config);

      // Fetch subscription config
      const { data: subData, error: subError } = await supabase.from('config').select('*').eq('id', 'subscription').maybeSingle();
      if (!subError && subData && subData.value) setSubscriptionConfig(subData.value);
    } catch (err) {
      console.warn("Data refresh failed");
    }
  };

  // Streak Modal & Logic States
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakRewardInfo, setStreakRewardInfo] = useState<{ newStreak: number; points: number; xp: number } | null>(null);

  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getYesterdayDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const checkDailyLoginStreak = async (currentUser: UserProgress) => {
    if (!currentUser || !currentUser.email) return;
    
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    
    const lastActiveDate = (currentUser as any).lastActiveDate || localStorage.getItem(`smart_user_last_active_${currentUser.email}`) || '';
    const lastLoginDate = (currentUser as any).lastLoginDate || localStorage.getItem(`smart_user_last_login_${currentUser.email}`) || '';
    
    if (lastLoginDate === todayStr) {
      return;
    }

    let updatedStreak = currentUser.streak ?? 0;

    // If they missed yesterday AND missed today, reset streak to 0
    if (lastActiveDate && lastActiveDate !== yesterdayStr && lastActiveDate !== todayStr) {
      updatedStreak = 0;
    }

    const updatedUser = {
      ...currentUser,
      streak: updatedStreak,
      lastLoginDate: todayStr,
      lastActiveDate: lastActiveDate
    } as any;

    setUser(updatedUser);
    localStorage.setItem('smart_user_session', JSON.stringify(updatedUser));
    localStorage.setItem(`smart_user_last_login_${currentUser.email}`, todayStr);
    if (lastActiveDate) {
      localStorage.setItem(`smart_user_last_active_${currentUser.email}`, lastActiveDate);
    }

    try {
      await supabase
        .from('admin_users')
        .update({ 
          streak: updatedStreak
        })
        .eq('email', currentUser.email);
    } catch (err) {
      console.warn("Could not sync streak reset to Supabase:", err);
    }
  };

  const handleAnswerQuestion = async () => {
    if (!isLoggedIn || !user || !user.email) return;

    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();

    const lastActiveDate = (user as any).lastActiveDate || localStorage.getItem(`smart_user_last_active_${user.email}`) || '';

    if (lastActiveDate === todayStr) {
      return;
    }

    let newStreak = 1;
    if (lastActiveDate === yesterdayStr) {
      newStreak = (user.streak || 0) + 1;
    }

    const pointsReward = 25;
    const xpReward = 100;

    const updatedUser = {
      ...user,
      streak: newStreak,
      points: user.points + pointsReward,
      xp: (user.xp || 0) + xpReward,
      lastActiveDate: todayStr
    } as any;

    setUser(updatedUser);
    localStorage.setItem('smart_user_session', JSON.stringify(updatedUser));
    localStorage.setItem(`smart_user_last_active_${user.email}`, todayStr);

    setStreakRewardInfo({
      newStreak,
      points: pointsReward,
      xp: xpReward
    });
    setShowStreakModal(true);

    try {
      await supabase
        .from('admin_users')
        .update({ 
          streak: newStreak,
          points: updatedUser.points,
          xp: updatedUser.xp
        })
        .eq('email', user.email);
    } catch (err) {
      console.warn("Could not sync streak reward to Supabase:", err);
    }
  };

  // Supabase-тен деректерді жүктеу
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setConnectionError(null);
      try {
        await refreshData();
        
        const { data: modulesData, error: mError } = await supabase.from('modules').select('*');
        if (mError) throw mError;
        
        if (modulesData && modulesData.length > 0) {
          const formattedModules: Record<string, Module[]> = {};
          modulesData.forEach(item => {
            formattedModules[item.subject_id] = item.data;
          });
          setAllModules(prev => ({ ...prev, ...formattedModules }));
        }

        const { data: staffData, error: sError } = await supabase.from('staff').select('*');
        let currentStaffList = staffList;
        if (!sError && staffData && staffData.length > 0) {
          setStaffList(staffData);
          currentStaffList = staffData;
        }

        // Load session from localStorage and verify
        const savedSession = localStorage.getItem('smart_user_session');
        if (savedSession && !isLoggedIn) {
          try {
            const parsedSession = JSON.parse(savedSession);
            const email = parsedSession.email?.toLowerCase().trim();
            
            // Refresh profile from Supabase to get latest subscription/points
            const { data: profile, error: pError } = await supabase
              .from('admin_users')
              .select('*')
              .eq('email', email)
              .maybeSingle();
            
            const staff = currentStaffList.find(s => s.email.toLowerCase() === email);
            const isOwner = email === 'nur.abuuadi@gmail.com' || email === 'ernazarnurtay@gmail.com';
            const isAdmin = !!staff || isOwner;
            
            const updatedUser = {
              ...parsedSession,
              ...(profile || {}),
              isAdmin,
              role: isOwner ? 'super-admin' : (staff?.role || 'student'),
              permissions: isOwner ? ['all'] : (staff?.permissions || [])
            };
            
            setUser(updatedUser);
            setIsLoggedIn(true);
            localStorage.setItem('smart_user_session', JSON.stringify(updatedUser));
            checkDailyLoginStreak(updatedUser);
          } catch (e) {
            localStorage.removeItem('smart_user_session');
          }
        }
      } catch (err: any) {
        console.warn("Supabase integration failed:", err.message);
        // "Failed to fetch" кезінде қолданушыға қатты қате көрсетпеу, себебі статикалық деректер бар
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          console.debug("Offline or blocked connection to Supabase detected.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [retryCount]);

  // Global error listener for network issues
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      // "Failed to fetch" can be benign (blocked trackers, etc), so we just log it
      if (event.reason?.message === 'Failed to fetch') {
        console.debug('Global unhandled fetch rejection caught');
      }
    };
    const handleOnline = () => {
      setIsOffline(false);
      setRetryCount(prev => prev + 1); // Trigger refresh
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleAuth = (userData: Partial<UserProgress>) => {
    if (!userData) return;
    const email = userData.email?.toLowerCase().trim();
    const staff = staffList.find(s => s.email.toLowerCase() === email);
    const isOwner = email === 'nur.abuuadi@gmail.com';
    const isAdmin = !!staff || isOwner;
    
    const newUser: UserProgress = { 
      ...user, 
      ...userData as any, 
      isAdmin, 
      role: isOwner ? 'super-admin' : (staff?.role || 'student'),
      permissions: isOwner ? ['all'] : (staff?.permissions || [])
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('smart_user_session', JSON.stringify(newUser));
    checkDailyLoginStreak(newUser);
  };

  const updateSubjects = async (subjects: string[]) => {
    const updatedUser = { ...user, chosenElectives: subjects };
    setUser(updatedUser);
    localStorage.setItem('smart_user_session', JSON.stringify(updatedUser));
    
    try {
      await supabase
        .from('admin_users')
        .update({ chosenElectives: subjects })
        .eq('email', user.email);
    } catch (err) {
      console.error('Failed to update subjects in Supabase:', err);
    }
  };

  const updateCompletedLesson = async (lessonId: string) => {
    if (!user.completedLessons.includes(lessonId)) {
      const newCompleted = [...user.completedLessons, lessonId];
      const updatedUser = {
        ...user,
        completedLessons: newCompleted,
        points: user.points + 10,
        xp: (user.xp || 0) + 50
      };
      setUser(updatedUser);
      localStorage.setItem('smart_user_session', JSON.stringify(updatedUser));

      try {
        await supabase
          .from('admin_users')
          .update({ 
            completedLessons: newCompleted,
            points: updatedUser.points,
            xp: updatedUser.xp
          })
          .eq('email', user.email);
      } catch (err) {
        console.error('Failed to update progress in Supabase:', err);
      }
    }
  };

  const handleWeeklyTestComplete = async (score: number, totalPoints: number) => {
    const xpGain = score * 2;
    const updatedUser = {
      ...user,
      points: user.points + score,
      xp: (user.xp || 0) + xpGain
    };
    setUser(updatedUser);
    localStorage.setItem('smart_user_session', JSON.stringify(updatedUser));

    try {
      await supabase
        .from('admin_users')
        .update({ 
          points: updatedUser.points,
          xp: updatedUser.xp
        })
        .eq('email', user.email);
    } catch (err) {
      console.error('Failed to update rating in Supabase:', err);
    }
  };

  const renderContent = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Деректер жүктелуде...</p>
      </div>
    );

    if (selectedLesson && !currentView.startsWith('admin')) {
      if ((selectedLesson as any).isTest) {
        return (
          <TestView 
            testType={(selectedLesson as any).testType}
            subjectId={(selectedLesson as any).subjectId}
            onComplete={(s) => {
              setUser({...user, points: user.points + s});
              setSelectedLesson(null);
            }} 
            onClose={() => setSelectedLesson(null)}
            onAnswerQuestion={handleAnswerQuestion}
          />
        );
      }
      return (
        <LessonContent 
          lesson={selectedLesson} 
          user={user}
          onComplete={() => updateCompletedLesson(selectedLesson.id)} 
          onClose={() => setSelectedLesson(null)} 
          onOpenView={(view) => {
            setSelectedLesson(null);
            setCurrentView(view);
          }}
          onAnswerQuestion={handleAnswerQuestion}
        />
      );
    }

    switch (currentView) {
      case 'home': return <HomeView user={user} subjects={SUBJECTS} onSelectView={setCurrentView} onSelectSubject={(id) => { setSelectedSubjectId(id); setCurrentView('roadmap'); }} homeConfig={homeConfig} news={news} />;
      case 'module-list': return <ModuleList user={user} onSelectLesson={setSelectedLesson} modules={selectedSubjectId ? (allModules[selectedSubjectId] || []) : []} subjects={SUBJECTS} selectedSubjectId={selectedSubjectId} onSelectSubject={setSelectedSubjectId} />;
      case 'weekly-test': {
        const primarySubjectId = user.chosenElectives[0] || 'chem';
        const subject = SUBJECTS.find(s => s.id === primarySubjectId) || SUBJECTS[0];
        const topics = (allModules[primarySubjectId] || []).slice(0, 3).map(m => m.title);
        return (
          <WeeklyTestView 
            subjectId={primarySubjectId}
            subjectName={subject.name}
            topics={topics.length > 0 ? topics : ['Жалпы курс мазмұны']}
            onComplete={handleWeeklyTestComplete}
            onClose={() => setCurrentView('home')}
            onAnswerQuestion={handleAnswerQuestion}
          />
        );
      }
      case 'ai-tools-hub': return <AIToolsHub onSelectView={setCurrentView} />;
      case 'profile': return <ProfileView user={user} onLogout={() => setIsLoggedIn(false)} onSelectView={setCurrentView} onUpdateUser={setUser} />;
      case 'uni-list': return <UniListView user={user} />;
      case 'subscription': return <SubscriptionView config={subscriptionConfig} user={user} onUpdateUser={setUser} onBack={() => setCurrentView('profile')} onRefresh={refreshData} />;
      case 'rating': return <RatingView user={user} onBack={() => setCurrentView('profile')} />;
      case 'marathon': return <MarathonView user={user} onUpdateMarathon={(m) => setUser({...user, marathon: m})} />;
      case 'subject-selection': return <SubjectSelectionView user={user} onUpdateSubjects={updateSubjects} onClose={() => setCurrentView('home')} />;
      case 'periodic-table': return <PeriodicTable onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'ai-tutor': return <AITutor onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'scanner': return <ScannerView onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'formulas': return <FormulaHub onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'solubility-table': return <SolubilityTable onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'reactivity-series': return <ReactivitySeries onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'multiplication-table': return <MultiplicationTable onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'glossary': return <GlossaryView onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'reaction-balancer': return <ReactionBalancer onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'flashcards': return <Flashcards onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'arena': return <ArenaView onBack={() => setCurrentView('ai-tools-hub')} onAnswerQuestion={handleAnswerQuestion} />;
      case 'career-advisor': return <CareerAdvisorView onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'roadmap': return <RoadmapView onBack={() => setCurrentView('home')} allModules={allModules} user={user} onSelectLesson={setSelectedLesson} subjects={SUBJECTS} initialSubjectId={selectedSubjectId} />;
      case 'tournament': return <TournamentView onBack={() => setCurrentView('home')} onAnswerQuestion={handleAnswerQuestion} />;
      case 'test': return <TestView selectedSubjects={user.chosenElectives} onComplete={(s) => setUser({...user, points: user.points + s})} onClose={() => setCurrentView('home')} onAnswerQuestion={handleAnswerQuestion} />;
      case 'admin':
      case 'admin-content':
      case 'admin-news':
      case 'admin-staff':
      case 'admin-users':
      case 'admin-home':
      case 'admin-unis':
      case 'admin-ai':
      case 'admin-subscription':
      case 'admin-system':
        return (
          <AdminPanel 
            currentView={currentView} 
            setView={setCurrentView} 
            allModules={allModules} 
            setAllModules={setAllModules} 
            staffList={staffList} 
            setStaffList={setStaffList} 
            user={user}
            homeConfig={homeConfig}
            setHomeConfig={setHomeConfig}
            news={news}
            setNews={setNews}
            subscriptionConfig={subscriptionConfig}
            setSubscriptionConfig={setSubscriptionConfig}
            refreshData={refreshData}
          />
        );
      default: return <HomeView user={user} subjects={SUBJECTS} onSelectView={setCurrentView} onSelectSubject={(id) => { setSelectedSubjectId(id); setCurrentView('module-list'); }} homeConfig={homeConfig} news={news} />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
        {isOffline && (
          <div className="fixed top-0 left-0 right-0 z-[250] bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-2 text-center">
            <i className="fas fa-wifi-slash mr-2"></i>
            Офлайн режим: Интернет байланысын тексеріңіз
          </div>
        )}
        {connectionError && !isOffline && (
          <div className="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white text-[10px] font-black uppercase tracking-widest py-2 text-center animate-in slide-in-from-top duration-300">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {connectionError}
            <button onClick={() => { setRetryCount(prev => prev + 1); setConnectionError(null); }} className="ml-4 underline">Қайта жүктеу</button>
          </div>
        )}
        {!isLoggedIn ? <AuthScreen onAuth={handleAuth} /> : (
          currentView.startsWith('admin') ? (
            <AdminLayout currentView={currentView} setView={setCurrentView} user={user}>{renderContent()}</AdminLayout>
          ) : (
            <StudentLayout 
              currentView={currentView} 
              setView={setCurrentView} 
              user={user} 
              isDarkMode={isDarkMode} 
              toggleDarkMode={toggleDarkMode}
              hideNav={!!selectedLesson}
            >
              {renderContent()}
            </StudentLayout>
          )
        )}
        {isLoggedIn && !currentView.startsWith('admin') && (
          <motion.div 
            drag
            dragMomentum={false}
            className="fixed bottom-24 left-6 z-[100] flex flex-col items-start gap-4 cursor-move"
            style={{ touchAction: 'none' }}
          >
            {isChatOpen && (
              <div className="w-[320px] md:w-[380px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 cursor-default" onPointerDown={e => e.stopPropagation()}>
                <AITutor onBack={() => setIsChatOpen(false)} />
              </div>
            )}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              onPointerDown={e => e.stopPropagation()}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all active:scale-90 ${
                isChatOpen ? 'bg-slate-800 rotate-90' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <i className={`fas ${isChatOpen ? 'fa-times' : 'fa-robot'} text-xl`}></i>
              {!isChatOpen && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
          </motion.div>
        )}

        {/* Daily Streak Completed Modal */}
        <AnimatePresence>
          {showStreakModal && streakRewardInfo && (
            <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[300] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-6 text-center space-y-6 shadow-2xl border border-amber-500/30 relative overflow-hidden"
              >
                {/* Confetti & Glow Background */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>

                {/* Fire Animation/Icon */}
                <div className="relative mt-2">
                  <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-[28px] flex items-center justify-center text-white text-4xl mx-auto shadow-lg shadow-orange-500/20 animate-bounce">
                    <i className="fas fa-fire animate-pulse"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full shadow-md border-2 border-white dark:border-slate-900">
                    +{streakRewardInfo.newStreak}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 font-sans">
                    Күнделікті серия! 🔥
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    Сіз бүгін 1 сұраққа жауап беріп, серияңызды сақтап қалдыңыз!
                  </p>
                </div>

                {/* Day tracker */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center px-4">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Серияңыз</span>
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-xl text-xs font-black">
                    <i className="fas fa-calendar-check"></i>
                    {streakRewardInfo.newStreak} күн қатарынан
                  </div>
                </div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/20 rounded-2xl p-3 text-center space-y-1">
                    <div className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                      <i className="fas fa-coins text-sm"></i>
                      +{streakRewardInfo.points}
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70">Ұпай сыйлығы</p>
                  </div>
                  <div className="bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-200/20 rounded-2xl p-3 text-center space-y-1">
                    <div className="text-lg font-black text-indigo-500 flex items-center justify-center gap-1">
                      <i className="fas fa-bolt text-sm"></i>
                      +{streakRewardInfo.xp}
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-wider text-indigo-600/70 dark:text-indigo-400/70">XP Тәжірибе</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowStreakModal(false)}
                  className="w-full py-3.5 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md"
                >
                  Жалғастыру
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
  );
};
export default App;
