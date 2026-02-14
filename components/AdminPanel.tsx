import React, { useMemo, useState, useEffect } from "react";
import { SUBJECTS } from "../constants";
import type { Subject, SubjectId } from "../constants";
import type { Module, Lesson, AppView, StaffMember, UserProgress } from "../types";

// ✅ Осы 3 компонент сенде болуы керек:
import AdminPostsManager from "./AdminPostsManager";
import AdminUniversitiesManager from "./AdminUniversitiesManager";
import AdminAIHubManager from "./AdminAIHubManager";
import AdminUsersManager from "./AdminUsersManager";

interface AdminPanelProps {
  currentView?: AppView;
  setView: (view: AppView) => void;
  allModules: Record<string, Module[]>;
  setAllModules: React.Dispatch<React.SetStateAction<Record<string, Module[]>>>;
  staffList: StaffMember[];
  setStaffList: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  user: UserProgress;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  currentView,
  setView,
  allModules,
  setAllModules,
  staffList,
  setStaffList,
  user,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonDraft, setLessonDraft] = useState<Lesson | null>(null);

  useEffect(() => {
    if (editingLesson) setLessonDraft({ ...editingLesson });
    else setLessonDraft(null);
  }, [editingLesson]);
  const [editStep, setEditStep] = useState<0 | 1 | 2 | 3 | 4>(0);
useEffect(() => {
  if (editingLesson) setEditStep(0);
}, [editingLesson]);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffSubjects, setNewStaffSubjects] = useState<SubjectId[]>([]);
  
  // ✅ super-admin логикасы
  const isSuperAdmin =
    user?.role === "super-admin" || user?.email === "nur.abuuadi@gmail.com";

  // ✅ Қай пәндер көрінеді
  const allowedSubjects = useMemo(() => {
    if (isSuperAdmin) return SUBJECTS;
    return SUBJECTS.filter((s: Subject) => user?.permissions?.includes(s.id));
  }, [user, isSuperAdmin]);

  // ✅ Актив модуль
  const activeModule = useMemo(() => {
    if (!selectedSubject || !selectedModuleId) return null;
    return (
      (allModules[selectedSubject.id] || []).find(
        (m: Module) => m.id === selectedModuleId
      ) || null
    );
  }, [allModules, selectedSubject, selectedModuleId]);

  // ------------------ MODULE CRUD ------------------
  const handleAddModule = () => {
    if (!isSuperAdmin || !selectedSubject || !newModuleTitle.trim()) return;

    const currentList = allModules[selectedSubject.id] || [];
    const nextNumber = currentList.length + 1;

    const newModule: Module = {
      id: `${selectedSubject.id}-m${nextNumber}-${Date.now()}`,
      title: `${nextNumber}. ${newModuleTitle.trim()}`,
      weekNumber: nextNumber,
      lessons: [],
    };

    const updated = {
      ...allModules,
      [selectedSubject.id]: [...currentList, newModule],
    };
    setAllModules(updated);
    localStorage.setItem("smart_modules_db", JSON.stringify(updated));
    setNewModuleTitle("");
    setIsAddingModule(false);
    setSelectedModuleId(newModule.id);
  };

  const handleDeleteModule = (modId: string) => {
    if (!isSuperAdmin || !selectedSubject) return;
    if (
      !window.confirm(
        "Бұл модульді және оның барлық сабақтарын өшіруді растайсыз ба?"
      )
    )
      return;

    const updated = {
      ...allModules,
      [selectedSubject.id]: (allModules[selectedSubject.id] || []).filter(
        (m: Module) => m.id !== modId
      ),
    };

    setAllModules(updated);
    localStorage.setItem("smart_modules_db", JSON.stringify(updated));
    if (selectedModuleId === modId) setSelectedModuleId(null);
  };

  const handleAddLesson = () => {
    if (!isSuperAdmin || !selectedModuleId || !selectedSubject) return;
    const title = prompt("Жаңа сабақ атауы:");
    if (!title) return;

    const newLesson: Lesson = {
  id: `L-${Date.now()}`,
  title,
  content: "",
  videoUrl: "",
  transcript: "",
  practiceHtml: "",
  reinforcement: {
  enabled: true,
  questions: [],
  passScore: 70,
},
  homeworkHtml: "",
  homeworkPdfUrl: "",
  homework: [],
  fixesVideoUrl: "",
  fixesPdfUrl: "",
};

    const updated = {
      ...allModules,
      [selectedSubject.id]: (allModules[selectedSubject.id] || []).map(
        (m: Module) =>
          m.id === selectedModuleId
            ? { ...m, lessons: [...m.lessons, newLesson] }
            : m
      ),
    };

    setAllModules(updated);
    localStorage.setItem("smart_modules_db", JSON.stringify(updated));
    setEditingLesson(newLesson);
  };

  const handleSaveLesson = () => {
  if (!lessonDraft || !selectedModuleId || !selectedSubject) return;

  const updated = {
    ...allModules,
    [selectedSubject.id]: (allModules[selectedSubject.id] || []).map((m: Module) => {
      if (m.id !== selectedModuleId) return m;

      return {
        ...m,
        lessons: m.lessons.map((l: Lesson) => (l.id === lessonDraft.id ? lessonDraft : l)),
      };
    }),
  };

  setAllModules(updated);
  localStorage.setItem("smart_modules_db", JSON.stringify(updated));
  alert("Өзгерістер сақталды!");
  setEditingLesson(null); // модалды жабу
};

  // ------------------ STAFF CRUD ------------------
  const handleAddStaff = () => {
    if (!isSuperAdmin) return;
    if (!newStaffEmail || !newStaffName || newStaffSubjects.length === 0) return;

    const newMember: StaffMember = {
      email: newStaffEmail.toLowerCase().trim(),
      name: newStaffName.trim(),
      role: "teacher",
      permissions: newStaffSubjects as any, // types.ts permissions string[] болса
    };

    const updated = [...staffList, newMember];
    setStaffList(updated);
    localStorage.setItem("smart_staff_db", JSON.stringify(updated));

    setNewStaffEmail("");
    setNewStaffName("");
    setNewStaffSubjects([]);
  };

  const handleRemoveStaff = (email: string) => {
    if (!isSuperAdmin || email === "nur.abuuadi@gmail.com") return;
    if (!window.confirm("Бұл қызметкерді өшіруді растайсыз ба?")) return;

    const updated = staffList.filter((s: StaffMember) => s.email !== email);
    setStaffList(updated);
    localStorage.setItem("smart_staff_db", JSON.stringify(updated));
  };

  const subjectBadge = (s: Subject) => {
    // Қарапайым белгі (icon/color жоқ болса да UI бұзылмайды)
    return (
      <div className="w-14 h-14 rounded-[18px] bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-lg">
        {s.title?.slice(0, 1) ?? "S"}
      </div>
    );
  };
{/* ===================== USERS ===================== */}
{currentView === "admin-users" && (
  <div className="space-y-8">
    <header className="flex items-center justify-between">
      <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
        Оқушылар
      </h2>
      <button
        onClick={() => setView("admin")}
        className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors"
      >
        ← Артқа
      </button>
    </header>

    <AdminUsersManager />
  </div>
)}

  return (
    <div className="pb-20 animate-in fade-in space-y-8">
      {/* ===================== ADMIN DASHBOARD ===================== */}
      {currentView === "admin" && (
        <div className="space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
                Басқару панелі
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Рөлі:{" "}
                <span className="text-indigo-600">
                  {isSuperAdmin
                    ? "Super Admin (Full Access)"
                    : "Teacher (Restricted)"}
                </span>
              </p>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => setView("admin-content")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
              >
                Контент
              </button>

              <button
                onClick={() => setView("admin-posts")}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
              >
                Лента
              </button>

              <button
                onClick={() => setView("admin-universities")}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
              >
                ЖОО
              </button>

              <button
                onClick={() => setView("admin-aihub")}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
              >
                AI Hub
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => setView("admin-staff")}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                >
                  Қызметкерлер
                </button>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                Рұқсат етілген пәндер
              </h4>
              <div className="flex flex-wrap gap-2">
                {allowedSubjects.map((s: Subject) => (
                  <span
                    key={s.id}
                    className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                  >
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== POSTS ===================== */}
      {currentView === "admin-posts" && (
        <div className="space-y-8">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
              Лента (мақалалар)
            </h2>
            <button
              onClick={() => setView("admin")}
              className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors"
            >
              ← Артқа
            </button>
          </header>

          <AdminPostsManager />
        </div>
      )}

      {/* ===================== UNIVERSITIES ===================== */}
      {currentView === "admin-universities" && (
        <div className="space-y-8">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
              ЖОО менеджері
            </h2>
            <button
              onClick={() => setView("admin")}
              className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors"
            >
              ← Артқа
            </button>
          </header>

          <AdminUniversitiesManager />
        </div>
      )}

      {/* ===================== AI HUB ===================== */}
      {currentView === "admin-aihub" && (
        <div className="space-y-8">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
              AI Hub Control
            </h2>
            <button
              onClick={() => setView("admin")}
              className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors"
            >
              ← Артқа
            </button>
          </header>

          <AdminAIHubManager />
        </div>
      )}

      {/* ===================== CONTENT (COURSES) ===================== */}
      {currentView === "admin-content" && (
        <div className="space-y-8">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
              Курстарды басқару
            </h2>
            <button
              onClick={() => setView("admin")}
              className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors"
            >
              ← Артқа
            </button>
          </header>

          {!selectedSubject ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allowedSubjects.map((sub: Subject) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub)}
                  className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-4 hover:border-indigo-500 transition-all text-center"
                >
                  {subjectBadge(sub)}
                  <h5 className="font-black text-lg text-slate-800 dark:text-slate-100">
                    {sub.title}
                  </h5>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {allModules[sub.id]?.length || 0} модуль
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    setSelectedSubject(null);
                    setSelectedModuleId(null);
                  }}
                  className="text-xs font-black uppercase text-indigo-600 flex items-center gap-2"
                >
                  <i className="fas fa-arrow-left"></i> Пәндер
                </button>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 font-outfit">
                  {selectedSubject.title}
                </h3>
                <div className="w-20"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Модульдер тізімі
                    </h4>
                    {isSuperAdmin && (
                      <button
                        onClick={() => setIsAddingModule(true)}
                        className="text-emerald-600 text-[10px] font-black uppercase hover:underline"
                      >
                        + Модуль қосу
                      </button>
                    )}
                  </div>

                  {isAddingModule && isSuperAdmin && (
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-[30px] border-2 border-emerald-500 shadow-xl space-y-4 animate-in zoom-in">
                      <input
                        type="text"
                        placeholder="Модуль атауы..."
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm outline-none border border-gray-100 dark:border-slate-700 font-bold"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddModule}
                          className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase"
                        >
                          Сақтау
                        </button>
                        <button
                          onClick={() => setIsAddingModule(false)}
                          className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-[10px] font-black uppercase"
                        >
                          Жабу
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                    {(allModules[selectedSubject.id] || []).map((mod: Module, i: number) => (
                      <div key={mod.id} className="group relative">
                        <button
                          onClick={() => setSelectedModuleId(mod.id)}
                          className={`w-full p-5 rounded-[22px] text-left transition-all border ${
                            selectedModuleId === mod.id
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                              : "bg-white dark:bg-slate-800 border-gray-50 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <span className="text-sm font-bold truncate block">
                            {i + 1}. {mod.title.replace(/^\d+\.\s*/, "")}
                          </span>
                        </button>

                        {isSuperAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(mod.id);
                            }}
                            className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8">
                  {activeModule ? (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-8">
                      <div className="flex items-center justify-between border-b dark:border-slate-700 pb-6">
                        <div>
                          <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">
                            {activeModule.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                            {activeModule.lessons.length} Сабақ бар
                          </p>
                        </div>

                        {isSuperAdmin && (
                          <button
                            onClick={handleAddLesson}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-transform"
                          >
                            + Сабақ қосу
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {activeModule.lessons.length === 0 ? (
                          <div className="py-10 text-center text-slate-300 italic text-sm border-2 border-dashed rounded-[30px]">
                            Бұл модульде әлі сабақ жоқ
                          </div>
                        ) : (
                          activeModule.lessons.map((lesson: Lesson, idx: number) => (
                            <div
                              key={lesson.id}
                              className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-[25px] border border-gray-100 dark:border-slate-700 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 border border-gray-100 dark:border-slate-700">
                                  {idx + 1}
                                </div>
                                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                                  {lesson.title}
                                </h5>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingLesson(lesson)}
                                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase border border-gray-100 dark:border-slate-700 hover:bg-indigo-600 hover:text-white transition-all"
                                >
                                  Басқару
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-gray-300 space-y-4 bg-gray-50/50 dark:bg-slate-900/20 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-slate-800">
                      <i className="fas fa-book-open text-5xl opacity-20"></i>
                      <p className="font-black text-xs uppercase tracking-widest">
                        Модульді таңдаңыз
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== STAFF ===================== */}
      {currentView === "admin-staff" && isSuperAdmin && (
        <div className="space-y-8">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
              Қызметкерлер
            </h2>
            <button
              onClick={() => setView("admin")}
              className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors"
            >
              ← Артқа
            </button>
          </header>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
            <h3 className="font-black text-slate-800 dark:text-slate-200">
              Жаңа мұғалім қосу
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Аты-жөні"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
              />
              <input
                type="email"
                placeholder="Email (login ретінде)"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
              />
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                Бекітілетін пәндер
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s: Subject) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      newStaffSubjects.includes(s.id)
                        ? setNewStaffSubjects(
                            newStaffSubjects.filter((i: SubjectId) => i !== s.id)
                          )
                        : setNewStaffSubjects([...newStaffSubjects, s.id])
                    }
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                      newStaffSubjects.includes(s.id)
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-400"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddStaff}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
            >
              Тіркеу
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-black uppercase text-gray-400 dark:text-slate-500">
                <tr>
                  <th className="p-6">Қызметкер</th>
                  <th className="p-6">Рөлі</th>
                  <th className="p-6">Пәндері</th>
                  <th className="p-6 text-right">Әрекет</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {staffList.map((staff: StaffMember) => (
                  <tr key={staff.email}>
                    <td className="p-6">
                      <p className="font-black text-slate-800 dark:text-slate-100 text-sm">
                        {staff.name}
                      </p>
                      <p className="text-xs text-gray-400">{staff.email}</p>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                          staff.role === "super-admin"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {staff.role}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-wrap gap-1">
                        {staff.permissions.includes("all") ? (
                          <span className="text-[9px] font-black text-gray-500">
                            БАРЛЫҚ ПӘН
                          </span>
                        ) : (
                          staff.permissions.map((p: string) => (
                            <span
                              key={p}
                              className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[8px] font-bold text-gray-600 dark:text-slate-400"
                            >
                              {p}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      {staff.email !== "nur.abuuadi@gmail.com" && (
                        <button
                          onClick={() => handleRemoveStaff(staff.email)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== LESSON EDIT MODAL ===================== */}
{editingLesson && (
  <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
    <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
      
      {/* Header */}
      <header className="p-6 md:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black font-outfit">
            {lessonDraft?.title ?? editingLesson.title}
          </h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
            Сабақ контентін өңдеу
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setEditStep((s) => (s > 0 ? ((s - 1) as any) : s))}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-black text-[10px] uppercase"
          >
            ← Алдыңғы
          </button>

          <button
            onClick={() => setEditStep((s) => (s < 4 ? ((s + 1) as any) : s))}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-black text-[10px] uppercase"
          >
            Келесі →
          </button>

          <button
            onClick={handleSaveLesson}
            className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg"
          >
            Өзгерісті сақтау
          </button>

          <button
            onClick={() => setEditingLesson(null)}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-black text-[10px] uppercase"
          >
            ← Артқа
          </button>

          <button
            onClick={() => setEditingLesson(null)}
            className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-red-500 transition-all"
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar">
        {!lessonDraft ? (
          <div className="text-slate-500 font-bold">Жүктелуде...</div>
        ) : (
          <div className="space-y-8">
            {/* STEP 0: 0) атауы + 1) видео */}
            {editStep === 0 && (
              <>
                {/* ===== 0) Негізгі ақпарат ===== */}
                <section className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[30px] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">0) Сабақ атауы</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base</span>
                  </div>

                  <input
                    value={lessonDraft.title}
                    onChange={(e) => setLessonDraft((p) => (p ? { ...p, title: e.target.value } : p))}
                    placeholder="Сабақ атауы"
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none"
                  />
                </section>

                {/* ===== 1) Видео ===== */}
                <section className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[30px] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">1) Сабақ видеосы</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Video</span>
                  </div>

                  <input
                    value={lessonDraft.videoUrl ?? ""}
                    onChange={(e) => setLessonDraft((p) => (p ? { ...p, videoUrl: e.target.value } : p))}
                    placeholder="YouTube embed URL (мыс: https://www.youtube.com/embed/...)"
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none"
                  />

                  {!!lessonDraft.videoUrl && (
                    <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                      <iframe className="w-full h-full" src={lessonDraft.videoUrl} allowFullScreen title="lesson-video" />
                    </div>
                  )}
                </section>
              </>
            )}

            {/* STEP 1: 2) бекіту */}
            {editStep === 1 && (
              <>
                {/* ===== 2) Бекіту (reinforcement) ===== */}
                <section className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[30px] p-6 space-y-4">
  <div className="flex items-center justify-between">
    <h4 className="text-lg font-black text-slate-900 dark:text-white">2) Бекіту тапсырмалары</h4>

    <button
      onClick={() =>
        setLessonDraft((p) => {
          if (!p) return p;
          const list = [...(p.reinforcementItems ?? [])];
          list.push({ id: `RQ-${Date.now()}`, question: "Сұрақ...", options: ["A", "B", "C", "D"], correctAnswer: 0 });
          return { ...p, reinforcementItems: list };
        })
      }
      className="text-[10px] font-black uppercase tracking-widest text-emerald-600"
    >
      + Сұрақ қосу
    </button>
  </div>

  {(lessonDraft.reinforcementItems ?? []).length === 0 ? (
    <div className="text-slate-400 font-bold text-sm">
      Бекіту сұрақтары жоқ. “Сұрақ қосу” бас.
    </div>
  ) : (
    <div className="space-y-4">
      {lessonDraft.reinforcementItems!.map((q, qi) => (
        <div
          key={qi}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="font-black text-slate-700 dark:text-slate-200">
              Сұрақ #{qi + 1}
            </div>

            <button
              onClick={() =>
                setLessonDraft((p) => {
                  if (!p) return p;
                  const list = (p.reinforcementItems ?? []).filter((_, i) => i !== qi);
                  return { ...p, reinforcementItems: list };
                })
              }
              className="text-[10px] font-black uppercase tracking-widest text-rose-600"
            >
              Өшіру
            </button>
          </div>

          <input
            value={q.question ?? ""}
            onChange={(e) =>
              setLessonDraft((p) => {
                if (!p) return p;
                const list = [...(p.reinforcementItems ?? [])];
                list[qi] = { ...list[qi], question: e.target.value };
                return { ...p, reinforcementItems: list };
              })
            }
            placeholder="Сұрақ мәтіні"
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold outline-none"
          />

          <div className="grid md:grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((oi) => (
              <input
                key={oi}
                value={q.options?.[oi] ?? ""}
                onChange={(e) =>
                  setLessonDraft((p) => {
                    if (!p) return p;
                    const list = [...(p.reinforcementItems ?? [])];
                    const item = list[qi] ?? { question: "", options: ["", "", "", ""], correctAnswer: 0 };
                    const opts = [...(item.options ?? ["", "", "", ""])];
                    opts[oi] = e.target.value;
                    list[qi] = { ...item, options: opts };
                    return { ...p, reinforcementItems: list };
                  })
                }
                placeholder={`Жауап ${oi + 1}`}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold outline-none"
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-slate-700 dark:text-slate-200">Дұрыс жауап:</span>
            <select
              value={q.correctAnswer ?? 0}
              onChange={(e) =>
                setLessonDraft((p) => {
                  if (!p) return p;
                  const list = [...(p.reinforcementItems ?? [])];
                  list[qi] = { ...list[qi], correctAnswer: Number(e.target.value) };
                  return { ...p, reinforcementItems: list };
                })
              }
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none"
            >
              <option value={0}>1</option>
              <option value={1}>2</option>
              <option value={2}>3</option>
              <option value={3}>4</option>
            </select>

            {/* реттеу: жоғары/төмен жылжыту */}
            <button
              onClick={() =>
                setLessonDraft((p) => {
                  if (!p) return p;
                  const list = [...(p.reinforcementItems ?? [])];
                  if (qi === 0) return p;
                  [list[qi - 1], list[qi]] = [list[qi], list[qi - 1]];
                  return { ...p, reinforcementItems: list };
                })
              }
              className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              ↑
            </button>
            <button
              onClick={() =>
                setLessonDraft((p) => {
                  if (!p) return p;
                  const list = [...(p.reinforcementItems ?? [])];
                  if (qi >= list.length - 1) return p;
                  [list[qi + 1], list[qi]] = [list[qi], list[qi + 1]];
                  return { ...p, reinforcementItems: list };
                })
              }
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
               </section>
              </>
            )}

            {/* STEP 2: 3) Үй жұмысы */}
            {editStep === 2 && (
              <>
                {/* ===== 3) Үй жұмысы (мәтін + PDF) ===== */}
                <section className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[30px] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">3) Үй жұмысы</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Homework</span>
                  </div>

                  <textarea
                    value={lessonDraft.homeworkHtml ?? ""}
                    onChange={(e) => setLessonDraft((p) => (p ? { ...p, homeworkHtml: e.target.value } : p))}
                    placeholder="Үй жұмысы мәтіні (HTML/мәтін)"
                    className="w-full min-h-[180px] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none"
                  />

                  <input
                    value={lessonDraft.homeworkPdfUrl ?? ""}
                    onChange={(e) => setLessonDraft((p) => (p ? { ...p, homeworkPdfUrl: e.target.value } : p))}
                    placeholder="Үй жұмысы PDF URL (public link)"
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none"
                  />
                </section>
              </>
            )}

            {/* STEP 3: 3.1) тесттер */}
            {editStep === 3 && (
              <>
                {/* ===== 3.1) Үй жұмысы тесттері ===== */}
                <section className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[30px] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">3.1) Үй жұмысы тесттері</h4>

                    <button
                      onClick={() =>
                        setLessonDraft((p) => {
                          if (!p) return p;
                          const next = {
                            id: `HW-${Date.now()}`,
                            question: "Сұрақ...",
                            options: ["A", "B", "C", "D"],
                            correctAnswer: 0,
                          };
                          return { ...p, homework: [...(p.homework ?? []), next] };
                        })
                      }
                      className="text-[10px] font-black uppercase tracking-widest text-emerald-600"
                    >
                      + Тест қосу
                    </button>
                  </div>

                  {(lessonDraft.homework ?? []).length === 0 ? (
                    <div className="text-slate-400 font-bold text-sm">
                      Тест жоқ. “Тест қосу” бассаң, оқушыға auto-check болады.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lessonDraft.homework.map((it, idx) => (
                        <div
                          key={it.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-black text-slate-700 dark:text-slate-200">Тест #{idx + 1}</div>
                            <button
                              onClick={() =>
                                setLessonDraft((p) => {
                                  if (!p) return p;
                                  return { ...p, homework: p.homework.filter((x) => x.id !== it.id) };
                                })
                              }
                              className="text-[10px] font-black uppercase tracking-widest text-rose-600"
                            >
                              Өшіру
                            </button>
                          </div>

                          <input
                            value={it.question ?? it.text ?? ""}
                            onChange={(e) =>
                              setLessonDraft((p) => {
                                if (!p) return p;
                                const hw = p.homework.map((x) => (x.id === it.id ? { ...x, question: e.target.value } : x));
                                return { ...p, homework: hw };
                              })
                            }
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold outline-none"
                            placeholder="Сұрақ"
                          />

                          <div className="grid md:grid-cols-2 gap-2">
                            {it.options.map((opt, oi) => (
                              <input
                                key={oi}
                                value={opt}
                                onChange={(e) =>
                                  setLessonDraft((p) => {
                                    if (!p) return p;
                                    const hw = p.homework.map((x) => {
                                      if (x.id !== it.id) return x;
                                      const opts = [...x.options];
                                      opts[oi] = e.target.value;
                                      return { ...x, options: opts };
                                    });
                                    return { ...p, homework: hw };
                                  })
                                }
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold outline-none"
                                placeholder={`Жауап ${oi + 1}`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">Дұрыс:</span>
                            <select
                              value={it.correctAnswer}
                              onChange={(e) =>
                                setLessonDraft((p) => {
                                  if (!p) return p;
                                  const hw = p.homework.map((x) =>
                                    x.id === it.id ? { ...x, correctAnswer: Number(e.target.value) } : x
                                  );
                                  return { ...p, homework: hw };
                                })
                              }
                              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none"
                            >
                              <option value={0}>1</option>
                              <option value={1}>2</option>
                              <option value={2}>3</option>
                              <option value={3}>4</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* STEP 4: 4) Қатемен жұмыс */}
            {editStep === 4 && (
              <>
                {/* ===== 4) Қатемен жұмыс ===== */}
                <section className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[30px] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">4) Қатемен жұмыс</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fixes</span>
                  </div>

                  <input
                    value={lessonDraft.fixesVideoUrl ?? ""}
                    onChange={(e) => setLessonDraft((p) => (p ? { ...p, fixesVideoUrl: e.target.value } : p))}
                    placeholder="Қатемен жұмыс видео URL (embed)"
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none"
                  />

                  <input
                    value={lessonDraft.fixesPdfUrl ?? ""}
                    onChange={(e) => setLessonDraft((p) => (p ? { ...p, fixesPdfUrl: e.target.value } : p))}
                    placeholder="Қатемен жұмыс PDF URL"
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none"
                  />
                </section>

                <div className="text-xs text-slate-400 font-bold">
                  Кеңес: Видео үшін embed сілтеме қолдан (youtube.com/embed/...). PDF үшін public link керек.
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}
</div>
  );
};

export default AdminPanel;