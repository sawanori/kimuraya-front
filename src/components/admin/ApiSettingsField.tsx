'use client'

import React, { useState } from 'react'

interface ApiSettingsFieldProps {
  path: string
  value?: any
  onChange?: (value: any) => void
}

export const ApiSettingsField: React.FC<ApiSettingsFieldProps> = ({ path, value = {}, onChange }) => {
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState('')
  
  const handleApiKeyChange = (newValue: string) => {
    setApiKey(newValue)
    if (onChange) {
      onChange({
        ...value,
        googleBusinessProfile: {
          ...value.googleBusinessProfile,
          apiKeyEncrypted: newValue
        }
      })
    }
  }

  return (
    <div className="field-type group">
      <div className="field-label">
        <label>API設定</label>
      </div>
      
      <div className="fields-group">
        <div className="field-type group">
          <div className="field-label">
            <label>Google Business Profile</label>
          </div>
          
          <div className="fields-group">
            <div className="field">
              <label htmlFor={`${path}.googleBusinessProfile.apiKey`}>
                APIキー
              </label>
              <div className="api-key-input-wrapper">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  id={`${path}.googleBusinessProfile.apiKey`}
                  value={apiKey || value?.googleBusinessProfile?.apiKeyMasked || ''}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="APIキーを入力"
                  className="field-input"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="show-hide-button"
                >
                  {showApiKey ? '隠す' : '表示'}
                </button>
              </div>
              <div className="field-description">
                APIキーは暗号化されて保存されます
              </div>
            </div>
            
            <div className="field">
              <label htmlFor={`${path}.googleBusinessProfile.placeId`}>
                Place ID
              </label>
              <input
                type="text"
                id={`${path}.googleBusinessProfile.placeId`}
                value={value?.googleBusinessProfile?.placeId || ''}
                onChange={(e) => {
                  if (onChange) {
                    onChange({
                      ...value,
                      googleBusinessProfile: {
                        ...value.googleBusinessProfile,
                        placeId: e.target.value
                      }
                    })
                  }
                }}
                placeholder="Google Business ProfileのPlace ID"
                className="field-input"
              />
            </div>
            
            <div className="field checkbox">
              <input
                type="checkbox"
                id={`${path}.googleBusinessProfile.isEnabled`}
                checked={value?.googleBusinessProfile?.isEnabled || false}
                onChange={(e) => {
                  if (onChange) {
                    onChange({
                      ...value,
                      googleBusinessProfile: {
                        ...value.googleBusinessProfile,
                        isEnabled: e.target.checked
                      }
                    })
                  }
                }}
              />
              <label htmlFor={`${path}.googleBusinessProfile.isEnabled`}>
                有効化
              </label>
            </div>
          </div>
        </div>
        
        <div className="field">
          <label htmlFor={`${path}.customApiEndpoint`}>
            カスタムAPIエンドポイント
          </label>
          <input
            type="text"
            id={`${path}.customApiEndpoint`}
            value={value?.customApiEndpoint || ''}
            onChange={(e) => {
              if (onChange) {
                onChange({
                  ...value,
                  customApiEndpoint: e.target.value
                })
              }
            }}
            placeholder="https://api.example.com/reviews"
            className="field-input"
          />
          <div className="field-description">
            外部レビューAPIのエンドポイントURL
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .api-key-input-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .field-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .show-hide-button {
          padding: 8px 16px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .show-hide-button:hover {
          background: #e0e0e0;
        }
        
        .field {
          margin-bottom: 16px;
        }
        
        .field label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
        }
        
        .field-description {
          margin-top: 4px;
          font-size: 12px;
          color: #666;
        }
        
        .field.checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .field.checkbox label {
          margin-bottom: 0;
        }
        
        .fields-group {
          padding: 16px;
          background: #f9f9f9;
          border-radius: 4px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  )
}