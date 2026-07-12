
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
  // === ХИМИЯ ===
  {
    id: 'c1',
    subject: 'chem',
    text: 'Зат мөлшерінің өлшем бірлігін көрсетіңіз.',
    options: ['моль', 'литр', 'килограмм', 'метр'],
    correctAnswer: 0
  },
  {
    id: 'c2',
    subject: 'chem',
    text: 'Судың (H₂O) молярлық массасы қандай?',
    options: ['16 г/моль', '18 г/моль', '20 г/моль', '22 г/моль'],
    correctAnswer: 1
  },
  {
    id: 'c3',
    subject: 'chem',
    text: 'Күкірт қышқылының (H₂SO₄) құрамындағы күкірттің (S) тотығу дәрежесі қандай?',
    options: ['+2', '+4', '+6', '-2'],
    correctAnswer: 2
  },
  {
    id: 'c4',
    subject: 'chem',
    text: 'Азот молекуласындағы (N₂) химиялық байланыстың түрі мен санын анықтаңыз.',
    options: ['Ковалентті полярлы, дара байланыс', 'Ковалентті полярсыз, үштік байланыс', 'Иондық байланыс', 'Сутектік байланыс'],
    correctAnswer: 1
  },
  {
    id: 'c5',
    subject: 'chem',
    text: 'Натрий гидроксиді (NaOH) қандай классқа жатады?',
    options: ['Қышқыл', 'Оксид', 'Сілті (Еритін негіз)', 'Тұз'],
    correctAnswer: 2
  },
  {
    id: 'c6',
    subject: 'chem',
    text: 'Сутегі атомының электрондық конфигурациясын көрсетіңіз.',
    options: ['1s¹', '1s²', '2s¹', '1s² 2s¹'],
    correctAnswer: 0
  },
  {
    id: 'c7',
    subject: 'chem',
    text: 'Периодтық жүйедегі ең белсенді бейметалл элемент қайсысы?',
    options: ['Оттегі (O)', 'Хлор (Cl)', 'Фтор (F)', 'Азот (N)'],
    correctAnswer: 2
  },
  {
    id: 'c8',
    subject: 'chem',
    text: 'Метан молекуласындағы (CH₄) көміртектің массалық үлесі қандай?',
    options: ['25%', '50%', '75%', '85%'],
    correctAnswer: 2
  },
  {
    id: 'c9',
    subject: 'chem',
    text: 'Күшті электролиттер қатарын анықтаңыз (көптік жауап).',
    options: ['H₂SO₄ (күкірт қышқылы)', 'H₂CO₃ (көмір қышқылы)', 'NaCl (натрий хлориді)', 'CH₃COOH (сірке қышқылы)', 'KOH (калий гидроксиді)'],
    correctAnswer: [0, 2, 4],
    isMulti: true
  },
  {
    id: 'c10',
    subject: 'chem',
    text: 'Тұз қышқылы мен мырыш (Zn) әрекеттескенде бөлінетін газды көрсетіңіз.',
    options: ['Оттегі (O₂)', 'Сутегі (H₂)', 'Хлор (Cl₂)', 'Көмірқышқыл газы (CO₂)'],
    correctAnswer: 1
  },

  // === БИОЛОГИЯ ===
  {
    id: 'b1',
    subject: 'bio',
    text: 'Өсімдік жасушасында фотосинтез процесі қай органоидта жүреді?',
    options: ['Митохондрия', 'Хлоропласт', 'Рибосома', 'Ядро'],
    correctAnswer: 1
  },
  {
    id: 'b2',
    subject: 'bio',
    text: 'Сау адамның дене жасушаларындағы (соматикалық) хромосомалар саны қанша?',
    options: ['23 хромосома', '46 хромосома', '48 хромосома', '92 хромосома'],
    correctAnswer: 1
  },
  {
    id: 'b3',
    subject: 'bio',
    text: 'Жасушаның негізгі "энергия станциясы" болып табылатын органоид қайсысы?',
    options: ['Лизосома', 'Гольджи аппараты', 'Митохондрия', 'Эндоплазмалық тор'],
    correctAnswer: 2
  },
  {
    id: 'b4',
    subject: 'bio',
    text: 'ДНҚ құрамына кіретін азотты негіздерді көрсетіңіз (көптік жауап).',
    options: ['Аденин', 'Урацил', 'Тимин', 'Гуанин', 'Цитозин'],
    correctAnswer: [0, 2, 3, 4],
    isMulti: true
  },
  {
    id: 'b5',
    subject: 'bio',
    text: 'Адам ағзасындағы ең үлкен без және оның атқаратын негізгі функцияларының бірі қандай?',
    options: ['Ұйқы безі, инсулин бөлу', 'Бауыр, өт бөлу және уытсыздандыру', 'Қалқанша безі, тироксин бөлу', 'Сілекей безі, амилаза бөлу'],
    correctAnswer: 1
  },
  {
    id: 'b6',
    subject: 'bio',
    text: 'Жүйке жүйесінің құрылымдық және функционалдық бірлігі қалай аталады?',
    options: ['Нефрон', 'Нейрон', 'Аксон', 'Синапс'],
    correctAnswer: 1
  },
  {
    id: 'b7',
    subject: 'bio',
    text: 'Адам жүрегі неше камерадан тұрады және олар қалай бөлінеді?',
    options: ['2 камералы: 1 жүрекше, 1 қарынша', '3 камералы: 2 жүрекше, 1 қарынша', '4 камералы: 2 жүрекше, 2 қарынша', '3 камералы, аралық пердесі бар'],
    correctAnswer: 2
  },

  // === ҚАЗАҚСТАН ТАРИХЫ ===
  {
    id: 'h1',
    subject: 'history-kz',
    text: 'Қазақ хандығының негізі қашан және қай жерде қаланды?',
    options: ['1456 жылы, Сырдария бойында', '1465 жылы, Қозыбасы және Шу өңірінде', '1511 жылы, Орталық Қазақстанда', '1397 жылы, Жетісуда'],
    correctAnswer: 1
  },
  {
    id: 'h2',
    subject: 'history-kz',
    text: 'Тұңғыш "Алтын адам" ескерткіші қай обадан және кімнің жетекшілігімен табылды?',
    options: ['Шілікті обасынан, Ә. Марғұлан', 'Берел обасынан, З. Самашев', 'Есік обасынан, К. Ақышев', 'Бесшатыр обасынан, К. Байпақов'],
    correctAnswer: 2
  },
  {
    id: 'h3',
    subject: 'history-kz',
    text: '1726 (кейбір деректерде 1728) жылы қазақ жасақтарының жоңғарларға алғашқы ірі соққы берген жеңісті шайқасы қандай?',
    options: ['Аңырақай шайқасы', 'Орбұлақ шайқасы', 'Бұланды шайқасы', 'Қалмаққырылған шайқасы'],
    correctAnswer: 2
  },
  {
    id: 'h4',
    subject: 'history-kz',
    text: 'Қазақ КСР-інің Мемлекеттік егемендігі туралы Декларация қабылданған тарихи күнді көрсетіңіз.',
    options: ['1989 жылы 16 желтоқсан', '1990 жылы 25 қазан', '1991 жылы 16 желтоқсан', '1993 жылы 28 қаңтар'],
    correctAnswer: 1
  },
  {
    id: 'h5',
    subject: 'history-kz',
    text: 'Қазақ хандығының күшеюіне үлес қосқан, "Қасқа жол" заңдар жинағын шығарған хан кім?',
    options: ['Жәнібек хан', 'Қасым хан', 'Хақназар хан', 'Есім хан'],
    correctAnswer: 1
  },

  // === МАТЕМАТИКАЛЫҚ САУАТТЫЛЫҚ ===
  {
    id: 'm1',
    subject: 'math-lit',
    text: 'Сыныпта 12 ұл және 18 қыз оқиды. Кездейсоқ таңдалған бір оқушының қыз бала болу ықтималдығын табыңыз.',
    options: ['2/5 (0.4)', '3/5 (0.6)', '1/3 (0.33)', '3/4 (0.75)'],
    correctAnswer: 1
  },
  {
    id: 'm2',
    subject: 'math-lit',
    text: 'Егер белгісіз санның 25%-ы 40-қа тең болса, осы санның өзін табыңыз.',
    options: ['80', '120', '160', '200'],
    correctAnswer: 2
  },
  {
    id: 'm3',
    subject: 'math-lit',
    text: 'Тіктөртбұрыштың ұзындығы 8 см, ал ауданы 48 см². Осы тіктөртбұрыштың периметрі нешеге тең?',
    options: ['14 см', '24 см', '28 см', '32 см'],
    correctAnswer: 2
  },
  {
    id: 'm4',
    subject: 'math-lit',
    text: 'Сандар тізбегі белгілі бір заңдылықпен орналасқан: 1, 3, 6, 10, 15, ... Келесі санды анықтаңыз.',
    options: ['18', '20', '21', '25'],
    correctAnswer: 2
  },
  {
    id: 'm5',
    subject: 'math-lit',
    text: 'Әкесі 36 жаста, ал оның ұлы 8 жаста. Неше жылдан кейін әкесінің жасы ұлының жасынан 3 есе үлкен болады?',
    options: ['4 жылдан кейін', '6 жылдан кейін', '8 жылдан кейін', '10 жылдан кейін'],
    correctAnswer: 1
  },

  // === ОҚУ САУАТТЫЛЫҒЫ ===
  {
    id: 'r1',
    subject: 'reading-lit',
    text: '«Ақпараттық технологиялардың дамуы адамның күнделікті тіршілігін жеңілдеткенімен, әлеуметтік оқшаулану мен белсенділіктің төмендеуіне әкеліп соғуда. Жастар арасында виртуалды әлем нақты шынайылықты алмастыруда, бұл психологиялық тұрғыдан тәуелділікті арттырады». Мәтіннің негізгі идеясы не?',
    options: [
      'Технологияларды тек білім алу мақсатында қолдану қажет.',
      'Ақпараттық технологиялардың дамуы адам психологиясы мен өміріне жағымсыз жанама әсерлер әкелуде.',
      'Жастар виртуалды әлемнен гөрі спортпен көбірек айналысуы тиіс.',
      'Компьютерлік желілерді шектеу заң жүзінде бекітілуі керек.'
    ],
    correctAnswer: 1
  },
  {
    id: 'r2',
    subject: 'reading-lit',
    text: '«Отырар қаласы — орта ғасырлардағы ең ірі мәдениет және ғылым ошағы болған. Онда орналасқан атақты Отырар кітапханасы Александрия кітапханасынан кейінгі ең бай қазына ретінде есептелді. Әбу Насыр әл-Фараби осы қалада туып, өсіп, алғашқы білімін алды». Осы мәтін бойынша дұрыс тұжырымды табыңыз.',
    options: [
      'Отырар қаласын моңғолдар толығымен өртеп жіберді.',
      'Әл-Фараби бүкіл өмірін Отырар қаласында өткізді.',
      'Отырар қаласы ежелгі дәуірдің ең бай ғылыми және мәдени орталығы болған.',
      'Александрия кітапханасы Отырар қаласында орналасқан.'
    ],
    correctAnswer: 2
  }
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
