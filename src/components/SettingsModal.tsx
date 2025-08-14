'use client'

import React, { useState, useEffect } from 'react'
import { X, Settings, Key, Save, Eye, EyeOff } from 'lucide-react'
import { useApiSettings, type ApiSettings } from '@/contexts/ApiSettingsContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings: contextSettings, updateSettings, loadSettings } = useApiSettings()
  const [isMounted, setIsMounted] = useState(false)
  
  const [settings, setSettings] = useState<ApiSettings>({
    googleAnalytics: {
      measurementId: '',
      apiSecret: '',
      propertyId: ''
    },
    googleBusinessProfile: {
      accountId: '',
      locationId: '',
      apiKey: '',
      clientId: '',
      clientSecret: ''
    },
    serpApi: {
      apiKey: '',
      engine: 'google',
      domain: 'google.co.jp'
    }
  })

  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({})
  const [activeTab, setActiveTab] = useState<'googleAnalytics' | 'googleBusinessProfile' | 'serpApi'>('googleAnalytics')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load settings from context when modal opens or context updates
  useEffect(() => {
    if (isMounted && isOpen && contextSettings) {
      setSettings(contextSettings)
    }
  }, [isMounted, isOpen, contextSettings])

  const saveSettings = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const success = await updateSettings(settings)
      
      if (success) {
        setSaveMessage('設定を保存しました')
        setTimeout(() => setSaveMessage(''), 3000)
        // Reload settings to ensure context is updated
        await loadSettings()
      } else {
        setSaveMessage('保存に失敗しました')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveMessage('保存中にエラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#2a2a2a] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-[#424242] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#424242]">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-[#10a37f]" />
            <h2 className="text-xl font-bold text-[#ececec]">API設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#424242] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#a8a8a8]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#424242]">
          <button
            onClick={() => setActiveTab('googleAnalytics')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'googleAnalytics'
                ? 'text-[#10a37f] border-b-2 border-[#10a37f] bg-[#10a37f]/10'
                : 'text-[#a8a8a8] hover:text-[#ececec] hover:bg-[#424242]/30'
            }`}
          >
            Google Analytics
          </button>
          <button
            onClick={() => setActiveTab('googleBusinessProfile')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'googleBusinessProfile'
                ? 'text-[#10a37f] border-b-2 border-[#10a37f] bg-[#10a37f]/10'
                : 'text-[#a8a8a8] hover:text-[#ececec] hover:bg-[#424242]/30'
            }`}
          >
            Google Business Profile
          </button>
          <button
            onClick={() => setActiveTab('serpApi')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'serpApi'
                ? 'text-[#10a37f] border-b-2 border-[#10a37f] bg-[#10a37f]/10'
                : 'text-[#a8a8a8] hover:text-[#ececec] hover:bg-[#424242]/30'
            }`}
          >
            SERP API
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Google Analytics Tab */}
          {activeTab === 'googleAnalytics' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  Measurement ID
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type="text"
                    value={settings.googleAnalytics.measurementId}
                    onChange={(e) => setSettings({
                      ...settings,
                      googleAnalytics: {
                        ...settings.googleAnalytics,
                        measurementId: e.target.value
                      }
                    })}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full pl-10 pr-3 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-[#666]">Google Analytics 4のMeasurement IDを入力してください</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  API Secret
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type={showSecrets['ga-secret'] ? 'text' : 'password'}
                    value={settings.googleAnalytics.apiSecret}
                    onChange={(e) => setSettings({
                      ...settings,
                      googleAnalytics: {
                        ...settings.googleAnalytics,
                        apiSecret: e.target.value
                      }
                    })}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('ga-secret')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a8a8a8] hover:text-[#ececec]"
                  >
                    {showSecrets['ga-secret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#666]">Measurement Protocol API Secret</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  Property ID
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type="text"
                    value={settings.googleAnalytics.propertyId}
                    onChange={(e) => setSettings({
                      ...settings,
                      googleAnalytics: {
                        ...settings.googleAnalytics,
                        propertyId: e.target.value
                      }
                    })}
                    placeholder="1234567890"
                    className="w-full pl-10 pr-3 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-[#666]">Google Analytics Property ID</p>
              </div>
            </div>
          )}

          {/* Google Business Profile Tab */}
          {activeTab === 'googleBusinessProfile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  Account ID
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type="text"
                    value={settings.googleBusinessProfile.accountId}
                    onChange={(e) => setSettings({
                      ...settings,
                      googleBusinessProfile: {
                        ...settings.googleBusinessProfile,
                        accountId: e.target.value
                      }
                    })}
                    placeholder="accounts/1234567890"
                    className="w-full pl-10 pr-3 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-[#666]">Google My Business Account ID</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  Location ID
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type="text"
                    value={settings.googleBusinessProfile.locationId}
                    onChange={(e) => setSettings({
                      ...settings,
                      googleBusinessProfile: {
                        ...settings.googleBusinessProfile,
                        locationId: e.target.value
                      }
                    })}
                    placeholder="locations/1234567890"
                    className="w-full pl-10 pr-3 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-[#666]">Business Location ID</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type={showSecrets['gbp-api'] ? 'text' : 'password'}
                    value={settings.googleBusinessProfile.apiKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      googleBusinessProfile: {
                        ...settings.googleBusinessProfile,
                        apiKey: e.target.value
                      }
                    })}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('gbp-api')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a8a8a8] hover:text-[#ececec]"
                  >
                    {showSecrets['gbp-api'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#666]">Google API Key</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  OAuth Client ID
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type="text"
                    value={settings.googleBusinessProfile.clientId}
                    onChange={(e) => setSettings({
                      ...settings,
                      googleBusinessProfile: {
                        ...settings.googleBusinessProfile,
                        clientId: e.target.value
                      }
                    })}
                    placeholder="xxxxxxxxxxxx.apps.googleusercontent.com"
                    className="w-full pl-10 pr-3 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-[#666]">OAuth 2.0 Client ID</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  OAuth Client Secret
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type={showSecrets['gbp-secret'] ? 'text' : 'password'}
                    value={settings.googleBusinessProfile.clientSecret}
                    onChange={(e) => setSettings({
                      ...settings,
                      googleBusinessProfile: {
                        ...settings.googleBusinessProfile,
                        clientSecret: e.target.value
                      }
                    })}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('gbp-secret')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a8a8a8] hover:text-[#ececec]"
                  >
                    {showSecrets['gbp-secret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#666]">OAuth 2.0 Client Secret</p>
              </div>
            </div>
          )}

          {/* SERP API Tab */}
          {activeTab === 'serpApi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
                  <input
                    type={showSecrets['serp-api'] ? 'text' : 'password'}
                    value={settings.serpApi.apiKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      serpApi: {
                        ...settings.serpApi,
                        apiKey: e.target.value
                      }
                    })}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('serp-api')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a8a8a8] hover:text-[#ececec]"
                  >
                    {showSecrets['serp-api'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#666]">SerpApi or similar search API key</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  Search Engine
                </label>
                <select
                  value={settings.serpApi.engine}
                  onChange={(e) => setSettings({
                    ...settings,
                    serpApi: {
                      ...settings.serpApi,
                      engine: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] focus:outline-none focus:border-[#10a37f] transition-colors"
                >
                  <option value="google">Google</option>
                  <option value="bing">Bing</option>
                  <option value="yahoo">Yahoo</option>
                  <option value="baidu">Baidu</option>
                </select>
                <p className="mt-1 text-xs text-[#666]">使用する検索エンジン</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a8a8a8] mb-2">
                  Search Domain
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.serpApi.domain}
                    onChange={(e) => setSettings({
                      ...settings,
                      serpApi: {
                        ...settings.serpApi,
                        domain: e.target.value
                      }
                    })}
                    placeholder="google.co.jp"
                    className="w-full px-3 py-2 bg-[#171717] border border-[#424242] rounded-lg text-[#ececec] placeholder-[#666] focus:outline-none focus:border-[#10a37f] transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-[#666]">検索対象のドメイン（例: google.co.jp）</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#424242]">
          <div className="text-sm text-[#a8a8a8]">
            {saveMessage && (
              <span className={saveMessage.includes('失敗') || saveMessage.includes('エラー') ? 'text-red-400' : 'text-[#10a37f]'}>
                {saveMessage}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#a8a8a8] hover:text-[#ececec] transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-6 py-2 bg-[#10a37f] hover:bg-[#0d8f6f] text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}