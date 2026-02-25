export interface AIProvider {
  id: string
  name: string
  description: string
  keyPlaceholder: string
  docsUrl: string
  envKey?: string
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'google-imagen',
    name: 'Google Imagen',
    description: 'Imagen 4 Fast — quota gratuit mensuel via Google AI',
    keyPlaceholder: 'AIza...',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/imagen',
    envKey: 'VITE_GOOGLE_AI_API_KEY',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Stable Diffusion XL — free tier limité',
    keyPlaceholder: 'hf_...',
    docsUrl: 'https://huggingface.co/settings/tokens',
  },
  {
    id: 'openai',
    name: 'OpenAI DALL-E',
    description: 'DALL-E 3 — crédit de départ offert',
    keyPlaceholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description: 'SDXL — crédits offerts au début',
    keyPlaceholder: 'r8_...',
    docsUrl: 'https://replicate.com/account/api-tokens',
  },
]

export function getProviderById(id: string): AIProvider | undefined {
  return AI_PROVIDERS.find((p) => p.id === id)
}
