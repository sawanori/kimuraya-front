export const languages = ['ja', 'en', 'ko', 'zh'] as const
export type Language = typeof languages[number]

export const languageNames: Record<Language, string> = {
  ja: '日本語',
  en: 'English',
  ko: '한국어',
  zh: '中文'
}

export const languageFlags: Record<Language, string> = {
  ja: '🇯🇵',
  en: '🇺🇸',
  ko: '🇰🇷',
  zh: '🇨🇳'
}

export const defaultLanguage: Language = 'ja'

// 翻訳ステータス
export type TranslationStatus = 'translated' | 'auto-translated' | 'untranslated'

export interface TranslatedContent<T> {
  [key: string]: {
    ja: T
    en?: T
    ko?: T
    zh?: T
    status?: {
      en?: TranslationStatus
      ko?: TranslationStatus
      zh?: TranslationStatus
    }
  }
}

// ブラウザの言語設定から最適な言語を取得
export function getPreferredLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage
  
  const browserLang = navigator.language.toLowerCase()
  
  if (browserLang.startsWith('ja')) return 'ja'
  if (browserLang.startsWith('en')) return 'en'
  if (browserLang.startsWith('ko')) return 'ko'
  if (browserLang.startsWith('zh')) return 'zh'
  
  return defaultLanguage
}

// 言語をCookieに保存
export function setLanguageCookie(lang: Language) {
  document.cookie = `language=${lang};path=/;max-age=31536000` // 1年間保存
}

// Cookieから言語を取得
export function getLanguageFromCookie(): Language | null {
  if (typeof window === 'undefined') return null
  
  const match = document.cookie.match(/language=(\w+)/)
  const lang = match?.[1] as Language | undefined
  
  return languages.includes(lang as Language) ? lang as Language : null
}