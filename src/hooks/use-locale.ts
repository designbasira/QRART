'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Locale } from '@/lib/i18n'

const STORAGE_KEY = 'qrart-locale'

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'fr'
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && (stored === 'fr' || stored === 'en')) return stored
  const browser = navigator.language.slice(0, 2)
  return browser === 'en' ? 'en' : 'fr'
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('fr')

  useEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
    document.documentElement.lang = newLocale
  }, [])

  return { locale, setLocale }
}
