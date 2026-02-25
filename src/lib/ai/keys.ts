import { getProviderById } from './providers'

const PREFIX = 'qrart-api-key-'

export function getApiKey(providerId: string): string | null {
  // 1. Check localStorage
  try {
    const stored = localStorage.getItem(PREFIX + providerId)
    if (stored) return stored
  } catch {
    // localStorage unavailable
  }

  // 2. Fallback to env variable
  const provider = getProviderById(providerId)
  if (provider?.envKey) {
    const envVal = (import.meta.env as Record<string, string | undefined>)[provider.envKey]
    if (envVal) return envVal
  }

  return null
}

export function setApiKey(providerId: string, key: string): void {
  try {
    localStorage.setItem(PREFIX + providerId, key)
  } catch {
    // localStorage unavailable
  }
}

export function removeApiKey(providerId: string): void {
  try {
    localStorage.removeItem(PREFIX + providerId)
  } catch {
    // localStorage unavailable
  }
}

export function hasApiKey(providerId: string): boolean {
  return !!getApiKey(providerId)
}
