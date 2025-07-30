import { Language, TranslationStatus } from '@/lib/i18n'

// 多言語テキストフィールド
export interface MultilingualTextField {
  ja: string
  en?: string
  ko?: string
  zh?: string
  status?: {
    en?: TranslationStatus
    ko?: TranslationStatus
    zh?: TranslationStatus
  }
  lastUpdated?: {
    ja: string
    en?: string
    ko?: string
    zh?: string
  }
}

// 多言語対応のコンテンツデータ
export interface MultilingualContentData {
  hero: {
    textFields: {
      mainTitle: MultilingualTextField
      subTitle: MultilingualTextField
      openTime: MultilingualTextField
      closeTime: MultilingualTextField
      closedDay: MultilingualTextField
    }
    imageFields: {
      logo: string
      bgPC1: string
      bgPC2: string
      bgPC3: string
      bgPC4: string
      bgMobile1: string
      bgMobile2: string
      bgMobile3: string
    }
  }
  // 他のセクションも同様に定義...
}

// 現在の言語でテキストを取得
export function getLocalizedText(field: MultilingualTextField | string, lang: Language): string {
  if (typeof field === 'string') return field
  
  const text = field[lang] || field.ja
  return text || ''
}

// 翻訳ステータスを取得
export function getFieldTranslationStatus(field: MultilingualTextField | string, lang: Language): TranslationStatus {
  if (typeof field === 'string' || lang === 'ja') return 'translated'
  
  return field.status?.[lang] || 'untranslated'
}