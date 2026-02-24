import { fr } from './fr'
import { en } from './en'

export type Locale = 'fr' | 'en'
export type TranslationKey = keyof typeof fr

const translations: Record<Locale, Record<TranslationKey, string>> = { fr, en }

export function t(key: TranslationKey, locale: Locale = 'fr'): string {
  return translations[locale]?.[key] || translations.fr[key] || key
}

export { fr, en }
