import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

type UniRow = {
  id: string;
  name: string;
  city: string | null;
  about: string | null;
  logo_url: string | null;
  website: string | null;
  updated_at: string;
};

type ProgramRow = {
  id: string;
  university_id: string;
  name: string;
  min_score: number | null;
  grants: number | null;
  description: string | null;
  updated_at: string;
};

export default function AdminUniversitiesManager() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [unis, setUnis] = useState<UniRow[]>([]);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);

  const [q, setQ] = useState("");
  const [activeUniId, setActiveUniId] = useState<string>("");

  const [uniForm, setUniForm] = useState({
    id: "",
    name: "",
    city: "",
    about: "",
    logo_url: "",
    website: "",
  });

  const [progForm, setProgForm] = useState({
    id: "",
    university_id: "",
    name: "",
    min_score: "",
    grants: "",
    description: "",
  });

  const filteredUnis = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return unis;
    return unis.filter(
      (u) =>
        u.name.toLowerCase().includes(qq) ||
        (u.city || "").toLowerCase().includes(qq)
    );
  }, [unis, q]);

  const load = async () => {
    setError("");
    setLoading(true);

    const { data: u, error: e1 } = await supabase
      .from("universities")
      .select("id,name,city,about,logo_url,website,updated_at")
      .order("updated_at", { ascending: false });

    if (e1) setError(e1.message);
    setUnis((u as UniRow[]) || []);

    const { data: p, error: e2 } = await supabase
      .from("university_programs")
      .select("id,university_id,name,min_score,grants,description,updated_at")
      .order("updated_at", { ascending: false });

    if (e2) setError((prev) => prev ? prev + " | " + e2.message : e2.message);
    setPrograms((p as ProgramRow[]) || []);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const saveUni = async () => {
    setError("");
    if (!uniForm.name.trim()) return setError("ЖОО атауы бос болмауы керек");

    const payload = {
      name: uniForm.name.trim(),
      city: uniForm.city.trim() || null,
      about: uniForm.about.trim() || null,
      logo_url: uniForm.logo_url.trim() || null,
      website: uniForm.website.trim() || null,
    };

    if (uniForm.id) {
      const { error } = await supabase.from("universities").update(payload).eq("id", uniForm.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from("universities").insert(payload);
      if (error) setError(error.message);
    }

    setUniForm({ id: "", name: "", city: "", about: "", logo_url: "", website: "" });
    await load();
  };

  const editUni = (u: UniRow) => {
    setUniForm({
      id: u.id,
      name: u.name || "",
      city: u.city || "",
      about: u.about || "",
      logo_url: u.logo_url || "",
      website: u.website || "",
    });
    setActiveUniId(u.id);
    setProgForm((s) => ({ ...s, university_id: u.id }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteUni = async (id: string) => {
    if (!confirm("Осы ЖОО-ны өшіреміз бе? (мамандықтары да өшеді)")) return;
    const { error } = await supabase.from("universities").delete().eq("id", id);
    if (error) setError(error.message);
    if (activeUniId === id) setActiveUniId("");
    await load();
  };

  const uniPrograms = useMemo(() => {
    if (!activeUniId) return [];
    return programs.filter((p) => p.university_id === activeUniId);
  }, [programs, activeUniId]);

  const saveProgram = async () => {
    setError("");
    if (!progForm.university_id) return setError("Алдымен ЖОО таңдаңыз");
    if (!progForm.name.trim()) return setError("Мамандық атауы бос болмауы керек");

    const payload = {
      university_id: progForm.university_id,
      name: progForm.name.trim(),
      min_score: progForm.min_score ? Number(progForm.min_score) : null,
      grants: progForm.grants ? Number(progForm.grants) : null,
      description: progForm.description.trim() || null,
    };

    if (progForm.id) {
      const { error } = await supabase.from("university_programs").update(payload).eq("id", progForm.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from("university_programs").insert(payload);
      if (error) setError(error.message);
    }

    setProgForm({ id: "", university_id: progForm.university_id, name: "", min_score: "", grants: "", description: "" });
    await load();
  };

  const editProgram = (p: ProgramRow) => {
    setProgForm({
      id: p.id,
      university_id: p.university_id,
      name: p.name || "",
      min_score: p.min_score?.toString() || "",
      grants: p.grants?.toString() || "",
      description: p.description || "",
    });
  };

  const deleteProgram = async (id: string) => {
    if (!confirm("Мамандықты өшіреміз бе?")) return;
    const { error } = await supabase.from("university_programs").delete().eq("id", id);
    if (error) setError(error.message);
    await load();
  };

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-5 py-4 text-sm font-bold">
          {error}
        </div>
      ) : null}

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-outfit">ЖОО қосу / өңдеу</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
            placeholder="Атауы" value={uniForm.name} onChange={e=>setUniForm(s=>({...s, name:e.target.value}))} />
          <input className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
            placeholder="Қала" value={uniForm.city} onChange={e=>setUniForm(s=>({...s, city:e.target.value}))} />
          <input className="p-4 md:col-span-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
            placeholder="Логотип URL (қаласаң)" value={uniForm.logo_url} onChange={e=>setUniForm(s=>({...s, logo_url:e.target.value}))} />
          <input className="p-4 md:col-span-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
            placeholder="Сайт" value={uniForm.website} onChange={e=>setUniForm(s=>({...s, website:e.target.value}))} />
          <textarea className="p-4 md:col-span-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold min-h-[140px]"
            placeholder="Сипаттама" value={uniForm.about} onChange={e=>setUniForm(s=>({...s, about:e.target.value}))} />
        </div>

        <div className="flex gap-2">
          <button onClick={saveUni} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
            {uniForm.id ? "Сақтау" : "Қосу"}
          </button>
          <button onClick={() => setUniForm({ id: "", name: "", city: "", about: "", logo_url: "", website: "" })}
            className="bg-gray-100 dark:bg-slate-900/40 text-gray-600 dark:text-slate-300 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">
            Тазалау
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-outfit">ЖОО тізімі</h3>
          <input value={q} onChange={(e)=>setQ(e.target.value)}
            className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold w-full md:w-80"
            placeholder="Іздеу..." />
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 font-bold">Жүктелуде...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredUnis.map(u => (
              <div key={u.id} className={`p-5 rounded-[25px] border shadow-sm transition-all ${
                activeUniId === u.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-700"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-black truncate">{u.name}</div>
                    <div className={`text-xs font-bold mt-1 ${activeUniId === u.id ? "text-white/80" : "text-slate-400"}`}>
                      {u.city || "Қала жоқ"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editUni(u)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${
                      activeUniId === u.id ? "bg-white/15 text-white" : "bg-white dark:bg-slate-800 text-indigo-600 border border-gray-100 dark:border-slate-700"
                    }`}>Өңдеу</button>
                    <button onClick={() => deleteUni(u.id)} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-red-50 text-red-700 border border-red-200">
                      Өшіру
                    </button>
                  </div>
                </div>

                {activeUniId === u.id ? (
                  <div className="mt-4 bg-white/10 rounded-2xl p-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">
                      Мамандықтар ({uniPrograms.length})
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input className="p-3 rounded-xl bg-white/15 outline-none text-white placeholder:text-white/60 font-bold"
                        placeholder="Мамандық атауы" value={progForm.name} onChange={e=>setProgForm(s=>({...s, name:e.target.value}))} />
                      <input className="p-3 rounded-xl bg-white/15 outline-none text-white placeholder:text-white/60 font-bold"
                        placeholder="Мин. балл (опц.)" value={progForm.min_score} onChange={e=>setProgForm(s=>({...s, min_score:e.target.value}))} />
                      <input className="p-3 rounded-xl bg-white/15 outline-none text-white placeholder:text-white/60 font-bold"
                        placeholder="Грант саны (опц.)" value={progForm.grants} onChange={e=>setProgForm(s=>({...s, grants:e.target.value}))} />
                      <input className="p-3 rounded-xl bg-white/15 outline-none text-white placeholder:text-white/60 font-bold"
                        placeholder="Сипаттама (қысқа)" value={progForm.description} onChange={e=>setProgForm(s=>({...s, description:e.target.value}))} />
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button onClick={saveProgram} className="bg-white text-indigo-700 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase">
                        {progForm.id ? "Сақтау" : "Қосу"}
                      </button>
                      <button onClick={() => setProgForm({ id:"", university_id: u.id, name:"", min_score:"", grants:"", description:"" })}
                        className="bg-white/15 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase">
                        Тазалау
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      {uniPrograms.map(p => (
                        <div key={p.id} className="bg-white/10 rounded-xl p-3 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-black truncate">{p.name}</div>
                            <div className="text-xs text-white/70 font-bold mt-1">
                              {p.min_score != null ? `мин балл: ${p.min_score}` : "мин балл жоқ"}
                              {p.grants != null ? ` · грант: ${p.grants}` : ""}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => editProgram(p)} className="px-4 py-2 rounded-xl bg-white/15 text-white text-[10px] font-black uppercase">Өңдеу</button>
                            <button onClick={() => deleteProgram(p.id)} className="px-4 py-2 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase">Өшіру</button>
                          </div>
                        </div>
                      ))}
                      {uniPrograms.length === 0 ? (
                        <div className="text-white/70 text-xs font-bold italic">Мамандық жоқ</div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
