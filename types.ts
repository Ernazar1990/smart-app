
export type AppView = 'auth' | 'home' | 'subjects' | 'module-list' | 'lesson-detail' | 'test' | 'marathon' | 'rating' | 'profile' | 'subscription' | 'periodic-table' | 'ai-tutor' | 'news-detail' | 'uni-list' | 'onboarding' | 'scanner' | 'formulas' | 'admin' | 'admin-content' | 'admin-news' | 'admin-users' | 'admin-staff' | 'admin-home' | 'admin-unis' | 'admin-ai' | 'subject-selection' | 'solubility-table' | 'reactivity-series' | 'multiplication-table' | 'glossary' | 'ai-tools-hub' | 'reaction-balancer' | 'flashcards' | 'arena' | 'ai-study-plan' | 'career-advisor' | 'roadmap' | 'tournament';

export type UserRole = 'student' | 'teacher' | 'super-admin';

// Missing type: UserMarathon
export interface UserMarathon {
  isActive: boolean;
  duration: 7 | 14 | 30;
  startDate: string;
  completedDays: number[];
  currentStreak: number;
}

export interface UserProgress {
  name: string;
  email: string;
  phone?: string;
  class?: string;
  region?: string;
  school?: string;
  pin?: string; 
  points: number;
  xp?: number; 
  level?: number;
  streak?: number;
  estimatedScore?: number;
  completedLessons: string[];
  totalLessons?: number;
  recentScores?: number[];
  categoryStrength?: { [key: string]: number };
  totalSolved?: number;
  correctAnswers?: number;
  subscription: string;
  chosenElectives: string[];
  startDate?: string;
  isAdmin?: boolean;
  role?: UserRole;
  permissions?: string[]; // Subject IDs like ['chem', 'bio']
  pointsHistory?: any[];
  // Added marathon field to UserProgress
  marathon?: UserMarathon;
}

export interface StaffMember {
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface Lesson {
  id: string;
  title: string;
  isFree: boolean;
  videoUrl: string;
  presentationUrl: string;
  analysisVideoUrl: string;
  pdfSolutionUrl: string;
  // Added transcript field to Lesson
  transcript?: string;
  reinforcement: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  homework: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  weekNumber: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  isElective: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Missing type: Question
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number | number[];
  isMulti?: boolean;
  subject?: string;
}

// Missing type: InternationalGrant
export interface InternationalGrant {
  id: string;
  country: string;
  title: string;
  totalGrants: string;
  programs: string;
  language: string;
  deadline: string;
  topUnis: string[];
  image: string;
  color: string;
}

// Missing type: University
export interface University {
  id: string;
  name: string;
  logo: string;
  location: string;
  region: string;
  type: string;
  specialtiesCount: number;
  minScore: number;
  averagePrice: string;
  hasDormitory: boolean;
  website: string;
  address: string;
  phone: string;
}

// Missing type: Specialty
export interface Specialty {
  id: string;
  code: string;
  name: string;
  subjects: string[];
  minScore: number;
  grants: number;
}

// Missing type: NewsItem
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  created_at?: string;
}
