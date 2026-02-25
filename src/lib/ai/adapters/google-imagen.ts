const IMAGEN_URL = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict'

export async function generateGoogleImagen(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(IMAGEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1 },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google Imagen: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const base64 = data.predictions?.[0]?.bytesBase64Encoded
  if (!base64) throw new Error('Google Imagen: pas de résultat')
  return `data:image/png;base64,${base64}`
}
