
import React, { useState, useMemo } from 'react';
import { University, Specialty, UserProgress, InternationalGrant } from '../types';
import { INTERNATIONAL_GRANTS } from '../constants';

interface UniListViewProps {
  user: UserProgress;
}

const REGIONS = [
  "Алматы қаласы", "Астана қаласы", "Шымкент қаласы", 
  "Ақмола облысы", "Ақтөбе облысы", "Алматы облысы", 
  "Атырау облысы", "Шығыс Қазақстан облысы", "Жамбыл облысы", 
  "Батыс Қазақстан облысы", "Қарағанды облысы", "Қостанай облысы", 
  "Қызылорда облысы", "Маңғыстау облысы", "Павлодар облысы", 
  "Солтүстік Қазақстан облысы", "Түркістан облысы"
];

const UNIS: University[] = [
  { id: 'enu', name: 'Л.Н. Гумилев атындағы Еуразия ұлттық университеті', logo: 'https://logo.clearbit.com/enu.kz', location: 'Астана', region: 'Астана қаласы', type: 'National', specialtiesCount: 51, minScore: 105, averagePrice: '1 100 000 ₸', hasDormitory: true, website: 'https://enu.kz', address: 'Сәтбаев көшесі, 2', phone: '+7 (7172) 70-95-00' },
  { id: 'nu', name: 'Назарбаев Университеті (NU)', logo: 'https://logo.clearbit.com/nu.edu.kz', location: 'Астана', region: 'Астана қаласы', type: 'International', specialtiesCount: 60, minScore: 130, averagePrice: 'Грант/Ақылы', hasDormitory: true, website: 'https://nu.edu.kz', address: 'Қабанбай батыр даңғылы, 53', phone: '+7 (7172) 70-66-88' },
  { id: 'aitu', name: 'Астана IT университеті', logo: 'https://logo.clearbit.com/astanait.edu.kz', location: 'Астана', region: 'Астана қаласы', type: 'Private', specialtiesCount: 4, minScore: 115, averagePrice: '1 400 000 ₸', hasDormitory: true, website: 'https://astanait.edu.kz', address: 'EXPO, Мәңгілік Ел, 55/11', phone: '+7 (7172) 64-57-10' },
  { id: 'kazguu', name: 'М. Нарикбаев атындағы КАЗГЮУ Университеті', logo: 'https://logo.clearbit.com/kazguu.kz', location: 'Астана', region: 'Астана қаласы', type: 'Private', specialtiesCount: 9, minScore: 110, averagePrice: '1 800 000 ₸', hasDormitory: true, website: 'https://kazguu.kz', address: 'Қорғалжын тас жолы, 8', phone: '+7 (7172) 70-30-30' },
  { id: 'amu', name: 'Астана Медициналық университеті', logo: 'https://logo.clearbit.com/amu.kz', location: 'Астана', region: 'Астана қаласы', type: 'State', specialtiesCount: 3, minScore: 125, averagePrice: '1 500 000 ₸', hasDormitory: true, website: 'https://amu.kz', address: 'Бейбітшілік к-сі, 49А', phone: '+7 (7172) 53-94-24' },
  { id: 'kazatu', name: 'С.Сейфуллин атындағы Қазақ агротехникалық университеті', logo: 'https://logo.clearbit.com/kazatu.edu.kz', location: 'Астана', region: 'Астана қаласы', type: 'National', specialtiesCount: 24, minScore: 80, averagePrice: '900 000 ₸', hasDormitory: true, website: 'https://kazatu.kz', address: 'Жеңіс даңғылы, 62', phone: '+7 (7172) 31-75-47' },
  { id: 'kaznu', name: 'Әл-Фараби атындағы Қазақ ұлттық университеті', logo: 'https://logo.clearbit.com/kaznu.kz', location: 'Алматы', region: 'Алматы қаласы', type: 'National', specialtiesCount: 58, minScore: 110, averagePrice: '1 200 000 ₸', hasDormitory: true, website: 'https://www.kaznu.kz', address: 'әл-Фараби даңғылы, 71', phone: '+7 (727) 377-33-33' },
  { id: 'satbayev', name: 'Қ.И. Сәтбаев атындағы Қазақ ұлттық техникалық зерттеу университеті', logo: 'https://logo.clearbit.com/satbayev.university', location: 'Алматы', region: 'Алматы қаласы', type: 'National', specialtiesCount: 25, minScore: 95, averagePrice: '1 300 000 ₸', hasDormitory: true, website: 'https://satbayev.university', address: 'Сәтбаев көшесі, 22', phone: '+7 (727) 257-71-32' },
  { id: 'kbtu', name: 'Қазақстан-Британ техникалық университеті (KBTU)', logo: 'https://logo.clearbit.com/kbtu.edu.kz', location: 'Алматы', region: 'Алматы қаласы', type: 'Private', specialtiesCount: 10, minScore: 115, averagePrice: '2 400 000 ₸', hasDormitory: true, website: 'https://kbtu.edu.kz', address: 'Төле би көшесі, 59', phone: '+7 (727) 357-42-42' },
  { id: 'iitu', name: 'Халықаралық ақпараттық технологиялар университеті (IITU)', logo: 'https://logo.clearbit.com/iitu.edu.kz', location: 'Алматы', region: 'Алматы қаласы', type: 'Private', specialtiesCount: 6, minScore: 112, averagePrice: '1 800 000 ₸', hasDormitory: true, website: 'https://iitu.edu.kz', address: 'Манас көшесі, 34/1', phone: '+7 (727) 244-51-01' },
];

const SPECIALTIES_DB: Specialty[] = [
  { id: 's1', code: 'B057', name: 'Ақпараттық технологиялар', subjects: ['math', 'phys'], minScore: 110, grants: 2500 },
  { id: 's2', code: 'B053', name: 'Химия', subjects: ['chem', 'bio'], minScore: 95, grants: 800 },
  { id: 's3', code: 'B086', name: 'Медицина', subjects: ['chem', 'bio'], minScore: 125, grants: 1200 },
];

// Helper component for University Logo with Fallback
const UniLogoImage: React.FC<{ uni: University, className?: string }> = ({ uni, className }) => {
  const [error, setError] = useState(false);

  if (error || !uni.logo) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-400 font-black text-2xl`}>
        {uni.name.charAt(0)}
      </div>
    );
  }

  return (
    <img 
      src={uni.logo} 
      alt={uni.name} 
      className={`${className} object-contain`} 
      onError={() => setError(true)}
    />
  );
};

const UniListView: React.FC<UniListViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'predictor' | 'international' | 'regions'>('all');
  const [search, setSearch] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [userScore, setUserScore] = useState<number>(user.estimatedScore || 0);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [selectedGrant, setSelectedGrant] = useState<InternationalGrant | null>(null);

  const filteredUnis = useMemo(() => {
    return UNIS.filter(uni => {
      const matchesSearch = uni.name.toLowerCase().includes(search.toLowerCase()) || 
                          uni.location.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(uni.region);
      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegions]);

  const predictions = useMemo(() => {
    if (userScore <= 0) return [];
    return SPECIALTIES_DB.filter(spec => {
      const matchesSubjects = spec.subjects.every(s => user.chosenElectives.includes(s));
      const scoreDiff = userScore - spec.minScore;
      return matchesSubjects && scoreDiff >= -15; 
    });
  }, [userScore, user.chosenElectives]);

  const toggleRegion = (reg: string) => {
    setSelectedRegions(prev => 
      prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg]
    );
  };

  if (selectedUni) {
    return (
      <div className="animate-in fade-in space-y-6 pb-24">
        <button onClick={() => setSelectedUni(null)} className="flex items-center gap-2 text-gray-500 font-bold mb-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 hover:text-emerald-600 transition-all">
          <i className="fas fa-arrow-left"></i> Тізімге оралу
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-[45px] border border-gray-100 dark:border-slate-700 overflow-hidden shadow-xl">
          <div className="h-48 bg-emerald-600 flex items-center justify-center p-10 relative">
             <div className="h-32 w-32 bg-white rounded-[35px] p-4 shadow-2xl flex items-center justify-center overflow-hidden">
                <UniLogoImage uni={selectedUni} className="h-full w-full" />
             </div>
             <div className="absolute bottom-4 right-6 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
               {selectedUni.type}
             </div>
          </div>
          <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{selectedUni.name}</h3>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">{selectedUni.address}, {selectedUni.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[35px] text-center border border-gray-100 dark:border-slate-700">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Орташа ақысы</p>
                <p className="text-lg font-black text-emerald-600">{selectedUni.averagePrice}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[35px] text-center border border-gray-100 dark:border-slate-700">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Жатақхана</p>
                <p className="text-lg font-black text-indigo-600">{selectedUni.hasDormitory ? 'БАР' : 'ЖОҚ'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-gray-900 dark:text-white px-2">Байланыс деректері</h4>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 space-y-4">
                <a href={selectedUni.website} target="_blank" className="flex items-center gap-4 text-emerald-600 hover:opacity-70 transition-opacity">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center"><i className="fas fa-globe"></i></div>
                  <span className="font-bold text-sm truncate">{selectedUni.website}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedGrant) {
    return (
      <div className="animate-in slide-in-from-bottom space-y-6 pb-24">
        <button onClick={() => setSelectedGrant(null)} className="flex items-center gap-2 text-gray-500 font-black mb-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> Гранттарға оралу
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-[45px] border border-gray-100 dark:border-slate-700 overflow-hidden shadow-xl">
           <div className={`h-56 bg-gradient-to-br ${selectedGrant.color} p-10 flex flex-col justify-end text-white relative`}>
              <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                Межправительственный грант
              </div>
              <h3 className="text-4xl font-black font-outfit uppercase">{selectedGrant.country}</h3>
           </div>
           
           <div className="p-8 space-y-8">
             <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[35px] border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed italic">
                  "В рамках Соглашения о сотрудничестве в области образования казахстанцам ежегодно выделяются гранты по следующим программам..."
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-3xl">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Грант саны</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{selectedGrant.totalGrants}</p>
               </div>
               <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-3xl">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Оқу тілі</p>
                  <p className="text-sm font-black text-emerald-600">{selectedGrant.language}</p>
               </div>
               <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-3xl col-span-1 md:col-span-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Дедлайн</p>
                  <p className="text-sm font-black text-orange-500 uppercase">{selectedGrant.deadline}</p>
               </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] px-2">Топ-5 ЖОО (QS 2026)</h4>
                <div className="space-y-2">
                  {selectedGrant.topUnis.map((uniName, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm">
                       <div className="w-8 h-8 bg-gray-50 dark:bg-slate-900 rounded-lg flex items-center justify-center font-black text-xs text-indigo-500">{i+1}</div>
                       <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{uniName}</p>
                    </div>
                  ))}
                </div>
             </div>
             
             <a href="https://bolashak.gov.kz" target="_blank" className="block w-full text-center bg-gray-900 text-white py-5 rounded-[35px] font-black shadow-lg">
                ТОЛЫҒЫРАҚ (BOLASHAK.GOV.KZ)
             </a>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      <header className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">Uni Hub 🎓</h2>
          <p className="text-gray-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Гранттар мен университеттер</p>
        </div>
        <button 
          onClick={() => setActiveTab(activeTab === 'regions' ? 'all' : 'regions')} 
          className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-all shadow-sm ${
            activeTab === 'regions' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'
          }`}
        >
          <i className="fas fa-sliders text-xs"></i>
        </button>
      </header>

      <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
        {[
          { id: 'all', label: 'Университеттер' },
          { id: 'predictor', label: 'Мүмкіндіктер' },
          { id: 'international', label: 'Шетелдік гранттар' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-2.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all ${
              activeTab === t.id ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 dark:text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'all' && (
         <div className="space-y-4 animate-in fade-in">
            <div className="relative group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500 text-xs"></i>
              <input 
                type="text" 
                placeholder="Университет атауы немесе қала..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-xs font-bold transition-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredUnis.map(uni => (
                <button 
                  key={uni.id}
                  onClick={() => setSelectedUni(uni)}
                  className="bg-white dark:bg-slate-800 p-3 rounded-[25px] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 text-left hover:border-emerald-500 transition-all group"
                >
                  <div className="w-14 h-14 bg-gray-50 dark:bg-slate-900 p-2 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                    <UniLogoImage uni={uni} className="max-h-full max-w-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 dark:text-white text-xs leading-snug line-clamp-2 font-outfit">{uni.name}</h4>
                    <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{uni.location}</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-200 dark:text-slate-700 px-1 group-hover:translate-x-1 transition-transform text-[10px]"></i>
                </button>
              ))}
            </div>
         </div>
      )}

      {activeTab === 'international' && (
        <div className="space-y-6 animate-in slide-in-from-right">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
              {INTERNATIONAL_GRANTS.map((grant) => (
                <button
                  key={grant.id}
                  onClick={() => setSelectedGrant(grant)}
                  className="relative h-64 rounded-[40px] overflow-hidden group shadow-lg"
                >
                  <img src={grant.image} alt={grant.country} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${grant.color} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-left">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">{grant.totalGrants}</p>
                     <h4 className="text-2xl font-black font-outfit uppercase">{grant.country}</h4>
                     <p className="text-[9px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                       <i className="far fa-calendar"></i> Дедлайн: {grant.deadline}
                     </p>
                  </div>
                </button>
              ))}
           </div>
           
           <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-[40px] border border-amber-100 dark:border-amber-800/50 mx-2 text-center space-y-4">
              <i className="fas fa-info-circle text-amber-500 text-3xl"></i>
              <h5 className="text-lg font-black text-amber-900 dark:text-amber-200 font-outfit">Үкіметаралық гранттар туралы</h5>
              <p className="text-sm text-amber-800/80 dark:text-amber-300 font-medium leading-relaxed">
                Бұл гранттар ҚР Ғылым және жоғары білім министрлігі мен шет елдер арасындағы келісім бойынша беріледі. 
                Толық құжаттар тізімі <b>Bolashak.gov.kz</b> сайтында жарияланады.
              </p>
           </div>
        </div>
      )}

      {activeTab === 'predictor' && (
        <div className="space-y-8 animate-in slide-in-from-bottom">
           <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-8 rounded-[45px] text-white shadow-xl relative overflow-hidden">
             <i className="fas fa-chart-line absolute -right-6 -top-6 text-9xl opacity-10"></i>
             <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-black font-outfit">Грант Болжағыш</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Болжамды балл</span>
                    <span className="text-3xl font-black font-outfit">{userScore}</span>
                  </div>
                  <input type="range" min="50" max="140" value={userScore} onChange={e => setUserScore(parseInt(e.target.value))} className="w-full accent-emerald-400 h-2 bg-white/20 rounded-full" />
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniListView;
