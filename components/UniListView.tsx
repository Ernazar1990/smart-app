// src/components/UniListView.tsx

import React, { useMemo, useState } from "react";
import type { University, Specialty, UserProgress, InternationalGrant } from "../types";
import { INTERNATIONAL_GRANTS } from "../constants";
import { COMMON_KZ_DOCUMENTS, COMMON_INTL_DOCUMENTS } from "../data/commonAdmission";
import { useUniversities } from "../hooks/useUniversities";

interface UniListViewProps {
  user: UserProgress;
}

const REGIONS = [
  "Алматы қаласы",
  "Астана қаласы",
  "Шымкент қаласы",
  "Ақмола облысы",
  "Ақтөбе облысы",
  "Алматы облысы",
  "Атырау облысы",
  "Шығыс Қазақстан облысы",
  "Жамбыл облысы",
  "Батыс Қазақстан облысы",
  "Қарағанды облысы",
  "Қостанай облысы",
  "Қызылорда облысы",
  "Маңғыстау облысы",
  "Павлодар облысы",
  "Солтүстік Қазақстан облысы",
  "Түркістан облысы",
];

// ⬇️ Бұл тек fallback. Кейін Supabase-та universities кестесін 113+ етіп толтырсаң,
// UI автомат сол тізімді көрсетеді.
const UNIS: University[] = [
  {
    id: "enu",
    name: "Л.Н. Гумилев атындағы Еуразия ұлттық университеті",
    logo: "https://logo.clearbit.com/enu.kz",
    location: "Астана",
    region: "Астана қаласы",
    type: "National",
    specialtiesCount: 51,
    minScore: 105,
    averagePrice: "1 100 000 ₸",
    hasDormitory: true,
    website: "https://enu.kz",
    address: "Сәтбаев көшесі, 2",
    phone: "+7 (7172) 70-95-00",
    contacts: {
      website: "https://enu.kz",
      phone: "+7 (7172) 70-95-00",
    },
    admission: { documentsKZ: COMMON_KZ_DOCUMENTS },
    opportunities: { dormitory: true, exchange: true },
  },
  {
    id: "nu",
    name: "Назарбаев Университеті (NU)",
    logo: "https://logo.clearbit.com/nu.edu.kz",
    location: "Астана",
    region: "Астана қаласы",
    type: "International",
    specialtiesCount: 60,
    minScore: 130,
    averagePrice: "Грант/Ақылы",
    hasDormitory: true,
    website: "https://nu.edu.kz",
    address: "Қабанбай батыр даңғылы, 53",
    phone: "+7 (7172) 70-66-88",
    contacts: {
      website: "https://nu.edu.kz",
      phone: "+7 (7172) 70-66-88",
    },
    admission: { documentsKZ: COMMON_KZ_DOCUMENTS },
    opportunities: { dormitory: true, exchange: true, foundation: true },
  },
  {
    id: "aitu",
    name: "Астана IT университеті",
    logo: "https://logo.clearbit.com/astanait.edu.kz",
    location: "Астана",
    region: "Астана қаласы",
    type: "Private",
    specialtiesCount: 4,
    minScore: 115,
    averagePrice: "1 400 000 ₸",
    hasDormitory: true,
    website: "https://astanait.edu.kz",
    address: "EXPO, Мәңгілік Ел, 55/11",
    phone: "+7 (7172) 64-57-10",
    contacts: {
      website: "https://astanait.edu.kz",
      phone: "+7 (7172) 64-57-10",
    },
    admission: { documentsKZ: COMMON_KZ_DOCUMENTS },
    opportunities: { dormitory: true, exchange: true },
  },
  {
    id: "kaznu",
    name: "Әл-Фараби атындағы Қазақ ұлттық университеті",
    logo: "https://logo.clearbit.com/kaznu.kz",
    location: "Алматы",
    region: "Алматы қаласы",
    type: "National",
    specialtiesCount: 58,
    minScore: 110,
    averagePrice: "1 200 000 ₸",
    hasDormitory: true,
    website: "https://www.kaznu.kz",
    address: "әл-Фараби даңғылы, 71",
    phone: "+7 (727) 377-33-33",
    contacts: {
      website: "https://www.kaznu.kz",
      phone: "+7 (727) 377-33-33",
    },
    admission: { documentsKZ: COMMON_KZ_DOCUMENTS },
    opportunities: { dormitory: true, exchange: true, militaryDept: true },
  },
  {
    id: "satbayev",
    name: "Қ.И. Сәтбаев атындағы Қазақ ұлттық техникалық зерттеу университеті",
    logo: "https://logo.clearbit.com/satbayev.university",
    location: "Алматы",
    region: "Алматы қаласы",
    type: "National",
    specialtiesCount: 25,
    minScore: 95,
    averagePrice: "1 300 000 ₸",
    hasDormitory: true,
    website: "https://satbayev.university",
    address: "Сәтбаев көшесі, 22",
    phone: "+7 (727) 257-71-32",
    contacts: {
      website: "https://satbayev.university",
      phone: "+7 (727) 257-71-32",
    },
    admission: { documentsKZ: COMMON_KZ_DOCUMENTS },
    opportunities: { dormitory: true, exchange: true, militaryDept: true },
  },
    {
    id: "buketov",
    name: "Е.А. Бөкетов атындағы Қарағанды университеті",
    logo: "https://logo.clearbit.com/buketov.edu.kz",
    location: "Қарағанды",
    region: "Қарағанды облысы",
    type: "State",
    specialtiesCount: 40,
    minScore: 85,
    averagePrice: "900 000 ₸",
    hasDormitory: true,
    website: "https://buketov.edu.kz",
    address: "Қарағанды қ.",
    phone: "",
    contacts: {
      website: "https://buketov.edu.kz",
      phone: "",
    },
    admission: { documentsKZ: COMMON_KZ_DOCUMENTS },
    opportunities: { dormitory: true, exchange: true },
  },
  {
    id: "auezov",
    name: "М. Әуезов атындағы Оңтүстік Қазақстан университеті",
    logo: "https://logo.clearbit.com/auezov.edu.kz",
    location: "Шымкент",
    region: "Шымкент қаласы",
    type: "State",
    specialtiesCount: 50,
    minScore: 80,
    averagePrice: "900 000 ₸",
    hasDormitory: true,
    website: "https://auezov.edu.kz",
    address: "Шымкент қ.",
    phone: "",
    contacts: {
      website: "https://auezov.edu.kz",
      phone: "",
    },
    admission: { documentsKZ: COMMON_KZ_DOCUMENTS },
    opportunities: { dormitory: true, exchange: true },
  },
  {
    id: "tou",
    name: "Торайғыров университеті",
    logo: "https://logo.clearbit.com/tou.edu.kz",
    location: "Павлодар",
    region: "Павлодар облысы",
    type: "State",
    specialtiesCount: 35,
    minScore: 75,
    averagePrice: "850 000 ₸",
    hasDormitory: true,
    website: "https://tou.edu.kz",
    address: "Павлодар қ.",
    phone: "",
    contacts: {
      website: "https://tou.edu.kz",
      phone: "",
    },
    admission: { documentsKZ: COMMON_KZ_DOCUMENTS },
    opportunities: { dormitory: true, exchange: true },
  },

];

const SPECIALTIES_DB: Specialty[] = [
  // ЕСКЕРТУ: subject id-лары сенің жобаңда әртүрлі болуы мүмкін.
  // Бұл бет құламасын деп "as any" қолдандым.
  { id: "s1", code: "B057", name: "Ақпараттық технологиялар", subjects: ["math", "phys"], minScore: 110, grants: 2500 } as any,
  { id: "s2", code: "B053", name: "Химия", subjects: ["chem", "bio"], minScore: 95, grants: 800 } as any,
  { id: "s3", code: "B086", name: "Медицина", subjects: ["chem", "bio"], minScore: 125, grants: 1200 } as any,
];

// Helper component for University Logo with Fallback
const UniLogoImage: React.FC<{ uni: University; className?: string }> = ({ uni, className }) => {
  const [error, setError] = useState(false);

  if (error || !uni.logo) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-400 font-black text-2xl`}
      >
        {(uni.name?.trim()?.[0] ?? "U")}
      </div>
    );
  }

  return <img src={uni.logo} alt={uni.name} className={`${className} object-contain`} onError={() => setError(true)} />;
};

const UniListView: React.FC<UniListViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<"all" | "predictor" | "international" | "regions">("all");
  const [search, setSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [userScore, setUserScore] = useState<number>(user.estimatedScore || 0);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [selectedGrant, setSelectedGrant] = useState<InternationalGrant | null>(null);

  const { unis, loading } = useUniversities(UNIS);

  const filteredUnis = useMemo(() => {
    const q = search.toLowerCase();
    return unis.filter((uni) => {
      const name = (uni.name ?? "").toLowerCase();
      const loc = (uni.location ?? "").toLowerCase();
      const matchesSearch = name.includes(q) || loc.includes(q);

      const region = uni.region ?? "";
      const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(region);

      return matchesSearch && matchesRegion;
    });
  }, [unis, search, selectedRegions]);

  const predictions = useMemo(() => {
    if (userScore <= 0) return [];
    const chosen = (user.chosenElectives ?? []) as any[];
    return (SPECIALTIES_DB as any[]).filter((spec) => {
      const subjects: string[] = spec.subjects ?? [];
      const matches = subjects.every((s) => chosen.includes(s));
      const minScore = typeof spec.minScore === "number" ? spec.minScore : 0;
      const scoreDiff = userScore - minScore;
      return matches && scoreDiff >= -15;
    });
  }, [userScore, user.chosenElectives]);

  const toggleRegion = (reg: string) => {
    setSelectedRegions((prev) => (prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]));
  };

  // ----------------------- UNI DETAIL -----------------------
  if (selectedUni) {
    const contacts = selectedUni.contacts ?? {};
    const docsKZ = selectedUni.admission?.documentsKZ?.length ? selectedUni.admission?.documentsKZ : COMMON_KZ_DOCUMENTS;
    const docsIntl = selectedUni.admission?.documentsIntl?.length ? selectedUni.admission?.documentsIntl : COMMON_INTL_DOCUMENTS;
    const opp = selectedUni.opportunities ?? {};

    return (
      <div className="animate-in fade-in space-y-6 pb-24">
        <button
          onClick={() => setSelectedUni(null)}
          className="flex items-center gap-2 text-gray-500 font-bold mb-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 hover:text-emerald-600 transition-all"
        >
          <i className="fas fa-arrow-left"></i> Тізімге оралу
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-[45px] border border-gray-100 dark:border-slate-700 overflow-hidden shadow-xl">
          <div className="h-48 bg-emerald-600 flex items-center justify-center p-10 relative">
            <div className="h-32 w-32 bg-white rounded-[35px] p-4 shadow-2xl flex items-center justify-center overflow-hidden">
              <UniLogoImage uni={selectedUni} className="h-full w-full" />
            </div>
            <div className="absolute bottom-4 right-6 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
              {selectedUni.type ?? "University"}
            </div>
          </div>

          <div className="p-8 space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{selectedUni.name}</h3>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
                {(selectedUni.address ?? "Адрес көрсетілмеген")}, {(selectedUni.location ?? "Қала/өңір")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[35px] text-center border border-gray-100 dark:border-slate-700">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Орташа ақысы</p>
                <p className="text-lg font-black text-emerald-600">{selectedUni.averagePrice ?? "—"}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[35px] text-center border border-gray-100 dark:border-slate-700">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Жатақхана</p>
                <p className="text-lg font-black text-indigo-600">
                  {(selectedUni.hasDormitory ?? opp.dormitory) ? "БАР" : "ЖОҚ"}
                </p>
              </div>
            </div>

            // CONTACTS
<div className="space-y-4">
  <h4 className="font-black text-gray-900 dark:text-white px-2">Байланыс деректері</h4>

  <div className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 space-y-3">
    {(() => {
      // ✅ null/empty-ді алып тастаймыз -> string | undefined
      const websiteRaw = (contacts.website ?? selectedUni.website) ?? undefined;
      const website =
        typeof websiteRaw === "string" && websiteRaw.trim().length > 0
          ? websiteRaw.trim()
          : undefined;

      return website ? (
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 text-emerald-600 hover:opacity-70 transition-opacity"
        >
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
            <i className="fas fa-globe"></i>
          </div>
          <span className="font-bold text-sm truncate">{website}</span>
        </a>
      ) : null;
    })()}

    {contacts.admissionsUrl ? (
      <a
        href={contacts.admissionsUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-4 text-indigo-600 hover:opacity-70 transition-opacity"
      >
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
          <i className="fas fa-file-signature"></i>
        </div>
        <span className="font-bold text-sm truncate">Қабылдау комиссиясы / Admission</span>
      </a>
    ) : null}

    {(contacts.phone ?? selectedUni.phone) ? (
      <div className="flex items-center gap-4 text-gray-700 dark:text-slate-200">
        <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
          <i className="fas fa-phone"></i>
        </div>
        <span className="font-bold text-sm">{(contacts.phone ?? selectedUni.phone) as string}</span>
      </div>
    ) : null}

    {contacts.admissionsPhone ? (
      <div className="flex items-center gap-4 text-gray-700 dark:text-slate-200">
        <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
          <i className="fas fa-headset"></i>
        </div>
        <span className="font-bold text-sm">Қабылдау: {contacts.admissionsPhone}</span>
      </div>
    ) : null}

    {contacts.email ? (
      <div className="flex items-center gap-4 text-gray-700 dark:text-slate-200">
        <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
          <i className="fas fa-envelope"></i>
        </div>
        <span className="font-bold text-sm">{contacts.email}</span>
      </div>
    ) : null}

    {contacts.admissionsEmail ? (
      <div className="flex items-center gap-4 text-gray-700 dark:text-slate-200">
        <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
          <i className="fas fa-inbox"></i>
        </div>
        <span className="font-bold text-sm">Қабылдау: {contacts.admissionsEmail}</span>
      </div>
    ) : null}
  </div>
</div>

            {/* DOCUMENTS */}
            <div className="space-y-4">
              <h4 className="font-black text-gray-900 dark:text-white px-2">Қажетті құжаттар</h4>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 space-y-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Қазақстан ЖОО (әдетте)
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-slate-200 font-medium">
                    {docsKZ.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Шетелдік ЖОО (жалпы)
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-slate-200 font-medium">
                    {docsIntl.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                {(selectedUni.admission?.notes?.length ?? 0) > 0 && (
                  <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ескертпелер</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-slate-200 font-medium">
                      {selectedUni.admission!.notes!.map((d: string, i: number) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------- GRANT DETAIL -----------------------
  if (selectedGrant) {
    const top = (selectedGrant as any).topUnis ?? [];
    return (
      <div className="animate-in slide-in-from-bottom space-y-6 pb-24">
        <button
          onClick={() => setSelectedGrant(null)}
          className="flex items-center gap-2 text-gray-500 font-black mb-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700"
        >
          <i className="fas fa-arrow-left"></i> Гранттарға оралу
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-[45px] border border-gray-100 dark:border-slate-700 overflow-hidden shadow-xl">
          <div className="h-56 bg-slate-900 p-10 flex flex-col justify-end text-white relative">
            <h3 className="text-3xl font-black font-outfit">{(selectedGrant as any).title ?? "Грант"}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Үкіметаралық гранттар бойынша ресми ақпарат: bolashak.gov.kz
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[35px] border border-indigo-100 dark:border-indigo-800/30">
              <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed">
                Құжаттар мен шарттар әр ел бойынша өзгереді. Ресми талаптар “Үкіметаралық гранттар” бөлімінде жарияланады.
              </p>
            </div>

            {top.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] px-2">
                  Топ ЖОО
                </h4>
                <div className="space-y-2">
                  {top.map((uniName: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm"
                    >
                      <div className="w-8 h-8 bg-gray-50 dark:bg-slate-900 rounded-lg flex items-center justify-center font-black text-xs text-indigo-500">
                        {i + 1}
                      </div>
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{uniName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[35px] border border-amber-100 dark:border-amber-800/50">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em] mb-2">
                Шетелге жалпы құжаттар (бағдарлау)
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-amber-900/80 dark:text-amber-200 font-medium">
                {COMMON_INTL_DOCUMENTS.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <a
              href="https://bolashak.gov.kz"
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center bg-gray-900 text-white py-5 rounded-[35px] font-black shadow-lg"
            >
              ТОЛЫҒЫРАҚ (BOLASHAK.GOV.KZ)
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------- LIST VIEW -----------------------
  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      <header className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white font-outfit">Uni Hub 🎓</h2>
          <p className="text-gray-500 dark:text-slate-500 text-sm">
            Университеттер, құжаттар, мүмкіндіктер{loading ? " • Жүктелуде..." : ""}
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === "regions" ? "all" : "regions")}
          className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all shadow-sm ${
            activeTab === "regions"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400"
          }`}
        >
          <i className="fas fa-sliders"></i>
        </button>
      </header>

      {activeTab === "regions" && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-[30px] border border-gray-100 dark:border-slate-700 mx-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Өңір бойынша сүзгі</p>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => toggleRegion(r)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                  selectedRegions.includes(r)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-[25px] border border-gray-100 dark:border-slate-700 shadow-sm">
        {[
          { id: "all", label: "Университеттер" },
          { id: "predictor", label: "Мүмкіндіктер" },
          { id: "international", label: "Шетелдік гранттар" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-3.5 rounded-[20px] text-[8px] font-black uppercase tracking-widest transition-all ${
              activeTab === t.id ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 dark:text-slate-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "all" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="relative group">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500"></i>
            <input
              type="text"
              placeholder="Университет атауы немесе қала..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[30px] shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 font-bold transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredUnis.map((uni) => (
              <button
                key={uni.id}
                onClick={() => setSelectedUni(uni)}
                className="bg-white dark:bg-slate-800 p-5 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-5 text-left hover:border-emerald-500 transition-all group"
              >
                <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 p-3 rounded-[28px] flex items-center justify-center border border-gray-100 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                  <UniLogoImage uni={uni} className="max-h-full max-w-full" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-black text-gray-900 dark:text-white text-base leading-snug line-clamp-2 font-outfit">
                    {uni.name}
                  </h4>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    {(uni.location ?? "—")} • {(uni.region ?? "—")}
                  </span>
                </div>
                <i className="fas fa-chevron-right text-gray-200 dark:text-slate-700 px-2 group-hover:translate-x-1 transition-transform"></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "international" && (
        <div className="space-y-6 animate-in slide-in-from-right px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(INTERNATIONAL_GRANTS as any[]).map((grant) => (
              <button
                key={grant.id}
                onClick={() => setSelectedGrant(grant as any)}
                className="relative p-6 rounded-[35px] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm text-left hover:border-emerald-500 transition-all"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Үкіметаралық грант</p>
                <h4 className="text-xl font-black text-gray-900 dark:text-white">{grant.title ?? "Grant"}</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {grant.description ?? ""}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-[40px] border border-amber-100 dark:border-amber-800/50 text-center space-y-4">
            <i className="fas fa-info-circle text-amber-500 text-3xl"></i>
            <h5 className="text-lg font-black text-amber-900 dark:text-amber-200 font-outfit">Үкіметаралық гранттар туралы</h5>
            <p className="text-sm text-amber-800/80 dark:text-amber-300 font-medium leading-relaxed">
              ҚР мен шет елдер арасындағы келісім бойынша беріледі. Ресми құжаттар/елдер тізімі: <b>bolashak.gov.kz</b>
            </p>
          </div>
        </div>
      )}

      {activeTab === "predictor" && (
        <div className="space-y-8 animate-in slide-in-from-bottom px-2">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-8 rounded-[45px] text-white shadow-xl relative overflow-hidden">
            <i className="fas fa-chart-line absolute -right-6 -top-6 text-9xl opacity-10"></i>
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-black font-outfit">Грант Болжағыш</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Болжамды балл</span>
                  <span className="text-3xl font-black font-outfit">{userScore}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="140"
                  value={userScore}
                  onChange={(e) => setUserScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-white/20 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700">
            <h4 className="font-black text-gray-900 dark:text-white mb-4">Саған жақын мамандықтар</h4>
            {predictions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">Пән комбинациясы немесе балл бойынша жақын ұсыныс табылмады.</p>
            ) : (
              <div className="space-y-3">
                {predictions.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-black text-gray-900 dark:text-white">
                        {p.code} — {p.name}
                      </p>
                      <span className="text-[10px] font-black text-emerald-600 uppercase">мин: {p.minScore}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Грант саны: {p.grants}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniListView;
