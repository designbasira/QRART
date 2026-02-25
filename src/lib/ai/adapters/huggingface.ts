const MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0'

export async function generateHuggingFace(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(MODEL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: prompt }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Hugging Face: ${response.status} - ${error}`)
  }

  // HF returns the image blob directly
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Hugging Face: erreur de lecture'))
    reader.readAsDataURL(blob)
  })
}
