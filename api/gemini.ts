import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' })
  }

  try {
    const { prompt } = (req.body ?? {}) as { prompt?: string }
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' })
    }

    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
      encodeURIComponent(apiKey)

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `
Сен ҰБТ-ға дайындайтын тәжірибелі ХИМИЯ МҰҒАЛІМІСІҢ.
Есепті ТЕК ФОРМУЛАМЕН және ҚАДАМДАП ШЕШ.

Ереже:
1) Берілгенін жаз
2) Формуланы көрсет
3) Есептеуді толық жүргіз
4) Соңында нақты жауабын (% немесе г) жаз
5) Егер жауап нұсқалары берілсе — дұрысын таңда

Есеп:
${prompt}
                `
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 700,
          temperature: 0.2
        }
      })
    })

    const data = await resp.json()

    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'Gemini error', details: data })
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text)
        .filter(Boolean)
        .join('') ?? ''

    return res.status(200).json({ text })
  } catch (e: any) {
    return res.status(500).json({ error: 'Server error', details: String(e?.message ?? e) })
  }
}
