import { CollectionAfterReadHook } from 'payload'
import { decrypt } from '../lib/crypto'

export const decryptApiKeys: CollectionAfterReadHook = async ({ doc, req }) => {
  if (!doc || !doc.settings?.apiSettings?.googleBusinessProfile?.apiKeyEncrypted) {
    return doc
  }

  try {
    // 管理画面でのみ復号化（APIキーを表示する必要がある場合）
    if (req.context?.isAdmin || req.url?.startsWith('/admin')) {
      const secret = process.env.PAYLOAD_SECRET || 'default-secret-key'
      const encryptedKey = doc.settings.apiSettings.googleBusinessProfile.apiKeyEncrypted
      
      // 復号化を試みる
      try {
        const decryptedKey = decrypt(encryptedKey, secret)
        // マスク表示（最初の4文字と最後の4文字のみ表示）
        if (decryptedKey.length > 8) {
          const masked = decryptedKey.substring(0, 4) + '...' + decryptedKey.substring(decryptedKey.length - 4)
          doc.settings.apiSettings.googleBusinessProfile.apiKeyMasked = masked
        }
      } catch (error) {
        // 復号化に失敗した場合は何もしない
        console.error('Failed to decrypt API key:', error)
      }
    }
    
    // フロントエンドには暗号化されたキーを送らない
    if (!req.context?.isAdmin && !req.url?.startsWith('/admin')) {
      delete doc.settings.apiSettings.googleBusinessProfile.apiKeyEncrypted
    }
  } catch (error) {
    console.error('Error in decryptApiKeys hook:', error)
  }

  return doc
}