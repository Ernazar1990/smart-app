// src/App.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import StudentLayout from "./components/StudentLayout";
import AdminLayout from "./components/AdminLayout";
import HomeView from "./components/HomeView";
import ProfileView from "./components/ProfileView";
import AuthScreen from "./components/AuthScreen";
import ModuleList from "./components/ModuleList";
import LessonContent from "./components/LessonContent";
import AITutor from "./components/AITutor";
import AdminPanel from "./components/AdminPanel";
import AIToolsHub from "./components/AIToolsHub";
import SubjectSelectionView from "./components/SubjectSelectionView";
import UniListView from "./components/UniListView";
import RatingView from "./components/RatingView";
import MarathonView from "./components/MarathonView";
import PeriodicTable from "./components/PeriodicTable";
import ScannerView from "./components/ScannerView";
import FormulaHub from "./components/FormulaHub";
import SolubilityTable from "./components/SolubilityTable";
import ReactivitySeries from "./components/ReactivitySeries";
import MultiplicationTable from "./components/MultiplicationTable";
import GlossaryView from "./components/GlossaryView";
import ReactionBalancer from "./components/ReactionBalancer";
import Flashcards from "./components/Flashcards";
import ArenaView from "./components/ArenaView";
import CareerAdvisorView from "./components/CareerAdvisorView";
import RoadmapView from "./components/RoadmapView";
import TournamentView from "./components/TournamentView";
import TestView from "./components/TestView";

import type { AppView, UserProgress, Lesson, Module, StaffMember, UserMarathon } from "./types";
import { SUBJECTS, MODULES_BY_SUBJECT } from "./constants";

const normalizeAllModules = (modules: Record<string, Module[]>): Record<string, Module[]> => {
  const normalized: Record<string, Module[]> = {};
  
  for (const [key, value] of Object.entries(modules)) {
    if (Array.isArray(value)) {
      normalized[key] = value;
    }
  }
  
  return normalized;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // ❗ string қыламыз — HomeView/ModuleList/SubjectSelectionView бәрімен қақтығыспайды
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>("chem");

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [allModules, setAllModules] = useState<Record<string, Module[]>>(() => {
    const saved = localStorage.getItem("smart_modules_db");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...(MODULES_BY_SUBJECT as any), ...(parsed || {}) };
      } catch {
        return MODULES_BY_SUBJECT as any;
      }
    }
    return MODULES_BY_SUBJECT as any;
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem("smart_staff_db");
    try {
      return saved
        ? JSON.parse(saved)
        : [
            {
              email: "nur.abuuadi@gmail.com",
              name: "Бас Админ",
              role: "super-admin",
              permissions: ["all"],
            } as any,
          ];
    } catch {
      return [
        {
          email: "nur.abuuadi@gmail.com",
          name: "Бас Админ",
          role: "super-admin",
          permissions: ["all"],
        } as any,
      ];
    }
  });

  const [user, setUser] = useState<UserProgress>(() => ({
    name: "Қонақ",
    email: "",
    phone: "",
    class: "11",
    region: "",
    school: "",
    pin: "",
    points: 0,
    xp: 0,
    level: 1,
    streak: 0,
    estimatedScore: 0,
    completedLessons: [],
    totalLessons: 177,
    recentScores: [],
    categoryStrength: {},
    totalSolved: 0,
    correctAnswers: 0,
    subscription: "none",
    chosenElectives: ["chem", "bio"] as any,
    startDate: new Date().toISOString(),
    isAdmin: false,
    role: "student",
    pointsHistory: [],
    permissions: [],
  } as any));

  // Persist modules/staff
  useEffect(() => {
    localStorage.setItem("smart_modules_db", JSON.stringify(allModules));
  }, [allModules]);

  useEffect(() => {
    localStorage.setItem("smart_staff_db", JSON.stringify(staffList));
  }, [staffList]);

  // Dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const handleAuth = (userData: Partial<UserProgress>) => {
    if (!userData) return;

    const staff = staffList.find((s: any) => (s.email || "").toLowerCase() === (userData.email || "").toLowerCase());
    const isAdmin = !!staff;

    const newUser: UserProgress = {
      ...(user as any),
      ...(userData as any),
      isAdmin,
      role: (staff?.role as any) || "student",
      permissions: (staff?.permissions as any) || [],
    } as any;

    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem("smart_user_session", JSON.stringify(newUser));
  };

  // Restore LocalStorage session
useEffect(() => {
  const saved = localStorage.getItem("smart_modules_db");
  if (!saved) return;

  try {
    const raw = JSON.parse(saved);
    const normalized = normalizeAllModules(raw);

    setAllModules(normalized);
    // ✅ бір рет жаңартып қайта сақтап қоямыз (енді бәрі жаңа форматта)
    localStorage.setItem("smart_modules_db", JSON.stringify(normalized));
  } catch (e) {
    console.error("modules parse error", e);
  }
}, []);

  // Supabase session auto login
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        handleAuth({ email: data.session.user.email || "" });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleAuth({ email: session.user.email || "" });
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateMarathon = (m: UserMarathon) => {
    const newUser = { ...(user as any), marathon: m };
    setUser(newUser);
    localStorage.setItem("smart_user_session", JSON.stringify(newUser));
  };

  const renderContent = () => {
    // Сабақ ашық тұрса — Admin емес кезде ғана LessonContent
    if (selectedLesson && !String(currentView).startsWith("admin")) {
      return (
        <div className="animate-in fade-in">
          <button
            onClick={() => setSelectedLesson(null)}
            className="mb-4 text-gray-500 font-bold text-xs bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-700"
          >
            <i className="fas fa-arrow-left"></i> Оралу
          </button>
          <LessonContent lesson={selectedLesson} onComplete={() => {}} />
        </div>
      );
    }

    switch (currentView) {
      case "home":
        return (
          <HomeView
            user={user}
            subjects={SUBJECTS as any}
            onSelectView={setCurrentView as any}
            onSelectSubject={(id: string) => {
              setSelectedSubjectId(id);
              setCurrentView("module-list" as any);
            }}
          />
        );

      case "module-list":
        return (
          <ModuleList
            user={user}
            onSelectLesson={setSelectedLesson as any}
            modules={selectedSubjectId ? allModules[selectedSubjectId] || [] : []}
            subjects={SUBJECTS as any}
            selectedSubjectId={selectedSubjectId as any}
            onSelectSubject={(id: string) => setSelectedSubjectId(id)}
          />
        );

      case "ai-tools-hub":
        return <AIToolsHub onSelectView={setCurrentView as any} />;

      case "profile":
        return (
          <ProfileView
            user={user}
            onLogout={() => {
              setIsLoggedIn(false);
              localStorage.removeItem("smart_user_session");
            }}
            onSelectView={setCurrentView as any}
          />
        );

      case "uni-list":
        return <UniListView user={user} />;

      case "rating":
        return <RatingView user={user} onBack={() => setCurrentView("profile" as any)} />;

      case "marathon":
        return <MarathonView user={user} onUpdateMarathon={handleUpdateMarathon} />;

      case "subject-selection":
        return (
          <SubjectSelectionView
            user={user}
            onUpdateSubjects={(s: string[]) => {
              const newUser = { ...(user as any), chosenElectives: s as any };
              setUser(newUser);
              localStorage.setItem("smart_user_session", JSON.stringify(newUser));
            }}
            onClose={() => setCurrentView("home" as any)}
          />
        );

      case "periodic-table":
        return <PeriodicTable onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "ai-tutor":
        return <AITutor onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "scanner":
        return <ScannerView onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "formulas":
        return <FormulaHub onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "solubility-table":
        return <SolubilityTable onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "reactivity-series":
        return <ReactivitySeries onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "multiplication-table":
        return <MultiplicationTable onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "glossary":
        return <GlossaryView onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "reaction-balancer":
        return <ReactionBalancer onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "flashcards":
        return <Flashcards onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "arena":
        return <ArenaView onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "career-advisor":
        return <CareerAdvisorView onBack={() => setCurrentView("ai-tools-hub" as any)} />;

      case "roadmap":
        return (
          <RoadmapView
            onBack={() => setCurrentView("home" as any)}
            modules={selectedSubjectId ? allModules[selectedSubjectId] || [] : []}
            user={user}
          />
        );

      case "tournament":
        return <TournamentView onBack={() => setCurrentView("home" as any)} />;

      case "test":
        return (
          <TestView
            onComplete={(s: number) => {
              const newUser = { ...(user as any), points: (user as any).points + s };
              setUser(newUser);
              localStorage.setItem("smart_user_session", JSON.stringify(newUser));
            }}
          />
        );

      // ADMIN views
      case "admin":
      case "admin-content":
      case "admin-posts":
      case "admin-universities":
      case "admin-aihub":
      case "admin-staff":
      case "admin-users":
        return (
          <AdminPanel
            currentView={currentView}
            setView={setCurrentView as any}
            allModules={allModules}
            setAllModules={setAllModules}
            staffList={staffList}
            setStaffList={setStaffList}
            user={user}
          />
        );

      default:
        return (
          <HomeView
            user={user}
            subjects={SUBJECTS as any}
            onSelectView={setCurrentView as any}
            onSelectSubject={(id: string) => {
              setSelectedSubjectId(id);
              setCurrentView("module-list" as any);
            }}
          />
        );
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      {!isLoggedIn ? (
        <AuthScreen onAuth={handleAuth} />
      ) : String(currentView).startsWith("admin") ? (
        <AdminLayout currentView={currentView} setView={setCurrentView as any} user={user}>
          {renderContent()}
        </AdminLayout>
      ) : (
        <StudentLayout
          currentView={currentView}
          setView={setCurrentView as any}
          user={user}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        >
          {renderContent()}
        </StudentLayout>
      )}
    </div>
  );
};

export default App;
