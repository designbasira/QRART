import { getApiKey } from './keys'

export async function generateImage(prompt: string, providerId: string): Promise<string> {
  // User key from localStorage (optional — server has its own fallback)
  const apiKey = getApiKey(providerId)

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, providerId, apiKey }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Erreur serveur : ${res.status}`)
  }

  return data.dataUrl
}
