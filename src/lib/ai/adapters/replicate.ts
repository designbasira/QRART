const API_URL = 'https://api.replicate.com/v1/predictions'
const SDXL_VERSION = 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc'

export async function generateReplicate(prompt: string, apiKey: string): Promise<string> {
  // 1. Create prediction
  const createRes = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'wait',
    },
    body: JSON.stringify({
      version: SDXL_VERSION.split(':')[1],
      input: {
        prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
      },
    }),
  })

  if (!createRes.ok) {
    const error = await createRes.text()
    throw new Error(`Replicate: ${createRes.status} - ${error}`)
  }

  let prediction = await createRes.json()

  // 2. Poll if not completed (Prefer: wait may return immediately)
  let attempts = 0
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && attempts < 60) {
    await new Promise((r) => setTimeout(r, 2000))
    const pollRes = await fetch(`${API_URL}/${prediction.id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!pollRes.ok) throw new Error(`Replicate poll: ${pollRes.status}`)
    prediction = await pollRes.json()
    attempts++
  }

  if (prediction.status === 'failed') {
    throw new Error(`Replicate: ${prediction.error || 'génération échouée'}`)
  }

  const imageUrl = prediction.output?.[0]
  if (!imageUrl) throw new Error('Replicate: pas de résultat')

  // 3. Fetch image and convert to data URL
  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error('Replicate: erreur téléchargement image')
  const blob = await imgRes.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Replicate: erreur de lecture'))
    reader.readAsDataURL(blob)
  })
}
