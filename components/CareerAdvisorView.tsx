import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ArrowLeft, Sparkles, BookOpen, GraduationCap, ChevronRight, HelpCircle, 
  MessageSquare, ShieldAlert, Compass, Trophy, Activity, CheckCircle2, 
  ArrowRight, RotateCcw, FileText, Lightbulb, Award, Smile 
} from 'lucide-react';

interface CareerProfile {
  id: string;
  name: string;
  combo: string;
  icon: string;
  color: string;
  desc: string;
  specialties: { code: string; title: string; quota: string; demand: string }[];
  unis: string[];
  requirements: string[];
  physicalPrep?: string[];
  tips: string[];
}

const CAREER_PROFILES: CareerProfile[] = [
  {
    id: 'creative',
    name: 'Шығармашылық мамандықтар (Өнер, Спорт, Дизайн)',
    combo: 'Шығармашылық емтихандар',
    icon: '🎨',
    color: 'from-pink-500 to-rose-600',
    desc: 'Егер сурет салуға, дизайнға, музыкаға немесе спортқа бейім болсаңыз, бұл бағыт сізге арналған. Мұнда ҰБТ-дан тек 2 міндетті пән тапсырылып, қалған ұпай ЖОО-да өтетін арнайы шығармашылық сынақтар арқылы жиналады.',
    specialties: [
      { code: 'B005', title: 'Дене шынықтыру мұғалімі', quota: 'Жоғары', demand: 'Өте жоғары (мектептер мен секциялар)' },
      { code: 'B027', title: 'Бейнелеу өнері және сызу', quota: 'Орташа', demand: 'Жоғары (архитектура, мектептер)' },
      { code: 'B028', title: 'Сән және дизайн (Киім, интерьер)', quota: 'Шектеулі', demand: 'Өте жоғары (сән үйлері, студиялар)' },
      { code: 'B029', title: 'Музыкалық білім مقرر және өнер', quota: 'Орташа', demand: 'Тұрақты (мәдениет ошақтары)' },
      { code: 'B031', title: 'Спорт және жаттықтырушылық', quota: 'Жоғары', demand: 'Жоғары (кәсіби клубтар, фитнес)' },
      { code: 'B073', title: 'Сәулет (Архитектура және урбанистика)', quota: 'Орташа', demand: 'Өте жоғары (құрылыс компаниялары)' }
    ],
    unis: [
      'Т.Жүргенов атындағы Қазақ ұлттық өнер академиясы (Алматы)',
      'Қазақ спорт және туризм академиясы (КазСТА, Алматы)',
      'Құрманғазы атындағы Қазақ ұлттық консерваториясы (Алматы)',
      'Абай атындағы ҚазҰПУ және Л.Гумилев атындағы ЕҰУ'
    ],
    requirements: [
      'ҰБТ-да тек Оқу сауаттылығы (макс 10 балл) және Қазақстан тарихы (макс 20 балл) тапсырылады.',
      'Таңдаған ЖОО-да жеке барып 2 шығармашылық емтихан тапсырасыз (әрқайсысы 50 балдан, макс 100 балл).',
      'Грантқа түсу үшін жалпы максималды ұпай саны — 130 балл.'
    ],
    physicalPrep: [
      '🏃 Дене шынықтыру және спорт (Ұлдар): 100 метрге жүгіру (норматив: 13.2 сек), белтемірде тартылу (кемі 15 рет), 1000 метрге кросс (3 мин 20 сек).',
      '🏃 Дене шынықтыру және спорт (Қыздар): 100 метрге жүгіру (норматив: 15.5 сек), шалқадан жатып денені көтеру (1 минутта кемі 45 рет), 500 метрге кросс.',
      '✍️ Бейнелеу өнері және Архитектура: 1-емтихан: Сурет (Натюрморт - геометриялық фигуралар мен тұрмыстық заттарды қарындашпен бейнелеу, пропорция сақтау); 2-емтихан: Живопись (Түрлі-түсті акварель немесе гуашьпен натюрморт салу) немесе Сызба (Архитектура үшін).'
    ],
    tips: [
      'Шығармашылық емтихандарға тіркелу маусым айының 20-нан басталып, шілде айының басында тікелей ЖОО-да өткізіледі.',
      'Емтихан алдында міндетті түрде таңдаған ЖОО-ның консультациялық сабақтарына қатысып, талаптарымен танысыңыз.',
      'Спорттық бағыттар үшін медициналық анықтамаларды (075/у формасы және арнайы спорттық рұқсат) алдын ала дайындаңыз.'
    ]
  },
  {
    id: 'math-it',
    name: 'Математика-Информатика (Бағдарламалау, Data Science және Жасанды Интеллект)',
    combo: 'Математика + Информатика',
    icon: '🤖',
    color: 'from-violet-500 to-indigo-700',
    desc: 'Заманауи цифрлық әлемді қалыптастырушы бағыт. Жасанды интеллект, машиналық оқыту, үлкен деректерді өңдеу (Data Science) және бағдарламалық жасақтаманы әзірлеуді қамтиды.',
    specialties: [
      { code: 'B057', title: 'Ақпараттық технологиялар (Software Engineering)', quota: 'Өте жоғары', demand: 'Өте жоғары (барлық салалар)' },
      { code: 'B111', title: 'Жасанды интеллект және Data Science', quota: 'Жоғары', demand: 'Аса жоғары (IT компаниялар, ғылыми орталықтар)' },
      { code: 'B058', title: 'Ақпараттық қауіпсіздік (Киберқауіпсіздік)', quota: 'Жоғары', demand: 'Өте жоғары (банктер, мемлекеттік органдар)' },
      { code: 'B059', title: 'Жүйелік инженерия және желілер', quota: 'Орташа', demand: 'Жоғары (телеком, серверлер)' }
    ],
    unis: [
      'Astana IT University (AITU, Астана)',
      'Халықаралық ақпараттық технологиялар университеті (МУИТ, Алматы)',
      'Қазақ-Британ техникалық университеті (ҚБТУ, Алматы)',
      'Әл-Фараби атындағы Қазақ ұлттық университеті (ҚазҰУ, Алматы)',
      'Сәтбаев атындағы ҚазҰТЗУ (Satbayev University, Алматы)'
    ],
    requirements: [
      'ҰБТ жалпы шекті балы: IT бағыты бойынша кемі 80 балл. Грант ұтып алу үшін 115-125+ балл жинау қажет.',
      'Жасанды интеллект және Data Science жаңа мамандығына сұраныс жоғары болғандықтан грант шекті балы жыл сайын артып келеді (118+).'
    ],
    tips: [
      'Информатикадан Python бағдарламалау тілінің негіздерін, деректер құрылымдарын және SQL негіздерін ерте бастан үйреніңіз.',
      'Жасанды интеллект саласы математикамен тығыз байланысты, сондықтан Сызықтық алгебра мен Ықтималдықтар теориясына баса назар аударыңыз.',
      'Біздің платформадағы "Жасанды Интеллект" курсын толық өтіп, базалық түсініктерді (Нейрондық желілер, NLP, CV) меңгеріңіз.'
    ]
  },
  {
    id: 'chem-bio',
    name: 'Химия-Биология (Медицина, Биотехнология және Ғылым)',
    combo: 'Химия + Биология',
    icon: '🧬',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Денсаулық сақтау, медициналық технологиялар, жаңа дәрі-дәрмектерді әзірлеу және табиғи ресурстарды зерттеумен байланысты беделді бағыт.',
    specialties: [
      { code: 'B086', title: 'Жалпы медицина (Терапевт, хирург)', quota: 'Жоғары', demand: 'Аса жоғары (медициналық орталықтар)' },
      { code: 'B087', title: 'Стоматология', quota: 'Аз', demand: 'Өте жоғары (жеке және мемлекеттік клиникалар)' },
      { code: 'B089', title: 'Фармация (Фармацевт, дәрі жасау)', quota: 'Орташа', demand: 'Жоғары (фарм-зауыттар, дәріханалар)' },
      { code: 'B050', title: 'Биологиялық және сабақтас ғылымдар', quota: 'Орташа', demand: 'Жоғары (зертханалар, ғылыми орталықтар)' },
      { code: 'B053', title: 'Химиялық инженерия және технологиялар', quota: 'Жоғары', demand: 'Жоғары (өндіріс, зауыттар, мұнай-химия)' }
    ],
    unis: [
      'С.Асфендияров атындағы Қазақ ұлттық медицина университеті (ҚазҰМУ, Алматы)',
      'Астана медицина университеті (АМУ, Астана)',
      'Әл-Фараби атындағы Қазақ ұлттық университеті (ҚазҰУ, Алматы)',
      'Қарағанды медицина университеті (ҚМУ)'
    ],
    requirements: [
      'Медициналық мамандықтарға түсу үшін ҰБТ ұпайынан бөлек психометриялық емтихан тапсыру міндетті (ЖОО-да өтеді, "өтті/өтпеді" түрінде).',
      'Грант шекті балдары: Стоматология — 130+, Жалпы медицина — 120+, Фармация — 115+. Ғылыми биология және химиялық технологиялар — 85-100+.'
    ],
    tips: [
      'Химиядан негізгі күшті органикалық реакциялар мен химиялық есептерді шығаруға салыңыз.',
      'Биологиядан адам анатомиясы, генетика есептері және молекулалық биология тақырыптары ҰБТ-да өте жиі кездеседі.',
      'Медицинаға баратын оқушылар үшін психометриялық тестке арнайы логикалық дайындық керек.'
    ]
  },
  {
    id: 'math-phys',
    name: 'Математика-Физика (IT, Инженерия, Сәулет және Энергетика)',
    combo: 'Математика + Физика',
    icon: '💻',
    color: 'from-blue-500 to-indigo-600',
    desc: 'Қазақстандағы ең көп грант бөлінетін және техникалық дамудың негізі болып табылатын бағыт. Ақпараттық технологиялардан бастап ғарыштық инженерияға дейін қамтиды.',
    specialties: [
      { code: 'B057', title: 'Ақпараттық технологиялар (IT, Software)', quota: 'Өте көп', demand: 'Аса жоғары (barlik sectorlar)' },
      { code: 'B059', title: 'Коммуникациялар және байланыс жүйелері', quota: 'Жоғары', demand: 'Жоғары (телеком, желілер)' },
      { code: 'B064', title: 'Құрылыс инженериясы және материалдары', quota: 'Көп', demand: 'Жоғары (құрылыс тресттері)' },
      { code: 'B062', title: 'Машина жасау және мехатроника', quota: 'Орташа', demand: 'Тұрақты өсуде (зауыттар, робототехника)' },
      { code: 'B074', title: 'Жылу энергетикасы және ядролық физика', quota: 'Жоғары', demand: 'Жоғары (энергия станциялары, инженерия)' }
    ],
    unis: [
      'Халықаралық ақпараттық технологиялар университеті (МУИТ, Алматы)',
      'Қазақ-Британ техникалық университеті (ҚБТУ, Алматы)',
      'Astana IT University (AITU, Астана)',
      'Сәтбаев атындағы ҚазҰТЗУ (Satbayev University, Алматы)',
      'Л.Гумилев атындағы Еуразия ұлттық университеті (ЕҰУ, Астана)'
    ],
    requirements: [
      'ҰБТ жалпы шекті балы: IT мамандықтары үшін кемі 80 балл (грант үшін 110-125+ талап етіледі).',
      'Техникалық инженерия және құрылыс бағыттары бойынша гранттар 65-80 балл аралығында да беріледі.'
    ],
    tips: [
      'Физикадан формулаларды механикалық жаттамай, физикалық құбылыстар мен заңдардың мәнін түсінуге тырысыңыз.',
      'Математикадан тригонометрия, туынды, интеграл және стереометрия есептерін шешу жылдамдығын арттырыңыз.',
      'Егер IT таңдасаңыз, алдын ала қарапайым бағдарламалау тілдерін (Python немесе C++) үйренуді бастаңыз.'
    ]
  },
  {
    id: 'math-geo',
    name: 'Математика-География (Бизнес, Қаржы, Экономика және Логистика)',
    combo: 'Математика + География',
    icon: '📈',
    color: 'from-amber-500 to-orange-600',
    desc: 'Бизнес үрдістерін басқару, қаржы нарығы, инвестициялар мен жаһандық сауда логистикасын ұнататын оқушыларға арналған беделді экономикалық бағыт.',
    specialties: [
      { code: 'B044', title: 'Мемлекеттік және жергілікті басқару', quota: 'Шектеулі', demand: 'Жоғары (әкімдіктер, министрліктер)' },
      { code: 'B046', title: 'Қаржы, экономика және есеп', quota: 'Орташа', demand: 'Өте жоғары (банктер, аудит, корпорациялар)' },
      { code: 'B047', title: 'Маркетинг және жарнама', quota: 'Орташа', demand: 'Аса жоғары (SMM, брендтер, цифрлық нарық)' },
      { code: 'B095', title: 'Логистика және көлік қызметтері', quota: 'Орташа', demand: 'Жоғары (халықаралық тасымал, қоймалар)' }
    ],
    unis: [
      'КИМЭП Университеті (KIMEP, Алматы)',
      'Нархоз Университеті (Алматы)',
      'Әл-Фараби атындағы ҚазҰУ және Л.Гумилев атындағы ЕҰУ',
      'Халықаралық бизнес академиясы (UIB, Алматы)'
    ],
    requirements: [
      'Экономикалық және қаржылық бағыттарда грант саны шектеулі болғандықтан, грант шекті балы әдетте 105-120+ аралығында болады.',
      'Логистика мен көлік қызметтері бойынша гранттар 85-95 балл аралығында табылады.'
    ],
    tips: [
      'Географиядан дүниежүзілік экономикалық картаны, елдердің мамандануын және пайдалы қазбалардың орналасуын жақсы білу қажет.',
      'Математикадан пайызға, ықтималдыққа және мәтіндік экономикалық есептерге ерекше көңіл бөліңіз.'
    ]
  }
];

const CareerAdvisorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'analyzer' | 'ai'>('profiles');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('creative');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Сәлем! Мен сенің AI кеңесшіңмін. ҰБТ-да таңдаған пәндеріңді, өзіңе ұнайтын салаларды немесе жинаған балдарыңды айтсаң, мен саған Қазақстан бойынша ең қолайлы мамандықтар мен университеттерді тауып беремін. ✨' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Profiler Quiz state
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<CareerProfile | null>(null);

  const activeProfile = CAREER_PROFILES.find(p => p.id === selectedProfileId) || CAREER_PROFILES[0];

  const quizQuestions = [
    {
      id: 1,
      text: "Бос уақытыңызда немен айналысқанды ұнатасыз?",
      options: [
        { key: 'A', text: 'Компьютерде жұмыс істеу немесе бағдарламалау (IT & Технология)', desc: 'Математикалық есептер шығару, код жазу немесе жасанды интеллект тақырыптары.' },
        { key: 'B', text: 'Биологиялық немесе химиялық құбылыстарды зерттеу (Ғылым & Медицина)', desc: 'Адам анатомиясы, химиялық реакциялар, емдеу немесе лабораториялық зерттеулер.' },
        { key: 'C', text: 'Сурет салу, дизайн жасау немесе спортпен шұғылдану (Өнер & Спорт)', desc: 'Бейнелеу өнері, киім немесе интерьер сәні, белсенді дене шынықтыру жаттығулары.' },
        { key: 'D', text: 'Бизнес идеялар ойлап табу немесе талдау жасау (Қаржы & Экономика)', desc: 'Маркетинг, логистикалық маршруттар жасау немесе елдердің географиясын талдау.' }
      ]
    },
    {
      id: 2,
      text: "Болашақ жұмысыңызда сіз үшін ең маңызды нәтиже қандай?",
      options: [
        { key: 'A', text: 'Заманауи технологиялық өнімдерді, бағдарламалар мен жасанды интеллект жасау', desc: 'Ең жоғары жалақы мен қашықтан (remote) жұмыс істеу мүмкіндігі.' },
        { key: 'B', text: 'Адамдарды емдеу, дәрі-дәрмек ойлап табу немесе табиғатты қорғау', desc: 'Қоғамға тікелей пайда әкелу және адамдардың өмірін сақтап қалу.' },
        { key: 'C', text: 'Өз шығармаларымды, әсем ғимараттар мен сәнді дизайн жасау немесе спортта биікке жету', desc: 'Креативті еркіндік, шығармашылық өзін-өзі көрсету және денсаулық.' },
        { key: 'D', text: 'Бизнес жобаларды басқару, компания табысын арттыру және инвестиция құю', desc: 'Ірі кәсіпорындарда басқарушы болу және қаржылық еркіндікке қол жеткізу.' }
      ]
    },
    {
      id: 3,
      text: "ҰБТ пәндерінің ішінде сізге қайсысы ең жеңіл әрі қызық болып көрінеді?",
      options: [
        { key: 'A', text: 'Математика, Информатика және Физика', desc: 'Сандар, логикалық заңдылықтар және алгоритмдік код жазу.' },
        { key: 'B', text: 'Химия мен Биология', desc: 'Тірі ағзалардың жұмысы, химиялық қосылыстар мен органикалық реакциялар.' },
        { key: 'C', text: 'Практикалық сынақтар (Дене шынықтыру, Бейнелеу, Сызу)', desc: 'Шығармашылық жобалар жасау, спорттық нормативтер немесе сурет салу.' },
        { key: 'D', text: 'География мен Математикалық сауаттылық', desc: 'Экономикалық карталар, сауда қатынастары және пайыздық есептеулер.' }
      ]
    },
    {
      id: 4,
      text: "Өзіңізді 10 жылдан кейін қандай жұмыс жағдайында елестетесіз?",
      options: [
        { key: 'A', text: 'Қазіргі заманғы IT-хабта немесе шетелдік технологиялық компанияда ноутбукпен', desc: 'Бағдарламалық қамтамасыз ету әзірлеу немесе ЖИ архитектурасын жасау.' },
        { key: 'B', text: 'Ақ халатты дәрігер ретінде заманауи емханада немесе зертхана орталығында', desc: 'Күрделі оталар жасау, емдеу немесе биологиялық зерттеулер жүргізу.' },
        { key: 'C', text: 'Креативті дизайн студиясында, сәулет орталығында немесе спорттық ареналарда', desc: 'Жеке сурет көрмелері, сән көрсетілімдері немесе кәсіби жаттықтырушылық.' },
        { key: 'D', text: 'Офистегі іскерлік кездесулерде, қаржылық банкте немесе логистика орталығында', desc: 'Инвестициялық жоспарлау, логистикалық тізбектерді басқару немесе маркетинг.' }
      ]
    }
  ];

  const handleSelectOption = (questionId: number, optionKey: string) => {
    const updatedAnswers = { ...quizAnswers, [questionId]: optionKey };
    setQuizAnswers(updatedAnswers);

    if (questionId < 4) {
      setQuizStep(questionId);
    } else {
      // Calculate dominant key
      const counts: Record<string, number> = { 'A': 0, 'B': 0, 'C': 0, 'D': 0 };
      Object.values(updatedAnswers).forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
      });

      let maxKey = 'A';
      let maxVal = 0;
      Object.entries(counts).forEach(([k, v]) => {
        if (v > maxVal) {
          maxVal = v;
          maxKey = k;
        }
      });

      let profileId = 'math-phys';
      if (maxKey === 'A') {
        profileId = Math.random() > 0.5 ? 'math-it' : 'math-phys';
      } else if (maxKey === 'B') {
        profileId = 'chem-bio';
      } else if (maxKey === 'C') {
        profileId = 'creative';
      } else if (maxKey === 'D') {
        profileId = 'math-geo';
      }

      const match = CAREER_PROFILES.find(p => p.id === profileId) || CAREER_PROFILES[0];
      setQuizResult(match);
      setQuizStep(4); // Finished
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey || apiKey === "" || apiKey === "undefined") {
        throw new Error("API Key is missing");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Сен Қазақстандағы жоғары оқу орындары (ЖОО), гранттар, ҰБТ мамандықтары, шекті балдар және шығармашылық сынақтар/физ дайындық нормативтері бойынша кәсіби білікті сарапшысың. 
      Оқушының келесі сұрағына немесе мүддесіне байланысты: "${userMsg}" оған нақты ақыл-кеңес бер.
      
      Нұсқаулық:
      1. Нақты мамандықтардың кодтарын (мысалы B057, B086) және атауларын атап көрсет.
      2. Үздік оқу орындарын жаз.
      3. Егер сұрақ шығармашылық өнер немесе спорт бағыттары туралы болса, міндетті түрде шығармашылық емтихан ережелері мен физ дайындық нормативтерін (жүгіру, белтемір, т.б.) жаз.
      4. Жауапты қазақ тілінде, нақты және жігерлендіретін стильде жаз. Маркдаунды пайдалан.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });
      
      setMessages(prev => [...prev, { role: 'ai', content: response.text || "Кешіріңіз, ақпарат алу мүмкін болмады." }]);
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', content: "Байланыс орнату мүмкін болмады. API кілтін тексеріңіз немесе сәлден кейін қайталап көріңіз." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500 font-sans">
      
      {/* Header card */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-6 md:p-8 rounded-[32px] text-white relative overflow-hidden shadow-lg mb-8" id="career-header-card">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <button 
              onClick={onBack} 
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold transition-all mb-2"
              id="back-to-home-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              Басты бетке қайту
            </button>
            <h2 className="text-xl md:text-2xl font-black font-outfit uppercase tracking-tight flex items-center gap-2">
              Мамандықтар мен ҰБТ кеңесшісі 🎓
            </h2>
            <p className="text-xs text-indigo-100 font-medium max-w-xl">
              Таңдаған бейінді пәндеріңізге сәйкес мамандықтар каталогы, мемлекеттік грант шекті балдары, физ дайындық талаптары мен смарт AI бағыттау қызметі.
            </p>
          </div>
          <Sparkles className="w-12 h-12 text-amber-300 opacity-40 animate-pulse hidden md:block flex-shrink-0" />
        </div>
        <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1.5 rounded-2xl mb-8 shadow-sm" id="career-tabs-container">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'profiles'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          id="tab-profiles-btn"
        >
          <BookOpen className="w-4 h-4" />
          Мамандықтар Каталогы (Пәндер)
        </button>
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'analyzer'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          id="tab-analyzer-btn"
        >
          <Compass className="w-4 h-4" />
          Мамандық Талдағыш 🎯
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          id="tab-ai-btn"
        >
          <MessageSquare className="w-4 h-4" />
          Жеке AI Консультант 🤖
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'profiles' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Grid of Profile Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3" id="profile-selectors-grid">
            {CAREER_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[120px] ${
                  selectedProfileId === p.id
                    ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 text-slate-950 dark:text-white shadow-sm'
                    : 'border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-indigo-200'
                }`}
                id={`selector-${p.id}`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-2xl select-none">{p.icon}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                    selectedProfileId === p.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {p.id === 'creative' ? 'Өнер' : p.id === 'math-it' ? 'AI / IT' : 'Стандарт'}
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-black text-slate-900 dark:text-warm-100 line-clamp-2 leading-tight">
                    {p.name.split(' (')[0]}
                  </h4>
                </div>
              </button>
            ))}
          </div>

          {/* Details of Selected Profile */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm" id="profile-details-card">
            <div className="flex items-start gap-4">
              <span className="text-4xl p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl select-none">{activeProfile.icon}</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
                  БЕЙІНДІ БАҒЫТ ТАЛДАУЫ • {activeProfile.combo}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeProfile.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">{activeProfile.desc}</p>
              </div>
            </div>

            {/* Specialties Table */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800" id="specialties-section">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-warm-100 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                Сұранысқа ие мамандықтар тізімі (Кодтарымен)
              </h4>
              <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse" id="specialties-table">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/40 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th className="p-3 pl-4">Код</th>
                        <th className="p-3">Мамандық атауы</th>
                        <th className="p-3">Грант мүмкіндігі</th>
                        <th className="p-3">Еңбек нарығындағы сұраныс</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {activeProfile.specialties.map((spec) => (
                        <tr key={spec.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25">
                          <td className="p-3 pl-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{spec.code}</td>
                          <td className="p-3 text-slate-800 dark:text-slate-200 font-bold">{spec.title}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400">{spec.quota}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400">{spec.demand}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Requirements block */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800" id="requirements-section">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-warm-100 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-rose-500" />
                Түсу талаптары мен Шекті балдар
              </h4>
              <ul className="space-y-2.5">
                {activeProfile.requirements.map((req, index) => (
                  <li key={index} className="text-xs text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100/50 dark:border-slate-800/50 leading-relaxed font-semibold">
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Section: Physical/Creative Exam Prep (Only if creative profile selected) */}
            {activeProfile.physicalPrep && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 bg-amber-500/5 dark:bg-amber-500/10 p-5 rounded-[24px] border border-amber-500/10" id="physical-prep-section">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-750 dark:text-amber-400 flex items-center gap-1.5">
                  🏃 Шығармашылық & Физ Дайындық нормативтері
                </h4>
                <p className="text-[11px] text-amber-600 dark:text-amber-300 font-semibold">
                  Шығармашылық мамандықтарға (спорт немесе бейнелеу өнері) түсетін оқушылар үшін қабылдау сынақтары мен оларға қажетті дене және шығармашылық дайындық өлшемдері:
                </p>
                <div className="space-y-2.5 mt-2">
                  {activeProfile.physicalPrep.map((prep, index) => (
                    <div key={index} className="text-xs text-amber-900 dark:text-amber-200 bg-white/50 dark:bg-slate-900/40 p-3 rounded-xl border border-amber-500/10 leading-relaxed font-bold">
                      {prep}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Universities */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800" id="unis-section">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-warm-100 flex items-center gap-1.5">
                🏛️ Қазақстандағы ең үздік ЖОО-лар тізімі
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeProfile.unis.map((uni, index) => (
                  <div key={index} className="p-3.5 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-350">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-mono text-[10px]">{index + 1}</span>
                    <span>{uni}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expert study advice */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800" id="tips-section">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-warm-100 flex items-center gap-1.5">
                ✨ Сапалы Дайындыққа арналған Кәсіби Кеңестер
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {activeProfile.tips.map((tip, index) => (
                  <div key={index} className="flex gap-3 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                    <span className="text-indigo-500 font-black">✦</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analyzer' && (
        <div className="space-y-8 animate-in fade-in duration-300" id="career-analyzer-view">
          
          {/* Step 1: Expert guidelines for Career Analysis */}
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm" id="guidance-section">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/10">
                ЖОСПАРЛАУ НҰСҚАУЛЫҒЫ
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Мамандықты Қалай Талдау Керек? Кеңестер & Нұсқаулық 📝
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Болашақ мамандықты дұрыс таңдау — сәтті мансаптың кепілі. Біздің сарапшылар ұсынатын мамандықты жүйелі талдау алгоритмі:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 rounded-2xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm">1</div>
                <h4 className="text-xs font-black text-slate-900 dark:text-warm-100">Бейімділікті Анықтау</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Өзіңізге ұнайтын пәндерді, теориялық жұмыстан гөрі практикалық (немесе керісінше) белсенділікті ұнататыныңызды бағалаңыз.
                </p>
              </div>
              <div className="p-5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm">2</div>
                <h4 className="text-xs font-black text-slate-900 dark:text-warm-100">Еңбек Нарығын Зерттеу</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Мамандықтың болашақ 10-15 жылдағы сұранысын ескеріңіз. Мысалы, Жасанды Интеллект, Медицина және Сәулет өнері өзекті болып қала береді.
                </p>
              </div>
              <div className="p-5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 rounded-2xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-black shadow-sm">3</div>
                <h4 className="text-xs font-black text-slate-900 dark:text-warm-100">Грант Шегі мен Санын Салыстыру</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Әр бейінді комбинацияға бөлінетін мемлекеттік гранттар санын және өткен жылдардағы грант шекті балдарын тексеріңіз.
                </p>
              </div>
            </div>
          </section>

          {/* Step 2: Dedicated Creative Pathway Guideline */}
          <section className="bg-gradient-to-br from-pink-500/5 to-rose-500/5 dark:from-pink-950/20 dark:to-rose-950/10 border border-pink-500/10 rounded-[32px] p-6 md:p-8 space-y-6" id="creative-guide-section">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                ШЫҒАРМАШЫЛЫҚ ПӘНДЕРГЕ ҚАТЫСТЫ НҰСҚАУЛЫҚ
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Шығармашылық Мамандықтар: Қайда, Қалай Түсу Керек? 🎨</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Егер сіз сурет салу, дизайн, сәулет немесе дене шынықтыру (спорт) бағыттарын таңдасаңыз, қабылдаудың мүлдем бөлек ережелері бар. Оларды мұқият біліңіз:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/60 border border-pink-500/5 p-5 rounded-2xl space-y-2">
                <h4 className="text-xs font-black text-pink-700 dark:text-pink-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  Қайда және Қалай Түсуге Болады?
                </h4>
                <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                  <li>✦ <b>Тіркелу мерзімі:</b> 20 маусым - 7 шілде аралығында қалаған мемлекеттік ЖОО-ның комиссиясына барып тіркелесіз.</li>
                  <li>✦ <b>Емтихан тапсыру:</b> 8 шілде - 15 шілде аралығында тікелей осы таңдаған ЖОО-да офлайн өтеді.</li>
                  <li>✦ <b>ҰБТ балдары:</b> Тек Оқу сауаттылығы (макс 10 балл) және Қазақстан тарихы (макс 20 балл) есептеледі (Жиынтығы макс 30 балл).</li>
                  <li>✦ <b>Шығармашылық емтихандар:</b> ЖОО-да 2 емтихан тапсырасыз (әрқайсысы макс 50 балл). Жалпы жоғарғы ұпай — 130.</li>
                </ul>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/60 border border-pink-500/5 p-5 rounded-2xl space-y-2">
                <h4 className="text-xs font-black text-pink-700 dark:text-pink-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  Қандай Физ (Дене) Дайындық Қажет?
                </h4>
                <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                  <li>✦ <b>Спорттық мамандықтар үшін (Ұлдар):</b> Белтемірде тартылу (15+ рет), 100 метрге шапшаң жүгіру (13.2 сек норматив), 1000 м төзімділік кроссы (3 мин 20 сек).</li>
                  <li>✦ <b>Спорттық мамандықтар үшін (Қыздар):</b> 1 минутта пресс (шалқадан тұру - 45+ рет), 100 метрге жүгіру (15.5 сек), 500 м төзімділік кроссы.</li>
                  <li>✦ <b>Сурет және Архитектура:</b> Пропорция мен көлеңкені сақтай отырып қарындашпен натюрморт сызу (Сурет) және Акварельмен түстік гамманы бейнелеу (Живопись).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step 3: Interactive Career Profiler Quiz */}
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm" id="profiler-quiz-container">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-500/10">
                ИНТЕРАКТИВТІ БАҒДАР СЫНАҒЫ
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Өз Мамандығыңды Тауып, Талдау Жаса! 🎯</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Төмендегі 4 сұраққа шынайы жауап берсеңіз, біз сіздің қызығушылығыңызға сәйкес мамандықтар тізімін, ҰБТ пәндерін және оқу орындарын талдап шығарамыз.
              </p>
            </div>

            {/* Quiz Wizard Content */}
            {quizStep < 4 ? (
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/20 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Сұрақ {quizStep + 1} / 4</span>
                  <div className="w-32 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all" style={{ width: `${(quizStep + 1) * 25}%` }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    {quizQuestions[quizStep].text}
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    {quizQuestions[quizStep].options.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(quizStep + 1, opt.key)}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 rounded-xl text-left transition-all group flex flex-col gap-1 w-full"
                        id={`question-${quizStep}-option-${opt.key}`}
                      >
                        <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {opt.text}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-normal">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Quiz Results View
              quizResult && (
                <div className="border-2 border-emerald-500/20 rounded-2xl p-6 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-6 animate-in zoom-in-95 duration-500" id="quiz-result-card">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-500/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 bg-white dark:bg-slate-900 rounded-xl select-none shadow-sm">{quizResult.icon}</span>
                      <div>
                        <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">ТАЛДАУ ҚОРТЫНДЫСЫ • ӨТЕ СӘЙКЕС КЕЛЕДІ</span>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">{quizResult.name}</h4>
                      </div>
                    </div>
                    <button 
                      onClick={handleResetQuiz}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-350 rounded-lg transition-all active:scale-95 flex-shrink-0"
                      id="reset-quiz-btn"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Қайтадан тапсыру
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 block">ҰСЫНЫЛАТЫН ҰБТ БЕЙІНДІ ПӘНДЕР КОМБИНАЦИЯСЫ:</span>
                      <p className="text-xs font-black text-slate-800 dark:text-white bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-3.5 py-2.5 rounded-xl inline-block shadow-sm">
                        🎯 {quizResult.combo}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 block">МАНСАП ТАЛДАУЫ:</span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">{quizResult.desc}</p>
                    </div>

                    {/* Matching Specialties list */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 block">СӘЙКЕС КЕЛЕТІН МАНДЫҚТАР ТІЗІМІ (КОДТАРЫМЕН):</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {quizResult.specialties.map((spec) => (
                          <div key={spec.code} className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex items-start gap-2 text-xs font-bold shadow-sm">
                            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">{spec.code}</span>
                            <div>
                              <span className="text-slate-800 dark:text-slate-200 block">{spec.title}</span>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-semibold">Сұраныс: {spec.demand}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Universities */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 block">ҰСЫНЫЛАТЫН УНИВЕРСИТЕТТЕР:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quizResult.unis.map((uni, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-[10px] text-slate-650 dark:text-slate-350 font-bold flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[9px] font-mono">{idx + 1}</span>
                            <span>{uni}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 block">ГРАНТҚА ӨТУ ШЕКТЕРІ МЕН ТАЛАПТАРЫ:</span>
                      <ul className="space-y-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                        {quizResult.requirements.map((req, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-emerald-500">✔</span>
                            <p>{req}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </section>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="flex flex-col h-[600px] border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 shadow-sm animate-in fade-in duration-300" id="ai-chat-view">
          <header className="bg-slate-50 dark:bg-slate-800/40 p-5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center text-xs select-none">
                🤖
              </span>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">AI Кәсіби Бағдар беруші</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Gemini 3.5 Flash интеллектуалды жүйесі</p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
              Жүйе Белсенді
            </span>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' 
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800'
                }`}>
                  <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse flex gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-850">
            <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Мысалы: Химия-биология таңдадым, бірақ медицинаға барғым келмейді. Қандай бағыт бар?" 
                className="flex-1 bg-transparent px-4 py-3 outline-none text-xs font-bold placeholder:text-slate-400" 
                id="career-ai-input"
              />
              <button 
                onClick={handleSend} 
                className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-600/10 transition-all active:scale-95"
                id="send-ai-query-btn"
              >
                Жіберу
              </button>
            </div>
            <span className="text-[9px] text-slate-400 text-center block mt-2 font-semibold">
              AI ҰБТ сарапшысы мемлекеттік грант тізімдерін және бейінді талаптарды секунд ішінде есептейді.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerAdvisorView;
