
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
import { motion } from 'motion/react';
import { AppView, UserProgress, Lesson, Module, StaffMember, UserMarathon, NewsItem } from './types';
import { SUBJECTS, MODULES_BY_SUBJECT } from './constants';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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
    } catch (err) {
      console.warn("Data refresh failed");
    }
  };

  // Supabase-тен деректерді жүктеу
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await refreshData();
        
        const { data: modulesData, error: mError } = await supabase.from('modules').select('*');
        if (!mError && modulesData && modulesData.length > 0) {
          const formattedModules: Record<string, Module[]> = {};
          modulesData.forEach(item => {
            formattedModules[item.subject_id] = item.data;
          });
          setAllModules(prev => ({ ...prev, ...formattedModules }));
        }

        const { data: staffData, error: sError } = await supabase.from('staff').select('*');
        if (!sError && staffData && staffData.length > 0) {
          setStaffList(staffData);
        }
      } catch (err) {
        console.warn("Supabase integration skipped or failed. Using local constants.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
    const isOwner = email === 'nur.abuuadi@gmail.com' || email === 'ernazarnurtay@gmail.com';
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
  };

  const updateSubjects = async (subjects: string[]) => {
    const updatedUser = { ...user, chosenElectives: subjects };
    setUser(updatedUser);
    localStorage.setItem('smart_user_session', JSON.stringify(updatedUser));
    
    try {
      await supabase
        .from('users')
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
          .from('users')
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

  const renderContent = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Деректер жүктелуде...</p>
      </div>
    );

    if (selectedLesson && !currentView.startsWith('admin')) {
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
        />
      );
    }

    switch (currentView) {
      case 'home': return <HomeView user={user} subjects={SUBJECTS} onSelectView={setCurrentView} onSelectSubject={(id) => { setSelectedSubjectId(id); setCurrentView('module-list'); }} homeConfig={homeConfig} news={news} />;
      case 'module-list': return <ModuleList user={user} onSelectLesson={setSelectedLesson} modules={selectedSubjectId ? (allModules[selectedSubjectId] || []) : []} subjects={SUBJECTS} selectedSubjectId={selectedSubjectId} onSelectSubject={setSelectedSubjectId} />;
      case 'ai-tools-hub': return <AIToolsHub onSelectView={setCurrentView} />;
      case 'profile': return <ProfileView user={user} onLogout={() => setIsLoggedIn(false)} onSelectView={setCurrentView} />;
      case 'uni-list': return <UniListView user={user} />;
      case 'subscription': return <SubscriptionView />;
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
      case 'arena': return <ArenaView onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'career-advisor': return <CareerAdvisorView onBack={() => setCurrentView('ai-tools-hub')} />;
      case 'roadmap': return <RoadmapView onBack={() => setCurrentView('home')} allModules={allModules} user={user} onSelectLesson={setSelectedLesson} subjects={SUBJECTS} />;
      case 'tournament': return <TournamentView onBack={() => setCurrentView('home')} />;
      case 'test': return <TestView selectedSubjects={user.chosenElectives} onComplete={(s) => setUser({...user, points: user.points + s})} />;
      case 'admin':
      case 'admin-content':
      case 'admin-news':
      case 'admin-staff':
      case 'admin-users':
      case 'admin-home':
      case 'admin-unis':
      case 'admin-ai':
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
            refreshData={refreshData}
          />
        );
      default: return <HomeView user={user} subjects={SUBJECTS} onSelectView={setCurrentView} onSelectSubject={(id) => { setSelectedSubjectId(id); setCurrentView('module-list'); }} homeConfig={homeConfig} news={news} />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
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
            hideNav={false}
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
    </div>
  );
};
export default App;
