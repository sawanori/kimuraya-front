'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function NewsHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  // ニュースページではhero-hiddenクラスを削除
  useEffect(() => {
    const header = document.querySelector('.news-header');
    if (header) {
      header.classList.remove('hero-hidden');
      // MutationObserverで変更を監視し、hero-hiddenが追加されたら削除
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (header.classList.contains('hero-hidden')) {
              header.classList.remove('hero-hidden');
            }
          }
        });
      });
      
      observer.observe(header, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    // モバイルメニューの開閉処理
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navMenu = document.querySelector('.nav-menu');

    const openMenu = () => {
      mobileMenu?.classList.add('open');
      document.body.style.overflow = 'hidden';
      setIsMenuOpen(true);
    };

    const closeMenu = () => {
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
      setIsMenuOpen(false);
    };

    if (menuToggle) {
      menuToggle.addEventListener('click', openMenu);
    }
    
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', openMenu);
    }

    // モバイルメニュー内のリンクをクリックしたら閉じる
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href === '#reservation') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeMenu();
        }
      });
    });

    return () => {
      if (menuToggle) menuToggle.removeEventListener('click', openMenu);
      if (mobileMenuBtn) mobileMenuBtn.removeEventListener('click', openMenu);
    };
  }, []);

  return (
    <header className="header news-header" style={{ opacity: 1, transform: 'translateY(0)', visibility: 'visible', display: 'block' }}>
      <nav className="nav">
        <Link href="/" className="logo jp-title">木村屋</Link>
        
        <ul className="nav-menu">
          <li><Link href="/">{t('nav.home')}</Link></li>
          <li><Link href="/#about">{t('nav.about')}</Link></li>
          <li><Link href="/#menu">{t('nav.menu')}</Link></li>
          <li><Link href="/#gallery">{t('nav.gallery')}</Link></li>
          <li><Link href="/#info">{t('nav.info')}</Link></li>
          <li><Link href="/news" className="active">新着情報</Link></li>
        </ul>
        
        <div className="nav-actions">
          <div className="desktop-language-switcher">
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
          <a href="#" className="nav-reservation-btn">{t('button.webReservation')}</a>
        </div>
        
        <button className="menu-toggle" id="menuToggle">
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>
      </nav>

      {/* モバイルメニュー */}
      <div className="mobile-menu" id="mobileMenu">
        <div className="mobile-menu-header">
          <a href="/" className="mobile-menu-logo jp-title">木村屋</a>
          <button 
            className="mobile-menu-close" 
            id="mobileMenuClose"
            onClick={() => {
              document.getElementById('mobileMenu')?.classList.remove('open');
              document.body.style.overflow = '';
              setIsMenuOpen(false);
            }}
          >
            <span></span>
            <span></span>
          </button>
        </div>
        <div className="mobile-menu-body">
          <ul className="mobile-menu-nav">
            <li><Link href="/">{t('nav.home')}</Link></li>
            <li><Link href="/#about">{t('nav.about')}</Link></li>
            <li><Link href="/#menu">{t('nav.menu')}</Link></li>
            <li><Link href="/#gallery">{t('nav.gallery')}</Link></li>
            <li><Link href="/#info">{t('nav.info')}</Link></li>
            <li><Link href="/news" className="active">新着情報</Link></li>
          </ul>
          <div className="mobile-menu-language">
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
          <a href="#reservation" className="mobile-menu-reservation">{t('button.webReservation')}</a>
        </div>
      </div>
    </header>
  );
}