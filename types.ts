// src/types.ts

export type AppView =
  | "home"
  | "module-list"
  | "lesson-detail"
  | "ai-tools-hub"
  | "ai-tutor"
  | "profile"
  | "uni-list"
  | "rating"
  | "marathon"
  | "subject-selection"
  | "periodic-table"
  | "scanner"
  | "formulas"
  | "solubility-table"
  | "reactivity-series"
  | "multiplication-table"
  | "glossary"
  | "reaction-balancer"
  | "flashcards"
  | "arena"
  | "career-advisor"
  | "roadmap"
  | "tournament"
  | "test"
  // admin
  | "admin"
  | "admin-content"
  | "admin-posts"
  | "admin-universities"
  | "admin-aihub"
  | "admin-staff"
  | "admin-users";

// ---------------- SUBJECTS ----------------
export type Subject = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isElective?: boolean;
};

// ---------------- LESSONS / MODULES ----------------

export type HomeworkItem = {
  id: string;
  // кей жерде text, кей жерде question қолданылған — екеуі де рұқсат
  text?: string;
  question?: string;
  options: string[];
  correctAnswer: number;
};

export type ReinforcementQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number; // дұрыс жауап индексі
  explanation?: string;
};

export interface Lesson {
  id: string;
  title: string;
  content: string;

  // ✅ қос
  reinforcement?: {
    enabled?: boolean;
    questions?: ReinforcementQuestion[];
    passScore?: number; // 0..100
  };

  // 1) Негізгі видео
  videoUrl?: string;

  // constants.ts ішінде transcript қолданылып тұр
  transcript?: string;

  // 2) Бекіту тапсырмасы
  practiceHtml?: string;

  // reinforcement кей жерде жоқ болуы мүмкін
  reinforcementItems?: ReinforcementQuestion[]; // ✅ көп бекіту сұрақтары

  // 3) Үй жұмысы
  homeworkHtml?: string;
  homeworkPdfUrl?: string;

  // Үй жұмысы тесттері
  homework: HomeworkItem[];

  // 4) Қатемен жұмыс
  fixesVideoUrl?: string;
  fixesPdfUrl?: string;
};

export type Module = {
  id: string;
  title: string;
  weekNumber?: number;
  lessons: Lesson[];
};
// ---------------- STAFF / USER ----------------
export type StaffMember = {
  email: string;
  name: string;
  role: "super-admin" | "teacher" | "admin" | string;
  permissions: string[];
};

export type UserMarathon = {
  // екі вариант жүр: startDate және startAt, isActive және active
  startDate?: string;
  startAt?: string;

  isActive?: boolean;
  active?: boolean;

  duration?: number;

  completedDays?: number[];
  currentStreak?: number;
};

export type UserProgress = {
  name: string;
  email: string;
  phone?: string;
  class?: string;
  region?: string;
  school?: string;
  pin?: string;

  points: number;
  xp: number;
  level: number;
  streak: number;
  estimatedScore: number;

  completedLessons: string[];
  totalLessons: number;

  recentScores: number[];
  categoryStrength: Record<string, number>;
  totalSolved: number;
  correctAnswers: number;

  subscription?: "none" | "basic" | "pro" | string;

  chosenElectives: string[];
  startDate?: string;

  isAdmin?: boolean;
  role?: string;
  permissions?: string[];

  pointsHistory?: any[];

  marathon?: UserMarathon;
};

// ---------------- CHAT ----------------
export type ChatMessage = {
  // стандарт: model жоқ, assistant қолдану керек
  role: "user" | "assistant" | "system";
  content: string;
};

// ---------------- TESTS ----------------
export type Question = {
  id: string;
  text: string;
  options: string[];

  // бір жауап: number, көп жауап: number[]
  correctAnswer: number | number[];

  // TestView.tsx осыны тексереді
  isMulti?: boolean;
};

// ---------------- NEWS ----------------
export type NewsItem = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  createdAt?: string;
};

// ---------------- UNI HUB ----------------
export type UniversityContacts = {
  website?: string;
  phone?: string;
  email?: string;

  admissionsUrl?: string;
  admissionsPhone?: string;
  admissionsEmail?: string;
};

export type UniversityAdmission = {
  documentsKZ?: string[];
  documentsIntl?: string[];
  notes?: string[];
};

export type UniversityOpportunities = {
  dormitory?: boolean;
  exchange?: boolean;
  doubleDegree?: boolean;
  militaryDept?: boolean;
  foundation?: boolean;
  scholarships?: string[];
};

export type University = {
  id: string;
  name: string;

  // UniListView қолданатын негізгі өрістер:
  logo?: string | null;
  location?: string | null;
  region?: string | null;
  type?: string | null;

  specialtiesCount?: number | null;
  minScore?: number | null;
  averagePrice?: string | null;

  hasDormitory?: boolean | null;
  website?: string | null;
  address?: string | null;
  phone?: string | null;

  // UniListView ішінде қолданылып тұр:
  contacts?: UniversityContacts | null;
  admission?: UniversityAdmission | null;
  opportunities?: UniversityOpportunities | null;
};

export type Specialty = {
  id: string;
  code?: string;
  name: string;
  subjects: string[];
  minScore?: number;
  grants?: number;
};

export type InternationalGrant = {
  id: string;

  country?: string;
  title?: string;

  totalGrants?: string;
  programs?: string;
  language?: string;
  deadline?: string;

  topUnis?: string[];

  image?: string;
  color?: string;

  // сенде UniListView кей жерде description көрсетеді
  description?: string;
};
