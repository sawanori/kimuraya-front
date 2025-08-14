'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { 
  useApiSettings,
  useGoogleAnalyticsSettings,
  useGoogleBusinessProfileSettings,
  useSerpApiSettings 
} from '@/contexts/ApiSettingsContext'

export default function ApiStatusIndicator() {
  const [isMounted, setIsMounted] = useState(false)
  const { isLoading, error } = useApiSettings()
  const gaSettings = useGoogleAnalyticsSettings()
  const gbpSettings = useGoogleBusinessProfileSettings()
  const serpSettings = useSerpApiSettings()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[#a8a8a8] text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>API設定を読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <XCircle className="w-4 h-4" />
        <span>API設定の読み込みエラー</span>
      </div>
    )
  }

  const apis = [
    { name: 'GA', isConfigured: gaSettings.isConfigured },
    { name: 'GBP', isConfigured: gbpSettings.isConfigured },
    { name: 'SERP', isConfigured: serpSettings.isConfigured }
  ]

  const configuredCount = apis.filter(api => api.isConfigured).length

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        {configuredCount === apis.length ? (
          <>
            <CheckCircle className="w-4 h-4 text-[#10a37f]" />
            <span className="text-[#10a37f]">全API設定済み</span>
          </>
        ) : configuredCount > 0 ? (
          <>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500">{configuredCount}/{apis.length} API設定済み</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400">API未設定</span>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {apis.map(api => (
          <div
            key={api.name}
            className={`px-2 py-1 text-xs rounded ${
              api.isConfigured 
                ? 'bg-[#10a37f]/20 text-[#10a37f]' 
                : 'bg-[#424242] text-[#666]'
            }`}
            title={`${api.name} ${api.isConfigured ? '設定済み' : '未設定'}`}
          >
            {api.name}
          </div>
        ))}
      </div>
    </div>
  )
}