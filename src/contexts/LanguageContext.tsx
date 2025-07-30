'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, defaultLanguage, getLanguageFromCookie, getPreferredLanguage } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {}
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    // 1. Cookieから言語を取得
    const cookieLang = getLanguageFromCookie()
    if (cookieLang) {
      setLanguage(cookieLang)
      return
    }

    // 2. ブラウザの言語設定から取得
    const preferredLang = getPreferredLanguage()
    setLanguage(preferredLang)
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}