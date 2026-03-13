
import React, { useState, useMemo } from 'react';
import { SUBJECTS } from '../constants';
import { Module, Lesson, Subject, AppView, StaffMember, UserProgress, NewsItem, University, Specialty, SubscriptionConfig } from '../types';
import { supabase } from '../supabaseClient';

interface AdminPanelProps {
  currentView?: AppView;
  setView: (view: AppView) => void;
  allModules: Record<string, Module[]>;
  setAllModules: React.Dispatch<React.SetStateAction<Record<string, Module[]>>>;
  staffList: StaffMember[];
  setAllStaffList?: React.Dispatch<React.SetStateAction<StaffMember[]>>; // Renamed to avoid confusion if needed, but keeping original for now
  setStaffList: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  user: UserProgress;
  homeConfig: any;
  setHomeConfig: (config: any) => void;
  news: NewsItem[];
  setNews: (news: NewsItem[]) => void;
  subscriptionConfig: SubscriptionConfig;
  setSubscriptionConfig: (config: SubscriptionConfig) => void;
  refreshData: () => Promise<void>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentView, 
  setView, 
  allModules, 
  setAllModules, 
  staffList, 
  setStaffList, 
  user,
  homeConfig,
  setHomeConfig,
  news,
  setNews,
  subscriptionConfig,
  setSubscriptionConfig,
  refreshData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'news' | 'unis' | 'ai' | 'users' | 'staff' | 'home' | 'subscription'>(
    currentView === 'admin-news' ? 'news' : 
    currentView === 'admin-content' ? 'content' :
    currentView === 'admin-users' ? 'users' :
    currentView === 'admin-staff' ? 'staff' :
    currentView === 'admin-home' ? 'home' :
    currentView === 'admin-unis' ? 'unis' :
    currentView === 'admin-ai' ? 'ai' : 
    currentView === 'admin-subscription' ? 'subscription' : 'content'
  );

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Partial<Lesson> | null>(null);
  const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // News state
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);

  // Students state (mock for now, or fetch from supabase if users table exists)
  const [students, setStudents] = useState<UserProgress[]>([
    { name: 'Әлихан Бақыт', email: 'ali@example.com', chosenElectives: ['География', 'Математика'], points: 1250, subscription: 'Premium', role: 'student', completedLessons: [] },
    { name: 'Аружан Серік', email: 'aru@example.com', chosenElectives: ['Биология', 'Химия'], points: 980, subscription: 'Free', role: 'student', completedLessons: [] },
  ]);

  const isSuperAdmin = user.email === 'nur.abuuadi@gmail.com';
  const staffMember = staffList.find(s => s.email === user.email);
  const allowedSubjects = isSuperAdmin ? SUBJECTS : (staffMember?.permissions ? SUBJECTS.filter(s => staffMember.permissions.includes(s.id)) : []);

  const handleSaveNews = async () => {
    if (!editingNews?.title || !editingNews?.content) return;
    setIsSaving(true);
    try {
      const newsData = {
        ...editingNews,
        date: editingNews.date || new Date().toLocaleDateString('kk-KZ'),
        created_at: editingNews.created_at || new Date().toISOString()
      };
      
      if (editingNews.id) {
        const { error } = await supabase.from('news').update(newsData).eq('id', editingNews.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news').insert([newsData]);
        if (error) throw error;
      }
      setShowNewsModal(false);
      setEditingNews(null);
      await refreshData();
      alert('Жаңалық сақталды!');
    } catch (err) {
      console.error("Error saving news:", err);
      alert('Қате орын алды: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Жаңалықты өшіруге сенімдісіз бе?')) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      await refreshData();
    } catch (err) {
      console.error("Error deleting news:", err);
      alert('Қате орын алды: ' + (err as any).message);
    }
  };

  // Universities state
  const [universities, setUniversities] = useState<University[]>([]);
  const [isUniLoading, setIsUniLoading] = useState(false);
  const [showUniModal, setShowUniModal] = useState(false);
  const [editingUni, setEditingUni] = useState<Partial<University> | null>(null);

  // Specialties state
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isSpecLoading, setIsSpecLoading] = useState(false);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [editingSpec, setEditingSpec] = useState<Partial<Specialty> | null>(null);

  // Staff state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffMember> | null>(null);

  // Student adding state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<UserProgress> | null>(null);

  const fetchUniversities = async () => {
    setIsUniLoading(true);
    try {
      const { data, error } = await supabase.from('universities').select('*').order('name');
      if (!error && data) setUniversities(data);
    } catch (err) {
      console.error("Error fetching universities:", err);
    } finally {
      setIsUniLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    setIsSpecLoading(true);
    try {
      const { data, error } = await supabase.from('specialties').select('*').order('name');
      if (!error && data) setSpecialties(data);
    } catch (err) {
      console.error("Error fetching specialties:", err);
    } finally {
      setIsSpecLoading(false);
    }
  };

  const handleSaveHomeConfig = async () => {
    setIsSaving(true);
    try {
      // Use upsert with a fixed ID to ensure we only have one config
      const { error } = await supabase.from('home_config').upsert({ id: 'main', config: homeConfig }, { onConflict: 'id' });
      if (error) throw error;
      await refreshData();
      alert('Басты бет баптаулары сақталды!');
    } catch (err) {
      console.error("Error saving home config:", err);
      alert('Қате орын алды: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSubscriptionConfig = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('config').upsert({ id: 'subscription', value: subscriptionConfig }, { onConflict: 'id' });
      if (error) throw error;
      await refreshData();
      alert('Жазылым баптаулары сақталды!');
    } catch (err) {
      console.error("Error saving subscription config:", err);
      alert('Қате орын алды: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    if (currentView === 'admin-news') setActiveSubTab('news');
    else if (currentView === 'admin-content') setActiveSubTab('content');
    else if (currentView === 'admin-users') setActiveSubTab('users');
    else if (currentView === 'admin-staff') setActiveSubTab('staff');
    else if (currentView === 'admin-home') setActiveSubTab('home');
    else if (currentView === 'admin-unis') setActiveSubTab('unis');
    else if (currentView === 'admin-ai') setActiveSubTab('ai');
  }, [currentView]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from('admin_users').select('*').order('points', { ascending: false });
      if (!error && data) setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const seedInitialUsers = async () => {
    if (!confirm('Тесттік оқушыларды жүктеуге сенімдісіз бе?')) return;
    setIsSaving(true);
    try {
      const initialUsers = [
        { email: 'student1@mail.kz', name: 'Әлихан Батыр', points: 1200, xp: 5000, subscription: 'premium', pin: '1111', chosenElectives: ['chem', 'bio'], role: 'student', completedLessons: [] },
        { email: 'student2@mail.kz', name: 'Аружан Серік', points: 850, xp: 3200, subscription: 'none', pin: '2222', chosenElectives: ['math', 'phys'], role: 'student', completedLessons: [] }
      ];
      const { error } = await supabase.from('admin_users').upsert(initialUsers);
      if (error) throw error;
      alert('Оқушылар жүктелді!');
      fetchStudents();
    } catch (err) {
      console.error("Users seed error:", err);
      alert('Қате: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    if (activeSubTab === 'unis') {
      fetchUniversities();
      fetchSpecialties();
    }
    if (activeSubTab === 'ai') fetchSpecialties();
    if (activeSubTab === 'news') refreshData();
    if (activeSubTab === 'content') refreshData();
    if (activeSubTab === 'users') fetchStudents();
  }, [activeSubTab]);

  const seedInitialData = async () => {
    if (!confirm('Бастапқы университеттер мен мамандықтарды базаға жүктеуге сенімдісіз бе?')) return;
    setIsSaving(true);
    try {
      const initialUnis = [
        { id: 'enu', name: 'Л.Н. Гумилев атындағы Еуразия ұлттық университеті', logo: 'https://logo.clearbit.com/enu.kz', location: 'Астана', region: 'Астана қаласы', type: 'National', specialtiesCount: 51, minScore: 105, averagePrice: '1 100 000 ₸', hasDormitory: true, website: 'https://enu.kz', address: 'Сәтбаев көшесі, 2', phone: '+7 (7172) 70-95-00' },
        { id: 'nu', name: 'Назарбаев Университеті (NU)', logo: 'https://logo.clearbit.com/nu.edu.kz', location: 'Астана', region: 'Астана қаласы', type: 'International', specialtiesCount: 60, minScore: 130, averagePrice: 'Грант/Ақылы', hasDormitory: true, website: 'https://nu.edu.kz', address: 'Қабанбай батыр даңғылы, 53', phone: '+7 (7172) 70-66-88' },
        { id: 'aitu', name: 'Астана IT университеті', logo: 'https://logo.clearbit.com/astanait.edu.kz', location: 'Астана', region: 'Астана қаласы', type: 'Private', specialtiesCount: 4, minScore: 115, averagePrice: '1 400 000 ₸', hasDormitory: true, website: 'https://astanait.edu.kz', address: 'EXPO, Мәңгілік Ел, 55/11', phone: '+7 (7172) 64-57-10' },
        { id: 'kazguu', name: 'М. Нарикбаев атындағы КАЗГЮУ Университеті', logo: 'https://logo.clearbit.com/kazguu.kz', location: 'Астана', region: 'Астана қаласы', type: 'Private', specialtiesCount: 9, minScore: 110, averagePrice: '1 800 000 ₸', hasDormitory: true, website: 'https://kazguu.kz', address: 'Қорғалжын тас жолы, 8', phone: '+7 (7172) 70-30-30' },
        { id: 'amu', name: 'Астана Медициналық университеті', logo: 'https://logo.clearbit.com/amu.kz', location: 'Астана', region: 'Астана қаласы', type: 'State', specialtiesCount: 3, minScore: 125, averagePrice: '1 500 000 ₸', hasDormitory: true, website: 'https://amu.kz', address: 'Бейбітшілік к-сі, 49А', phone: '+7 (7172) 53-94-24' }
      ];

      const initialSpecs = [
        { id: 's1', code: 'B057', name: 'Ақпараттық технологиялар', subjects: ['math', 'phys'], minScore: 110, grants: 2500 },
        { id: 's2', code: 'B053', name: 'Химия', subjects: ['chem', 'bio'], minScore: 95, grants: 800 },
        { id: 's3', code: 'B086', name: 'Медицина', subjects: ['chem', 'bio'], minScore: 125, grants: 1200 }
      ];

      // Use upsert and check errors explicitly
      const { error: uniError } = await supabase.from('universities').upsert(initialUnis);
      if (uniError) {
        console.error("Uni seed error:", uniError);
        throw new Error("Университеттерді жүктеу қатесі: " + uniError.message);
      }

      const { error: specError } = await supabase.from('specialties').upsert(initialSpecs);
      if (specError) {
        console.error("Spec seed error:", specError);
        throw new Error("Мамандықтарды жүктеу қатесі: " + specError.message);
      }
      
      alert('Деректер сәтті жүктелді!');
      fetchUniversities();
      fetchSpecialties();
    } catch (err) {
      console.error("Seed error:", err);
      alert('Қате: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const seedInitialContent = async () => {
    if (!confirm('Бастапқы оқу модульдерін жүктеуге сенімдісіз бе?')) return;
    setIsSaving(true);
    try {
      const { MODULES_BY_SUBJECT } = await import('../constants');
      for (const [subId, modules] of Object.entries(MODULES_BY_SUBJECT)) {
        await supabase.from('modules').upsert({
          subject_id: subId,
          data: modules
        }, { onConflict: 'subject_id' });
      }
      alert('Оқу мазмұны сәтті жүктелді!');
      refreshData();
    } catch (err) {
      console.error("Content seed error:", err);
      alert('Қате: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const seedInitialNews = async () => {
    if (!confirm('Бастапқы жаңалықтарды жүктеуге сенімдісіз бе?')) return;
    setIsSaving(true);
    try {
      const initialNews = [
        { id: 'n1', title: 'ҰБТ-2026: Жаңа формат', content: 'Биылғы ҰБТ форматындағы өзгерістер туралы толық ақпарат...', date: '27.02.2026' },
        { id: 'n2', title: 'Гранттар саны артты', content: 'Мемлекеттік гранттар саны биыл 15%-ға көбейді...', date: '26.02.2026' }
      ];
      await supabase.from('news').upsert(initialNews);
      alert('Жаңалықтар сәтті жүктелді!');
      refreshData();
    } catch (err) {
      console.error("News seed error:", err);
      alert('Қате: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const seedInitialHomeConfig = async () => {
    if (!confirm('Бастапқы басты бет баптауларын жүктеуге сенімдісіз бе?')) return;
    setIsSaving(true);
    try {
      const defaultConfig = {
        greetingTitle: 'Сәлем, Оқушы! 👋',
        premiumTitle: 'Барлық сабақтарға қолжетімділік алыңыз! 🚀',
        premiumDesc: '177 сабақ • 12 пән • Шексіз тест • Балл жүйесі',
        bannerColor: 'bg-indigo-600',
        premiumColor: 'from-amber-500 to-orange-600'
      };
      const { error } = await supabase.from('home_config').upsert({
        id: 'main',
        config: defaultConfig
      }, { onConflict: 'id' });
      if (error) throw error;
      alert('Басты бет баптаулары жүктелді!');
      refreshData();
    } catch (err) {
      console.error("Home seed error:", err);
      alert('Қате: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const seedInitialSubscriptionConfig = async () => {
    if (!confirm('Бастапқы жазылым баптауларын жүктеуге сенімдісіз бе?')) return;
    setIsSaving(true);
    try {
      const initialConfig: SubscriptionConfig = {
        bundles: [
          { id: 'single', name: '1 пән', priceMonth: '10 000 ₸', priceYear: '80 000 ₸', oldPriceMonth: '15 000 ₸', oldPriceYear: '120 000 ₸', desc: 'Таңдаған бір пәніңізге толық қолжетімділік.', color: 'border-gray-200' },
          { id: 'double', name: '2 пән', priceMonth: '15 000 ₸', priceYear: '120 000 ₸', oldPriceMonth: '25 000 ₸', oldPriceYear: '200 000 ₸', desc: 'Екі таңдау пәніңізге толық қолжетімділік.', color: 'border-blue-500 bg-blue-50/30' },
          { id: 'full', name: '5 пән (Толық пакет)', priceMonth: '40 000 ₸', priceYear: '320 000 ₸', oldPriceMonth: '60 000 ₸', oldPriceYear: '480 000 ₸', desc: 'Барлық 3 негізгі пән + 2 таңдау пәні. Ең тиімді таңдау!', color: 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100/50', badge: 'Ең тиімді' },
        ],
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kaspi.kz/pay/SMART_UBT',
        kaspiNumber: '8 777 190 27 96',
        kaspiName: 'Ерназар Н.',
        whatsappNumber: '77771902796'
      };
      const { error } = await supabase.from('config').upsert({ id: 'subscription', value: initialConfig }, { onConflict: 'id' });
      if (error) throw error;
      setSubscriptionConfig(initialConfig);
      alert('Бастапқы жазылым баптаулары орнатылды!');
      refreshData();
    } catch (err) {
      console.error("Subscription seed error:", err);
      alert('Қате: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const seedInitialStaff = async () => {
    if (!confirm('Бастапқы қызметкерлерді жүктеуге сенімдісіз бе?')) return;
    setIsSaving(true);
    try {
      const initialStaff = [
        { email: 'nur.abuuadi@gmail.com', name: 'Бас Админ', role: 'super-admin', permissions: ['all'] },
        { email: 'test@mail.kz', name: 'Арман Құратор', role: 'teacher', permissions: ['chem'] }
      ];
      const { error } = await supabase.from('staff').upsert(initialStaff);
      if (error) throw error;
      alert('Қызметкерлер жүктелді! Бетті жаңартыңыз.');
      window.location.reload();
    } catch (err) {
      console.error("Staff seed error:", err);
      alert('Қате: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUni = async () => {
    if (!editingUni?.name) return;
    setIsSaving(true);
    try {
      if (editingUni.id) {
        const { error } = await supabase.from('universities').update(editingUni).eq('id', editingUni.id);
        if (error) throw error;
      } else {
        const newUni = { ...editingUni, id: Date.now().toString() };
        const { error } = await supabase.from('universities').insert([newUni]);
        if (error) throw error;
      }
      setShowUniModal(false);
      setEditingUni(null);
      fetchUniversities();
      alert('ЖОО сақталды!');
    } catch (err) {
      console.error("Error saving university:", err);
      alert('Қате орын алды: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUni = async (id: string) => {
    if (!confirm('ЖОО-ны өшіруге сенімдісіз бе?')) return;
    try {
      const { error } = await supabase.from('universities').delete().eq('id', id);
      if (error) throw error;
      fetchUniversities();
    } catch (err) {
      console.error("Error deleting university:", err);
      alert('Қате орын алды: ' + (err as any).message);
    }
  };

  const handleSaveStaff = async () => {
    if (!editingStaff?.name || !editingStaff?.email) return;
    setIsSaving(true);
    try {
      const newStaff = { ...editingStaff, role: editingStaff.role || 'teacher', permissions: editingStaff.permissions || [] } as StaffMember;
      
      // Try to check if staff exists first to decide between insert and update
      // This can sometimes bypass certain RLS issues with upsert
      const { data: existing } = await supabase.from('staff').select('email').eq('email', newStaff.email).maybeSingle();
      
      let error;
      if (existing) {
        const { error: updateError } = await supabase.from('staff').update(newStaff).eq('email', newStaff.email);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('staff').insert([newStaff]);
        error = insertError;
      }

      if (error) throw error;
      
      setStaffList(prev => {
        const exists = prev.find(s => s.email === newStaff.email);
        if (exists) return prev.map(s => s.email === newStaff.email ? newStaff : s);
        return [...prev, newStaff];
      });
      setShowStaffModal(false);
      setEditingStaff(null);
      alert('Қызметкер сақталды!');
    } catch (err) {
      console.error("Error saving staff:", err);
      alert('Қате орын алды: ' + (err as any).message + '\n\nЕскерту: Supabase-те "staff" кестесіне RLS саясатын (Policy) қосу қажет болуы мүмкін.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStaff = async (email: string) => {
    if (!confirm('Қызметкерді өшіруге сенімдісіз бе?')) return;
    try {
      const { error } = await supabase.from('staff').delete().eq('email', email);
      if (error) throw error;
      setStaffList(prev => prev.filter(s => s.email !== email));
    } catch (err) {
      console.error("Error deleting staff:", err);
      alert('Қате: ' + (err as any).message);
    }
  };

  const handleSaveStudent = async () => {
    if (!editingStudent?.name) {
      alert('Аты-жөні өрісін толтырыңыз');
      return;
    }
    if (!editingStudent?.email) {
      alert('Email өрісін толтырыңыз');
      return;
    }
    
    setIsSaving(true);
    try {
      const studentData = {
        ...editingStudent,
        points: editingStudent.points || 0,
        subscription: editingStudent.subscription || 'Free',
        pin: editingStudent.pin || Math.floor(1000 + Math.random() * 9000).toString(),
        chosenElectives: editingStudent.chosenElectives || [],
        role: 'student',
        completedLessons: editingStudent.completedLessons || []
      };
      
      const { error } = await supabase.from('admin_users').upsert(studentData);
      if (error) throw error;
      
      alert('Оқушы деректері сақталды!');
      setShowStudentModal(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
      alert('Сақтау кезінде қате кетті: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStudent = async (email: string) => {
    if (!confirm('Оқушыны өшіруге сенімдісіз бе?')) return;
    try {
      const { error } = await supabase.from('admin_users').delete().eq('email', email);
      if (error) throw error;
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert('Қате: ' + (err as any).message);
    }
  };

  const handleSaveSpec = async () => {
    if (!editingSpec?.name || !editingSpec?.code) return;
    setIsSaving(true);
    try {
      if (editingSpec.id) {
        const { error } = await supabase.from('specialties').update(editingSpec).eq('id', editingSpec.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('specialties').insert([editingSpec]);
        if (error) throw error;
      }
      setShowSpecModal(false);
      setEditingSpec(null);
      fetchSpecialties();
      alert('Мамандық сақталды!');
    } catch (err) {
      console.error("Error saving specialty:", err);
      alert('Қате орын алды: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveModules = async (subjectId: string, modules: Module[]) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('modules').upsert({
        subject_id: subjectId,
        data: modules
      }, { onConflict: 'subject_id' });
      
      if (error) throw error;
      
      setAllModules(prev => ({ ...prev, [subjectId]: modules }));
      await refreshData();
      alert('Сәтті сақталды!');
    } catch (err) {
      console.error("Error saving modules:", err);
      alert('Қате орын алды: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteModule = (moduleId: string) => {
    if (!selectedSubject || !confirm('Модульді өшіруге сенімдісіз бе?')) return;
    const currentModules = allModules[selectedSubject.id] || [];
    handleSaveModules(selectedSubject.id, currentModules.filter(m => m.id !== moduleId));
  };

  const saveModuleInfo = () => {
    if (!selectedSubject || !editingModule) return;
    const currentModules = [...(allModules[selectedSubject.id] || [])];
    
    if (editingModule.id) {
      const modIdx = currentModules.findIndex(m => m.id === editingModule.id);
      if (modIdx !== -1) {
        const updatedModule = { ...currentModules[modIdx], ...editingModule } as Module;
        currentModules[modIdx] = updatedModule;
        if (selectedModule && selectedModule.id === editingModule.id) {
          setSelectedModule(updatedModule);
        }
      }
    } else {
      const newModule: Module = {
        id: Date.now().toString(),
        title: editingModule.title || 'Жаңа модуль',
        lessons: [],
        weekNumber: editingModule.weekNumber || (currentModules.length + 1)
      };
      currentModules.push(newModule);
    }
    
    handleSaveModules(selectedSubject.id, currentModules);
    setEditingModule(null);
  };

  const saveLesson = () => {
    if (!selectedSubject || !selectedModule || !selectedLesson) return;
    const currentModules = [...(allModules[selectedSubject.id] || [])];
    const modIdx = currentModules.findIndex(m => m.id === selectedModule.id);
    if (modIdx === -1) return;

    const lessons = [...currentModules[modIdx].lessons];
    if (selectedLesson.id) {
      const lessonIdx = lessons.findIndex(l => l.id === selectedLesson.id);
      if (lessonIdx !== -1) lessons[lessonIdx] = selectedLesson as Lesson;
    } else {
      const newLesson = { ...selectedLesson, id: Date.now().toString() } as Lesson;
      lessons.push(newLesson);
    }

    currentModules[modIdx].lessons = lessons;
    handleSaveModules(selectedSubject.id, currentModules);
    setSelectedLesson(null);
  };

  const deleteLesson = (lessonId: string) => {
    if (!selectedSubject || !selectedModule || !confirm('Сабақты өшіруге сенімдісіз бе?')) return;
    const currentModules = [...(allModules[selectedSubject.id] || [])];
    const modIdx = currentModules.findIndex(m => m.id === selectedModule.id);
    if (modIdx === -1) return;

    currentModules[modIdx].lessons = currentModules[modIdx].lessons.filter(l => l.id !== lessonId);
    handleSaveModules(selectedSubject.id, currentModules);
  };

  const handleDeleteSpec = async (id: string) => {
    if (!confirm('Мамандықты өшіруге сенімдісіз бе?')) return;
    try {
      const { error } = await supabase.from('specialties').delete().eq('id', id);
      if (error) throw error;
      fetchSpecialties();
    } catch (err) {
      console.error("Error deleting specialty:", err);
      alert('Қате орын алды: ' + (err as any).message);
    }
  };

  const addReinforcementItem = () => {
    if (!selectedLesson) return;
    const reinforcement = [...(selectedLesson.reinforcement || [])];
    reinforcement.push({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
    setSelectedLesson({ ...selectedLesson, reinforcement });
  };

  const removeReinforcementItem = (idx: number) => {
    if (!selectedLesson) return;
    const reinforcement = [...(selectedLesson.reinforcement || [])];
    reinforcement.splice(idx, 1);
    setSelectedLesson({ ...selectedLesson, reinforcement });
  };

  const updateReinforcementItem = (idx: number, field: string, value: any) => {
    if (!selectedLesson) return;
    const reinforcement = [...(selectedLesson.reinforcement || [])];
    reinforcement[idx] = { ...reinforcement[idx], [field]: value };
    setSelectedLesson({ ...selectedLesson, reinforcement });
  };

  const addHomeworkItem = () => {
    if (!selectedLesson) return;
    const homework = [...(selectedLesson.homework || [])];
    homework.push({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
    setSelectedLesson({ ...selectedLesson, homework });
  };

  const removeHomeworkItem = (idx: number) => {
    if (!selectedLesson) return;
    const homework = [...(selectedLesson.homework || [])];
    homework.splice(idx, 1);
    setSelectedLesson({ ...selectedLesson, homework });
  };

  const updateHomeworkItem = (idx: number, field: string, value: any) => {
    if (!selectedLesson) return;
    const homework = [...(selectedLesson.homework || [])];
    homework[idx] = { ...homework[idx], [field]: value };
    setSelectedLesson({ ...selectedLesson, homework });
  };

  // AI Hub state
  const [aiTools, setAiTools] = useState([
    { id: 'flashcards', label: 'Карточкалар', icon: 'fa-clone', color: 'bg-orange-500', active: true },
    { id: 'reaction-balancer', label: 'Реакция Теңестіру', icon: 'fa-equals', color: 'bg-pink-500', active: true },
    { id: 'periodic-table', label: 'Периодтық кесте', icon: 'fa-table-cells', color: 'bg-amber-500', active: true },
    { id: 'solubility-table', label: 'Ерігіштік кестесі', icon: 'fa-vial', color: 'bg-blue-500', active: true },
    { id: 'reactivity-series', label: 'Белсенділік қатары', icon: 'fa-bolt', color: 'bg-red-500', active: true },
    { id: 'glossary', label: 'Терминдер', icon: 'fa-spell-check', color: 'bg-teal-500', active: true },
    { id: 'formulas', label: 'Формулалар', icon: 'fa-square-root-variable', color: 'bg-cyan-600', active: true },
  ]);

  const toggleAiTool = (id: string) => {
    setAiTools(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] -m-4 md:-m-10">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {activeSubTab === 'home' && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black font-outfit">Басты бетті басқару</h3>
                   <div className="flex gap-3">
                      <button onClick={seedInitialHomeConfig} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all">Бастапқы баптаулар</button>
                      <button 
                        onClick={handleSaveHomeConfig}
                        disabled={isSaving}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                      >
                        {isSaving ? 'Сақталуда...' : 'Сақтау'}
                      </button>
                   </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Сәлемдеме баннері</h4>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Тақырыбы</label>
                    <input 
                      type="text" 
                      value={homeConfig.greetingTitle} 
                      onChange={e => setHomeConfig({...homeConfig, greetingTitle: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Түсі (Tailwind class)</label>
                    <input 
                      type="text" 
                      value={homeConfig.bannerColor} 
                      onChange={e => setHomeConfig({...homeConfig, bannerColor: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600">Premium баннері</h4>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Тақырыбы</label>
                    <input 
                      type="text" 
                      value={homeConfig.premiumTitle} 
                      onChange={e => setHomeConfig({...homeConfig, premiumTitle: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Сипаттамасы</label>
                    <input 
                      type="text" 
                      value={homeConfig.premiumDesc} 
                      onChange={e => setHomeConfig({...homeConfig, premiumDesc: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Түсі (Tailwind gradient)</label>
                    <input 
                      type="text" 
                      value={homeConfig.premiumColor} 
                      onChange={e => setHomeConfig({...homeConfig, premiumColor: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'content' && (
            <div className="animate-in fade-in">
               {!selectedSubject ? (
                 <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <h3 className="text-lg font-black font-outfit">Оқу мазмұнын басқару</h3>
                      <button onClick={seedInitialContent} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all">Бастапқы мазмұнды жүктеу</button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                   {allowedSubjects.map((sub: Subject) => (
                     <button key={sub.id} onClick={() => setSelectedSubject(sub)} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-4 hover:border-indigo-500 transition-all text-center group">
                        <div className={`${sub.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-105 transition-transform`}><i className={`fas ${sub.icon}`}></i></div>
                        <h5 className="font-black text-slate-800 dark:text-slate-100 text-sm">{sub.name}</h5>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Басқару</span>
                     </button>
                   ))}
                 </div>
                </div>
               ) : !selectedModule ? (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <button onClick={() => setSelectedSubject(null)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-arrow-left"></i> Пәндерге қайту
                      </button>
                      <h3 className="text-xl font-black font-outfit">{selectedSubject.name} модульдері</h3>
                      <button onClick={() => setEditingModule({ title: '', weekNumber: (allModules[selectedSubject.id]?.length || 0) + 1 })} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">+ Модуль</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(allModules[selectedSubject.id] || []).map(mod => (
                        <div key={mod.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex justify-between items-center group">
                          <div>
                            <h4 className="font-black text-slate-800 dark:text-white text-sm">{mod.title}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{mod.lessons.length} сабақ • {mod.weekNumber}-апта</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingModule(mod)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                              <i className="fas fa-edit text-[10px]"></i>
                            </button>
                            <button onClick={() => setSelectedModule(mod)} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                              <i className="fas fa-chevron-right text-[10px]"></i>
                            </button>
                            <button onClick={() => deleteModule(mod.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                              <i className="fas fa-trash text-[10px]"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <button onClick={() => setSelectedModule(null)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-arrow-left"></i> Модульдерге қайту
                      </button>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black font-outfit">{selectedModule.title} сабақтары</h3>
                        <button onClick={() => setEditingModule(selectedModule)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                          <i className="fas fa-edit text-sm"></i>
                        </button>
                      </div>
                      <button onClick={() => setSelectedLesson({ reinforcement: [], homework: [] })} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">+ Сабақ</button>
                    </div>

                    <div className="space-y-3">
                      {selectedModule.lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-gray-50 dark:bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">{idx + 1}</div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">{lesson.title}</h4>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                const l = { ...lesson };
                                if (!Array.isArray(l.reinforcement)) {
                                  l.reinforcement = l.reinforcement ? [l.reinforcement as any] : [];
                                }
                                if (!Array.isArray(l.homework)) {
                                  l.homework = l.homework ? [l.homework as any] : [];
                                }
                                setSelectedLesson(l as Lesson);
                              }} 
                              className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                            >
                              <i className="fas fa-edit text-[10px]"></i>
                            </button>
                            <button onClick={() => deleteLesson(lesson.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                              <i className="fas fa-trash text-[10px]"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeSubTab === 'news' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-6 animate-in slide-in-from-bottom">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black font-outfit">Жаңалықтар лентасы</h3>
                <div className="flex gap-3">
                  {news.length === 0 && (
                    <button onClick={seedInitialNews} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all">Бастапқы жаңалықтар</button>
                  )}
                  <button 
                    onClick={() => { setEditingNews({}); setShowNewsModal(true); }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg"
                  >
                    + Жаңалық
                  </button>
                </div>
              </div>
              
              {isNewsLoading ? (
                <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Жүктелуде...</div>
              ) : news.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-3xl">Жаңалықтар жоқ</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.map((item: NewsItem) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl flex justify-between items-center border border-gray-100 dark:border-slate-700 hover:border-indigo-500 transition-all group">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{item.title}</h4>
                          <p className="text-[9px] text-gray-400 font-medium">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingNews(item); setShowNewsModal(true); }} className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                          <i className="fas fa-edit text-[10px]"></i>
                        </button>
                        <button onClick={() => { if (item.id) handleDeleteNews(item.id); }} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                          <i className="fas fa-trash text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'users' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm animate-in fade-in">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black font-outfit">Оқушылар мониторингі</h3>
                  <div className="flex gap-3">
                    {students.length <= 2 && (
                      <button onClick={seedInitialUsers} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all">Бастапқы оқушылар</button>
                    )}
                    <input type="text" placeholder="Іздеу..." className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 ring-indigo-500" />
                    <button 
                      onClick={() => {
                        setEditingStudent({
                          name: '',
                          email: '',
                          subscription: 'Free',
                          activationCode: Math.floor(100000 + Math.random() * 900000).toString(),
                          activeSubjects: [],
                          points: 0
                        }); 
                        setShowStudentModal(true); 
                      }} 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                    >
                      + Оқушы қосу
                    </button>
                  </div>
               </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-slate-900 text-[9px] font-black uppercase text-gray-400">
                      <tr>
                        <th className="p-4">Оқушы</th>
                        <th className="p-4">Пәндер / Код</th>
                        <th className="p-4">Мерзімі</th>
                        <th className="p-4 text-center">Балл/XP</th>
                        <th className="p-4 text-right">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {students.map((s: UserProgress) => (
                        <tr key={s.email} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-sm text-slate-800 dark:text-white">{s.name}</p>
                            <p className="text-[10px] text-gray-400">{s.email}</p>
                          </td>
                          <td className="p-4">
                             <div className="flex flex-col gap-1">
                                <div className="flex gap-1 flex-wrap">
                                  {(s.activeSubjects || s.chosenElectives || []).map((e: string) => (
                                    <span key={e} className="text-[8px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-black uppercase">{e}</span>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded uppercase tracking-widest">
                                    PIN: {s.pin || '—'}
                                  </span>
                                  {s.pin && (
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(s.pin || '');
                                        alert('PIN көшірілді!');
                                      }}
                                      className="text-slate-300 hover:text-indigo-600 transition-colors"
                                      title="Көшіру"
                                    >
                                      <i className="fas fa-copy text-[10px]"></i>
                                    </button>
                                  )}
                                </div>
                             </div>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold text-slate-500">
                              {s.subscriptionExpiresAt ? new Date(s.subscriptionExpiresAt).toLocaleDateString() : '—'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                             <span className="font-black text-emerald-600 text-xs">{s.points} ★</span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2 items-center">
                              <button 
                                onClick={async () => {
                                  const newStatus = s.subscription === 'Premium' ? 'Free' : 'Premium';
                                  if (!confirm(`Оқушыны ${newStatus} статусына ауыстыруға сенімдісіз бе?`)) return;
                                  try {
                                    const { error } = await supabase.from('admin_users').update({ subscription: newStatus }).eq('email', s.email);
                                    if (error) throw error;
                                    fetchStudents();
                                    alert('Статус жаңартылды!');
                                  } catch (err) {
                                    alert('Қате: ' + (err as any).message);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                  s.subscription === 'Premium' 
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                  : 'bg-gray-100 text-gray-500 hover:bg-indigo-600 hover:text-white'
                                }`}
                              >
                                {s.subscription === 'Premium' ? 'Premium' : 'Free'}
                              </button>
                              <div className="flex gap-1">
                                <button onClick={() => { setEditingStudent(s); setShowStudentModal(true); }} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><i className="fas fa-edit text-[10px]"></i></button>
                                <button onClick={() => handleDeleteStudent(s.email)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash text-[10px]"></i></button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeSubTab === 'staff' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm animate-in zoom-in space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black font-outfit">Қызметкерлер</h3>
                  <div className="flex gap-3">
                    {staffList.length <= 2 && (
                      <button onClick={seedInitialStaff} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all">Бастапқы қызметкерлер</button>
                    )}
                    <button onClick={() => { setEditingStaff({}); setShowStaffModal(true); }} className="bg-slate-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">+ Қызметкер</button>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffList.map(staff => (
                    <div key={staff.email} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-black text-xs">{staff.name.charAt(0)}</div>
                          <div>
                            <p className="font-bold text-xs text-slate-800 dark:text-white">{staff.name}</p>
                            <p className="text-[8px] text-gray-400 uppercase tracking-widest">{staff.role}</p>
                          </div>
                       </div>
                                               <div className="flex gap-2">
                           <button onClick={() => { setEditingStaff(staff); setShowStaffModal(true); }} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><i className="fas fa-edit text-[10px]"></i></button>
                           <button onClick={() => handleDeleteStaff(staff.email)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash text-[10px]"></i></button>
                        </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeSubTab === 'unis' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black font-outfit">ЖОО базасы</h3>
                    <div className="flex gap-3">
                       {universities.length === 0 && (
                         <button onClick={seedInitialData} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all">Бастапқы деректерді жүктеу</button>
                       )}
                       <button onClick={() => { setEditingUni({}); setShowUniModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">+ ЖОО қосу</button>
                    </div>
                 </div>

                 {isUniLoading ? (
                   <div className="py-20 text-center animate-pulse text-slate-400 text-[10px] font-black uppercase tracking-widest">Жүктелуде...</div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {universities.map(uni => (
                        <div key={uni.id} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-slate-700">
                                <i className="fas fa-university text-indigo-600"></i>
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-slate-800 dark:text-white">{uni.name}</h4>
                                <p className="text-[8px] text-gray-400 uppercase tracking-widest">{uni.location}</p>
                              </div>
                           </div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingUni(uni); setShowUniModal(true); }} className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><i className="fas fa-edit text-[10px]"></i></button>
                              <button onClick={() => handleDeleteUni(uni.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><i className="fas fa-trash text-[10px]"></i></button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black font-outfit">Мамандықтар базасы</h3>
                    <button onClick={() => { setEditingSpec({}); setShowSpecModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">+ Мамандық</button>
                 </div>

                 {isSpecLoading ? (
                   <div className="py-20 text-center animate-pulse text-slate-400 text-[10px] font-black uppercase tracking-widest">Жүктелуде...</div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {specialties.map(spec => (
                        <div key={spec.id} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 flex justify-between items-center group">
                           <div>
                              <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1">{spec.code}</p>
                              <h4 className="font-bold text-xs text-slate-800 dark:text-white">{spec.name}</h4>
                           </div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingSpec(spec); setShowSpecModal(true); }} className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><i className="fas fa-edit text-[10px]"></i></button>
                              <button onClick={() => handleDeleteSpec(spec.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><i className="fas fa-trash text-[10px]"></i></button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeSubTab === 'ai' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black font-outfit">AI Hub Құралдары</h3>
                  <button onClick={() => alert('Сақталды!')} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">Өзгерістерді сақтау</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiTools.map(tool => (
                    <div key={tool.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${tool.active ? 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-700' : 'bg-gray-100/50 dark:bg-slate-900/20 border-dashed border-gray-200 dark:border-slate-800 opacity-60'}`}>
                       <div className="flex items-center gap-4">
                         <div className={`${tool.color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm shadow-sm`}>
                           <i className={`fas ${tool.icon}`}></i>
                         </div>
                         <div>
                           <h4 className="font-bold text-xs text-slate-800 dark:text-white">{tool.label}</h4>
                           <p className="text-[8px] text-gray-400 uppercase tracking-widest">{tool.active ? 'Белсенді' : 'Өшірулі'}</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => toggleAiTool(tool.id)}
                         className={`w-10 h-6 rounded-full relative transition-colors ${tool.active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-700'}`}
                       >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tool.active ? 'left-5' : 'left-1'}`}></div>
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeSubTab === 'subscription' && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black font-outfit">Жазылымды басқару</h3>
                <div className="flex gap-3">
                  <button onClick={seedInitialSubscriptionConfig} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all">Бастапқы баптаулар</button>
                  <button 
                    onClick={handleSaveSubscriptionConfig}
                    disabled={isSaving}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Сақталуда...' : 'Сақтау'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Төлем деректері</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kaspi нөмірі</label>
                      <input 
                        type="text" 
                        value={subscriptionConfig.kaspiNumber} 
                        onChange={e => setSubscriptionConfig({...subscriptionConfig, kaspiNumber: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kaspi иесінің аты</label>
                      <input 
                        type="text" 
                        value={subscriptionConfig.kaspiName} 
                        onChange={e => setSubscriptionConfig({...subscriptionConfig, kaspiName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">WhatsApp нөмірі (77...)</label>
                    <input 
                      type="text" 
                      value={subscriptionConfig.whatsappNumber} 
                      onChange={e => setSubscriptionConfig({...subscriptionConfig, whatsappNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kaspi QR суреті</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden">
                        {subscriptionConfig.qrCodeUrl ? (
                          <img src={subscriptionConfig.qrCodeUrl} alt="QR Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <i className="fas fa-qrcode text-gray-300"></i>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setSubscriptionConfig({...subscriptionConfig, qrCodeUrl: reader.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden" 
                          id="qr-upload"
                        />
                        <label 
                          htmlFor="qr-upload"
                          className="inline-block px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-indigo-100 transition-all"
                        >
                          Суретті жүктеу
                        </label>
                        <p className="text-[8px] text-gray-400 italic">QR код суретін тікелей жүктеңіз немесе төмендегі сілтемені өзгертіңіз</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kaspi QR URL</label>
                    <input 
                      type="text" 
                      value={subscriptionConfig.qrCodeUrl} 
                      onChange={e => setSubscriptionConfig({...subscriptionConfig, qrCodeUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Пакеттер мен бағалар</h4>
                  <div className="space-y-4">
                    {subscriptionConfig.bundles.map((bundle, idx) => (
                      <div key={bundle.id} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{bundle.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Айлық баға</label>
                            <input 
                              type="text" 
                              value={bundle.priceMonth} 
                              onChange={e => {
                                const newBundles = [...subscriptionConfig.bundles];
                                newBundles[idx] = { ...bundle, priceMonth: e.target.value };
                                setSubscriptionConfig({ ...subscriptionConfig, bundles: newBundles });
                              }}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Жылдық баға</label>
                            <input 
                              type="text" 
                              value={bundle.priceYear} 
                              onChange={e => {
                                const newBundles = [...subscriptionConfig.bundles];
                                newBundles[idx] = { ...bundle, priceYear: e.target.value };
                                setSubscriptionConfig({ ...subscriptionConfig, bundles: newBundles });
                              }}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Ескі айлық</label>
                            <input 
                              type="text" 
                              value={bundle.oldPriceMonth || ''} 
                              onChange={e => {
                                const newBundles = [...subscriptionConfig.bundles];
                                newBundles[idx] = { ...bundle, oldPriceMonth: e.target.value };
                                setSubscriptionConfig({ ...subscriptionConfig, bundles: newBundles });
                              }}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Ескі жылдық</label>
                            <input 
                              type="text" 
                              value={bundle.oldPriceYear || ''} 
                              onChange={e => {
                                const newBundles = [...subscriptionConfig.bundles];
                                newBundles[idx] = { ...bundle, oldPriceYear: e.target.value };
                                setSubscriptionConfig({ ...subscriptionConfig, bundles: newBundles });
                              }}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lesson Editor Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-200 no-scrollbar">
            <h3 className="text-xl font-black font-outfit mb-8">{selectedLesson.id ? 'Сабақты өңдеу' : 'Жаңа сабақ'}</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Сабақ атауы</label>
                  <input 
                    type="text" 
                    value={selectedLesson.title || ''} 
                    onChange={e => setSelectedLesson({...selectedLesson, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 ring-indigo-500"
                    placeholder="Сабақ тақырыбы..."
                  />
                </div>
                <div className="ml-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedLesson.isFree || false}
                      onChange={e => setSelectedLesson({...selectedLesson, isFree: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Тегін сабақ</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Видео URL (YouTube/Vimeo)</label>
                  <input 
                    type="text" 
                    value={selectedLesson.videoUrl || ''} 
                    onChange={e => setSelectedLesson({...selectedLesson, videoUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 ring-indigo-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Конспект URL (PDF)</label>
                  <input 
                    type="text" 
                    value={selectedLesson.presentationUrl || ''} 
                    onChange={e => setSelectedLesson({...selectedLesson, presentationUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 ring-indigo-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Сабақ мәтіні (Транскрипт)</label>
                <textarea 
                  value={selectedLesson.transcript || ''} 
                  onChange={e => setSelectedLesson({...selectedLesson, transcript: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 ring-indigo-500 min-h-[100px]"
                  placeholder="Сабақтың мәтіндік нұсқасын осында жазыңыз..."
                />
              </div>

              <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600">Бекіту тапсырмасы</h4>
                  <button onClick={addReinforcementItem} className="text-[8px] font-black text-amber-600 uppercase tracking-widest">+ Сұрақ қосу</button>
                </div>
                
                <div className="space-y-6">
                  {selectedLesson.reinforcement?.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-amber-800 space-y-3 relative">
                      <button onClick={() => removeReinforcementItem(qIdx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><i className="fas fa-times text-xs"></i></button>
                      <input 
                        type="text" 
                        placeholder={`Сұрақ ${qIdx + 1}`}
                        value={q.question}
                        onChange={e => updateReinforcementItem(qIdx, 'question', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg text-xs outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt: string, oIdx: number) => (
                          <input 
                            key={oIdx}
                            type="text" 
                            placeholder={`Нұсқа ${oIdx + 1}`}
                            value={opt}
                            onChange={e => {
                              const opts = [...q.options];
                              opts[oIdx] = e.target.value;
                              updateReinforcementItem(qIdx, 'options', opts);
                            }}
                            className={`px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border rounded-lg text-[10px] outline-none ${q.correctAnswer === oIdx ? 'border-emerald-500' : 'border-gray-100 dark:border-slate-700'}`}
                          />
                        ))}
                      </div>
                      <select 
                        value={q.correctAnswer}
                        onChange={e => updateReinforcementItem(qIdx, 'correctAnswer', parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 rounded-lg px-2 py-1 text-[10px]"
                      >
                        {[0,1,2,3].map(i => <option key={i} value={i}>{i+1}-нұсқа дұрыс</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Қатемен жұмыс (Талдау)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Талдау видео URL"
                    value={selectedLesson.analysisVideoUrl || ''}
                    onChange={e => setSelectedLesson({...selectedLesson, analysisVideoUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-800 rounded-xl text-xs outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Шешімдер ПДФ URL"
                    value={selectedLesson.pdfSolutionUrl || ''}
                    onChange={e => setSelectedLesson({...selectedLesson, pdfSolutionUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-800 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Үй жұмысы</h4>
                  <button onClick={addHomeworkItem} className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">+ Сұрақ қосу</button>
                </div>
                
                <div className="space-y-6">
                  {selectedLesson.homework?.map((hw, hIdx) => (
                    <div key={hIdx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-emerald-800 space-y-3 relative">
                      <button onClick={() => removeHomeworkItem(hIdx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><i className="fas fa-times text-xs"></i></button>
                      <input 
                        type="text" 
                        placeholder={`Сұрақ ${hIdx + 1}`}
                        value={hw.question}
                        onChange={e => updateHomeworkItem(hIdx, 'question', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg text-xs outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {hw.options.map((opt: string, oIdx: number) => (
                          <input 
                            key={oIdx}
                            type="text" 
                            placeholder={`Нұсқа ${oIdx + 1}`}
                            value={opt}
                            onChange={e => {
                              const opts = [...hw.options];
                              opts[oIdx] = e.target.value;
                              updateHomeworkItem(hIdx, 'options', opts);
                            }}
                            className={`px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border rounded-lg text-[10px] outline-none ${hw.correctAnswer === oIdx ? 'border-emerald-500' : 'border-gray-100 dark:border-slate-700'}`}
                          />
                        ))}
                      </div>
                      <select 
                        value={hw.correctAnswer}
                        onChange={e => updateHomeworkItem(hIdx, 'correctAnswer', parseInt(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 rounded-lg px-2 py-1 text-[10px]"
                      >
                        {[0,1,2,3].map(i => <option key={i} value={i}>{i+1}-нұсқа дұрыс</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button onClick={() => setSelectedLesson(null)} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-500 hover:bg-gray-200 transition-all">Артқа қайту</button>
              <button 
                onClick={saveLesson}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all"
              >
                Растау
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specialty Modal */}
      {showSpecModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black font-outfit mb-8">{editingSpec?.id ? 'Мамандықты өңдеу' : 'Жаңа мамандық'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Код</label>
                  <input 
                    type="text" 
                    value={editingSpec?.code || ''} 
                    onChange={e => setEditingSpec({...editingSpec, code: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    placeholder="B001"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Атауы</label>
                  <input 
                    type="text" 
                    value={editingSpec?.name || ''} 
                    onChange={e => setEditingSpec({...editingSpec, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    placeholder="Мамандық атауы..."
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Минималды балл</label>
                <input 
                  type="number" 
                  value={editingSpec?.minScore || 0} 
                  onChange={e => setEditingSpec({...editingSpec, minScore: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <button onClick={() => setShowSpecModal(false)} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-500 hover:bg-gray-200 transition-all">Артқа қайту</button>
              <button 
                onClick={handleSaveSpec} 
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all"
              >
                Растау
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black font-outfit mb-8">{editingNews?.id ? 'Жаңалықты өңдеу' : 'Жаңа жаңалық'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Тақырыбы</label>
                <input 
                  type="text" 
                  value={editingNews?.title || ''} 
                  onChange={e => setEditingNews({...editingNews, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none"
                  placeholder="Жаңалық тақырыбы..."
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Мазмұны</label>
                <textarea 
                  value={editingNews?.content || ''} 
                  onChange={e => setEditingNews({...editingNews, content: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none min-h-[120px]"
                  placeholder="Жаңалық мәтіні..."
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Сурет URL</label>
                <input 
                  type="text" 
                  value={editingNews?.image || ''} 
                  onChange={e => setEditingNews({...editingNews, image: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <button onClick={() => setShowNewsModal(false)} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-500 hover:bg-gray-200 transition-all">Артқа қайту</button>
              <button 
                onClick={handleSaveNews} 
                disabled={isSaving}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Сақталуда...' : 'Растау'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* University Modal */}
      {showUniModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black font-outfit mb-8">{editingUni?.id ? 'ЖОО-ны өңдеу' : 'Жаңа ЖОО'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Атауы</label>
                <input 
                  type="text" 
                  value={editingUni?.name || ''} 
                  onChange={e => setEditingUni({...editingUni, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                  placeholder="Университет атауы..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Қала</label>
                  <input 
                    type="text" 
                    value={editingUni?.location || ''} 
                    onChange={e => setEditingUni({...editingUni, location: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    placeholder="Алматы..."
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Регион</label>
                  <input 
                    type="text" 
                    value={editingUni?.region || ''} 
                    onChange={e => setEditingUni({...editingUni, region: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    placeholder="Оңтүстік..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Минималды балл</label>
                  <input 
                    type="number" 
                    value={editingUni?.minScore || 0} 
                    onChange={e => setEditingUni({...editingUni, minScore: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Орташа бағасы</label>
                  <input 
                    type="text" 
                    value={editingUni?.averagePrice || ''} 
                    onChange={e => setEditingUni({...editingUni, averagePrice: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                    placeholder="600,000 ₸"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Веб-сайт</label>
                <input 
                  type="text" 
                  value={editingUni?.website || ''} 
                  onChange={e => setEditingUni({...editingUni, website: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                <input 
                  type="checkbox" 
                  checked={editingUni?.hasDormitory || false} 
                  onChange={e => setEditingUni({...editingUni, hasDormitory: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Жатақхана бар</span>
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <button onClick={() => setShowUniModal(false)} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-500 hover:bg-gray-200 transition-all">Артқа қайту</button>
              <button 
                onClick={handleSaveUni} 
                disabled={isSaving}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Сақталуда...' : 'Растау'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black font-outfit mb-8">Жаңа қызметкер</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Аты-жөні</label>
                <input 
                  type="text" 
                  value={editingStaff?.name || ''} 
                  onChange={e => setEditingStaff({...editingStaff, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                <input 
                  type="email" 
                  value={editingStaff?.email || ''} 
                  onChange={e => setEditingStaff({...editingStaff, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Рөлі</label>
                <select 
                  value={editingStaff?.role || 'teacher'} 
                  onChange={e => setEditingStaff({...editingStaff, role: e.target.value as any})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                >
                  <option value="teacher">Мұғалім (Куратор)</option>
                  <option value="super-admin">Админ</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Рұқсат етілген пәндер</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                  {SUBJECTS.map(sub => (
                    <label key={sub.id} className="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={editingStaff?.permissions?.includes(sub.id) || false}
                        onChange={e => {
                          const perms = [...(editingStaff?.permissions || [])];
                          if (e.target.checked) {
                            if (!perms.includes(sub.id)) perms.push(sub.id);
                          } else {
                            const idx = perms.indexOf(sub.id);
                            if (idx > -1) perms.splice(idx, 1);
                          }
                          setEditingStaff({...editingStaff, permissions: perms});
                        }}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <button onClick={() => setShowStaffModal(false)} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-500 hover:bg-gray-200 transition-all">Артқа қайту</button>
              <button 
                onClick={handleSaveStaff} 
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all"
              >
                Растау
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black font-outfit mb-8">Жаңа оқушы</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Аты-жөні</label>
                <input 
                  type="text" 
                  value={editingStudent?.name || ''} 
                  onChange={e => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                <input 
                  type="email" 
                  value={editingStudent?.email || ''} 
                  onChange={e => setEditingStudent({...editingStudent, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Жазылым түрі</label>
                <select 
                  value={editingStudent?.subscription || 'Free'} 
                  onChange={e => setEditingStudent({...editingStudent, subscription: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                >
                  <option value="Free">Тегін (Free)</option>
                  <option value="Premium">Premium</option>
                  <option value="Ultra">Ultra</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">6 таңбалы код</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={editingStudent?.activationCode || ''} 
                      onChange={e => setEditingStudent({...editingStudent, activationCode: e.target.value.toUpperCase()})}
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none font-mono"
                      placeholder="123456"
                    />
                    <button 
                      onClick={() => {
                        const code = Math.floor(100000 + Math.random() * 900000).toString();
                        setEditingStudent({...editingStudent, activationCode: code});
                      }}
                      className="px-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                      title="Код генерациялау"
                    >
                      <i className="fas fa-sync-alt text-xs"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Аяқталу уақыты</label>
                  <input 
                    type="date" 
                    value={editingStudent?.subscriptionExpiresAt?.split('T')[0] || ''} 
                    onChange={e => setEditingStudent({...editingStudent, subscriptionExpiresAt: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Рұқсат етілген пәндер</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                  {SUBJECTS.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        const current = editingStudent?.activeSubjects || [];
                        const next = current.includes(sub.id) 
                          ? current.filter(id => id !== sub.id)
                          : [...current, sub.id];
                        setEditingStudent({...editingStudent, activeSubjects: next});
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        (editingStudent?.activeSubjects || []).includes(sub.id)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-800 text-gray-400 border border-gray-100 dark:border-slate-700'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <button 
                onClick={() => setShowStudentModal(false)} 
                disabled={isSaving}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-500 hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Артқа қайту
              </button>
              <button 
                onClick={handleSaveStudent} 
                disabled={isSaving}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Сақталуда...
                  </>
                ) : 'Растау'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Module Edit Modal */}
      {editingModule && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black font-outfit mb-6">{editingModule.id ? 'Модульді өзгерту' : 'Жаңа модуль қосу'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Модуль атауы</label>
                <input 
                  type="text" 
                  value={editingModule.title || ''} 
                  onChange={e => setEditingModule({...editingModule, title: e.target.value})}
                  placeholder="Мысалы: Бейорганикалық химия"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Апта нөмірі</label>
                <input 
                  type="number" 
                  value={editingModule.weekNumber || ''} 
                  onChange={e => setEditingModule({...editingModule, weekNumber: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setEditingModule(null)} 
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-500 hover:bg-gray-200 transition-all"
              >
                Болдырмау
              </button>
              <button 
                onClick={saveModuleInfo} 
                disabled={isSaving || !editingModule.title}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Сақталуда...' : 'Сақтау'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
