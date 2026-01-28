import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

type PostStatus = "draft" | "published";

type PostRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content_md: string;
  cover_url: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const emptyForm = {
  id: "",
  title: "",
  excerpt: "",
  content_md: "",
  cover_url: "",
  status: "draft" as PostStatus,
};

export default function AdminPostsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [items, setItems] = useState<PostRow[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const [isEditing, setIsEditing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      (p.title || "").toLowerCase().includes(q) ||
      (p.excerpt || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const load = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select("id,title,excerpt,content_md,cover_url,status,published_at,created_at,updated_at")
      .order("updated_at", { ascending: false });

    if (error) setError(error.message);
    setItems((data as PostRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setForm({ ...emptyForm });
    setIsEditing(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (p: PostRow) => {
    setForm({
      id: p.id,
      title: p.title || "",
      excerpt: p.excerpt || "",
      content_md: p.content_md || "",
      cover_url: p.cover_url || "",
      status: p.status || "draft",
    });
    setIsEditing(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    setError("");

    if (!form.title.trim()) return setError("Тақырып (title) бос болмауы керек");
    if (!form.content_md.trim()) return setError("Мәтін (content) бос болмауы керек");

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim() ? form.excerpt.trim() : null,
      content_md: form.content_md,
      cover_url: form.cover_url.trim() ? form.cover_url.trim() : null,
      status: form.status,
    };

    if (isEditing && form.id) {
      const { error } = await supabase.from("posts").update(payload).eq("id", form.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from("posts").insert(payload);
      if (error) setError(error.message);
    }

    setSaving(false);
    await load();
    startCreate();
  };

  const remove = async (id: string) => {
    const ok = confirm("Осы мақаланы өшіреміз бе?");
    if (!ok) return;
    setError("");
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) setError(error.message);
    await load();
  };

  const togglePublish = async (p: PostRow) => {
    setError("");
    const next: PostStatus = p.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("posts").update({ status: next }).eq("id", p.id);
    if (error) setError(error.message);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-outfit">
              Мақала қосу / өңдеу
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Draft / Published
            </p>
          </div>

          <button
            onClick={startCreate}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
          >
            + Жаңа
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-5 py-4 text-sm font-bold">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
            placeholder="Тақырып (title)"
          />

          <input
            value={form.cover_url}
            onChange={(e) => setForm((s) => ({ ...s, cover_url: e.target.value }))}
            className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
            placeholder="Cover URL (қаласаң)"
          />

          <input
            value={form.excerpt}
            onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))}
            className="md:col-span-2 p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
            placeholder="Қысқаша сипаттама (excerpt)"
          />

          <textarea
            value={form.content_md}
            onChange={(e) => setForm((s) => ({ ...s, content_md: e.target.value }))}
            className="md:col-span-2 p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold min-h-[220px]"
            placeholder={`# Тақырып\n\nМәтін...`}
          />

          <div className="flex items-center gap-3">
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as PostStatus }))}
              className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>

            <button
              disabled={saving}
              onClick={save}
              className="ml-auto bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-60"
            >
              {saving ? "Сақталуда..." : isEditing ? "Сақтау" : "Қосу"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-outfit">
            Мақалалар тізімі
          </h3>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold w-full md:w-80"
            placeholder="Іздеу..."
          />
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 font-bold">Жүктелуде...</div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-bold">Мақала жоқ</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-[25px] border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      p.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {p.status}
                    </span>
                    <p className="font-black text-slate-800 dark:text-slate-100 truncate">
                      {p.title}
                    </p>
                  </div>
                  {p.excerpt ? (
                    <p className="text-xs text-slate-400 font-bold mt-2 line-clamp-2">
                      {p.excerpt}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(p)}
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase border border-gray-100 dark:border-slate-700 hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    {p.status === "published" ? "Draft" : "Publish"}
                  </button>

                  <button
                    onClick={() => startEdit(p)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase shadow-lg"
                  >
                    Өңдеу
                  </button>

                  <button
                    onClick={() => remove(p.id)}
                    className="px-5 py-2.5 rounded-xl bg-red-50 text-red-700 text-[10px] font-black uppercase border border-red-200 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Өшіру
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
