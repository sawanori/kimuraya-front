'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'
export default function NewsFooter() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(setContent)
      .catch(err => console.error('Error fetching content:', err));
  }, []);

  if (!content) return null;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo jp-title">{content.info.textFields.shopName.split(' ')[0]}<small style={{color: "rgba(255,255,255,0.8)", fontSize: "0.7em", display: "block", marginTop: "5px", fontWeight: 300}}>サンプル店</small></div>
          <div className="footer-contact">
            <div className="footer-tel">Tel: {content.info.textFields.phone}</div>
            <div className="footer-message">ホームページを見たとお伝えいただけるとスムーズです。</div>
          </div>
          <a href="#reservation" className="footer-reservation-btn">WEB予約はこちら</a>
        </div>
        <div className="footer-right">
          <div className="footer-info-group">
            <div className="footer-info-item">
              <span className="footer-label">{t('info.label.address')}</span>
              <span className="footer-value" dangerouslySetInnerHTML={{ __html: content.info.textFields.address.replace(/\n/g, ' ') }} />
            </div>
            <div className="footer-info-item">
              <span className="footer-label">{t('info.label.access')}</span>
              <span className="footer-value">{content.info.textFields.access}</span>
            </div>
            <div className="footer-info-item">
              <span className="footer-label">{t('info.label.hours')}</span>
              <span className="footer-value" dangerouslySetInnerHTML={{ __html: content.info.textFields.businessHours.replace(/\n/g, '<br />') }} />
            </div>
            <div className="footer-info-item">
              <span className="footer-label">{t('info.label.closed')}</span>
              <span className="footer-value">{content.info.textFields.closedDays}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}