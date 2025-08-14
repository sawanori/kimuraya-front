import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { contentTranslations } from '@/lib/translations/content-translations'
import { } from '@/lib/i18n'

export function useMultilingual() {
  const { language } = useLanguage()

  // 静的テキストの翻訳を取得
  const t = (key: string) => getTranslation(key, language)

  // 動的コンテンツの翻訳を取得
  const getContent = (path: string, content?: any, defaultValue?: any): any => {
    const keys = path.split('.')
    
    // まずcontentから取得を試みる（JSONファイルの内容を優先）
    if (content) {
      let current = content
      for (const key of keys) {
        current = current?.[key]
      }
      
      // 多言語コンテンツの場合
      if (current && typeof current === 'object' && 'values' in current) {
        return current.values[language] || current.values.ja || defaultValue || ''
      }
      
      // 配列や通常のオブジェクトの場合はそのまま返す
      if (current !== undefined) {
        return current
      }
    }
    
    // contentTranslationsから取得（フォールバック）
    let translated: any = contentTranslations
    for (const key of keys) {
      translated = translated?.[key]
    }
    
    if (translated && typeof translated === 'object' && language in translated) {
      return translated[language]
    }
    
    // デフォルト値またはデフォルトで日本語を返す
    return defaultValue !== undefined ? defaultValue : (translated?.ja || '')
  }

  // 多言語対応されているかチェック
  const isTranslated = (path: string): boolean => {
    const keys = path.split('.')
    let translated: any = contentTranslations
    
    for (const key of keys) {
      translated = translated?.[key]
    }
    
    return translated && typeof translated === 'object' && language in translated
  }

  return {
    t,
    getContent,
    isTranslated,
    language
  }
}