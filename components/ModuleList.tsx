import React, { useMemo, useState } from "react";
import { Module, UserProgress, Subject } from "../types";

interface ModuleListProps {
  user: UserProgress;
  onSelectLesson: (lesson: any) => void;
  modules: Module[];
  subjects: Subject[];
  selectedSubjectId: string | null;
  onSelectSubject: (id: string) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({
  user,
  onSelectLesson,
  modules,
  subjects,
  selectedSubjectId,
  onSelectSubject,
}) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // ✅ safety: user.completedLessons жоқ болса — бос массив
  const completedLessons = useMemo(
    () => (Array.isArray((user as any)?.completedLessons) ? (user as any).completedLessons : []),
    [user]
  );

  // ✅ safety: modules жоқ болса — бос массив
  const safeModules = useMemo(() => {
    const list = Array.isArray(modules) ? modules : [];
    return list.map((m: any) => ({
      ...m,
      lessons: Array.isArray(m?.lessons) ? m.lessons : [],
    }));
  }, [modules]);

  const mySubjects = useMemo(() => {
    const chosen = Array.isArray((user as any)?.chosenElectives) ? (user as any).chosenElectives : [];
    return (Array.isArray(subjects) ? subjects : []).filter((sub: any) => !sub.isElective || chosen.includes(sub.id));
  }, [subjects, user]);

  const toggleModule = (modId: string) => {
    setExpandedModule((prev) => (prev === modId ? null : modId));
  };

  if (!selectedSubjectId) {
    return (
      <div className="space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="px-2">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">
            Дайындық 📚
          </h2>
          <p className="text-gray-500 dark:text-slate-500 text-sm mt-1">
            Оқуды жалғастыру үшін пәнді таңдаңыз.
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              Менің курстарым
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {mySubjects.map((sub: any) => (
              <button
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className="bg-white dark:bg-slate-800 p-6 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all text-left group"
              >
                <div
                  className={`${sub.color ?? "bg-emerald-600"} w-16 h-16 rounded-[24px] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-105 transition-transform`}
                >
                  <i className={`fas ${sub.icon ?? "fa-book"}`}></i>
                </div>

                <div className="flex-1">
                  <h5 className="font-black text-gray-900 dark:text-slate-100 text-lg font-outfit">
                    {sub.name ?? sub.title ?? "Пән"}
                  </h5>
                  <p className="text-[10px] text-gray-400 uppercase font-black">
                    {safeModules.length} модуль
                  </p>
                </div>

                <i className="fas fa-chevron-right text-gray-200 dark:text-slate-700 group-hover:translate-x-1 transition-transform"></i>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      <header className="space-y-2">
        <button
          onClick={() => onSelectSubject("")}
          className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2"
        >
          <i className="fas fa-arrow-left"></i> Пәндерге оралу
        </button>

        <h2 className="text-3xl font-black text-gray-900 dark:text-white font-outfit">
          Оқу жоспары
        </h2>
        <p className="text-sm text-gray-500">
          Модульді басып, сабақтар тізімін көріңіз
        </p>
      </header>

      <div className="space-y-4">
        {safeModules.map((module: any, idx: number) => {
          const lessons = module.lessons as any[];
          const isExpanded = expandedModule === module.id;

          // ✅ safety: lessons бос болса — done=false
          const isDone =
            lessons.length > 0 &&
            lessons.every((l: any) => completedLessons.includes(l.id));

          return (
            <div key={module.id ?? idx} className="space-y-2">
              <button
                onClick={() => toggleModule(module.id)}
                className={`w-full p-6 rounded-[30px] border transition-all flex items-center justify-between text-left ${
                  isExpanded
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]"
                    : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-800 dark:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isExpanded
                        ? "bg-white/20"
                        : "bg-gray-100 dark:bg-slate-900 text-gray-400"
                    }`}
                  >
                    {isDone ? <i className="fas fa-check"></i> : idx + 1}
                  </div>

                  <div>
                    <h4 className="font-black text-sm font-outfit leading-tight">
                      {module.title ?? `Модуль ${idx + 1}`}
                    </h4>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                      {lessons.length} сабақ
                    </span>
                  </div>
                </div>

                <i
                  className={`fas fa-chevron-down transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                ></i>
              </button>

              {isExpanded && (
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-[30px] border border-gray-100 dark:border-slate-800 p-2 space-y-1 animate-in slide-in-from-top duration-300">
                  {lessons.length === 0 ? (
                    <p className="p-6 text-center text-xs font-black text-gray-400 uppercase">
                      Сабақтар әлі қосылмаған
                    </p>
                  ) : (
                    lessons.map((lesson: any, lIdx: number) => {
                      const lDone = completedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id ?? lIdx}
                          onClick={() => onSelectLesson(lesson)}
                          className="w-full p-4 flex items-center gap-4 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all text-left group"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                              lDone ? "text-emerald-500" : "text-gray-400"
                            }`}
                          >
                            {lIdx + 1}.
                          </div>

                          <div className="flex-1">
                            <h5 className="font-bold text-gray-700 dark:text-slate-300 text-sm group-hover:text-emerald-500">
                              {lesson.title ?? `Сабақ ${lIdx + 1}`}
                            </h5>
                            <span className="text-[8px] font-black uppercase text-gray-400">
                              {lesson.isFree ? "Тегін" : "Premium"}
                            </span>
                          </div>

                          <i className="fas fa-play-circle text-gray-200 dark:text-slate-700 group-hover:text-emerald-500 text-lg transition-colors"></i>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleList;
