'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function NewsOnlyHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return (
    <>
      <header className="news-only-header">
        <nav className="news-only-nav">
          <Link href="/" className="news-only-logo">木村屋</Link>
          
          <div className="news-only-title">新着情報</div>
          
          <div className="news-only-actions">
            <div className="desktop-language-switcher">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>
            <a href="#" className="news-only-reservation-btn">{t('button.webReservation')}</a>
          </div>
          
          <button 
            className="news-only-menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* モバイルメニュー */}
      <div className={`news-only-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="news-only-mobile-header">
          <Link href="/" className="news-only-mobile-logo">木村屋</Link>
          <button 
            className="news-only-mobile-close" 
            onClick={() => setIsMenuOpen(false)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
        <div className="news-only-mobile-body">
          <div className="news-only-mobile-title">新着情報</div>
          <div className="news-only-mobile-language">
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
          <a href="#reservation" className="news-only-mobile-reservation">{t('button.webReservation')}</a>
        </div>
      </div>
    </>
  );
}