Deno.serve(async (req) => {
  // Тек POST
  if (req.method !== "POST") return new Response("Use POST", { status: 405 });

  // 1) JWT бар-жоғын тексеру
  const auth = req.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return new Response(
      JSON.stringify({ ok: false, error: "Authorization Bearer токен жоқ. Алдымен логин болыңыз." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2) Supabase Auth арқылы токеннен user алу
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!anonKey) {
    return new Response(
      JSON.stringify({ ok: false, error: "SUPABASE_ANON_KEY табылмады (env-file керек)." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const u = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
    },
  });

  if (!u.ok) {
    const err = await u.json().catch(() => ({}));
    return new Response(JSON.stringify({ ok: false, error: "JWT жарамсыз/мерзімі өткен.", details: err }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await u.json();
  // user.id бар болса — логин болған
  // Қаласаңыз: user.email, user.user_metadata т.б. қолданасыз

  // 3) Prompt оқу
  const body = await req.json().catch(() => ({}));
  const prompt = String(body?.prompt ?? "").trim();
  if (!prompt) {
    return new Response(JSON.stringify({ ok: false, error: "prompt бос" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4) OpenAI key
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    return new Response(JSON.stringify({ ok: false, error: "OPENAI_API_KEY табылмады" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 5) OpenAI сұранысы
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
    }),
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    const msg =
      r.status === 429
        ? "OpenAI квота/баланс жетпейді. Billing/Usage тексеріңіз."
        : "OpenAI сұранысы сәтсіз.";

    return new Response(JSON.stringify({ ok: false, status: r.status, message: msg, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const text =
    (data?.output_text as string | undefined) ??
    (Array.isArray(data?.output)
      ? data.output
          .flatMap((o: any) => o?.content ?? [])
          .map((c: any) => c?.text)
          .filter(Boolean)
          .join("\n")
      : "");

  return new Response(
    JSON.stringify({ ok: true, user_id: user?.id ?? null, text }),
    { headers: { "Content-Type": "application/json" } }
  );
});
