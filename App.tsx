import React, { useState, useEffect } from 'react';
import StudentLayout from './components/StudentLayout';
import AdminLayout from './components/AdminLayout';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import AuthScreen from './components/AuthScreen';
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
import { AppView, UserProgress, Lesson, Module, StaffMember, UserMarathon } from './types';
import { SUBJECTS, MODULES_BY_SUBJECT } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>('chem');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [allModules, setAllModules] = useState<Record<string, Module[]>>(() => {
    const saved = localStorage.getItem('smart_modules_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...MODULES_BY_SUBJECT, ...parsed };
      } catch (e) { return MODULES_BY_SUBJECT; }
    }
    return MODULES_BY_SUBJECT;
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('smart_staff_db');
    try {
      return saved ? JSON.parse(saved) : [
        { email: 'nur.abuuadi@gmail.com', name: 'Бас Админ', role: 'super-admin', permissions: ['all'] }
      ];
    } catch (e) {
      return [{ email: 'nur.abuuadi@gmail.com', name: 'Бас Админ', role: 'super-admin', permissions: ['all'] }];
    }
  });

  const [user, setUser] = useState<UserProgress>({
    name: 'Қонақ', email: '', phone: '', class: '11', region: '', school: '', pin: '', points: 0, xp: 0, level: 1, streak: 0, estimatedScore: 0,
    completedLessons: [], totalLessons: 177, recentScores: [], categoryStrength: {}, totalSolved: 0, correctAnswers: 0,
    subscription: 'none', chosenElectives: ['chem', 'bio'], startDate: new Date().toISOString(), isAdmin: false,
    role: 'student', // Әдепкі рөл - оқушы
    pointsHistory: []
  });

  useEffect(() => { localStorage.setItem('smart_modules_db', JSON.stringify(allModules)); }, [allModules]);
  useEffect(() => { localStorage.setItem('smart_staff_db', JSON.stringify(staffList)); }, [staffList]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleAuth = (userData: Partial<UserProgress>) => {
    if (!userData) return;
    const staff = staffList.find(s => s.email?.toLowerCase() === userData.email?.toLowerCase());
    const isAdmin = !!staff;
    const newUser: UserProgress = { 
      ...user, 
      ...userData as any, 
      isAdmin, 
      role: staff?.role || 'student',
      permissions: staff?.permissions || []
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('smart_user_session', JSON.stringify(newUser));
  };

  useEffect(() => {
    const savedSession = localStorage.getItem('smart_user_session');
    if (savedSession && savedSession !== 'undefined' && savedSession !== 'null') {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && typeof parsed === 'object') {
          const staff = staffList.find(s => s.email?.toLowerCase() === parsed.email?.toLowerCase());
          parsed.isAdmin = !!staff;
          parsed.role = staff?.role || 'student';
          parsed.permissions = staff?.permissions || [];
          setUser(parsed);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Session restoration error", e);
      }
    }
  }, [staffList]);

  const handleUpdateMarathon = (m: UserMarathon) => {
    const newUser = { ...user, marathon: m };
    setUser(newUser);
    localStorage.setItem('smart_user_session', JSON.stringify(newUser));
  };

  const renderContent = () => {
    if (selectedLesson && !currentView.startsWith('admin')) {
      return (
        <div className="animate-in fade-in">
          <button onClick={() => setSelectedLesson(null)} className="mb-4 text-gray-500 font-bold text-xs bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-700">
            <i className="fas fa-arrow-left"></i> Оралу
          </button>
          <LessonContent lesson={selectedLesson} onComplete={() => {}} />
        </div>
      );
    }

    switch (currentView) {
      case 'home': return <HomeView user={user} subjects={SUBJECTS} onSelectView={setCurrentView} onSelectSubject={(id) => { setSelectedSubjectId(id); setCurrentView('module-list'); }} />;
      case 'module-list': return <ModuleList user={user} onSelectLesson={setSelectedLesson} modules={selectedSubjectId ? (allModules[selectedSubjectId] || []) : []} subjects={SUBJECTS} selectedSubjectId={selectedSubjectId} onSelectSubject={setSelectedSubjectId} />;
      case 'ai-tools-hub': return <AIToolsHub onSelectView={setCurrentView} />;
      case 'profile': return <ProfileView user={user} onLogout={() => setIsLoggedIn(false)} onSelectView={setCurrentView} />;
      case 'uni-list': return <UniListView user={user} />;
      case 'rating': return <RatingView user={user} onBack={() => setCurrentView('profile')} />;
      case 'marathon': return <MarathonView user={user} onUpdateMarathon={handleUpdateMarathon} />;
      case 'subject-selection': return <SubjectSelectionView user={user} onUpdateSubjects={(s) => setUser({...user, chosenElectives: s})} onClose={() => setCurrentView('home')} />;
      
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
      case 'roadmap': return <RoadmapView onBack={() => setCurrentView('home')} modules={selectedSubjectId ? allModules[selectedSubjectId] : []} user={user} />;
      case 'tournament': return <TournamentView onBack={() => setCurrentView('home')} />;
      case 'test': return <TestView onComplete={(s) => setUser({...user, points: user.points + s})} />;
      
      case 'admin':
      case 'admin-content':
      case 'admin-staff':
        return <AdminPanel currentView={currentView} setView={setCurrentView} allModules={allModules} setAllModules={setAllModules} staffList={staffList} setStaffList={setStaffList} user={user} />;
      
      default: return <HomeView user={user} subjects={SUBJECTS} onSelectView={setCurrentView} onSelectSubject={(id) => { setSelectedSubjectId(id); setCurrentView('module-list'); }} />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {!isLoggedIn ? <AuthScreen onAuth={handleAuth} /> : (
        currentView.startsWith('admin') ? (
          <AdminLayout currentView={currentView} setView={setCurrentView} user={user}>{renderContent()}</AdminLayout>
        ) : (
          <StudentLayout currentView={currentView} setView={setCurrentView} user={user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>{renderContent()}</StudentLayout>
        )
      )}
    </div>
  );
};
export default App;