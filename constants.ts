
import { Subject, Module, Lesson, Question, InternationalGrant } from './types';

const createLesson = (id: string, title: string, isFree = false): Lesson => ({
  id,
  title,
  isFree,
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Мысал ретінде
  presentationUrl: 'https://example.com/slide.pdf',
  analysisVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  pdfSolutionUrl: 'https://example.com/solution.pdf',
  transcript: `Бұл "${title}" тақырыбы бойынша мәтіндік нұсқа.`,
  reinforcement: [{
    question: `${title} бойынша бекіту сұрағы:`,
    options: ['Дұрыс жауап', 'Қате 1', 'Қате 2', 'Қате 3'],
    correctAnswer: 0
  }],
  homework: Array.from({ length: 10 }, (_, i) => ({
    question: `${title}: Тест сұрағы №${i + 1}`,
    options: ['A нұсқасы', 'B нұсқасы', 'C нұсқасы', 'D нұсқасы'],
    correctAnswer: 0
  }))
});

export const SUBJECT_TITLES: Record<string, string[]> = {
  'chem': [
    'Химия пәніне кіріспе. Таза заттар және қоспалар',
    'Заттардың агрегаттық күйінің өзгеруі',
    'Атомдар. Молекулалар. Заттар',
    'Атом құрылысы. Электрондық конфигурация',
    'Периодтық заң және периодтық жүйе',
    'Химиялық байланыс түрлері',
    'Зат мөлшері. Авогадро заны',
    'Бейорганикалық қосылыстардың негізгі кластары',
    'Химиялық реакциялардың жіктелуі',
    'Ерітінділер және ерігіштік',
    'Электролиттік диссоциация',
    'Тотығу-тотықсыздану реакциялары',
    'Металдардың жалпы қасиеттері',
    'Бейметалдардың жалпы қасиеттері',
    'Сутегі және галогендер',
    'Оттегі топшасы элементтері',
    'Азот топшасы элементтері',
    'Көміртек топшасы элементтері',
    'Органикалық химияға кіріспе',
    'Көмірсутектер: Алкандар, Алкендер, Алкиндер',
    'Оттекті органикалық қосылыстар',
    'Азотты органикалық қосылыстар. Биологиялық белсенді заттар'
  ],
  'geo': [
    'География ғылымының даму тарихы',
    'Картография және географиялық деректер',
    'Жердің геосфералары',
    'Литосфера және жер бедері',
    'Атмосфера және климат',
    'Гидросфера: Дүниежүзілік мұхит және құрлық сулары',
    'Биосфера және табиғат зоналары',
    'Дүниежүзі халқының географиясы',
    'Дүниежүзілік шаруашылық',
    'Қазақстанның физикалық географиясы',
    'Қазақстанның экономикалық географиясы'
  ],
  'it': [
    'Ақпараттық процестер және қауіпсіздік',
    'Компьютерлік жүйелер мен желілер',
    'Алгоритмдеу және бағдарламалау (Python)',
    'Деректер базасы және SQL',
    'Веб-технологиялар (HTML, CSS)',
    'Модельдеу және талдау',
    'Жасанды интеллект негіздері'
  ],
  'kaz-lit': [
    'Көне дәуір әдебиеті',
    'Хандық дәуір әдебиеті',
    'XIX ғасыр әдебиеті (Абай, Ыбырай, Шоқан)',
    'XX ғасыр басындағы қазақ әдебиеті',
    'Кеңес дәуіріндегі қазақ әдебиеті',
    'Тәуелсіздік кезеңіндегі әдебиет'
  ],
  'rus-lit': [
    'Древнерусская литература',
    'Литература XVIII века',
    'Золотой век русской литературы (Пушкин, Лермонтов, Гоголь)',
    'Литература второй половины XIX века',
    'Серебряный век русской поэзии',
    'Литература XX века и современность'
  ],
  'history-world': [
    'Ежелгі дүние тарихы',
    'Орта ғасырлар тарихы',
    'Жаңа заман тарихы',
    'Қазіргі заман тарихы',
    'Халықаралық қатынастар тарихы'
  ],
  'law': [
    'Мемлекет және құқық теориясы',
    'Конституциялық құқық',
    'Азаматтық құқық',
    'Қылмыстық құқық',
    'Еңбек құқығы',
    'Әкімшілік құқық'
  ],
  'bio': [
    'Биология ғылымына кіріспе',
    'Жасушалық биология',
    'Тірі ағзалардың көптүрлілігі',
    'Адам физиологиясы',
    'Генетика және селекция негіздері',
    'Эволюциялық ілім',
    'Экология және биосфера'
  ],
  'phys': [
    'Механика негіздері',
    'Молекулалық физика және термодинамика',
    'Электродинамика',
    'Оптика',
    'Кванттық физика',
    'Астрономия негіздері'
  ],
  'math': [
    'Алгебра және анализ бастамалары',
    'Тригонометрия',
    'Планиметрия',
    'Стереометрия',
    'Ықтималдықтар теориясы',
    'Математикалық логика'
  ],
  'math-lit': [
    'Сандармен амалдар',
    'Логикалық есептер',
    'Геометриялық мазмұнды есептер',
    'Диаграммалар мен графиктер',
    'Мәтіндік есептер'
  ],
  'reading-lit': [
    'Мәтінмен жұмыс дағдылары',
    'Ақпаратты талдау және жинақтау',
    'Мәтін стилі мен түрін анықтау',
    'Сыни ойлау тапсырмалары'
  ],
  'history-kz': [
    'Ежелгі Қазақстан тарихы',
    'Орта ғасырлардағы Қазақстан',
    'Қазақ хандығының құрылуы мен нығаюы',
    'Қазақстан Ресей империясы құрамында',
    'Кеңестік Қазақстан тарихы',
    'Тәуелсіз Қазақстан'
  ],
  'english': [
    'Grammar: Tenses and Aspects',
    'Vocabulary: Education and Career',
    'Reading Comprehension Strategies',
    'Listening and Speaking Skills',
    'Writing: Essays and Letters'
  ]
};

const generateModules = (subjectId: string): Module[] => {
  const titles = SUBJECT_TITLES[subjectId] || [];
  return titles.map((title, index) => {
    const lessons: Lesson[] = [];
    
    const subLessons = [
      'Теориялық негіздер',
      'Есептер шығару әдістемесі',
      'ҰБТ деңгейіндегі тест талдауы'
    ];

    subLessons.forEach((sub, i) => {
      lessons.push(createLesson(`${subjectId}-m${index + 1}-l${i + 1}`, `${title}: ${sub}`, index === 0 && i === 0));
    });

    return {
      id: `${subjectId}-m${index + 1}`,
      title: `${index + 1}-тарау. ${title}`,
      weekNumber: index + 1,
      lessons
    };
  });
};

export const MODULES_BY_SUBJECT: Record<string, Module[]> = {
  'chem': generateModules('chem'),
  'bio': generateModules('bio'),
  'phys': generateModules('phys'),
  'math': generateModules('math'),
  'math-lit': generateModules('math-lit'),
  'reading-lit': generateModules('reading-lit'),
  'history-kz': generateModules('history-kz'),
  'english': generateModules('english'),
  'geo': generateModules('geo'),
  'it': generateModules('it'),
  'kaz-lit': generateModules('kaz-lit'),
  'rus-lit': generateModules('rus-lit'),
  'history-world': generateModules('history-world'),
  'law': generateModules('law'),
};

export const SUBJECTS: Subject[] = [
  { id: 'chem', name: 'Химия', icon: 'fa-flask', color: 'bg-indigo-500', isElective: true },
  { id: 'bio', name: 'Биология', icon: 'fa-dna', color: 'bg-emerald-500', isElective: true },
  { id: 'phys', name: 'Физика', icon: 'fa-atom', color: 'bg-blue-500', isElective: true },
  { id: 'math', name: 'Математика', icon: 'fa-calculator', color: 'bg-amber-500', isElective: true },
  { id: 'geo', name: 'География', icon: 'fa-globe', color: 'bg-sky-500', isElective: true },
  { id: 'it', name: 'Информатика', icon: 'fa-code', color: 'bg-slate-700', isElective: true },
  { id: 'kaz-lit', name: 'Қазақ тілі мен әдебиеті', icon: 'fa-pen-nib', color: 'bg-orange-600', isElective: true },
  { id: 'rus-lit', name: 'Орыс тілі мен әдебиеті', icon: 'fa-book', color: 'bg-blue-700', isElective: true },
  { id: 'history-world', name: 'Дүниежүзі тарихы', icon: 'fa-earth-americas', color: 'bg-red-600', isElective: true },
  { id: 'law', name: 'Құқық негіздері', icon: 'fa-gavel', color: 'bg-zinc-600', isElective: true },
  { id: 'math-lit', name: 'Мат сауаттылық', icon: 'fa-brain', color: 'bg-rose-500', isElective: false },
  { id: 'reading-lit', name: 'Оқу сауаттылығы', icon: 'fa-book-open', color: 'bg-teal-500', isElective: false },
  { id: 'history-kz', name: 'Қазақстан тарихы', icon: 'fa-landmark', color: 'bg-amber-600', isElective: false },
  { id: 'english', name: 'Ағылшын тілі', icon: 'fa-language', color: 'bg-pink-500', isElective: true },
];

export const INTERNATIONAL_GRANTS: InternationalGrant[] = [
  { id: 'hungary', country: 'Венгрия', title: 'Stipendium Hungaricum', totalGrants: '250 грант', programs: 'Барлық бағыттар', language: 'Ағылшын', deadline: 'Қаңтар', topUnis: ['ELTE', 'University of Debrecen', 'BME', 'Corvinus University'], image: 'https://picsum.photos/seed/hungary/800/400', color: 'from-green-600 to-red-600' },
  { id: 'turkey', country: 'Түркия', title: 'Türkiye Bursları', totalGrants: '500+ грант', programs: 'Бакалавриат, Магистратура', language: 'Түрік/Ағылшын', deadline: 'Ақпан', topUnis: ['Istanbul University', 'METU', 'Hacettepe University', 'Ankara University'], image: 'https://picsum.photos/seed/turkey/800/400', color: 'from-red-600 to-red-800' },
  { id: 'china', country: 'Қытай', title: 'CSC Scholarship', totalGrants: '100+ грант', programs: 'Техникалық, Гуманитарлық', language: 'Қытай/Ағылшын', deadline: 'Наурыз', topUnis: ['Tsinghua University', 'Peking University', 'Fudan University'], image: 'https://picsum.photos/seed/china/800/400', color: 'from-red-500 to-yellow-500' },
  { id: 'korea', country: 'Оңтүстік Корея', title: 'GKS (Global Korea Scholarship)', totalGrants: '50+ грант', programs: 'STEM, Өнер, Бизнес', language: 'Корей/Ағылшын', deadline: 'Наурыз', topUnis: ['SNU', 'KAIST', 'Yonsei University', 'Korea University'], image: 'https://picsum.photos/seed/korea/800/400', color: 'from-blue-600 to-red-500' },
  { id: 'germany', country: 'Германия', title: 'DAAD / Тегін оқу', totalGrants: 'Шексіз (Мемлекеттік)', programs: 'Инженерия, Ғылым', language: 'Неміс/Ағылшын', deadline: 'Жыл бойы', topUnis: ['TU Munich', 'Heidelberg University', 'RWTH Aachen'], image: 'https://picsum.photos/seed/germany/800/400', color: 'from-yellow-500 to-black' },
  { id: 'usa', country: 'АҚШ', title: 'Global UGRAD / Fullbright', totalGrants: '20+ грант', programs: 'Алмасу бағдарламалары', language: 'Ағылшын', deadline: 'Желтоқсан', topUnis: ['Harvard', 'MIT', 'Stanford', 'UC Berkeley'], image: 'https://picsum.photos/seed/usa/800/400', color: 'from-blue-800 to-red-600' }
];

export const MARATHON_TASKS = ["Сабақты көру", "Тест талдау", "Конспект жазу"];
export const MOTIVATIONAL_QUOTES = ["Бүгін еңбектен - ертең демал", "Грант сені күтіп тұр"];
export const MOCK_QUESTIONS: Question[] = [
  // Химия
  { id: 'c1', subject: 'chem', text: 'Зат мөлшерінің өлшем бірлігі?', options: ['моль', 'литр', 'кг', 'метр'], correctAnswer: 0 },
  { id: 'c2', subject: 'chem', text: 'Судың молярлық массасы?', options: ['16 г/моль', '18 г/моль', '20 г/моль', '22 г/моль'], correctAnswer: 1 },
  // Биология
  { id: 'b1', subject: 'bio', text: 'Фотосинтез қайда жүреді?', options: ['Митохондрия', 'Хлоропласт', 'Рибосома', 'Ядро'], correctAnswer: 1 },
  { id: 'b2', subject: 'bio', text: 'Адамда неше хромосома бар?', options: ['44', '46', '48', '50'], correctAnswer: 1 },
  // Қазақстан тарихы
  { id: 'h1', subject: 'history-kz', text: 'Қазақ хандығы қай жылы құрылды?', options: ['1455', '1465', '1475', '1485'], correctAnswer: 1 },
  // Оқу сауаттылығы
  { id: 'r1', subject: 'reading-lit', text: 'Мәтіннің негізгі ойын анықтаңыз...', options: ['Табиғатты қорғау', 'Технология', 'Тарих', 'Спорт'], correctAnswer: 0 },
  // Мат сауаттылық
  { id: 'm1', subject: 'math-lit', text: '2 + 2 * 2 нешеге тең?', options: ['8', '6', '4', '2'], correctAnswer: 1 }
];
export const STRATEGIC_COMBINATIONS = [
  { id: 'bio-chem', name: 'Химия + Биология', subjects: ['chem', 'bio'], icon: 'fa-vials', color: 'from-indigo-500 to-emerald-500', desc: 'Медицина, биология, экология, ветеринария' },
  { id: 'math-phys', name: 'Математика + Физика', subjects: ['math', 'phys'], icon: 'fa-atom', color: 'from-amber-500 to-blue-500', desc: 'IT, инженерия, архитектура, авиация' },
  { id: 'math-it', name: 'Математика + Информатика', subjects: ['math', 'it'], icon: 'fa-code', color: 'from-amber-500 to-slate-700', desc: 'Бағдарламалау, Data Science, киберқауіпсіздік' },
  { id: 'geo-math', name: 'География + Математика', subjects: ['geo', 'math'], icon: 'fa-globe', color: 'from-sky-500 to-amber-500', desc: 'Логистика, кадастр, жерге орналастыру' },
  { id: 'kaz-lit-history', name: 'Қаз. әдебиеті + Тарих', subjects: ['kaz-lit', 'history-world'], icon: 'fa-pen-nib', color: 'from-orange-600 to-red-600', desc: 'Журналистика, филология, өнертану' },
  { id: 'history-law', name: 'Дүниежүзі тарихы + Құқық', subjects: ['history-world', 'law'], icon: 'fa-gavel', color: 'from-red-600 to-zinc-600', desc: 'Заңгерлік, халықаралық қатынастар' },
  { id: 'english-history', name: 'Ағылшын + Тарих', subjects: ['english', 'history-world'], icon: 'fa-language', color: 'from-pink-500 to-red-600', desc: 'Аударма ісі, туризм, халықаралық қатынастар' }
];
