// src/constants.ts

// ЕСКЕРТУ: Бұл файл енді Subject/University типтерін өз ішінде қайта анықтамайды.
// Компоненттер күткен өрістер: name, icon, color бар.

export type SubjectId =
  | "math"
  | "reading"
  | "chem"
  | "phys"
  | "bio"
  | "history"
  | "geo"
  | "eng"
  | "creative";

export type Subject = {
  id: SubjectId;
  name: string;
  title?: string;      // backward compat (кей жер title қолданса)
  icon: string;        // fontawesome class suffix
  color: string;       // tailwind gradient or bg class
  isElective?: boolean;
};

export const SUBJECTS: Subject[] = [
  { id: "math", name: "Математика", title: "Математика", icon: "fa-square-root-alt", color: "bg-emerald-600" },
  { id: "reading", name: "Оқу сауаттылығы", title: "Оқу сауаттылығы", icon: "fa-book-reader", color: "bg-indigo-600" },

  { id: "chem", name: "Химия", title: "Химия", icon: "fa-flask", color: "bg-orange-600", isElective: true },
  { id: "phys", name: "Физика", title: "Физика", icon: "fa-atom", color: "bg-blue-600", isElective: true },
  { id: "bio", name: "Биология", title: "Биология", icon: "fa-dna", color: "bg-green-600", isElective: true },
  { id: "history", name: "Қазақстан тарихы", title: "Қазақстан тарихы", icon: "fa-landmark", color: "bg-slate-900", isElective: true },
  { id: "geo", name: "География", title: "География", icon: "fa-globe-asia", color: "bg-cyan-600", isElective: true },
  { id: "eng", name: "Ағылшын тілі", title: "Ағылшын тілі", icon: "fa-language", color: "bg-purple-600", isElective: true },
];

export type Module = {
  id: string;
  subjectId: SubjectId;
  title: string;
  description?: string;
};

export const MODULES_BY_SUBJECT: Record<Exclude<SubjectId, "creative">, Module[]> = {
  math: [
    { id: "math-1", subjectId: "math", title: "Негізгі формулалар" },
    { id: "math-2", subjectId: "math", title: "Тест стратегиясы" },
  ],
  reading: [
    { id: "read-1", subjectId: "reading", title: "Мәтінмен жұмыс" },
    { id: "read-2", subjectId: "reading", title: "Логикалық сұрақтар" },
  ],
  chem: [{ id: "chem-1", subjectId: "chem", title: "Зат мөлшері, есептер" }],
  phys: [{ id: "phys-1", subjectId: "phys", title: "Механика негіздері" }],
  bio: [{ id: "bio-1", subjectId: "bio", title: "Жасуша және генетика" }],
  history: [{ id: "hist-1", subjectId: "history", title: "Хронология, картамен жұмыс" }],
  geo: [{ id: "geo-1", subjectId: "geo", title: "Климат және карта" }],
  eng: [{ id: "eng-1", subjectId: "eng", title: "Grammar + Reading" }],
};

export type StrategicCombination = {
  id: string;
  name: string;
  title?: string;     // backward compat
  desc: string;
  subjects: SubjectId[];
  icon: string;
  color: string;      // gradient tailwind: "from... to..."
};

export const STRATEGIC_COMBINATIONS: StrategicCombination[] = [
  {
    id: "combo-stem",
    name: "STEM",
    title: "STEM (Физ+Мат/Хим)",
    desc: "Инженерия, IT, техникалық мамандықтар үшін тиімді.",
    subjects: ["math", "phys"],
    icon: "fa-microchip",
    color: "from-emerald-500 to-cyan-600",
  },
  {
    id: "combo-med",
    name: "Медицина",
    title: "Медицина (Био+Хим)",
    desc: "Медицина, фармация, биотех бағыттарына.",
    subjects: ["bio", "chem"],
    icon: "fa-heartbeat",
    color: "from-pink-500 to-orange-500",
  },
  {
    id: "combo-social",
    name: "Әлеумет",
    title: "Әлеумет (Тарих+Гео)",
    desc: "Құқық, халықаралық қатынас, әлеуметтік ғылымдар.",
    subjects: ["history", "geo"],
    icon: "fa-balance-scale",
    color: "from-indigo-600 to-slate-900",
  },
];

export type MockQuestion = {
  id: string;
  subjectId: SubjectId;
  text: string;
  options: string[];
  correctIndex: number; // міндетті
};

export const MOCK_QUESTIONS: MockQuestion[] = [
  { id: "q1", subjectId: "math", text: "2 + 3 = ?", options: ["4", "5", "6", "7"], correctIndex: 1 },
  {
    id: "q2",
    subjectId: "reading",
    text: "Мәтіндегі негізгі ойды табу деген не?",
    options: ["Сөз санын санау", "Басты мағынаны анықтау", "Грамматиканы табу", "Дыбыстау"],
    correctIndex: 1,
  },
];

// UniListView-та қолданатын демо-шетел гранттары (минимум)
export type InternationalGrant = {
  id: string;
  title: string;
  description?: string;
  topUnis: string[];
};

export const INTERNATIONAL_GRANTS: InternationalGrant[] = [
  {
    id: "g1",
    title: "Үкіметаралық гранттар (жалпы)",
    description: "Елдер бойынша квота/шарттар жыл сайын жаңарады.",
    topUnis: ["University A", "University B", "University C"],
  },
];
