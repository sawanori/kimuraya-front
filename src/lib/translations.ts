import { Language, TranslationStatus } from './i18n'

// 多言語コンテンツの型定義
export interface MultilingualContent {
  [key: string]: {
    values: {
      ja: string
      en?: string
      ko?: string
      zh?: string
    }
    status: {
      en: TranslationStatus
      ko: TranslationStatus
      zh: TranslationStatus
    }
    lastUpdated: {
      ja: string
      en?: string
      ko?: string
      zh?: string
    }
  }
}

// 静的な翻訳を別ファイルから読み込み
import { staticTranslations } from './translations/static-translations'

export { staticTranslations }

// 翻訳を取得する関数
export function getTranslation(key: string, lang: Language): string {
  return staticTranslations[key]?.[lang] || staticTranslations[key]?.ja || key
}

// コンテンツの翻訳を取得
export function getContentTranslation(
  content: Record<string, unknown>,
  path: string,
  lang: Language
): string {
  const keys = path.split('.')
  let current: unknown = content
  
  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      current = undefined
    }
  }
  
  // 多言語対応の場合
  if (typeof current === 'object' && current !== null && 'values' in current) {
    const values = (current as { values: Record<string, string> }).values
    return values[lang] || values.ja || ''
  }
  
  // 従来の形式の場合（日本語のみ）
  return typeof current === 'string' ? current : ''
}

// 翻訳ステータスを取得
export function getTranslationStatus(
  content: Record<string, unknown>,
  path: string,
  lang: Language
): TranslationStatus {
  if (lang === 'ja') return 'translated'
  
  const keys = path.split('.')
  let current: unknown = content
  
  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      current = undefined
    }
  }
  
  if (typeof current === 'object' && current !== null && 'status' in current) {
    const status = (current as { status: Record<string, TranslationStatus> }).status
    return status[lang] || 'untranslated'
  }
  
  return 'untranslated'
}