
import { Subject, Module, NewsItem, Question, Lesson, InternationalGrant } from './types';

const createLesson = (id: string, title: string, isFree = false): Lesson => ({
  id,
  title,
  isFree,
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  presentationUrl: 'https://drive.google.com/file/d/sample/view',
  analysisVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  pdfSolutionUrl: 'https://drive.google.com/file/d/sample-analysis/view',
  transcript: `Бұл "${title}" тақырыбы бойынша мәтіндік нұсқа.`,
  reinforcement: {
    question: `${title} бойынша бекіту сұрағы:`,
    options: ['Дұрыс жауап', 'Қате 1', 'Қате 2', 'Қате 3'],
    correctAnswer: 0
  },
  homework: Array.from({ length: 15 }, (_, i) => ({
    id: `${id}-hw-${i}`,
    text: `${title}: Тест сұрағы №${i + 1}`,
    options: ['A нұсқасы', 'B нұсқасы', 'C нұсқасы', 'D нұсқасы'],
    correctAnswer: 0
  }))
});

export const SUBJECT_TITLES: Record<string, string[]> = {
  'math-lit': ['Сандар жиыны', 'Проценттер', 'Логикалық есептер', 'Геометрия негіздері', 'Мәтіндік есептер', 'Графиктер мен диаграммалар'],
  'reading-lit': ['Мәтін түрлері', 'Негізгі ойды анықтау', 'Стильдік ерекшеліктер', 'Мәнмәтіндік талдау', 'Ақпаратты салыстыру'],
  'history-kz': ['Ежелгі Қазақстан', 'Түркі қағанаттары', 'Қазақ хандығының құрылуы', 'Ресей империясы кезеңі', 'Алаш қозғалысы', 'Тәуелсіз Қазақстан'],
  'math': ['Алгебралық өрнектер', 'Функциялар', 'Тригонометрия', 'Туынды және Интеграл', 'Планиметрия', 'Стереометрия', 'Ықтималдықтар теориясы'],
  'phys': ['Механика', 'Термодинамика', 'Электродинамика', 'Оптика', 'Кванттық физика', 'Ядролық физика'],
  'chem': [
    'Химияға кіріспе', 'Атом құрылысы', 'Периодтық жүйе', 'Химиялық байланыс', 
    'Зат мөлшері', 'Бейорганикалық кластар', 'Ерітінділер', 'ТТР', 
    'Реакция жылдамдығы', 'Тепе-теңдік', 'Металдар', 'Бейметалдар', 
    'Сутегі мен Оттегі', 'Азот пен Фосфор', 'Көміртек пен Кремний', 
    'Органикалық кіріспе', 'Алкандар', 'Алкендер мен Алкиндер', 
    'Арендер', 'Спирттер мен Альдегидтер', 'Карбон қышқылдары', 'Азотты қосылыстар'
  ],
  'bio': [
    'Биологияға кіріспе', 'Цитология: Жасуша', 'Биохимия', 'Метаболизм',
    'Вирустар мен Бактериялар', 'Саңырауқұлақтар', 'Өсімдіктер', 'Жануарлар',
    'Асқорыту жүйесі', 'Қан айналым жүйесі', 'Тыныс алу', 'Жүйке жүйесі',
    'Генетика', 'Селекция', 'Экология', 'Эволюция', 'Биосфера'
  ],
};

const generateModules = (subjectId: string): Module[] => {
  const titles = SUBJECT_TITLES[subjectId] || [];
  return titles.map((title, index) => {
    const isChem = subjectId === 'chem';
    const lessonsCount = isChem ? 3 : 1; 
    const lessons: Lesson[] = [];
    for (let i = 1; i <= lessonsCount; i++) {
      let lessonTitle = `${title}: ${i}-бөлім`;
      if (isChem) {
        if (i === 1) lessonTitle = `${title}: Теория негіздері`;
        if (i === 2) lessonTitle = `${title}: Есептер шығару`;
        if (i === 3) lessonTitle = `${title}: Күрделі деңгей (ҰБТ)`;
      }
      lessons.push(createLesson(`${subjectId}-m${index + 1}-l${i}`, lessonTitle, index === 0 && i === 1));
    }
    return {
      id: `${subjectId}-m${index + 1}`,
      title: `${index + 1}. ${title}`,
      weekNumber: index + 1,
      lessons
    };
  });
};

export const MODULES_BY_SUBJECT: Record<string, Module[]> = {
  'math-lit': generateModules('math-lit'),
  'reading-lit': generateModules('reading-lit'),
  'history-kz': generateModules('history-kz'),
  'math': generateModules('math'),
  'phys': generateModules('phys'),
  'chem': generateModules('chem'),
  'bio': generateModules('bio'),
};

export const SUBJECTS: Subject[] = [
  { id: 'math-lit', name: 'Мат. сауаттылық', icon: 'fa-calculator', color: 'bg-blue-500', isElective: false },
  { id: 'reading-lit', name: 'Оқу сауаттылығы', icon: 'fa-book-open', color: 'bg-orange-500', isElective: false },
  { id: 'history-kz', name: 'Қазақстан тарихы', icon: 'fa-landmark', color: 'bg-red-500', isElective: false },
  { id: 'math', name: 'Математика', icon: 'fa-square-root-variable', color: 'bg-blue-600', isElective: true },
  { id: 'phys', name: 'Физика', icon: 'fa-atom', color: 'bg-indigo-500', isElective: true },
  { id: 'chem', name: 'Химия', icon: 'fa-flask', color: 'bg-emerald-500', isElective: true },
  { id: 'bio', name: 'Биология', icon: 'fa-dna', color: 'bg-pink-500', isElective: true },
];

export const INTERNATIONAL_GRANTS: InternationalGrant[] = [
  { id: 'hungary', country: 'Венгрия', title: 'Stipendium Hungaricum', totalGrants: '250 грант', programs: 'Бакалавриат — 110, Магистратура — 90', language: 'Венгр, ағылшын', deadline: 'Желтоқсан-Қаңтар', topUnis: ['University of Debrecen', 'Eötvös Loránd University'], image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=600', color: 'from-green-600 to-red-600' },
  { id: 'china', country: 'Қытай', title: 'Қытай үкіметтік гранты', totalGrants: '155 грант', programs: 'Барлық деңгей', language: 'Қытай, ағылшын', deadline: 'Қаңтар-Ақпан', topUnis: ['Peking University', 'Tsinghua University'], image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=600', color: 'from-red-600 to-yellow-500' }
];

export const MARATHON_TASKS = ["Бүгінгі сабақты толық көру", "10 есеп шығару", "AI Тьюторға 1 сұрақ қою"];
export const MOTIVATIONAL_QUOTES = ["Бүгінгі еңбек - ертеңгі грант!", "Кішігірім қадамдар үлкен жеңіске жетелейді."];
export const MOCK_QUESTIONS: Question[] = [
  { id: 'q1', text: 'Зат мөлшерінің өлшем бірлігі қандай?', options: ['Моль', 'Килограмм', 'Литр', 'Метр'], correctAnswer: 0 }
];
export const STRATEGIC_COMBINATIONS = [
  { id: 'bio-chem', name: 'Биология + Химия', subjects: ['bio', 'chem'], icon: 'fa-vials', color: 'from-emerald-500 to-teal-600', desc: 'Медицина, Фармация.' },
  { id: 'math-phys', name: 'Математика + Физика', subjects: ['math', 'phys'], icon: 'fa-atom', color: 'from-blue-500 to-indigo-600', desc: 'Инженерия, IT.' },
];
