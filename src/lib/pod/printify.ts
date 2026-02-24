// Printify API client
// Docs: https://developers.printify.com/
const PRINTIFY_API = 'https://api.printify.com/v1'

function getHeaders(): HeadersInit {
  const token = import.meta.env.VITE_PRINTIFY_API_KEY ?? ''
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

export function isPrintifyConfigured(): boolean {
  return !!import.meta.env.VITE_PRINTIFY_API_KEY
}

export interface PrintifyProduct {
  id: string
  title: string
  images: string[]
}

export interface PrintifyBlueprint {
  id: number
  title: string
  description: string
  images: string[]
}

export async function getBlueprints(): Promise<PrintifyBlueprint[]> {
  const res = await fetch(`${PRINTIFY_API}/catalog/blueprints.json`, { headers: getHeaders() })
  if (!res.ok) throw new Error(`Printify API error: ${res.status}`)
  const data = await res.json()
  return data.map((b: any) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    images: b.images,
  }))
}

export async function uploadImage(params: {
  fileName: string
  base64: string
}): Promise<{ id: string; url: string }> {
  const res = await fetch(`${PRINTIFY_API}/uploads/images.json`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      file_name: params.fileName,
      contents: params.base64,
    }),
  })
  if (!res.ok) throw new Error(`Printify upload error: ${res.status}`)
  const data = await res.json()
  return { id: data.id, url: data.preview_url }
}

export async function getShops(): Promise<{ id: number; title: string }[]> {
  const res = await fetch(`${PRINTIFY_API}/shops.json`, { headers: getHeaders() })
  if (!res.ok) throw new Error(`Printify shops error: ${res.status}`)
  return await res.json()
}
