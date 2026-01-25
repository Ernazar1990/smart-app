export async function getChemistryExplanation(
  userPrompt: string,
  history?: { role: string; content: string }[]
): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: userPrompt,
      history,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'AI қатесі');
  }

  return data.text || 'Жауап алынбады';
}
