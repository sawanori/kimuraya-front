'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface ApiSettings {
  googleAnalytics: {
    measurementId: string
    apiSecret: string
    propertyId: string
  }
  googleBusinessProfile: {
    accountId: string
    locationId: string
    apiKey: string
    clientId: string
    clientSecret: string
  }
  serpApi: {
    apiKey: string
    engine: string
    domain: string
  }
}

interface ApiSettingsContextType {
  settings: ApiSettings | null
  isLoading: boolean
  error: string | null
  loadSettings: () => Promise<void>
  updateSettings: (newSettings: ApiSettings) => Promise<boolean>
  getSetting: (path: string) => any
}

const ApiSettingsContext = createContext<ApiSettingsContextType | undefined>(undefined)

export function ApiSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ApiSettings | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Load settings on mount
  useEffect(() => {
    setIsMounted(true)
    // Only load settings after component is mounted
    const timer = setTimeout(() => {
      loadSettings()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/settings/api-keys', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else if (response.status === 401) {
        // Don't set error for authentication issues
        console.log('User not authenticated yet, skipping API settings load')
      } else {
        setError('Failed to load API settings')
      }
    } catch (err) {
      console.error('Failed to load API settings:', err)
      setError('Error loading API settings')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (newSettings: ApiSettings): Promise<boolean> => {
    setError(null)
    
    try {
      const response = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newSettings)
      })
      
      if (response.ok) {
        setSettings(newSettings)
        return true
      } else {
        setError('Failed to save API settings')
        return false
      }
    } catch (err) {
      console.error('Failed to save API settings:', err)
      setError('Error saving API settings')
      return false
    }
  }

  // Helper function to get nested setting values
  const getSetting = (path: string): any => {
    if (!settings) return null
    
    const keys = path.split('.')
    let value: any = settings
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key as keyof typeof value]
      } else {
        return null
      }
    }
    
    return value
  }

  const value: ApiSettingsContextType = {
    settings,
    isLoading,
    error,
    loadSettings,
    updateSettings,
    getSetting
  }

  return (
    <ApiSettingsContext.Provider value={value}>
      {children}
    </ApiSettingsContext.Provider>
  )
}

// Custom hook for easy access
export function useApiSettings() {
  const context = useContext(ApiSettingsContext)
  if (context === undefined) {
    throw new Error('useApiSettings must be used within an ApiSettingsProvider')
  }
  return context
}

// Convenience hooks for specific APIs
export function useGoogleAnalyticsSettings() {
  const { settings, getSetting } = useApiSettings()
  return {
    measurementId: getSetting('googleAnalytics.measurementId'),
    apiSecret: getSetting('googleAnalytics.apiSecret'),
    propertyId: getSetting('googleAnalytics.propertyId'),
    isConfigured: !!(
      getSetting('googleAnalytics.measurementId') && 
      getSetting('googleAnalytics.apiSecret')
    )
  }
}

export function useGoogleBusinessProfileSettings() {
  const { settings, getSetting } = useApiSettings()
  return {
    accountId: getSetting('googleBusinessProfile.accountId'),
    locationId: getSetting('googleBusinessProfile.locationId'),
    apiKey: getSetting('googleBusinessProfile.apiKey'),
    clientId: getSetting('googleBusinessProfile.clientId'),
    clientSecret: getSetting('googleBusinessProfile.clientSecret'),
    isConfigured: !!(
      getSetting('googleBusinessProfile.accountId') && 
      getSetting('googleBusinessProfile.locationId') &&
      getSetting('googleBusinessProfile.apiKey')
    )
  }
}

export function useSerpApiSettings() {
  const { settings, getSetting } = useApiSettings()
  return {
    apiKey: getSetting('serpApi.apiKey'),
    engine: getSetting('serpApi.engine'),
    domain: getSetting('serpApi.domain'),
    isConfigured: !!getSetting('serpApi.apiKey')
  }
}