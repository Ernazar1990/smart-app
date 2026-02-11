import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient"; // сенде supabase клиент қайда тұр — соған сай жолын түзет

type StudentRow = {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  parent_phone: string | null;
  region: string | null;
  school: string | null;
  class: string | null;
  readiness: number | null;
  created_at: string | null;
};

export default function AdminUsersManager() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [rows, setRows] = useState<StudentRow[]>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,name,phone,parent_phone,region,school,class,readiness,created_at")
        .order("created_at", { ascending: false })
        .limit(200);

      if (!alive) return;

      if (error) {
        setErr(error.message);
        setRows([]);
      } else {
        setRows(Array.isArray(data) ? (data as StudentRow[]) : []);
      }

      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const count = useMemo(() => rows.length, [rows]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[30px] border border-gray-100 dark:border-slate-700">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400">
          Барлығы: {count}
        </div>
        {err ? (
          <div className="mt-3 p-4 rounded-2xl bg-rose-50 text-rose-700 font-bold text-sm">
            Қате: {err}
            <div className="text-xs mt-2 opacity-80">
              (Көбіне RLS policy / permissions / кесте аты сәйкес емес)
            </div>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-gray-100 dark:border-slate-700 text-slate-400 font-bold">
          Жүктелуде...
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-gray-100 dark:border-slate-700 text-center text-slate-400 font-bold">
          Оқушылар табылмады.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-gray-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900/50 text-[10px] font-black uppercase text-gray-400 dark:text-slate-500">
              <tr>
                <th className="p-6">Оқушы</th>
                <th className="p-6">Мектеп/Сынып</th>
                <th className="p-6">Телефон</th>
                <th className="p-6">Аймақ</th>
                <th className="p-6 text-right">Деңгей</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="p-6">
                    <div className="font-black text-slate-800 dark:text-slate-100">
                      {u.name ?? "Аты жоқ"}
                    </div>
                    <div className="text-xs text-gray-400">{u.email ?? "Email жоқ"}</div>
                    {u.parent_phone ? (
                      <div className="text-xs text-gray-400">Ата-ана: {u.parent_phone}</div>
                    ) : null}
                  </td>

                  <td className="p-6">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {u.school ?? "Мектеп жоқ"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {u.class ? `${u.class}-сынып` : "Сынып жоқ"}
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {u.phone ?? "—"}
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {u.region ?? "—"}
                    </div>
                  </td>

                  <td className="p-6 text-right">
                    <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase">
                      {typeof u.readiness === "number" ? `${u.readiness}%` : "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
