import React, { useMemo } from "react";
import { UserMarathon, UserProgress } from "../types";

interface MarathonViewProps {
  user: UserProgress;
  onUpdateMarathon: (m: UserMarathon) => void;
}

const MOTIVATIONAL_QUOTES = [
  "Күн сайын аздап — үлкен нәтиже.",
  "Тұрақтылық — басты күш.",
  "Бүгін жаса — ертең жеңіл болады.",
  "Сабыр мен еңбек бәрін жеңеді.",
];

export default function MarathonView({ user, onUpdateMarathon }: MarathonViewProps) {
  const marathon = user.marathon;

  // ✅ қауіпсіз дефолттар
  const isActive = !!(marathon?.isActive ?? marathon?.active);
  const completedDays = marathon?.completedDays ?? [];
  const currentStreak = marathon?.currentStreak ?? user.streak ?? 0;
  const duration = marathon?.duration ?? 30;
  const startIso = marathon?.startDate ?? marathon?.startAt ?? new Date().toISOString();
  const start = new Date(startIso);

  const diffDays = useMemo(() => {
    const now = new Date();
    const ms = now.getTime() - start.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }, [startIso]);

  const progress = useMemo(() => {
    const p = Math.min((completedDays.length / duration) * 100, 100);
    return Number.isFinite(p) ? p : 0;
  }, [completedDays.length, duration]);

  const quote = useMemo(() => {
    const idx = (currentStreak || 0) % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[idx];
  }, [currentStreak]);

  const startMarathon = () => {
    const next: UserMarathon = {
      isActive: true,
      active: true,
      startDate: new Date().toISOString(),
      startAt: new Date().toISOString(),
      duration: 30,
      completedDays: [],
      currentStreak: 0,
    };
    onUpdateMarathon(next);
  };

  const stopMarathon = () => {
    if (!marathon) return;
    onUpdateMarathon({ ...marathon, isActive: false, active: false });
  };

  const markTodayDone = () => {
    if (!marathon) return;

    const day = diffDays + 1;

    const list = marathon.completedDays ?? [];
    if (list.includes(day)) return;

    const next: UserMarathon = {
      ...marathon,
      completedDays: [...list, day],
      currentStreak: (marathon.currentStreak ?? 0) + 1,
      isActive: true,
      active: true,
    };

    onUpdateMarathon(next);
  };

  if (!marathon || !isActive) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
            Марафон
          </h2>
        </header>

        <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm text-center space-y-4">
          <p className="text-slate-500 font-bold">Марафон әлі басталмаған.</p>
          <button
            onClick={startMarathon}
            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
          >
            Марафонды бастау
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
            Марафон
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{quote}</p>
        </div>

        <button
          onClick={stopMarathon}
          className="bg-red-50 text-red-700 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-200 hover:bg-red-500 hover:text-white transition-all"
        >
          Тоқтату
        </button>
      </header>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-[30px] p-6 border border-gray-100 dark:border-slate-700">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ұзақтығы</p>
            <h2 className="text-3xl font-black mt-2">{duration} күн</h2>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-[30px] p-6 border border-gray-100 dark:border-slate-700">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ағымдағы серия</p>
            <h2 className="text-3xl font-black mt-2">{currentStreak} күн</h2>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-[30px] p-6 border border-gray-100 dark:border-slate-700">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Прогресс</p>
            <h2 className="text-3xl font-black mt-2">{Math.round(progress)}%</h2>
          </div>
        </div>

        <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden">
          <div className="h-3 bg-emerald-600" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={markTodayDone}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
          >
            Бүгінгі күн орындалды
          </button>

          <div className="flex-1 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 text-sm font-bold text-slate-500">
            Басталған күн:{" "}
            <span className="text-slate-800 dark:text-slate-200">
              {start.toLocaleDateString()}
            </span>
            <br />
            Орындалған күндер:{" "}
            <span className="text-emerald-600 dark:text-emerald-400">{completedDays.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
