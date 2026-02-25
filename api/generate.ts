import type { VercelRequest, VercelResponse } from '@vercel/node'

// Max duration 60s for Replicate polling
export const config = { maxDuration: 60 }

const ENV_KEYS: Record<string, string[]> = {
  'google-imagen': ['GOOGLE_AI_API_KEY', 'VITE_GOOGLE_AI_API_KEY'],
  huggingface: ['HUGGINGFACE_API_KEY', 'VITE_HUGGINGFACE_API_KEY'],
  openai: ['OPENAI_API_KEY', 'VITE_OPENAI_API_KEY'],
  replicate: ['REPLICATE_API_KEY', 'VITE_REPLICATE_API_KEY'],
}

function getServerKey(providerId: string): string | null {
  const keys = ENV_KEYS[providerId] ?? []
  for (const k of keys) {
    const val = process.env[k]
    if (val) return val
  }
  return null
}

// --- Adapters (server-side, no CORS issues) ---

async function generateGoogleImagen(prompt: string, apiKey: string): Promise<string> {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict'
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1 } }),
  })
  if (!res.ok) throw new Error(`Google Imagen: ${res.status} - ${await res.text()}`)
  const data = await res.json()
  const base64 = data.predictions?.[0]?.bytesBase64Encoded
  if (!base64) throw new Error('Google Imagen: pas de résultat')
  return `data:image/png;base64,${base64}`
}

async function generateHuggingFace(prompt: string, apiKey: string): Promise<string> {
  const url = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0'
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: prompt }),
  })
  if (!res.ok) throw new Error(`Hugging Face: ${res.status} - ${await res.text()}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  return `data:image/png;base64,${buffer.toString('base64')}`
}

async function generateOpenAI(prompt: string, apiKey: string): Promise<string> {
  const url = 'https://api.openai.com/v1/images/generations'
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024', response_format: 'b64_json' }),
  })
  if (!res.ok) throw new Error(`OpenAI: ${res.status} - ${await res.text()}`)
  const data = await res.json()
  const base64 = data.data?.[0]?.b64_json
  if (!base64) throw new Error('OpenAI: pas de résultat')
  return `data:image/png;base64,${base64}`
}

async function generateReplicate(prompt: string, apiKey: string): Promise<string> {
  const API_URL = 'https://api.replicate.com/v1/predictions'
  const version = '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc'

  const createRes = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Prefer: 'wait' },
    body: JSON.stringify({ version, input: { prompt, width: 1024, height: 1024, num_outputs: 1 } }),
  })
  if (!createRes.ok) throw new Error(`Replicate: ${createRes.status} - ${await createRes.text()}`)

  let prediction = await createRes.json()
  let attempts = 0
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && attempts < 30) {
    await new Promise((r) => setTimeout(r, 2000))
    const pollRes = await fetch(`${API_URL}/${prediction.id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!pollRes.ok) throw new Error(`Replicate poll: ${pollRes.status}`)
    prediction = await pollRes.json()
    attempts++
  }

  if (prediction.status === 'failed') throw new Error(`Replicate: ${prediction.error || 'génération échouée'}`)
  const imageUrl = prediction.output?.[0]
  if (!imageUrl) throw new Error('Replicate: pas de résultat')

  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error('Replicate: erreur téléchargement image')
  const buffer = Buffer.from(await imgRes.arrayBuffer())
  return `data:image/png;base64,${buffer.toString('base64')}`
}

// --- Handler ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, providerId, apiKey } = req.body ?? {}
  if (!prompt || !providerId) {
    return res.status(400).json({ error: 'prompt et providerId requis' })
  }

  const key = apiKey || getServerKey(providerId)
  if (!key) {
    return res.status(400).json({ error: "Aucune clé API configurée pour ce modèle. Cliquez sur l'icône 🔑 pour en ajouter une." })
  }

  try {
    let dataUrl: string
    switch (providerId) {
      case 'google-imagen':
        dataUrl = await generateGoogleImagen(prompt, key)
        break
      case 'huggingface':
        dataUrl = await generateHuggingFace(prompt, key)
        break
      case 'openai':
        dataUrl = await generateOpenAI(prompt, key)
        break
      case 'replicate':
        dataUrl = await generateReplicate(prompt, key)
        break
      default:
        return res.status(400).json({ error: `Provider inconnu : ${providerId}` })
    }
    return res.status(200).json({ dataUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return res.status(500).json({ error: message })
  }
}
