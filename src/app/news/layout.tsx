import React from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link rel="stylesheet" href="/css/styles.css" />
      <link rel="stylesheet" href="/css/nav-actions.css" />
      <link rel="stylesheet" href="/css/language-switcher.css" />
      <link rel="stylesheet" href="/styles/news/news.css" />
      <style dangerouslySetInnerHTML={{__html: `
        /* ニュースページ専用ヘッダースタイル */
        .news-only-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 72px;
          z-index: 9999;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e1e4e8;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .news-only-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .news-only-logo {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          text-decoration: none;
          letter-spacing: 0.1em;
        }
        
        .news-only-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: 0.05em;
        }
        
        .news-only-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .news-only-reservation-btn {
          background: #0066ff;
          color: white;
          padding: 10px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .news-only-reservation-btn:hover {
          background: #0052cc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }
        
        .news-only-menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .news-only-menu-toggle span {
          display: block;
          width: 100%;
          height: 2px;
          background: #1a1a1a;
          transition: all 0.3s;
        }
        
        /* モバイルメニュー */
        .news-only-mobile-menu {
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          background: white;
          transform: translateY(-100%);
          transition: transform 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-height: calc(100vh - 72px);
          overflow-y: auto;
        }
        
        .news-only-mobile-menu.open {
          transform: translateY(0);
        }
        
        .news-only-mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e1e4e8;
        }
        
        .news-only-mobile-logo {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          text-decoration: none;
        }
        
        .news-only-mobile-close {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
        }
        
        .news-only-mobile-close span {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 20px;
          height: 2px;
          background: #1a1a1a;
          transform-origin: center;
        }
        
        .news-only-mobile-close span:first-child {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        
        .news-only-mobile-close span:last-child {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
        
        .news-only-mobile-body {
          padding: 24px;
        }
        
        .news-only-mobile-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          text-align: center;
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }
        
        .news-only-mobile-language {
          margin-bottom: 24px;
        }
        
        .news-only-mobile-reservation {
          display: block;
          background: #0066ff;
          color: white;
          padding: 16px;
          text-align: center;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        
        .news-only-mobile-reservation:hover {
          background: #0052cc;
        }
        
        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          .news-only-header {
            height: 64px;
          }
          
          .news-only-title {
            display: none;
          }
          
          .news-only-actions .desktop-language-switcher {
            display: none;
          }
          
          .news-only-reservation-btn {
            display: none;
          }
          
          .news-only-menu-toggle {
            display: flex;
          }
          
          .news-only-mobile-menu {
            top: 64px;
          }
        }
      `}} />
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </>
  )
}