"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useMultilingual } from '@/hooks/useMultilingual';
import { fetchLatestArticles } from '@/lib/news/api';
import { Article } from '@/types/news';
import { mockArticles } from '@/lib/news/mock-data';
import Link from 'next/link';
import YouTubeLoop from '@/components/YouTubeLoop';

interface ContentData {
  hero: {
    textFields: {
      mainTitle: string;
      subTitle: string;
      openTime: string;
      closeTime: string;
      closedDay: string;
      backgroundType?: string;
    };
    imageFields: {
      logo: string;
      bgPC1: string;
      bgPC2: string;
      bgPC3: string;
      bgPC4: string;
      bgMobile1: string;
      bgMobile2: string;
      bgMobile3: string;
    };
    videoFields?: {
      bgVideo: string;
    };
  };
  introParallax: {
    textFields: {
      message: string;
    };
    backgroundField?: string;
    imageFields?: {
      parallaxBg?: string;
    };
  };
  craft: {
    textFields: {
      leftText: string;
      rightText: string;
    };
    imageFields: {
      image1: string;
      image2: string;
      image3: string;
    };
  };
  features: {
    textFields: {
      mainTitle: string;
      feature1Title: string;
      feature1Description: string;
      feature2Title: string;
      feature2Description: string;
      feature3Title: string;
      feature3Description: string;
      feature4Title: string;
      feature4Description: string;
    };
    imageFields: {
      feature1Image: string;
      feature2Image: string;
      feature3Image: string;
      feature4Image: string;
    };
  };
  menu: {
    textFields: {
      sectionTitle: string;
      subTitle: string;
    };
    menuCards?: Array<{
      id: string;
      subTitle: string;
      title: string;
      items: Array<{
        name: string;
        price: string;
      }>;
      note?: string;
    }>;
  };
  seats: {
    textFields: {
      title: string;
      subTitle: string;
    };
    imageFields: {
      privateSpace: string;
      semiPrivateBox: string;
      tableSeats: string;
      groupSeats: string;
      windowDateSeats: string;
    };
    seatData?: Array<{
      id: string;
      name: string;
      capacity: string;
      description: string;
      tags: string[];
      image: string;
    }>;
  };
  gallery: {
    textFields: {
      title: string;
      subTitle: string;
    };
    imageFields: {
      gallery1: string;
      gallery2: string;
      gallery3: string;
      gallery4: string;
      gallery5: string;
      gallery6: string;
      gallery7: string;
      gallery8: string;
      gallery9: string;
    };
  };
  info: {
    textFields: {
      title: string;
      shopName: string;
      address: string;
      access: string;
      phone: string;
      businessHours: string;
      closedDays: string;
      seats: string;
      googleMapUrl?: string;
    };
  };
  motsunabe?: {
    textFields?: {
      sectionTitle?: string;
      sectionSubtitle?: string;
      description?: string;
      [key: string]: string | undefined;
    };
    imageFields?: {
      mainImage?: string;
      [key: string]: string | undefined;
    };
    badges?: string[];
    showOptions?: boolean;
    options?: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
    }>;
    [key: string]: unknown;
  };
  'intro-parallax'?: {
    textFields?: {
      message?: string;
    };
    imageFields?: {
      parallaxBg?: string;
    };
  };
  diningStyle?: {
    textFields?: {
      [key: string]: string;
    };
    imageFields?: {
      partyBg?: string;
      sakeBg?: string;
    };
  };
  courses?: {
    cards?: Array<{
      id: string;
      image: string;
      title: string;
      subtitle: string;
      price: string;
      note?: string;
      itemCount: string;
      description: string;
      menuItems: string[];
      features: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
      ctaText: string;
    }>;
  };
  drinks?: {
    title?: string;
    subtitle?: string;
    categories?: Array<{
      id: string;
      name: string;
      items: Array<{
        name: string;
        price: string;
      }>;
    }>;
  };
}

// Googleマップの共有リンクからembed用URLに変換する関数
function getGoogleMapEmbedUrl(shareUrl: string, infoFields?: { googleMapUrl?: string; address?: string; shopName?: string }): string {
  if (!shareUrl) return '';
  
  try {
    // 座標を含むURLから緯度経度を抽出（完全なURLの場合）
    const coordMatch = shareUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      // より正確な座標でのembed URL
      return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${lat},${lng}&zoom=17`;
    }
    
    // place IDを含むURLから抽出（完全なURLの場合）
    const placeMatch = shareUrl.match(/place\/([^\/\?@]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeName)}&zoom=17`;
    }
    
    // 短縮URLの場合は、住所または店名を使って検索する
    if (shareUrl.includes('maps.app.goo.gl') || shareUrl.includes('goo.gl/maps')) {
      const address = infoFields?.address || "神奈川県横浜市神奈川区鶴屋町2-15";
      const shopName = infoFields?.shopName || "木村屋本店 横浜鶴屋町";
      // 住所と店名を組み合わせてより正確な検索を行う
      const query = `${shopName} ${address.split('\n')[0]}`;
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}&zoom=17`;
    }
    
    // デフォルトは店名で検索
    const shopName = infoFields?.shopName || "木村屋本店 横浜鶴屋町";
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(shopName)}&zoom=17`;
    
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error);
    return '';
  }
}

export default function HomePage({ content }: { content: ContentData }) {
  const { language, setLanguage } = useLanguage();
  const { t, getContent } = useMultilingual();
  const [_mobileMenuOpen, _setMobileMenuOpen] = useState(false);
  const [_showAllGallery, _setShowAllGallery] = useState(false);
  const [currentSeat, setCurrentSeat] = useState(0);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showDrinksModal, setShowDrinksModal] = useState(false);
  const [currentCourseSlide, setCurrentCourseSlide] = useState(0);
  const [currentMotsunabeSlide, setCurrentMotsunabeSlide] = useState(0);
  const [currentGallerySlide, setCurrentGallerySlide] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [currentReviewSlide, setCurrentReviewSlide] = useState(0);
  // 初期データとしてモックデータの最新3件を使用
  const initialNews = mockArticles
    .filter(article => article.status === 'published' && new Date(article.publishedAt) <= new Date())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  
  
  const [latestNews, setLatestNews] = useState<Article[]>(initialNews);

  // 最新のニュースを取得（localStorageから）
  useEffect(() => {
    const loadLatestNews = async () => {
      try {
        // クライアントサイドでのみ実行
        if (typeof window !== 'undefined') {
          const articles = await fetchLatestArticles(3);
          setLatestNews(articles);
        }
      } catch (error) {
        console.error('ニュースの取得に失敗しました:', error);
      }
    };
    loadLatestNews();
  }, []);
  
  // PageTopボタンの設定
  useEffect(() => {
    const handlePageTop = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.page-top-btn')) {
        e.preventDefault();
        
        // スクロールコンテナの存在を確認
        const scrollContainer = document.querySelector('.scroll-container');
        if (scrollContainer) {
          // モバイルの場合はスクロールコンテナをスムーズスクロール
          const startPosition = scrollContainer.scrollTop;
          const duration = 500; // アニメーション時間（ミリ秒）
          const startTime = performance.now();
          
          const animateScroll = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // イージング関数（easeInOutQuad）
            const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            
            scrollContainer.scrollTop = startPosition * (1 - easeInOutQuad(progress));
            
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };
          
          requestAnimationFrame(animateScroll);
        } else {
          // デスクトップの場合は通常のスムーズスクロール
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    
    document.addEventListener('click', handlePageTop);
    return () => document.removeEventListener('click', handlePageTop);
  }, []);
  
  useEffect(() => {
    // 初期状態でナビゲーション非表示設定（PC・タブレットサイズのみ）
    const handleInitialNavigation = () => {
      if (window.innerWidth >= 768) {
        setHeaderHidden(true);
        const heroReservationBtn = document.getElementById('heroReservationBtn');
        const heroNavMenu = document.getElementById('heroNavMenu');
        if (heroReservationBtn) heroReservationBtn.style.display = 'block';
        if (heroNavMenu) heroNavMenu.style.display = 'flex';
      } else {
        setHeaderHidden(false);
      }
    };

    // スクロール時のナビゲーション表示制御
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        const heroSection = document.querySelector('.hero') as HTMLElement;
        if (heroSection) {
          const heroHeight = heroSection.offsetHeight;
          const scrollPercent = (window.scrollY / heroHeight) * 100;
          const heroReservationBtn = document.getElementById('heroReservationBtn');
          const heroNavMenu = document.getElementById('heroNavMenu');
          
          if (scrollPercent < 50) {
            // ヒーロー内50%未満はナビゲーション非表示、ヒーロー用要素表示
            setHeaderHidden(true);
            if (heroReservationBtn) heroReservationBtn.style.display = 'block';
            if (heroNavMenu) heroNavMenu.style.display = 'flex';
          } else {
            // ヒーロー内50%以上は通常のナビゲーション表示、ヒーロー用要素非表示
            setHeaderHidden(false);
            if (heroReservationBtn) heroReservationBtn.style.display = 'none';
            if (heroNavMenu) heroNavMenu.style.display = 'none';
          }
        }
      }
    };

    // リサイズ時のナビゲーション制御
    const handleResize = () => {
      handleInitialNavigation();
      handleScroll();
    };

    // 初期化
    handleInitialNavigation();
    
    // イベントリスナー追加
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    // craft section画像のスクロールアニメーション
    const craftImages = document.querySelectorAll('.craft-image-1, .craft-image-2, .craft-image-3');
    const craftObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    craftImages.forEach(image => {
      craftObserver.observe(image);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      craftObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    // ヒーロースライダー
    const backgroundType = content?.hero?.textFields?.backgroundType || 'slideshow';
    
    // 動画背景の場合は早期リターン
    if (backgroundType === 'video') {
      return;
    }
    
    const isMobile = window.innerWidth <= 768;
    const heroSlidesDesktop = document.querySelectorAll('.hero-slide-desktop');
    const heroSlidesMobile = document.querySelectorAll('.hero-slide-mobile');
    
    let interval: NodeJS.Timeout;
    
    if (isMobile && heroSlidesMobile.length > 0) {
      let currentSlideMobile = 0;
      
      // 初期状態設定 - 最初のスライドをアクティブに
      heroSlidesMobile[0].classList.add('active');
      
      // 最初のスライドのアニメーションをリセットして開始
      const firstSlideMobile = heroSlidesMobile[0].querySelector('img');
      if (firstSlideMobile) {
        firstSlideMobile.style.animation = 'none';
        void firstSlideMobile.offsetHeight; // リフローを強制
        firstSlideMobile.style.animation = 'zoomOut 10s linear forwards';
      }
      
      function changeSlideMobile() {
        heroSlidesMobile[currentSlideMobile].classList.remove('active');
        currentSlideMobile = (currentSlideMobile + 1) % heroSlidesMobile.length;
        heroSlidesMobile[currentSlideMobile].classList.add('active');
        
        // 新しいスライドのアニメーションをリセット
        const nextImg = heroSlidesMobile[currentSlideMobile].querySelector('img');
        if (nextImg) {
          nextImg.style.animation = 'none';
          void nextImg.offsetHeight;
          nextImg.style.animation = 'zoomOut 10s linear forwards';
        }
      }
      
      interval = setInterval(changeSlideMobile, 10000);
    } else if (!isMobile && heroSlidesDesktop.length > 0) {
      let currentSlideDesktop = 0;
      
      // 初期状態設定 - 最初のスライドをアクティブに
      heroSlidesDesktop[0].classList.add('active');
      
      // 最初のスライドのアニメーションをリセットして開始
      const firstSlideDesktop = heroSlidesDesktop[0].querySelector('img');
      if (firstSlideDesktop) {
        firstSlideDesktop.style.animation = 'none';
        void firstSlideDesktop.offsetHeight; // リフローを強制
        firstSlideDesktop.style.animation = 'zoomOut 10s linear forwards';
      }
      
      function changeSlideDesktop() {
        heroSlidesDesktop[currentSlideDesktop].classList.remove('active');
        currentSlideDesktop = (currentSlideDesktop + 1) % heroSlidesDesktop.length;
        heroSlidesDesktop[currentSlideDesktop].classList.add('active');
        
        // 新しいスライドのアニメーションをリセット
        const nextImg = heroSlidesDesktop[currentSlideDesktop].querySelector('img');
        if (nextImg) {
          nextImg.style.animation = 'none';
          void nextImg.offsetHeight;
          nextImg.style.animation = 'zoomOut 10s linear forwards';
        }
      }
      
      interval = setInterval(changeSlideDesktop, 10000);
    }
    
    // クリーンアップ
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [content]);

  // フェードインアニメーション
  useEffect(() => {
    const fadeUpElements = document.querySelectorAll('.fade-up');
    const fadeScaleElements = document.querySelectorAll('.fade-scale');
    const allFadeElements = [...fadeUpElements, ...fadeScaleElements];
    
    // 初期表示のアニメーション（ヒーローセクション）
    const heroElements = document.querySelectorAll('.hero .fade-up');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 100);
    });

    // スクロールでのアニメーション
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    allFadeElements.forEach(element => {
      // ヒーローセクション以外の要素を監視
      if (!element.closest('.hero')) {
        observer.observe(element);
      }
    });

    return () => {
      allFadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  // モバイルメニューの開閉
  useEffect(() => {
    
    // 要素の存在確認
    const _menuToggle = document.getElementById('menuToggle');
    const _mobileMenu = document.getElementById('mobileMenu');
    const _mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    
    // イベント委譲を使用してより確実にイベントを処理
    const handleClick = (e: MouseEvent) => {
      
      const target = e.target as HTMLElement;
      const mobileMenu = document.getElementById('mobileMenu');
      
      if (!mobileMenu) {
        return;
      }

      // ハンバーガーボタンのクリック
      if (target.id === 'menuToggle' || target.closest('#menuToggle') || 
          target.id === 'mobileMenuBtn' || target.closest('#mobileMenuBtn')) {
        e.preventDefault();
        mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
        
        // デバッグ：スタイルを直接適用
        mobileMenu.style.display = 'block';
        mobileMenu.style.pointerEvents = 'auto';
        const menuContent = mobileMenu.querySelector('.mobile-menu-content') as HTMLElement;
        const menuOverlay = mobileMenu.querySelector('.mobile-menu-overlay') as HTMLElement;
        if (menuContent) {
          menuContent.style.transform = 'translateX(0)';
        }
        if (menuOverlay) {
          menuOverlay.style.opacity = '1';
        }
        
        // ハンバーガーボタンのアニメーション
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
          menuToggle.classList.add('active');
        }
      }
      
      // 閉じるボタンのクリック
      if (target.id === 'mobileMenuClose' || target.closest('#mobileMenuClose') ||
          target.id === 'mobileMenuOverlay') {
        e.preventDefault();
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // デバッグ：スタイルをリセット
        mobileMenu.style.display = '';
        mobileMenu.style.pointerEvents = '';
        const menuContent = mobileMenu.querySelector('.mobile-menu-content') as HTMLElement;
        const menuOverlay = mobileMenu.querySelector('.mobile-menu-overlay') as HTMLElement;
        if (menuContent) {
          menuContent.style.transform = '';
        }
        if (menuOverlay) {
          menuOverlay.style.opacity = '';
        }
        
        // ハンバーガーボタンのアニメーションを戻す
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
          menuToggle.classList.remove('active');
        }
      }
    };

    // documentレベルでイベントを監視
    document.addEventListener('click', handleClick);

    // スムーズスクロール
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href === '#reservation') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // メニューを閉じる
          const mobileMenu = document.getElementById('mobileMenu');
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
        }
      });
    });

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // 座席スライドショーの初期化と制御
  useEffect(() => {
    const seatSlides = document.querySelectorAll('.seat-slide');
    const thumbnails = document.querySelectorAll('.thumbnail');

    // スライドとサムネイルの更新
    const updateSlideshow = (index: number) => {
      // すべてのスライドとサムネイルから active クラスを削除
      seatSlides.forEach(slide => slide.classList.remove('active'));
      thumbnails.forEach(thumb => thumb.classList.remove('active'));

      // 選択されたスライドとサムネイルに active クラスを追加
      if (seatSlides[index]) seatSlides[index].classList.add('active');
      if (thumbnails[index]) thumbnails[index].classList.add('active');
    };

    // サムネイルクリックイベント
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        setCurrentSeat(index);
        updateSlideshow(index);
      });
    });

    // 初期状態を設定
    updateSlideshow(currentSeat);

    // クリーンアップ
    return () => {
      thumbnails.forEach((thumbnail) => {
        thumbnail.removeEventListener('click', () => {});
      });
    };
  }, [currentSeat]);

  // もつ鍋オプションのスライド機能（モバイル用）
  useEffect(() => {
    const handleMotsunabeSwipe = () => {
      const optionsGrid = document.querySelector('.options-grid');
      if (!optionsGrid) return;

      let startX = 0;
      let currentX = 0;
      let isDragging = false;

      const handleTouchStart = (e: TouchEvent) => {
        if (window.innerWidth > 768) return; // モバイルのみ
        startX = e.touches[0].clientX;
        isDragging = true;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || window.innerWidth > 768) return;
        currentX = e.touches[0].clientX;
      };

      const handleTouchEnd = () => {
        if (!isDragging || window.innerWidth > 768) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        const threshold = 50; // スワイプの閾値
        
        if (Math.abs(diffX) > threshold) {
          const optionsCount = content?.motsunabe?.options?.length || 0;
          if (diffX > 0) {
            // 左スワイプ（次へ）- 無限ループ
            setCurrentMotsunabeSlide(prev => (prev + 1) % optionsCount);
          } else if (diffX < 0) {
            // 右スワイプ（前へ）- 無限ループ
            setCurrentMotsunabeSlide(prev => (prev - 1 + optionsCount) % optionsCount);
          }
        }
      };

      optionsGrid.addEventListener('touchstart', handleTouchStart as EventListener);
      optionsGrid.addEventListener('touchmove', handleTouchMove as EventListener);
      optionsGrid.addEventListener('touchend', handleTouchEnd);

      return () => {
        optionsGrid.removeEventListener('touchstart', handleTouchStart as EventListener);
        optionsGrid.removeEventListener('touchmove', handleTouchMove as EventListener);
        optionsGrid.removeEventListener('touchend', handleTouchEnd);
      };
    };

    handleMotsunabeSwipe();
  }, [currentMotsunabeSlide, content?.motsunabe?.options]);

  // もつ鍋オプションの自動スライド（モバイル用）
  useEffect(() => {
    if (window.innerWidth > 768) return; // モバイルのみ
    
    const optionsCount = content?.motsunabe?.options?.length || 0;
    if (optionsCount <= 1) return; // 1枚以下なら自動スライド不要
    
    const interval = setInterval(() => {
      setCurrentMotsunabeSlide(prev => (prev + 1) % optionsCount);
    }, 4000); // 4秒ごとに自動スライド
    
    return () => clearInterval(interval);
  }, [content?.motsunabe?.options]);

  // スライド位置の更新
  useEffect(() => {
    if (window.innerWidth > 768) return;
    
    const optionsGrid = document.querySelector('.options-grid') as HTMLElement;
    const cards = document.querySelectorAll('.option-card');
    
    if (optionsGrid && cards.length > 0) {
      const cardWidth = cards[0].clientWidth;
      const scrollPosition = currentMotsunabeSlide * cardWidth;
      optionsGrid.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentMotsunabeSlide]);

  // ギャラリースライドのスクロール制御（モバイル用）
  useEffect(() => {
    if (window.innerWidth > 768) return;
    
    const gallerySlides = document.querySelector('.gallery-slides') as HTMLElement;
    if (!gallerySlides) return;
    
    const slideWidth = window.innerWidth;
    // オフセット1を追加（複製した最初の画像の分）
    const scrollPosition = (currentGallerySlide + 1) * slideWidth;
    
    gallerySlides.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }, [currentGallerySlide]);

  // 無限スクロールの処理
  useEffect(() => {
    if (window.innerWidth > 768) return;
    
    const gallerySlides = document.querySelector('.gallery-slides') as HTMLElement;
    if (!gallerySlides) return;
    
    const handleScroll = () => {
      const slideWidth = window.innerWidth;
      const scrollLeft = gallerySlides.scrollLeft;
      const maxScroll = slideWidth * 10; // 9枚 + 前後の複製
      
      // 最初の複製画像にいる場合、最後の実画像に瞬間移動
      if (scrollLeft <= 0) {
        gallerySlides.scrollLeft = slideWidth * 9;
        setCurrentGallerySlide(8);
      }
      // 最後の複製画像にいる場合、最初の実画像に瞬間移動
      else if (scrollLeft >= maxScroll) {
        gallerySlides.scrollLeft = slideWidth;
        setCurrentGallerySlide(0);
      }
    };
    
    gallerySlides.addEventListener('scrollend', handleScroll);
    
    // 初期位置を設定
    const slideWidth = window.innerWidth;
    gallerySlides.scrollLeft = slideWidth;
    
    return () => {
      gallerySlides.removeEventListener('scrollend', handleScroll);
    };
  }, []);

  // ギャラリースライドショーのスワイプ機能（モバイル用）
  useEffect(() => {
    if (window.innerWidth > 768) return;
    
    const gallerySlides = document.querySelector('.gallery-slides');
    if (!gallerySlides) return;
    
    // スワイプ機能
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      e.preventDefault(); // スクロールを防ぐ
    };
    
    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diffX = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // 左スワイプ（次へ）
          setCurrentGallerySlide(prev => (prev + 1) % 9);
        } else {
          // 右スワイプ（前へ）
          setCurrentGallerySlide(prev => (prev - 1 + 9) % 9);
        }
      }
    };
    
    gallerySlides.addEventListener('touchstart', handleTouchStart as EventListener);
    gallerySlides.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    gallerySlides.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      gallerySlides.removeEventListener('touchstart', handleTouchStart as EventListener);
      gallerySlides.removeEventListener('touchmove', handleTouchMove as EventListener);
      gallerySlides.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // レビューカルーセルの制御
  useEffect(() => {
    const reviewsTrack = document.querySelector('.reviews-track') as HTMLElement;
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewIndicators = document.querySelectorAll('.review-indicator');
    const prevBtn = document.getElementById('reviewPrevBtn');
    const nextBtn = document.getElementById('reviewNextBtn');
    
    if (!reviewsTrack || reviewCards.length === 0) return;
    
    const isMobile = window.innerWidth <= 768;
    const cardWidth = isMobile ? window.innerWidth - 80 : 430; // モバイルは画面幅-80px、デスクトップは400+30
    const totalSlides = reviewCards.length;
    
    // スライドを更新する関数
    const updateSlide = (index: number) => {
      const offset = index * cardWidth;
      reviewsTrack.style.transform = `translateX(-${offset}px)`;
      
      // インジケーター更新
      reviewIndicators.forEach((indicator, i) => {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
      
      setCurrentReviewSlide(index);
    };
    
    // 前へボタン
    const handlePrev = () => {
      const newIndex = currentReviewSlide === 0 ? totalSlides - 1 : currentReviewSlide - 1;
      updateSlide(newIndex);
    };
    
    // 次へボタン
    const handleNext = () => {
      const newIndex = (currentReviewSlide + 1) % totalSlides;
      updateSlide(newIndex);
    };
    
    // ボタンイベントリスナー
    prevBtn?.addEventListener('click', handlePrev);
    nextBtn?.addEventListener('click', handleNext);
    
    // インジケータークリック
    reviewIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        updateSlide(index);
      });
    });
    
    // タッチ/スワイプ対応
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diffX = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };
    
    reviewsTrack.addEventListener('touchstart', handleTouchStart as EventListener);
    reviewsTrack.addEventListener('touchmove', handleTouchMove as EventListener);
    reviewsTrack.addEventListener('touchend', handleTouchEnd);
    
    // 自動スライド
    const autoSlideInterval = setInterval(() => {
      handleNext();
    }, 5000);
    
    // ウィンドウリサイズ対応
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      const newCardWidth = newIsMobile ? window.innerWidth - 80 : 430;
      const offset = currentReviewSlide * newCardWidth;
      reviewsTrack.style.transform = `translateX(-${offset}px)`;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      prevBtn?.removeEventListener('click', handlePrev);
      nextBtn?.removeEventListener('click', handleNext);
      reviewsTrack.removeEventListener('touchstart', handleTouchStart as EventListener);
      reviewsTrack.removeEventListener('touchmove', handleTouchMove as EventListener);
      reviewsTrack.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      clearInterval(autoSlideInterval);
    };
  }, [currentReviewSlide]);

  return (
    <>
      {/* スクロールコンテナ */}
      <div className="scroll-container">
      {/* Header */}
      <header className={`header ${headerHidden ? 'hero-hidden' : ''}`}>
        <nav className="nav">
          <a href="index.html" className="logo jp-title">{content.info.textFields.shopName.split(' ')[0]}</a>
          
          <ul className="nav-menu">
            <li><a href="#home">{t('nav.home')}</a></li>
            <li><a href="#about">{t('nav.about')}</a></li>
            <li><a href="#menu">{t('nav.menu')}</a></li>
            <li><a href="#gallery">{t('nav.gallery')}</a></li>
            <li><a href="#info">{t('nav.info')}</a></li>
          </ul>
          
          <div className="nav-actions">
            <div className="desktop-language-switcher">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>
            <a 
              href="#" 
              className="nav-reservation-btn"
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== 'undefined' && (window as typeof window & { plausible?: (event: string) => void }).plausible) {
                  (window as typeof window & { plausible: (event: string) => void }).plausible('ReserveClick');
                }
              }}
            >
              {t('button.webReservation')}
            </a>
          </div>
          
          <button className="menu-toggle" id="menuToggle">
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </button>
        </nav>
      </header>
      
      {/* ヒーロー用WEB予約ボタン */}
      <a 
        href="#reservation" 
        className="hero-reservation-btn" 
        id="heroReservationBtn"
        onClick={(e) => {
          e.preventDefault();
          if (typeof window !== 'undefined' && (window as typeof window & { plausible?: (event: string) => void }).plausible) {
            (window as typeof window & { plausible: (event: string) => void }).plausible('ReserveClick');
          }
        }}
      >
        {t('button.webReservationHere')}
      </a>

      {/* ヒーロー用縦書きナビゲーション */}
      <nav className="hero-nav-menu" id="heroNavMenu">
        <a href="#home">{t('nav.home')}</a>
        <a href="#room">{t('section.menu')}</a>
        <a href="#gallery">{t('nav.gallery')}</a>
        <a href="#info">{t('nav.info')}</a>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-bg">
          {content.hero.textFields.backgroundType === 'video' && content.hero.videoFields?.bgVideo ? (
            (() => {
              // YouTube URLから動画IDを抽出
              const extractYouTubeId = (url: string): string | null => {
                if (!url) return null
                if (url.match(/^[a-zA-Z0-9_-]{11}$/)) return url
                const patterns = [
                  /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                  /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
                ]
                for (const pattern of patterns) {
                  const match = url.match(pattern)
                  if (match) return match[1]
                }
                return null
              }
              
              const youtubeId = extractYouTubeId(content.hero.videoFields.bgVideo)
              
              if (youtubeId) {
                // YouTube動画の場合
                return (
                  <div className="hero-video-wrapper">
                    <YouTubeLoop videoId={youtubeId} loopDuration={5} />
                    <div className="hero-video-overlay"></div>
                  </div>
                )
              } else {
                // 通常の動画ファイルの場合
                return (
                  <div className="hero-video-wrapper">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="hero-video"
                    >
                      <source src={content.hero.videoFields.bgVideo} type="video/mp4" />
                    </video>
                    <div className="hero-video-overlay"></div>
                  </div>
                )
              }
            })()
          ) : (
            <div className="hero-slider">
              {/* PC・タブレット用 */}
              <div className="hero-slide hero-slide-desktop active">
                <img src={content.hero.imageFields.bgPC1} alt={`${getContent('shopInfo.shopName', content)} ${t('alt.mainVisual')} 1`} />
              </div>
              <div className="hero-slide hero-slide-desktop">
                <img src={content.hero.imageFields.bgPC2} alt={`${getContent('shopInfo.shopName', content)} ${t('alt.mainVisual')} 2`} />
              </div>
              <div className="hero-slide hero-slide-desktop">
                <img src={content.hero.imageFields.bgPC3} alt={`${getContent('shopInfo.shopName', content)} ${t('alt.mainVisual')} 3`} />
              </div>
              <div className="hero-slide hero-slide-desktop">
                <img src={content.hero.imageFields.bgPC4} alt={`${getContent('shopInfo.shopName', content)} ${t('alt.mainVisual')} 4`} />
              </div>
              
              {/* スマホ用 */}
              <div className="hero-slide hero-slide-mobile">
                <img src={content.hero.imageFields.bgMobile1} alt={`${getContent('shopInfo.shopName', content)} ${t('alt.mobileVisual')} 1`} />
              </div>
              <div className="hero-slide hero-slide-mobile">
                <img src={content.hero.imageFields.bgMobile2} alt={`${getContent('shopInfo.shopName', content)} ${t('alt.mobileVisual')} 2`} />
              </div>
              <div className="hero-slide hero-slide-mobile">
                <img src={content.hero.imageFields.bgMobile3} alt={`${getContent('shopInfo.shopName', content)} ${t('alt.mobileVisual')} 3`} />
              </div>
            </div>
          )}
        </div>
        <div className="hero-content">
          <img src={content.hero.imageFields.logo} alt={getContent('shopInfo.shopName', content)} className="hero-logo fade-up" />
          <h1 className="hero-title fade-up">
            <span className="desktop-text">{getContent('hero.textFields.mainTitle', content)}</span>
            <span className="mobile-text">{getContent('hero.textFields.mainTitle', content).split('').map((char: string, i: number) => (
              <span key={i}>{char === 'も' || char === '専' ? <><br />{char}</> : char}</span>
            ))}</span>
          </h1>
          <p className="hero-subtitle fade-up">
            <span className="desktop-text">{getContent('hero.textFields.subTitle', content)}</span>
            <span className="mobile-text">{getContent('hero.textFields.subTitle', content).split('で').map((part: string, i: number) => (
              <React.Fragment key={i}>{i === 0 ? `${part}で` : <><br />{part}</>}</React.Fragment>
            ))}</span>
          </p>
        </div>
        <div className="hero-info fade-up">
          <span>{getContent('hero.textFields.openTime', content)}</span>
          <span>{getContent('hero.textFields.closeTime', content)}</span>
          <span>{getContent('hero.textFields.closedDay', content)}</span>
        </div>
      </section>
      
      {/* パララックス背景 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .parallax-bg-wrapper {
            background-image: url(${content['intro-parallax']?.imageFields?.parallaxBg || content.introParallax?.imageFields?.parallaxBg || '/images/DSC00400.jpg'}) !important;
          }
        `
      }} />
      <div className="parallax-bg-wrapper"></div>
      
      {/* 冒頭メッセージパララックスセクション */}
      <section className="intro-parallax-section" id="intro-parallax">
        <div className="intro-content">
          <h2 className="intro-title-vertical jp-title fade-up" dangerouslySetInnerHTML={{ 
            __html: getContent('introParallax.textFields.message', content).replace(/\n/g, '<br />')
          }} />
        </div>
      </section>

      {/* こだわり */}
      <section className="craft-section" id="craft">
        <div className="craft-grid-container">
          <div className="craft-vertical-text">
            <h2 className="craft-vertical-title jp-title fade-up">{getContent('craft.textFields.leftText', content)}</h2>
          </div>
          
          <div className="craft-vertical-text-right">
            <h2 className="craft-vertical-title-right jp-title fade-up">{getContent('craft.textFields.rightText', content)}</h2>
          </div>
          
          <div className="craft-image-1">
            <img src={content.craft.imageFields.image1} alt={t('alt.ingredients')} className="craft-img fade-up" loading="lazy" />
            <div className="craft-image-overlay"></div>
          </div>
          
          <div className="craft-image-2">
            <img src={content.craft.imageFields.image2} alt={t('alt.notJustKyushuFood')} className="craft-img fade-up" loading="lazy" />
            <div className="craft-image-overlay"></div>
          </div>
          
          <div className="craft-image-3">
            <img src={content.craft.imageFields.image3} alt={t('alt.specialDishes')} className="craft-img fade-up" loading="lazy" />
            <div className="craft-image-overlay"></div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="features-section" id="features">
        <div className="features-grid">
          {/* カード1: 伝統の技 (モバイルでは2番目) */}
          <div className="feature-card masked-content order-mobile-2">
            <img src={content.features.imageFields.feature1Image} alt={t('alt.ingredients')} className="feature-image" loading="lazy" />
            <div className="feature-content">
              <div className="feature-number">01</div>
              <h3 className="feature-title jp-title" dangerouslySetInnerHTML={{ 
                __html: getContent('features.feature1Title', content).replace(/\n/g, '<br />')
              }} />
              <p className="feature-description">{getContent('features.feature1Description', content)}</p>
              <div className="feature-accent"></div>
            </div>
          </div>

          {/* カード2: メッセージカード (モバイルでは1番目) */}
          <div className="feature-card text-overlay order-mobile-1">
            <div className="feature-content">
              <h3 className="feature-title jp-title fade-up">{content.features.textFields.mainTitle}</h3>
              <p className="feature-description">
                {language === 'ja' ? (
                  <>
                    もつ鍋専門店としての伝統の味と受け継がれた<br />
                    本場九州仕込み博多もつ鍋と当店のこだわりで<br />
                    皆様に満足できる食体験を提供いたします。
                  </>
                ) : language === 'en' ? (
                  <>
                    With our traditional flavors as a motsunabe specialty restaurant<br />
                    and authentic Kyushu-style Hakata motsunabe,<br />
                    we provide a satisfying dining experience for everyone.
                  </>
                ) : language === 'ko' ? (
                  <>
                    모츠나베 전문점으로서의 전통의 맛과 계승된<br />
                    정통 규슈 스타일 하카타 모츠나베와 우리 가게의 고집으로<br />
                    모든 분들께 만족할 수 있는 식사 경험을 제공합니다.
                  </>
                ) : (
                  <>
                    作为牛肠火锅专门店的传统风味和传承的<br />
                    正宗九州风格博多牛肠火锅和本店的讲究<br />
                    为大家提供满意的用餐体验。
                  </>
                )}
              </p>
            </div>
          </div>

          {/* カード3: 四季の美 (モバイルでは3番目) */}
          <div className="feature-card masked-content order-mobile-3">
            <img src={content.features.imageFields.feature2Image} alt={t('alt.varietyOfTastes')} className="feature-image" loading="lazy" />
            <div className="feature-content">
              <div className="feature-number">02</div>
              <h3 className="feature-title jp-title" dangerouslySetInnerHTML={{ 
                __html: getContent('features.feature2Title', content).replace(/\n/g, '<br />')
              }} />
              <p className="feature-description">{getContent('features.feature2Description', content)}</p>
              <div className="feature-accent"></div>
            </div>
          </div>

          {/* カード4: 厳選素材 (モバイルでは4番目) */}
          <div className="feature-card masked-content order-mobile-4">
            <img src={content.features.imageFields.feature3Image} alt={t('alt.richLineup')} className="feature-image" loading="lazy" />
            <div className="feature-content">
              <div className="feature-number">03</div>
              <h3 className="feature-title jp-title" dangerouslySetInnerHTML={{ 
                __html: getContent('features.feature3Title', content).replace(/\n/g, '<br />')
              }} />
              <p className="feature-description">{getContent('features.feature3Description', content)}</p>
              <div className="feature-accent"></div>
            </div>
          </div>

          {/* カード5: おもてなし (モバイルでは5番目) */}
          <div className="feature-card masked-content order-mobile-5">
            <img src={content.features.imageFields.feature4Image} alt={t('alt.japaneseSpace')} className="feature-image" loading="lazy" />
            <div className="feature-content">
              <div className="feature-number">04</div>
              <h3 className="feature-title jp-title" dangerouslySetInnerHTML={{ 
                __html: getContent('features.feature4Title', content).replace(/\n/g, '<br />')
              }} />
              <p className="feature-description">{getContent('features.feature4Description', content)}</p>
              <div className="feature-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* パララックス背景2 */}
      <div className="parallax-bg-wrapper parallax-bg-2"></div>

      {/* 本場九州仕込みのもつ鍋を楽しむパララックスセクション */}
      <section className="intro-parallax-section intro-parallax-2" id="intro-parallax-2">
        <div className="intro-content">
          <h2 className="intro-title-vertical jp-title fade-up">
            本場九州仕込みの<br />
            もつ鍋を楽しむ
          </h2>
        </div>
      </section>

      {/* 空間セクション */}
      <section className="space-section" id="space">
        <div className="space-grid-container">
          <div className="space-title-area">
            <h2 className="space-main-title jp-title fade-up">伝統の博多もつ鍋</h2>
          </div>
          
          <div className="space-hero-image">
            <img src="/images/no1-0243.jpg" alt={t('alt.motsunabeMain')} className="space-hero-img" loading="lazy" />
          </div>
          
          <div className="space-detail-text-1">
            <div className="space-text-block">
              <h3 className="space-text-title">{getContent('space.title1', content) || t('section.kyushuStyle')}</h3>
              <p className="space-text-content">
                {t('space.cabbage.text1')}<br />
                {t('space.cabbage.text2')}<br />
                {t('space.cabbage.text3')}
              </p>
            </div>
          </div>
          
          <div className="space-image-1">
            <img src="/images/no1-0220.jpg" alt={t('alt.cookingScene')} className="space-sub-image" loading="lazy" />
          </div>
          
          <div className="space-image-2">
            <picture>
              <source media="(max-width: 768px)" srcSet="./images/no1-0241.jpg" />
              <img src="/images/no1-0235.jpg" alt={t('alt.ingredientsCloseup')} className="space-sub-image" loading="lazy" />
            </picture>
          </div>
          
          <div className="space-detail-text-2">
            <div className="space-text-block">
              <p className="space-text-content">
                {t('space.cabbage.text4')}<br />
                {t('space.cabbage.text5')}<br />
                {t('space.cabbage.text6')}
              </p>
            </div>
          </div>
          
          <div className="space-circle-1">
            <picture>
              <source media="(max-width: 768px)" srcSet="./images/no1-0220.jpg" />
              <img src="/images/DSC00631.jpg" alt={t('alt.traditionalTools')} className="space-circle-img" loading="lazy" />
            </picture>
          </div>
          
          <div className="space-circle-2">
            <img src="/images/DSC00654.jpg" alt={t('alt.selectedIngredients')} className="space-circle-img" loading="lazy" />
          </div>
          
          <div className="space-circle-3">
            <img src="/images/DSC00681.jpg" alt={t('alt.craftsmanship')} className="space-circle-img" loading="lazy" />
          </div>
          
          <div className="space-quote-block">
            <blockquote className="space-quote">
              {t('space.quote')}
            </blockquote>
            <cite className="space-quote-author">{t('space.quoteAuthor')}</cite>
          </div>
        </div>
      </section>

      {/* もつ鍋セクション */}
      <section className="motsunabe-section" id="motsunabe">
        <div className="motsunabe-container">
          <div className="motsunabe-header fade-up">
            <h2 className="motsunabe-title jp-title">{content?.motsunabe?.textFields?.sectionTitle || '名物もつ鍋'}</h2>
            <p className="motsunabe-subtitle">{content?.motsunabe?.textFields?.sectionSubtitle || '本場博多の味を、横浜で'}</p>
          </div>
          
          <div className="motsunabe-content">
            <div className="motsunabe-main fade-up">
              <div className="motsunabe-image-wrapper">
                <img src={content?.motsunabe?.imageFields?.mainImage || '/images/no1-0241.jpg'} alt={t('alt.hakataMoitsunabe')} className="motsunabe-image" />
                <div className="motsunabe-badge">
                  {(content?.motsunabe?.badges || [t('motsunabe.badge1'), t('motsunabe.badge2')]).map((badge: string, index: number) => (
                    <span key={index}>{badge}</span>
                  ))}
                </div>
              </div>
              
              <div className="motsunabe-info">
                <h3 className="motsunabe-catch">
                  {content?.motsunabe?.textFields?.catchphrase || t('motsunabe.catch')}
                </h3>
                
                <p className="motsunabe-description">
                  {content?.motsunabe?.textFields?.description || t('motsunabe.description')}
                </p>
                
                <div className="motsunabe-features">
                  <div className="motsunabe-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <h4>{content?.motsunabe?.textFields?.feature1Title || t('motsunabe.feature1.title')}</h4>
                    <p>{content?.motsunabe?.textFields?.feature1Desc || t('motsunabe.feature1.desc')}</p>
                  </div>
                  
                  <div className="motsunabe-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3h18v18H3zM12 8v8M8 12h8"/>
                      </svg>
                    </div>
                    <h4>{content?.motsunabe?.textFields?.feature2Title || t('motsunabe.feature2.title')}</h4>
                    <p>{content?.motsunabe?.textFields?.feature2Desc || t('motsunabe.feature2.desc')}</p>
                  </div>
                  
                  <div className="motsunabe-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <h4>{content?.motsunabe?.textFields?.feature3Title || t('motsunabe.feature3.title')}</h4>
                    <p>{content?.motsunabe?.textFields?.feature3Desc || t('motsunabe.feature3.desc')}</p>
                  </div>
                </div>
                
                <div className="motsunabe-price">
                  <div className="price-label">{content?.motsunabe?.textFields?.priceLabel || t('motsunabe.priceLabel')}</div>
                  <div className="price-amount">
                    <span className="price-number">{content?.motsunabe?.textFields?.priceAmount || '1,680'}</span>
                    <span className="price-unit">{content?.motsunabe?.textFields?.priceUnit || t('motsunabe.priceUnit')}</span>
                    <span className="price-tax">{content?.motsunabe?.textFields?.priceTax || t('motsunabe.priceTax')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {content?.motsunabe?.showOptions !== false && (
              <div className="motsunabe-options fade-up">
                <h3 className="options-title">{content?.motsunabe?.textFields?.optionsTitle || t('motsunabe.optionsTitle')}</h3>
                <div className="options-grid">
                  {(content?.motsunabe?.options || []).map((option: { id: string; title: string; description: string; image: string }) => (
                    <div key={option.id} className="option-card">
                      <img src={option.image} alt={option.title} />
                      <h4>{option.title}</h4>
                      <p>{option.description}</p>
                    </div>
                  ))}
                </div>
                {/* モバイル用スライドインジケーター */}
                <div className="options-slide-indicators">
                  {(content?.motsunabe?.options || []).map((_: unknown, index: number) => (
                    <button
                      key={index}
                      className={`slide-indicator ${index === currentMotsunabeSlide ? 'active' : ''}`}
                      onClick={() => setCurrentMotsunabeSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* お品書き */}
      <section className="room-section" id="room">
        <div className="room-container">
          <h2 className="section-title jp-title fade-up">{t('section.menu')}</h2>
          <p className="section-subtitle fade-up">{t('section.menuSubtitle')}</p>
          
          <div className="menu-grid">
            {/* 動的メニューカード */}
            {content.menu?.menuCards?.map((card: { id: string; subTitle: string; title: string; items: Array<{ name: string; price: string }>; note?: string }, index: number) => (
              <div 
                key={card.id} 
                className={`menu-card fade-scale ${index >= 3 ? 'hidden-menu-mobile' : ''}`}
                data-menu-extra={index >= 3 ? 'true' : undefined}
              >
                <div className="menu-category">{card.subTitle}</div>
                <h3 className="menu-title jp-title">{card.title}</h3>
                <div className="menu-items">
                  {card.items.map((item: { name: string; price: string }, itemIndex: number) => (
                    <div key={itemIndex} className="menu-item">
                      <span className="menu-item-name">{item.name}</span>
                      <span className="menu-item-price">{item.price}</span>
                    </div>
                  ))}
                </div>
                {card.note && <p className="menu-note">{card.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 宴会or一人飲みセクション */}
      <section className="dining-style-section" id="dining-style">
        <div className="dining-style-container">
          <h2 className="dining-section-title fade-up">{getContent('diningStyle.sectionTitle', content)}</h2>
          <div className="dining-style-grid">
            {/* 左カラム：宴会 */}
            <div className="dining-column dining-party">
              <div className="dining-bg-image dining-party-bg" style={{
                backgroundImage: content.diningStyle?.imageFields?.partyBg ? `url(${content.diningStyle.imageFields.partyBg})` : undefined
              }}></div>
              <div className="dining-overlay"></div>
              <div className="dining-content">
                <div className="dining-header">
                  <span className="dining-subtitle">PARTY</span>
                  <h3 className="dining-title jp-title">{getContent('diningStyle.partyTitle', content)}</h3>
                </div>
                <div className="dining-description">
                  <p>{getContent('diningStyle.partyDescription', content).replace(/\\n/g, ' ')}</p>
                  <ul className="dining-features">
                    <li>{t('dining.partyFeature1')}</li>
                    <li>{t('dining.partyFeature2')}</li>
                    <li>{t('dining.partyFeature3')}</li>
                  </ul>
                </div>
                <button className="dining-cta-btn" onClick={() => setShowCoursesModal(true)}>
                  <span>{t('button.viewCourses')}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* 右カラム：お酒 */}
            <div className="dining-column dining-sake">
              <div className="dining-bg-image dining-sake-bg" style={{
                backgroundImage: content.diningStyle?.imageFields?.sakeBg ? `url(${content.diningStyle.imageFields.sakeBg})` : undefined
              }}></div>
              <div className="dining-overlay"></div>
              <div className="dining-content">
                <div className="dining-header">
                  <span className="dining-subtitle">SAKE</span>
                  <h3 className="dining-title jp-title">{getContent('diningStyle.sakeTitle', content)}</h3>
                </div>
                <div className="dining-description">
                  <p>{getContent('diningStyle.sakeDescription', content).replace(/\\n/g, ' ')}</p>
                  <ul className="dining-features">
                    <li>{t('dining.sakeFeature1')}</li>
                    <li>{t('dining.sakeFeature2')}</li>
                    <li>{t('dining.sakeFeature3')}</li>
                  </ul>
                </div>
                <button className="dining-cta-btn" onClick={() => setShowDrinksModal(true)}>
                  <span>{t('button.viewSakeMenu')}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 席紹介セクション */}
      <section className="seats-section" id="seats">
        <div className="seats-container">
          <div className="seats-header fade-up">
            <h2 className="seats-title jp-title">{t('section.seats')}</h2>
            <p className="seats-subtitle">{t('section.seatsSubtitle')}</p>
          </div>
          
          {/* スライダーコンテナ */}
          <div className="seats-slider-container fade-up">
            {/* メインスライダー */}
            <div className="seats-main-slider">
              <div className="seats-slides">
                {content.seats.seatData ? (
                  // 新しいseatData形式の場合
                  content.seats.seatData.map((seat: { id: string; name: string; capacity: string; description: string; tags: string[]; image: string }, index: number) => {
                    // 座席タイプを判定してキーを設定
                    const seatKey = seat.id === 'private-space' ? 'privateSpace' :
                                   seat.id === 'semi-private-box' ? 'semiPrivateBox' :
                                   seat.id === 'table-seats' ? 'tableSeats' :
                                   seat.id === 'group-seats' ? 'groupSeats' :
                                   seat.id === 'window-date-seats' ? 'windowDateSeats' :
                                   null;
                    
                    // プレースホルダーの場合は別のキーを使用
                    const placeholderKey = seat.id === 'table-seats' ? 'seatPlaceholders.tableSeats' :
                                          seat.id === 'group-seats' ? 'seatPlaceholders.groupSeats' :
                                          seat.id === 'window-date-seats' ? 'seatPlaceholders.windowDateSeats' :
                                          null;
                    
                    const nameKey = placeholderKey || (seatKey ? `seats.${seatKey}` : null);
                    
                    // タグの翻訳マッピング
                    const tagTranslationMap: { [key: string]: string } = {
                      '大人数OK': 'seat.tag.largeGroup',
                      '貸切可能': 'seat.tag.privateBooking',
                      'レイアウト変更可': 'seat.tag.flexibleLayout',
                      '落ち着いた空間': 'seat.tag.quietSpace',
                      '窓際席': 'seat.tag.windowSide',
                      '女子会におすすめ': 'seat.tag.girlsNight',
                      'ゆったり空間': 'seat.tag.spacious',
                      '少人数向け': 'seat.tag.smallGroup',
                      '大人数対応': 'seat.tag.largeGroupFriendly',
                      '宴会向け': 'seat.tag.partyReady',
                      '景色が良い': 'seat.tag.goodView',
                      'デートに人気': 'seat.tag.datePopular',
                      '開放的': 'seat.tag.open'
                    };
                    
                    return (
                      <div key={seat.id} className={`seat-slide ${index === 0 ? 'active' : ''}`} data-seat={index}>
                        <div className="seat-image">
                          <img src={seat.image} alt={nameKey ? getContent(`${nameKey}.name`, content) : seat.name} loading="lazy" />
                        </div>
                        <div className="seat-details">
                          <h3 className="seat-name">{nameKey ? getContent(`${nameKey}.name`, content) : seat.name}</h3>
                          <div className="seat-capacity">
                            <span className="capacity-icon">👥</span>
                            <span className="capacity-text">{nameKey ? getContent(`${nameKey}.capacity`, content) : seat.capacity}</span>
                          </div>
                          <p className="seat-description">
                            {nameKey ? getContent(`${nameKey}.description`, content) : seat.description}
                          </p>
                          <div className="seat-features">
                            {seat.tags.map((tag: string, tagIndex: number) => (
                              <div key={tagIndex} className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>{tagTranslationMap[tag] ? t(tagTranslationMap[tag]) : tag}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // 旧imageFields形式の場合（互換性のため）
                  <>
                    {/* 貸切スペース */}
                    <div className="seat-slide active" data-seat="0">
                      <div className="seat-image">
                        <img src={content.seats.imageFields.privateSpace} alt={getContent('seats.privateSpace.name', content)} loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">{getContent('seats.privateSpace.name', content)}</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">{getContent('seats.privateSpace.capacity', content)}</span>
                    </div>
                    <p className="seat-description">
                      {getContent('seats.privateSpace.description', content)}
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.largeGroup')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.privateBooking')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.flexibleLayout')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 半個室風ボックス席 */}
                <div className="seat-slide" data-seat="1">
                  <div className="seat-image">
                    <img src={content.seats.imageFields.semiPrivateBox} alt={getContent('seats.semiPrivateBox.name', content)} loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">{getContent('seats.semiPrivateBox.name', content)}</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">{getContent('seats.semiPrivateBox.capacity', content)}</span>
                    </div>
                    <p className="seat-description">
                      {getContent('seats.semiPrivateBox.description', content)}
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.quietSpace')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.windowSide')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.girlsNight')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* テーブル席 */}
                <div className="seat-slide" data-seat="2">
                  <div className="seat-image">
                    <img src={content.seats.imageFields.tableSeats} alt={getContent('seatPlaceholders.tableSeats.name', content)} loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">{getContent('seatPlaceholders.tableSeats.name', content)}</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">{getContent('seatPlaceholders.tableSeats.capacity', content)}</span>
                    </div>
                    <p className="seat-description">
                      {getContent('seatPlaceholders.tableSeats.description', content)}
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.spacious')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.smallGroup')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* グループ席 */}
                <div className="seat-slide" data-seat="3">
                  <div className="seat-image">
                    <img src={content.seats.imageFields.groupSeats} alt={getContent('seatPlaceholders.groupSeats.name', content)} loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">{getContent('seatPlaceholders.groupSeats.name', content)}</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">{getContent('seatPlaceholders.groupSeats.capacity', content)}</span>
                    </div>
                    <p className="seat-description">
                      {getContent('seatPlaceholders.groupSeats.description', content)}
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.largeGroupFriendly')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.partyReady')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.flexibleLayout')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 窓際デート席 */}
                <div className="seat-slide" data-seat="4">
                  <div className="seat-image">
                    <img src={content.seats.imageFields.windowDateSeats} alt={getContent('seatPlaceholders.windowDateSeats.name', content)} loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">{getContent('seatPlaceholders.windowDateSeats.name', content)}</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">{getContent('seatPlaceholders.windowDateSeats.capacity', content)}</span>
                    </div>
                    <p className="seat-description">
                      {getContent('seatPlaceholders.windowDateSeats.description', content)}
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.goodView')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.datePopular')}</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{t('seat.tag.open')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                </>
                )}
              </div>
            </div>

            {/* サムネイルナビゲーション */}
            <div className="seats-thumbnails">
              {content.seats.seatData ? (
                // 新しいseatData形式の場合
                content.seats.seatData.map((seat: { id: string; name: string; capacity: string; description: string; tags: string[]; image: string }, index: number) => {
                  // 座席タイプを判定してキーを設定
                  const seatKey = seat.id === 'private-space' ? 'privateSpace' :
                                 seat.id === 'semi-private-box' ? 'semiPrivateBox' :
                                 seat.id === 'table-seats' ? 'tableSeats' :
                                 seat.id === 'group-seats' ? 'groupSeats' :
                                 seat.id === 'window-date-seats' ? 'windowDateSeats' :
                                 null;
                  
                  // プレースホルダーの場合は別のキーを使用
                  const placeholderKey = seat.id === 'table-seats' ? 'seatPlaceholders.tableSeats' :
                                        seat.id === 'group-seats' ? 'seatPlaceholders.groupSeats' :
                                        seat.id === 'window-date-seats' ? 'seatPlaceholders.windowDateSeats' :
                                        null;
                  
                  const nameKey = placeholderKey || (seatKey ? `seats.${seatKey}` : null);
                  const translatedName = nameKey ? getContent(`${nameKey}.name`, content) : seat.name;
                  
                  return (
                    <div key={seat.id} className={`thumbnail ${index === 0 ? 'active' : ''}`} data-seat={index}>
                      <img src={seat.image} alt={translatedName} />
                      <span className="thumbnail-label">{translatedName.length > 6 ? translatedName.substring(0, 6) : translatedName}</span>
                    </div>
                  );
                })
              ) : (
                // 旧imageFields形式の場合（互換性のため）
                <>
                  <div className="thumbnail active" data-seat="0">
                    <img src={content.seats.imageFields.privateSpace} alt={t('alt.seatThumbnail')} />
                    <span className="thumbnail-label">{getContent('seats.privateSpace.name', content).substring(0, 6)}</span>
                  </div>
                  <div className="thumbnail" data-seat="1">
                    <img src={content.seats.imageFields.semiPrivateBox} alt={t('alt.semiPrivateThumbnail')} />
                    <span className="thumbnail-label">{getContent('seats.semiPrivateBox.name', content).substring(0, 5)}</span>
                  </div>
                  <div className="thumbnail" data-seat="2">
                    <img src={content.seats.imageFields.tableSeats} alt={t('alt.tableThumbnail')} />
                    <span className="thumbnail-label">{getContent('seatPlaceholders.tableSeats.name', content).substring(0, 6)}</span>
                  </div>
                  <div className="thumbnail" data-seat="3">
                    <img src={content.seats.imageFields.groupSeats} alt={t('alt.groupThumbnail')} />
                    <span className="thumbnail-label">{getContent('seatPlaceholders.groupSeats.name', content).substring(0, 6)}</span>
                  </div>
                  <div className="thumbnail" data-seat="4">
                    <img src={content.seats.imageFields.windowDateSeats} alt={t('alt.dateThumbnail')} />
                    <span className="thumbnail-label">{getContent('seatPlaceholders.windowDateSeats.name', content).substring(0, 5)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 口コミセクション */}
      <section className="reviews-section" id="reviews">
        <div className="reviews-container">
          <div className="reviews-header fade-up">
            <h2 className="reviews-title jp-title">お客様の声</h2>
            <p className="reviews-subtitle">Googleビジネスプロフィールより</p>
            <div className="reviews-rating-summary">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="star-icon filled">★</span>
                ))}
              </div>
              <span className="rating-text">4.8 / 5.0</span>
            </div>
          </div>

          <div className="reviews-carousel-wrapper">
            <div className="reviews-carousel" id="reviewsCarousel">
              <div className="reviews-track">
                {/* モックデータ */}
                {[
                  {
                    id: 1,
                    rating: 5,
                    text: "本格的な九州料理が楽しめる素晴らしいお店です。特に、馬刺しは絶品でした。スタッフの方々も親切で、居心地の良い空間でした。また必ず訪れたいと思います。",
                    author: "山田太郎",
                    date: "2024年1月"
                  },
                  {
                    id: 2,
                    rating: 5,
                    text: "会社の宴会で利用させていただきました。個室でゆったりと過ごせ、料理のクオリティも高く、みんな大満足でした。特に、もつ鍋が絶品で、締めのちゃんぽん麺も最高でした。",
                    author: "佐藤花子",
                    date: "2024年1月"
                  },
                  {
                    id: 3,
                    rating: 4,
                    text: "デートで利用しました。窓際の席で夜景を見ながらの食事は本当にロマンチックでした。お料理も美味しく、特に地鶏の炭火焼きが香ばしくて忘れられない味です。",
                    author: "鈴木一郎",
                    date: "2023年12月"
                  },
                  {
                    id: 4,
                    rating: 5,
                    text: "九州出身の私も納得の味です。故郷の味を東京で楽しめるのは本当に嬉しいです。焼酎の種類も豊富で、料理との相性も抜群。店員さんの対応も素晴らしかったです。",
                    author: "田中美咲",
                    date: "2023年12月"
                  },
                  {
                    id: 5,
                    rating: 5,
                    text: "雰囲気、料理、サービス、すべてが最高でした。特別な日の食事にぴったりのお店です。コース料理を注文しましたが、どれも丁寧に作られていて感動しました。",
                    author: "高橋健二",
                    date: "2023年11月"
                  },
                  {
                    id: 6,
                    rating: 4,
                    text: "友人との飲み会で利用。料理はどれも美味しく、特に明太子料理のバリエーションに驚きました。価格も良心的で、コスパが良いお店だと思います。",
                    author: "渡辺真由美",
                    date: "2023年11月"
                  },
                  {
                    id: 7,
                    rating: 5,
                    text: "接待で使わせていただきましたが、お客様にも大変喜んでいただけました。個室の雰囲気も良く、料理の提供タイミングも完璧でした。",
                    author: "中村正志",
                    date: "2023年10月"
                  },
                  {
                    id: 8,
                    rating: 5,
                    text: "家族の誕生日祝いで訪問。サプライズケーキの対応もしていただき、素敵な思い出になりました。子供向けのメニューもあり、家族連れにも優しいお店です。",
                    author: "小林由美",
                    date: "2023年10月"
                  },
                  {
                    id: 9,
                    rating: 4,
                    text: "カウンター席で板前さんとの会話を楽しみながら食事ができました。旬の食材を使った料理の説明も丁寧で、食への理解が深まりました。",
                    author: "加藤浩",
                    date: "2023年9月"
                  },
                  {
                    id: 10,
                    rating: 5,
                    text: "何度来ても飽きない味と雰囲気。季節ごとにメニューが変わるのも楽しみの一つです。今回は秋の味覚を堪能させていただきました。また近いうちに伺います。",
                    author: "斎藤恵子",
                    date: "2023年9月"
                  }
                ].map((review, _index) => (
                  <div key={review.id} className="review-card">
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={`star-icon ${star <= review.rating ? 'filled' : 'empty'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="review-text">{review.text}</p>
                    <div className="review-footer">
                      <span className="review-author">{review.author}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* ナビゲーションボタン */}
            <button className="review-nav-btn prev" id="reviewPrevBtn" aria-label="前のレビュー">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="review-nav-btn next" id="reviewNextBtn" aria-label="次のレビュー">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* インジケーター */}
          <div className="review-indicators">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
              <button
                key={index}
                className={`review-indicator ${index === 0 ? 'active' : ''}`}
                data-index={index}
                aria-label={`レビュー ${index + 1} へ移動`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* フォトギャラリー */}
      <section className="gallery-section" id="gallery">
        <div className="gallery-container">
          <div className="gallery-header fade-up">
            <h2 className="gallery-title jp-title">{t('section.gallery')}</h2>
            <p className="gallery-subtitle">{t('section.gallerySubtitle')}</p>
          </div>
          
          {/* モバイル用スライドショー */}
          <div className="gallery-slideshow mobile-only">
            {(() => {
              const galleryItems = [
                { img: content.gallery.imageFields.gallery1, caption: t('gallery.atmosphere') },
                { img: content.gallery.imageFields.gallery2, caption: t('gallery.notJustKyushu') },
                { img: content.gallery.imageFields.gallery3, caption: t('gallery.traditionalTaste') },
                { img: content.gallery.imageFields.gallery4, caption: t('gallery.counterSeats') },
                { img: content.gallery.imageFields.gallery5, caption: t('gallery.interior') },
                { img: content.gallery.imageFields.gallery6, caption: t('gallery.nightEntrance') },
                { img: content.gallery.imageFields.gallery7, caption: t('gallery.spaciousSeating') },
                { img: content.gallery.imageFields.gallery8, caption: t('gallery.privateRoom') },
                { img: content.gallery.imageFields.gallery9, caption: t('gallery.hospitality') }
              ];
              
              // 無限スクロール用に前後に複製を追加
              const extendedItems = [
                galleryItems[galleryItems.length - 1], // 最後の画像を最初に
                ...galleryItems,
                galleryItems[0] // 最初の画像を最後に
              ];
              
              return (
                <>
                  <div className="gallery-slides">
                    {extendedItems.map((item, index) => (
                      <div key={index} className="gallery-slide">
                        <img src={item.img} alt={`${getContent('shopInfo.shopName', content)} ${index}`} className="gallery-slide-image" />
                        <div className="gallery-slide-overlay">
                          <span className="gallery-slide-caption">{item.caption}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* スライドインジケーター */}
                  <div className="gallery-slide-indicators">
                    {galleryItems.map((_, index) => (
                      <button
                        key={index}
                        className={`slide-indicator ${index === currentGallerySlide ? 'active' : ''}`}
                        onClick={() => setCurrentGallerySlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
          
          {/* PC用グリッド表示 */}
          <div className="gallery-grid">
            {/* メイン画像（PC/タブレットで全表示） */}
            <div className="gallery-item fade-up">
              <img src={content.gallery.imageFields.gallery1} alt={`${getContent('shopInfo.shopName', content)} 1`} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">{t('gallery.atmosphere')}</span>
              </div>
            </div>
            <div className="gallery-item fade-up">
              <img src={content.gallery.imageFields.gallery2} alt={`${getContent('shopInfo.shopName', content)} 2`} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">{t('gallery.notJustKyushu')}</span>
              </div>
            </div>
            <div className="gallery-item fade-up">
              <img src={content.gallery.imageFields.gallery3} alt={`${getContent('shopInfo.shopName', content)} 3`} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">{t('gallery.traditionalTaste')}</span>
              </div>
            </div>
            
            {/* 追加画像（PC/タブレットのみ最初から表示） */}
            <div className="gallery-item fade-up desktop-only">
              <img src={content.gallery.imageFields.gallery4} alt={`${getContent('shopInfo.shopName', content)} 4`} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">{t('gallery.counterSeats')}</span>
              </div>
            </div>
            <div className="gallery-item fade-up desktop-only">
              <img src={content.gallery.imageFields.gallery5} alt={`${getContent('shopInfo.shopName', content)} 5`} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">{t('gallery.interior')}</span>
              </div>
            </div>
            <div className="gallery-item fade-up desktop-only">
              <img src={content.gallery.imageFields.gallery6} alt={`${getContent('shopInfo.shopName', content)} 6`} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">{t('gallery.nightEntrance')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 新着情報 */}
      <section className="news-section" id="news">
        <div className="news-container">
          <h2 className="section-title jp-title fade-up">{t('section.news') || '新着情報'}</h2>
          
          <div className="news-grid">
            {latestNews.length > 0 ? (
              latestNews.map((article) => {
                const publishDate = new Date(article.publishedAt);
                const formattedDate = `${publishDate.getFullYear()}.${String(publishDate.getMonth() + 1).padStart(2, '0')}.${String(publishDate.getDate()).padStart(2, '0')}`;
                const categoryName = article.categories[0]?.name || 'INFO';
                
                return (
                  <Link href={`/news/${article.slug}`} key={article.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <article className="news-item fade-up">
                      <time className="news-date">{formattedDate}</time>
                      <h3 className="news-title">{article.title}</h3>
                      <span className="news-category">{categoryName}</span>
                      <div className="news-arrow">→</div>
                    </article>
                  </Link>
                );
              })
            ) : (
              <>
                <article className="news-item fade-up">
                  <time className="news-date">2024.01.15</time>
                  <h3 className="news-title">{t('news.winterMenu')}</h3>
                  <span className="news-category">MENU</span>
                  <div className="news-arrow">→</div>
                </article>
                
                <article className="news-item fade-up">
                  <time className="news-date">2024.01.08</time>
                  <h3 className="news-title">{t('news.newYearHours')}</h3>
                  <span className="news-category">INFO</span>
                  <div className="news-arrow">→</div>
                </article>
                
                <article className="news-item fade-up">
                  <time className="news-date">2023.12.20</time>
                  <h3 className="news-title">{t('news.yearEndNotice')}</h3>
                  <span className="news-category">INFO</span>
                  <div className="news-arrow">→</div>
                </article>
              </>
            )}
          </div>

          <div className="news-more fade-up">
            <Link href="/news" className="news-more-link">{t('news.viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* 店舗情報 */}
      <section className="info-section" id="info">
        <div className="container">
          <h2 className="section-title jp-title fade-up">{t('section.info')}</h2>
          
          <dl className="info-list">
            <dt>{t('info.shopName')}</dt>
            <dd>{getContent('shopInfo.shopName', content)}</dd>
            
            <dt>{t('info.label.address')}</dt>
            <dd dangerouslySetInnerHTML={{ __html: getContent('shopInfo.address', content).replace(/\n/g, '<br />') }} />
            
            <dt>{t('info.label.access')}</dt>
            <dd>{getContent('shopInfo.access', content)}</dd>
            
            <dt>{t('info.label.phone')}</dt>
            <dd>{content.info.textFields.phone}</dd>
            
            <dt>{t('info.label.hours')}</dt>
            <dd dangerouslySetInnerHTML={{ __html: getContent('shopInfo.businessHours', content).replace(/\n/g, '<br />') }} />
            
            <dt>{t('info.label.closed')}</dt>
            <dd>{getContent('shopInfo.closedDays', content)}</dd>
            
            <dt>{t('info.label.seats')}</dt>
            <dd>{getContent('shopInfo.seatsCount', content)}</dd>
            
            <dt>喫煙</dt>
            <dd>全席喫煙可（20歳未満入店不可）</dd>
            
            <dt>駐車場</dt>
            <dd>近隣にコインパーキング多数有</dd>
          </dl>
        </div>
        
        {/* Google Map */}
        <div className="map-container fade-up">
          {content.info?.textFields?.googleMapUrl ? (
            <iframe 
              src={getGoogleMapEmbedUrl(content.info.textFields.googleMapUrl, content.info.textFields)}
              width="100%" 
              height="500" 
              style={{border: 0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          ) : (
            <div style={{
              width: '100%',
              height: '500px',
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '16px'
            }}>
              地図を表示するには、管理画面でGoogleマップの共有リンクを設定してください
            </div>
          )}
        </div>
      </section>

      {/* フッター */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo jp-title">{content.info.textFields.shopName.split(' ')[0]}<small style={{color: "rgba(255,255,255,0.8)", fontSize: "0.7em", display: "block", marginTop: "5px", fontWeight: 300}}>サンプル店</small></div>
            <div className="footer-contact">
              <div className="footer-tel">Tel: {content.info.textFields.phone}</div>
              <div className="footer-message">ホームページを見たとお伝えいただけるとスムーズです。</div>
            </div>
            <a 
              href="#reservation" 
              className="footer-reservation-btn"
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== 'undefined' && (window as typeof window & { plausible?: (event: string) => void }).plausible) {
                  (window as typeof window & { plausible: (event: string) => void }).plausible('ReserveClick');
                }
              }}
            >
              WEB予約はこちら
            </a>
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
        
        <div className="footer-bottom">
          <p className="copyright">&copy; 2024 {getContent('shopInfo.shopName', content).split(' ')[0]}. {t('footer.rights')}</p>
          <button 
            className="page-top-btn" 
            onClick={(e) => {
              e.preventDefault();
              const scrollContainer = document.querySelector('.scroll-container');
              if (scrollContainer) {
                // モバイルの場合はスクロールコンテナをスムーズスクロール
                const startPosition = scrollContainer.scrollTop;
                const duration = 500;
                const startTime = performance.now();
                
                const animateScroll = (currentTime: number) => {
                  const elapsedTime = currentTime - startTime;
                  const progress = Math.min(elapsedTime / duration, 1);
                  
                  // イージング関数
                  const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                  
                  scrollContainer.scrollTop = startPosition * (1 - easeInOutQuad(progress));
                  
                  if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                  }
                };
                
                requestAnimationFrame(animateScroll);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
            <span>{t('pageTop')}</span>
          </button>
        </div>
      </footer>
      </div>
      {/* スクロールコンテナ終了 */}

      {/* モバイルメニュー */}
      <div className="mobile-menu" id="mobileMenu">
        <div className="mobile-menu-overlay" id="mobileMenuOverlay"></div>
        <div className="mobile-menu-content">
          <button className="mobile-menu-close" id="mobileMenuClose">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <ul className="mobile-nav">
            <li><a href="#home" className="mobile-link">{t('nav.home')}</a></li>
            <li><a href="#features" className="mobile-link">{t('nav.features')}</a></li>
            <li><a href="#space" className="mobile-link">{t('section.kyushuStyle')}</a></li>
            <li><a href="#room" className="mobile-link">{t('nav.menu')}</a></li>
            <li><a href="#dining-style" className="mobile-link">{t('section.enjoyWay')}</a></li>
            <li><a href="#seats" className="mobile-link">{t('nav.seats')}</a></li>
            <li><a href="#gallery" className="mobile-link">{t('nav.gallery')}</a></li>
            <li><a href="#news" className="mobile-link">{t('section.news')}</a></li>
            <li><a href="#info" className="mobile-link">{t('nav.info')}</a></li>
          </ul>
          <div className="mobile-language-switcher">
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </div>

      {/* モバイル用固定ボトムナビゲーション */}
      <div className="mobile-bottom-nav">
        <div className="nav-group">
          <a href="https://line.me/R/" target="_blank" className="bottom-nav-item">
            <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 11.055A9 9 0 1 1 12 3a9 9 0 0 1 9 8.055v.945a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1a6 6 0 1 0-2.5 4.92"/>
            </svg>
            <span className="bottom-nav-text">LINE登録</span>
          </a>
          <a 
            href="#reservation" 
            className="bottom-nav-item"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== 'undefined' && (window as typeof window & { plausible?: (event: string) => void }).plausible) {
                (window as typeof window & { plausible: (event: string) => void }).plausible('ReserveClick');
              }
            }}
          >
            <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            <span className="bottom-nav-text">ネット予約</span>
          </a>
        </div>
        <span className="nav-divider">｜</span>
        <div className="nav-group">
          <button className="bottom-nav-item" id="mobileMenuBtn">
            <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span className="bottom-nav-text">メニュー</span>
          </button>
        </div>
      </div>

      {/* コースモーダル */}
      {showCoursesModal && (
        <div className="courses-modal active">
          <div className="modal-overlay" onClick={() => setShowCoursesModal(false)}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowCoursesModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="courses-slider">
              {/* コースカードを動的に表示 */}
              {(content?.courses?.cards || []).map((course: { id: string; image: string; title: string; subtitle: string; price: string; note?: string; itemCount: string; description: string; menuItems: string[]; features: Array<{ icon: string; title: string; description: string }>; ctaText: string }, index: number) => (
                <div key={course.id} className={`course-slide ${currentCourseSlide === index ? 'active' : ''}`}>
                  <div className="course-header">
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <h2 className="course-title">
                      {course.title}
                      {course.subtitle && <><br />{course.subtitle}</>}
                      <br />
                      <span className="title-price">{course.price}</span>
                    </h2>
                    {course.note && <p className="course-subtitle">{course.note}</p>}
                  </div>
                  <div className="course-body">
                    <div className="course-info">
                      <div className="course-items">全<span>{course.itemCount}</span>品</div>
                      <p className="course-description">{course.description}</p>
                      
                      <div className="course-menu">
                        <h4 className="menu-title">コース内容</h4>
                        <ul className="menu-items">
                          {course.menuItems.map((item: string, itemIndex: number) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="course-features">
                        {course.features.map((feature: { icon: string; title: string; description: string }, featureIndex: number) => {
                          // アイコンのSVGマップ
                          const iconMap: { [key: string]: React.JSX.Element } = {
                            users: (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                              </svg>
                            ),
                            calendar: (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                            ),
                            clock: (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                            ),
                            beer: (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 11l3 3L22 4"/>
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                              </svg>
                            )
                          }
                          
                          return (
                            <div key={featureIndex} className="feature-item">
                              {iconMap[feature.icon] || iconMap.beer}
                              <div>
                                <div style={{ fontWeight: 600 }}>{feature.title}</div>
                                {feature.description && <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{feature.description}</div>}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <button className="course-cta">{course.ctaText}</button>
                  </div>
                </div>
              ))}
              
              {/* スライダーコントロール */}
              {(content?.courses?.cards || []).length > 1 && (
                <>
                  <button className="slider-control prev" onClick={() => setCurrentCourseSlide((prev) => prev === 0 ? (content?.courses?.cards || []).length - 1 : prev - 1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <button className="slider-control next" onClick={() => setCurrentCourseSlide((prev) => (prev + 1) % (content?.courses?.cards || []).length)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                  
                  {/* ドットインジケーター */}
                  <div className="slider-dots">
                    {(content?.courses?.cards || []).map((_: unknown, index: number) => (
                      <button 
                        key={index}
                        className={`slider-dot ${currentCourseSlide === index ? 'active' : ''}`} 
                        onClick={() => setCurrentCourseSlide(index)}
                      ></button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ドリンクモーダル */}
      {showDrinksModal && (
        <div className="drinks-modal active">
          <div className="modal-overlay" onClick={() => setShowDrinksModal(false)}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowDrinksModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="drinks-content">
              <div className="drinks-header">
                <h2 className="drinks-title">{content?.drinks?.title || 'お酒メニュー'}</h2>
                <p className="drinks-subtitle">{content?.drinks?.subtitle || '全国から厳選した日本酒と焼酎、季節限定の銘柄から定番まで'}</p>
              </div>
              
              <div className="drinks-categories">
                {/* カテゴリーを動的に表示 */}
                {(content?.drinks?.categories || []).map((category: { id: string; name: string; items: Array<{ name: string; price: string }> }) => (
                  <div key={category.id} className="drink-category">
                    <div className="category-header">{category.name}</div>
                    <div className="category-items">
                      {category.items.map((item: { name: string; price: string; description?: string }, index: number) => (
                        <div key={index} className="drink-item">
                          {item.description ? (
                            <>
                              <div className="drink-main">
                                <span className="drink-name">{item.name}</span>
                                <span className="drink-price">{item.price}</span>
                              </div>
                              <p className="drink-description">{item.description}</p>
                            </>
                          ) : (
                            <>
                              <span className="drink-name">{item.name}</span>
                              <span className="drink-price">{item.price}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}