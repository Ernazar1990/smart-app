import AdminPostsManager from './AdminPostsManager';
import React, { useState, useMemo } from 'react';
import { SUBJECTS } from '../constants';
import { Module, Lesson, Subject, AppView, StaffMember, UserProgress } from '../types';

interface AdminPanelProps {
  currentView?: AppView;
  setView: (view: AppView) => void;
  allModules: Record<string, Module[]>;
  setAllModules: React.Dispatch<React.SetStateAction<Record<string, Module[]>>>;
  staffList: StaffMember[];
  setStaffList: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  user: UserProgress;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentView, setView, allModules, setAllModules, staffList, setStaffList, user }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffSubjects, setNewStaffSubjects] = useState<string[]>([]);

  const isSuperAdmin = user?.role === 'super-admin' || user?.email === 'nur.abuuadi@gmail.com';

  const allowedSubjects = useMemo(() => {
    if (isSuperAdmin) return SUBJECTS;
    return SUBJECTS.filter(s => user?.permissions?.includes(s.id));
  }, [user, isSuperAdmin]);

  const activeModule = useMemo(() => {
    if (!selectedSubject || !selectedModuleId) return null;
    return (allModules[selectedSubject.id] || []).find(m => m.id === selectedModuleId) || null;
  }, [allModules, selectedSubject, selectedModuleId]);

  const handleAddModule = () => {
    if (!isSuperAdmin || !selectedSubject || !newModuleTitle.trim()) return;
    const currentList = allModules[selectedSubject.id] || [];
    const nextNumber = currentList.length + 1;
    const newModule: Module = {
      id: `${selectedSubject.id}-m${nextNumber}-${Date.now()}`,
      title: `${nextNumber}. ${newModuleTitle.trim()}`,
      weekNumber: nextNumber,
      lessons: []
    };
    const updated = { ...allModules, [selectedSubject.id]: [...currentList, newModule] };
    setAllModules(updated);
    localStorage.setItem('smart_modules_db', JSON.stringify(updated));
    setNewModuleTitle('');
    setIsAddingModule(false);
    setSelectedModuleId(newModule.id);
  };

  const handleDeleteModule = (modId: string) => {
    if (!isSuperAdmin || !selectedSubject || !window.confirm("Бұл модульді және оның барлық сабақтарын өшіруді растайсыз ба?")) return;
    const updated = { ...allModules, [selectedSubject.id]: allModules[selectedSubject.id].filter(m => m.id !== modId) };
    setAllModules(updated);
    localStorage.setItem('smart_modules_db', JSON.stringify(updated));
    if (selectedModuleId === modId) setSelectedModuleId(null);
  };

  const handleAddLesson = () => {
    if (!isSuperAdmin || !selectedModuleId || !selectedSubject) return;
    const title = prompt("Жаңа сабақ атауы:");
    if (!title) return;
    const newLesson: Lesson = {
      id: `L-${Date.now()}`, title, isFree: false, videoUrl: '', presentationUrl: '', analysisVideoUrl: '', pdfSolutionUrl: '',
      reinforcement: { question: 'Сұрақ?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      homework: []
    };
    const updated = {
      ...allModules,
      [selectedSubject.id]: allModules[selectedSubject.id].map(m => 
        m.id === selectedModuleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    };
    setAllModules(updated);
    localStorage.setItem('smart_modules_db', JSON.stringify(updated));
    setEditingLesson(newLesson);
  };

  const handleSaveLesson = () => {
    if (!editingLesson || !selectedModuleId || !selectedSubject) return;
    const updated = {
      ...allModules,
      [selectedSubject.id]: allModules[selectedSubject.id].map(m => {
        if (m.id === selectedModuleId) {
          return { ...m, lessons: m.lessons.map(l => l.id === editingLesson.id ? editingLesson : l) };
        }
        return m;
      })
    };
    setAllModules(updated);
    localStorage.setItem('smart_modules_db', JSON.stringify(updated));
    alert("Өзгерістер сақталды!");
  };

  const handleAddStaff = () => {
    if (!isSuperAdmin || !newStaffEmail || !newStaffName || newStaffSubjects.length === 0) return;
    const newMember: StaffMember = {
      email: newStaffEmail.toLowerCase().trim(),
      name: newStaffName,
      role: 'teacher',
      permissions: newStaffSubjects
    };
    const updated = [...staffList, newMember];
    setStaffList(updated);
    localStorage.setItem('smart_staff_db', JSON.stringify(updated));
    setNewStaffEmail(''); setNewStaffName(''); setNewStaffSubjects([]);
  };

  const handleRemoveStaff = (email: string) => {
    if (!isSuperAdmin || email === 'nur.abuuadi@gmail.com') return;
    if (!window.confirm("Бұл қызметкерді өшіруді растайсыз ба?")) return;
    const updated = staffList.filter(s => s.email !== email);
    setStaffList(updated);
    localStorage.setItem('smart_staff_db', JSON.stringify(updated));
  };

  return (
    <div className="pb-20 animate-in fade-in">
      {currentView === 'admin' && (
        <div className="space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">Басқару панелі</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Рөлі: <span className="text-indigo-600">{isSuperAdmin ? 'Super Admin (Full Access)' : 'Teacher (Restricted)'}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('admin-content')} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Контент</button>
              {isSuperAdmin && <button onClick={() => setView('admin-staff')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Қызметкерлер</button>}
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Рұқсат етілген пәндер</h4>
               <div className="flex flex-wrap gap-2">
                 {allowedSubjects.map(s => (
                   <span key={s.id} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase">{s.name}</span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'admin-content' && (
        <div className="space-y-8">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">Курстарды басқару</h2>
            <button onClick={() => setView('admin')} className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors">← Артқа</button>
          </header>

          {!selectedSubject ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allowedSubjects.map(sub => (
                <button key={sub.id} onClick={() => setSelectedSubject(sub)} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-4 hover:border-indigo-500 transition-all text-center">
                   <div className={`${sub.color} w-16 h-16 rounded-[24px] flex items-center justify-center text-white text-2xl shadow-lg`}><i className={`fas ${sub.icon}`}></i></div>
                   <h5 className="font-black text-lg text-slate-800 dark:text-slate-100">{sub.name}</h5>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{allModules[sub.id]?.length || 0} модуль</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700">
                <button onClick={() => { setSelectedSubject(null); setSelectedModuleId(null); }} className="text-xs font-black uppercase text-indigo-600 flex items-center gap-2">
                  <i className="fas fa-arrow-left"></i> Пәндер
                </button>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 font-outfit">{selectedSubject.name}</h3>
                <div className="w-20"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Модульдер тізімі</h4>
                    {isSuperAdmin && (
                      <button onClick={() => setIsAddingModule(true)} className="text-emerald-600 text-[10px] font-black uppercase hover:underline">+ Модуль қосу</button>
                    )}
                  </div>

                  {isAddingModule && isSuperAdmin && (
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-[30px] border-2 border-emerald-500 shadow-xl space-y-4 animate-in zoom-in">
                      <input type="text" placeholder="Модуль атауы..." value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm outline-none border border-gray-100 dark:border-slate-700 font-bold" />
                      <div className="flex gap-2">
                        <button onClick={handleAddModule} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase">Сақтау</button>
                        <button onClick={() => setIsAddingModule(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-[10px] font-black uppercase">Жабу</button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                    {(allModules[selectedSubject.id] || []).map((mod, i) => (
                      <div key={mod.id} className="group relative">
                        <button 
                          onClick={() => setSelectedModuleId(mod.id)} 
                          className={`w-full p-5 rounded-[22px] text-left transition-all border ${
                            selectedModuleId === mod.id 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                              : 'bg-white dark:bg-slate-800 border-gray-50 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-sm font-bold truncate block">{i + 1}. {mod.title.replace(/^\d+\.\s*/, '')}</span>
                        </button>
                        {isSuperAdmin && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod.id); }} 
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
                          <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">{activeModule.title}</h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{activeModule.lessons.length} Сабақ бар</p>
                        </div>
                        {isSuperAdmin && (
                          <button onClick={handleAddLesson} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-transform">+ Сабақ қосу</button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {activeModule.lessons.length === 0 ? (
                          <div className="py-10 text-center text-slate-300 italic text-sm border-2 border-dashed rounded-[30px]">Бұл модульде әлі сабақ жоқ</div>
                        ) : (
                          activeModule.lessons.map((lesson, idx) => (
                            <div key={lesson.id} className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-[25px] border border-gray-100 dark:border-slate-700 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 border border-gray-100 dark:border-slate-700">{idx + 1}</div>
                                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">{lesson.title}</h5>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setEditingLesson(lesson)} className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase border border-gray-100 dark:border-slate-700 hover:bg-indigo-600 hover:text-white transition-all">
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
                      <p className="font-black text-xs uppercase tracking-widest">Модульді таңдаңыз</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {currentView === 'admin-staff' && isSuperAdmin && (
        <div className="space-y-8">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">Қызметкерлер</h2>
            <button onClick={() => setView('admin')} className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors">← Артқа</button>
          </header>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
            <h3 className="font-black text-slate-800 dark:text-slate-200">Жаңа мұғалім қосу</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Аты-жөні" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold" />
              <input type="email" placeholder="Email (login ретінде)" value={newStaffEmail} onChange={e => setNewStaffEmail(e.target.value)} className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold" />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Бекітілетін пәндер</p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => newStaffSubjects.includes(s.id) ? setNewStaffSubjects(newStaffSubjects.filter(i => i !== s.id)) : setNewStaffSubjects([...newStaffSubjects, s.id])}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${newStaffSubjects.includes(s.id) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleAddStaff} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Тіркеу</button>
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
                  {staffList.map(staff => (
                    <tr key={staff.email}>
                      <td className="p-6">
                        <p className="font-black text-slate-800 dark:text-slate-100 text-sm">{staff.name}</p>
                        <p className="text-xs text-gray-400">{staff.email}</p>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${staff.role === 'super-admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          {staff.role}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-1">
                          {staff.permissions.includes('all') ? 
                            <span className="text-[9px] font-black text-gray-500">БАРЛЫҚ ПӘН</span> :
                            staff.permissions.map(p => <span key={p} className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[8px] font-bold text-gray-600 dark:text-slate-400">{p}</span>)
                          }
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        {staff.email !== 'nur.abuuadi@gmail.com' && (
                          <button onClick={() => handleRemoveStaff(staff.email)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash"></i></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {editingLesson && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl min-h-[80vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <header className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black font-outfit">{editingLesson.title}</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Сабақ контентін өңдеу</p>
              </div>
              <div className="flex gap-4">
                <button onClick={handleSaveLesson} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-emerald-900/20">Өзгерісті сақтау</button>
                <button onClick={() => setEditingLesson(null)} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-red-500 transition-all"><i className="fas fa-times"></i></button>
              </div>
            </header>
            
            <div className="flex-1 p-10 space-y-8 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Сабақ атауы</label>
                    <input type="text" value={editingLesson.title} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Видео (YouTube Embed Link)</label>
                    <input type="text" placeholder="https://www.youtube.com/embed/..." value={editingLesson.videoUrl} onChange={e => setEditingLesson({...editingLesson, videoUrl: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Конспект (PDF/Drive Link)</label>
                    <input type="text" value={editingLesson.presentationUrl} onChange={e => setEditingLesson({...editingLesson, presentationUrl: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Талдау видеосы</label>
                    <input type="text" value={editingLesson.analysisVideoUrl} onChange={e => setEditingLesson({...editingLesson, analysisVideoUrl: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold" />
                 </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-[35px] border border-indigo-100 dark:border-indigo-800/30">
                 <h5 className="font-black text-indigo-900 dark:text-indigo-200 mb-6 flex items-center gap-2">
                   <i className="fas fa-vial"></i> Бекіту сұрағы
                 </h5>
                 <div className="space-y-4">
                    <textarea 
                      value={editingLesson.reinforcement.question} 
                      onChange={e => setEditingLesson({...editingLesson, reinforcement: {...editingLesson.reinforcement, question: e.target.value}})}
                      className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold text-sm min-h-[100px]"
                      placeholder="Сұрақты жазыңыз..."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {editingLesson.reinforcement.options.map((opt, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            type="text" 
                            value={opt} 
                            onChange={e => {
                              const newOpts = [...editingLesson.reinforcement.options];
                              newOpts[i] = e.target.value;
                              setEditingLesson({...editingLesson, reinforcement: {...editingLesson.reinforcement, options: newOpts}});
                            }}
                            className="flex-1 p-3 bg-white dark:bg-slate-800 border rounded-xl text-xs font-bold" 
                          />
                          <button 
                            onClick={() => setEditingLesson({...editingLesson, reinforcement: {...editingLesson.reinforcement, correctAnswer: i}})}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${editingLesson.reinforcement.correctAnswer === i ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;