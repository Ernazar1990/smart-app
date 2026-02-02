import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { University } from "../types";

export function useUniversities(fallback: University[]) {
  const [unis, setUnis] = useState<University[]>(fallback);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .order("name", { ascending: true });

      if (!alive) return;

      if (!error && data?.length) {
        setUnis(data as any);
      }

      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { unis, loading };
}
