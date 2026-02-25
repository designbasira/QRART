const API_URL = 'https://api.openai.com/v1/images/generations'

export async function generateOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const base64 = data.data?.[0]?.b64_json
  if (!base64) throw new Error('OpenAI: pas de résultat')
  return `data:image/png;base64,${base64}`
}
