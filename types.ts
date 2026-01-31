// types.ts

export type SubscriptionPlan = "none" | "basic" | "pro" | "premium";
export type PostStatus = "draft" | "published";

export type AppView =
  | "home"
  | "module-list"
  | "lesson"
  | "ai-tools-hub"
  | "profile"
  | "uni-list"
  | "rating"
  | "marathon"
  | "subject-selection"
  | "periodic-table"
  | "ai-tutor"
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
  // Admin routes
  | "admin"
  | "admin-content"
  | "admin-posts"
  | "admin-universities"
  | "admin-aihub"
  | "admin-staff"
  | "admin-users";

export type Subject = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
};

export type Reinforcement = {
  question: string;
  options: string[];
  correctAnswer: number; // index
};

export type HomeworkItem = {
  id: string;
  question: string;
  answer?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
};

export type Lesson = {
  id: string;
  title: string;
  isFree: boolean;

  // optional content links
  videoUrl?: string;
  presentationUrl?: string;
  analysisVideoUrl?: string;
  pdfSolutionUrl?: string;

  reinforcement: Reinforcement;
  homework: HomeworkItem[];
};

export type Module = {
  id: string;
  title: string;
  weekNumber: number;
  lessons: Lesson[];
};

export type StaffRole = "teacher" | "admin" | "super-admin";

export type StaffMember = {
  email: string;
  name: string;
  role: StaffRole;
  permissions: string[]; // e.g. ['all'] or ['chem','bio']
};

export type UserMarathon = {
  active?: boolean;
  startAt?: string;
  endAt?: string;
  daysDone?: number;
  targetDays?: number;
};

export type PointsHistoryItem = {
  at: string; // ISO
  delta: number;
  reason?: string;
};

export type UserProgress = {
  // identity
  name: string;
  email: string;
  phone: string;
  class: string;
  region: string;
  school: string;
  pin: string;

  // gamification
  points: number;
  xp: number;
  level: number;
  streak: number;
  estimatedScore: number;

  // learning stats
  completedLessons: string[];
  totalLessons: number;
  recentScores: number[];
  categoryStrength: Record<string, number>;
  totalSolved: number;
  correctAnswers: number;

  subscription: SubscriptionPlan;

  chosenElectives: string[];
  startDate: string;

  // admin flags
  isAdmin: boolean;
  role: "student" | StaffRole;
  permissions?: string[];

  // optional features
  marathon?: UserMarathon;
  pointsHistory: PointsHistoryItem[];
};
