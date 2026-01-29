import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type SettingsRow = {
  id: string;
  tools_enabled: Record<string, boolean>;
  daily_limits: Record<string, number>;
  prompt_templates: Record<string, string>;
};

const defaultTools = ["ai_tutor", "scanner", "reaction_balancer", "flashcards"];

export default function AdminAIHubManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [row, setRow] = useState<SettingsRow | null>(null);

  const load = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.from("ai_settings").select("id,tools_enabled,daily_limits,prompt_templates").limit(1);

    if (error) setError(error.message);
    const r = (data?.[0] as any) || null;

    // Егер tenant үшін жол жоқ болса — admin өзі жасасын
    if (!r) {
      const { data: ins, error: e2 } = await supabase.from("ai_settings").insert({}).select("id,tools_enabled,daily_limits,prompt_templates").single();
      if (e2) setError(e2.message);
      setRow(ins as any);
    } else {
      setRow(r as any);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setTool = (key: string, val: boolean) => {
    if (!row) return;
    setRow({
      ...row,
      tools_enabled: { ...(row.tools_enabled || {}), [key]: val },
    });
  };

  const setLimit = (key: string, val: number) => {
    if (!row) return;
    setRow({
      ...row,
      daily_limits: { ...(row.daily_limits || {}), [key]: val },
    });
  };

  const setTemplate = (key: string, val: string) => {
    if (!row) return;
    setRow({
      ...row,
      prompt_templates: { ...(row.prompt_templates || {}), [key]: val },
    });
  };

  const save = async () => {
    if (!row) return;
    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("ai_settings")
      .update({
        tools_enabled: row.tools_enabled,
        daily_limits: row.daily_limits,
        prompt_templates: row.prompt_templates,
      })
      .eq("id", row.id);

    if (error) setError(error.message);
    setSaving(false);
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-400 font-bold">Жүктелуде...</div>;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-5 py-4 text-sm font-bold">
          {error}
        </div>
      ) : null}

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-outfit">AI Hub басқару</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            құралдарды қосу/өшіру · лимит · промпт
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {defaultTools.map((t) => (
            <div key={t} className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-[25px] border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-800 dark:text-slate-100">{t}</div>
                <button
                  onClick={() => setTool(t, !(row?.tools_enabled?.[t] ?? true))}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${
                    (row?.tools_enabled?.[t] ?? true)
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {(row?.tools_enabled?.[t] ?? true) ? "ON" : "OFF"}
                </button>
              </div>

              <div className="mt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily limit</label>
                <input
                  type="number"
                  value={row?.daily_limits?.[t] ?? 0}
                  onChange={(e) => setLimit(t, Number(e.target.value || 0))}
                  className="mt-2 w-full p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
                />
              </div>

              <div className="mt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prompt template (опц.)</label>
                <textarea
                  value={row?.prompt_templates?.[t] ?? ""}
                  onChange={(e) => setTemplate(t, e.target.value)}
                  className="mt-2 w-full p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold min-h-[110px]"
                  placeholder="Мысалы: Оқушыға қысқа, түсінікті тілмен түсіндір..."
                />
              </div>
            </div>
          ))}
        </div>

        <button
          disabled={saving}
          onClick={save}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-60"
        >
          {saving ? "Сақталуда..." : "Сақтау"}
        </button>
      </div>
    </div>
  );
}
