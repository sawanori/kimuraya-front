'use client'

import { useState, useEffect, useRef } from 'react'
import { Language, languages, languageNames, languageFlags, setLanguageCookie } from '@/lib/i18n'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  currentLanguage: Language
  onLanguageChange: (lang: Language) => void
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageSelect = (lang: Language) => {
    setLanguageCookie(lang)
    onLanguageChange(lang)
    setIsOpen(false)
  }

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-switcher-button"
        aria-label="Language switcher"
      >
        <Globe className="w-5 h-5" />
        <span className="language-flag">{languageFlags[currentLanguage]}</span>
        <span className="language-name">{currentLanguage.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageSelect(lang)}
              className={`language-option ${currentLanguage === lang ? 'active' : ''}`}
            >
              <span className="language-flag">{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
              {currentLanguage === lang && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}