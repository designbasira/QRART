import { getApiKey } from './keys'
import { generateGoogleImagen } from './adapters/google-imagen'
import { generateHuggingFace } from './adapters/huggingface'
import { generateOpenAI } from './adapters/openai'
import { generateReplicate } from './adapters/replicate'

export async function generateImage(prompt: string, providerId: string): Promise<string> {
  const apiKey = getApiKey(providerId)
  if (!apiKey) {
    throw new Error('Aucune clé API configurée pour ce modèle. Cliquez sur l\'icône 🔑 pour en ajouter une.')
  }

  switch (providerId) {
    case 'google-imagen':
      return generateGoogleImagen(prompt, apiKey)
    case 'huggingface':
      return generateHuggingFace(prompt, apiKey)
    case 'openai':
      return generateOpenAI(prompt, apiKey)
    case 'replicate':
      return generateReplicate(prompt, apiKey)
    default:
      throw new Error(`Provider inconnu : ${providerId}`)
  }
}
