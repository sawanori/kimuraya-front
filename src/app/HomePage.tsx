"use client";

import React, { useEffect, useState } from 'react';

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
    backgroundField: string;
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
    };
  };
}

export default function HomePage({ content }: { content: ContentData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [currentSeat, setCurrentSeat] = useState(0);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showDrinksModal, setShowDrinksModal] = useState(false);
  const [currentCourseSlide, setCurrentCourseSlide] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);

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
        firstSlideMobile.offsetHeight; // リフローを強制
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
          nextImg.offsetHeight;
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
        firstSlideDesktop.offsetHeight; // リフローを強制
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
          nextImg.offsetHeight;
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
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    const openMenu = () => {
      if (mobileMenu) mobileMenu.classList.add('active');
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      if (mobileMenu) mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);

    // スムーズスクロール
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#reservation') return;
        
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
      if (mobileMenuClose) mobileMenuClose.removeEventListener('click', closeMenu);
      if (mobileMenuOverlay) mobileMenuOverlay.removeEventListener('click', closeMenu);
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
  return (
    <>
      {/* スクロールコンテナ */}
      <div className="scroll-container">
      {/* Header */}
      <header className={`header ${headerHidden ? 'hero-hidden' : ''}`}>
        <nav className="nav">
          <a href="index.html" className="logo jp-title">{content.info.textFields.shopName.split(' ')[0]}</a>
          
          <ul className="nav-menu">
            <li><a href="#home">ホーム</a></li>
            <li><a href="#about">私たちについて</a></li>
            <li><a href="#menu">メニュー</a></li>
            <li><a href="#gallery">ギャラリー</a></li>
            <li><a href="#info">店舗情報</a></li>
          </ul>
          
          <a href="#" className="nav-reservation-btn">WEB予約</a>
          
          <button className="menu-toggle" id="menuToggle">
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </button>
        </nav>
      </header>
      
      {/* ヒーロー用WEB予約ボタン */}
      <a href="#reservation" className="hero-reservation-btn" id="heroReservationBtn">WEB予約はこちら</a>

      {/* ヒーロー用縦書きナビゲーション */}
      <nav className="hero-nav-menu" id="heroNavMenu">
        <a href="#home">ホーム</a>
        <a href="#room">お品書き</a>
        <a href="#gallery">ギャラリー</a>
        <a href="#info">店舗情報</a>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-bg">
          {content.hero.textFields.backgroundType === 'video' && content.hero.videoFields?.bgVideo ? (
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
          ) : (
            <div className="hero-slider">
              {/* PC・タブレット用 */}
              <div className="hero-slide hero-slide-desktop active">
                <img src={content.hero.imageFields.bgPC1} alt="木村屋本店 メインビジュアル1" />
              </div>
              <div className="hero-slide hero-slide-desktop">
                <img src={content.hero.imageFields.bgPC2} alt="木村屋本店 メインビジュアル2" />
              </div>
              <div className="hero-slide hero-slide-desktop">
                <img src={content.hero.imageFields.bgPC3} alt="木村屋本店 メインビジュアル3" />
              </div>
              <div className="hero-slide hero-slide-desktop">
                <img src={content.hero.imageFields.bgPC4} alt="木村屋本店 メインビジュアル4" />
              </div>
              
              {/* スマホ用 */}
              <div className="hero-slide hero-slide-mobile">
                <img src={content.hero.imageFields.bgMobile1} alt="木村屋本店 スマホ用1" />
              </div>
              <div className="hero-slide hero-slide-mobile">
                <img src={content.hero.imageFields.bgMobile2} alt="木村屋本店 スマホ用2" />
              </div>
              <div className="hero-slide hero-slide-mobile">
                <img src={content.hero.imageFields.bgMobile3} alt="木村屋本店 スマホ用3" />
              </div>
            </div>
          )}
        </div>
        <div className="hero-content">
          <img src={content.hero.imageFields.logo} alt="木村屋本店" className="hero-logo fade-up" />
          <h1 className="hero-title fade-up">
            <span className="desktop-text">{content.hero.textFields.mainTitle}</span>
            <span className="mobile-text">{content.hero.textFields.mainTitle.split('').map((char, i) => (
              <span key={i}>{char === 'も' || char === '専' ? <><br />{char}</> : char}</span>
            ))}</span>
          </h1>
          <p className="hero-subtitle fade-up">
            <span className="desktop-text">{content.hero.textFields.subTitle}</span>
            <span className="mobile-text">{content.hero.textFields.subTitle.split('で').map((part, i) => (
              <React.Fragment key={i}>{i === 0 ? `${part}で` : <><br />{part}</>}</React.Fragment>
            ))}</span>
          </p>
        </div>
        <div className="hero-info fade-up">
          <span>{content.hero.textFields.openTime}</span>
          <span>{content.hero.textFields.closeTime}</span>
          <span>{content.hero.textFields.closedDay}</span>
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
            __html: content.introParallax.textFields.message.replace(/\n/g, '<br />')
          }} />
        </div>
      </section>

      {/* こだわり */}
      <section className="craft-section" id="craft">
        <div className="craft-grid-container">
          <div className="craft-vertical-text">
            <h2 className="craft-vertical-title jp-title fade-up">{content.craft.textFields.leftText}</h2>
          </div>
          
          <div className="craft-vertical-text-right">
            <h2 className="craft-vertical-title-right jp-title fade-up">{content.craft.textFields.rightText}</h2>
          </div>
          
          <div className="craft-image-1">
            <img src={content.craft.imageFields.image1} alt="こだわりの食材" className="craft-img fade-up" loading="lazy" />
            <div className="craft-image-overlay"></div>
          </div>
          
          <div className="craft-image-2">
            <img src={content.craft.imageFields.image2} alt="ちょっとは九州じゃない料理" className="craft-img fade-up" loading="lazy" />
            <div className="craft-image-overlay"></div>
          </div>
          
          <div className="craft-image-3">
            <img src={content.craft.imageFields.image3} alt="こだわりの料理" className="craft-img fade-up" loading="lazy" />
            <div className="craft-image-overlay"></div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="features-section" id="features">
        <div className="features-grid">
          {/* カード1: 伝統の技 (モバイルでは2番目) */}
          <div className="feature-card masked-content order-mobile-2">
            <img src={content.features.imageFields.feature1Image} alt="こだわりの食材" className="feature-image" loading="lazy" />
            <div className="feature-content">
              <div className="feature-number">01</div>
              <h3 className="feature-title jp-title" dangerouslySetInnerHTML={{ 
                __html: content.features.textFields.feature1Title.replace(/\n/g, '<br />')
              }} />
              <p className="feature-description">{content.features.textFields.feature1Description}</p>
              <div className="feature-accent"></div>
            </div>
          </div>

          {/* カード2: メッセージカード (モバイルでは1番目) */}
          <div className="feature-card text-overlay order-mobile-1">
            <div className="feature-content">
              <h3 className="feature-title jp-title fade-up">{content.features.textFields.mainTitle}</h3>
              <p className="feature-description">
                もつ鍋専門店としての伝統の味と受け継がれた<br />
                本場九州仕込み博多もつ鍋と当店のこだわりで<br />
                皆様に満足できる食体験を提供いたします。
              </p>
            </div>
          </div>

          {/* カード3: 四季の美 (モバイルでは3番目) */}
          <div className="feature-card masked-content order-mobile-3">
            <img src={content.features.imageFields.feature2Image} alt="多彩な味" className="feature-image" loading="lazy" />
            <div className="feature-content">
              <div className="feature-number">02</div>
              <h3 className="feature-title jp-title" dangerouslySetInnerHTML={{ 
                __html: content.features.textFields.feature2Title.replace(/\n/g, '<br />')
              }} />
              <p className="feature-description">{content.features.textFields.feature2Description}</p>
              <div className="feature-accent"></div>
            </div>
          </div>

          {/* カード4: 厳選素材 (モバイルでは4番目) */}
          <div className="feature-card masked-content order-mobile-4">
            <img src={content.features.imageFields.feature3Image} alt="充実の逸品" className="feature-image" loading="lazy" />
            <div className="feature-content">
              <div className="feature-number">03</div>
              <h3 className="feature-title jp-title" dangerouslySetInnerHTML={{ 
                __html: content.features.textFields.feature3Title.replace(/\n/g, '<br />')
              }} />
              <p className="feature-description">{content.features.textFields.feature3Description}</p>
              <div className="feature-accent"></div>
            </div>
          </div>

          {/* カード5: おもてなし (モバイルでは5番目) */}
          <div className="feature-card masked-content order-mobile-5">
            <img src={content.features.imageFields.feature4Image} alt="和の空間" className="feature-image" loading="lazy" />
            <div className="feature-content">
              <div className="feature-number">04</div>
              <h3 className="feature-title jp-title" dangerouslySetInnerHTML={{ 
                __html: content.features.textFields.feature4Title.replace(/\n/g, '<br />')
              }} />
              <p className="feature-description">{content.features.textFields.feature4Description}</p>
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
            <img src="/images/no1-0243.jpg" alt="もつ鍋メイン" className="space-hero-img" loading="lazy" />
          </div>
          
          <div className="space-detail-text-1">
            <div className="space-text-block">
              <h3 className="space-text-title">本場九州仕込み</h3>
              <p className="space-text-content">
                厳選した新鮮な国産牛もつを使用し、
                幾度も試作を重ねて完成させた
                香り高き秘伝の特製スープ。
              </p>
            </div>
          </div>
          
          <div className="space-image-1">
            <img src="/images/no1-0220.jpg" alt="博多もつ鍋の調理風景" className="space-sub-image" loading="lazy" />
          </div>
          
          <div className="space-image-2">
            <picture>
              <source media="(max-width: 768px)" srcSet="./images/no1-0241.jpg" />
              <img src="/images/no1-0235.jpg" alt="もつ鍋の具材アップ" className="space-sub-image" loading="lazy" />
            </picture>
          </div>
          
          <div className="space-detail-text-2">
            <div className="space-text-block">
              <p className="space-text-content">
                キャベツはあえて手でちぎることで<br />
                食感を残し、スープがよく染み込むよう工夫。<br />
                もつ鍋専門店としての伝統の味と製法を守り続けています。
              </p>
            </div>
          </div>
          
          <div className="space-circle-1">
            <picture>
              <source media="(max-width: 768px)" srcSet="./images/no1-0220.jpg" />
              <img src="/images/DSC00631.jpg" alt="伝統の調理器具" className="space-circle-img" loading="lazy" />
            </picture>
          </div>
          
          <div className="space-circle-2">
            <img src="/images/DSC00654.jpg" alt="厳選された食材" className="space-circle-img" loading="lazy" />
          </div>
          
          <div className="space-circle-3">
            <img src="/images/DSC00681.jpg" alt="職人の技" className="space-circle-img" loading="lazy" />
          </div>
          
          <div className="space-quote-block">
            <blockquote className="space-quote">
              「塩」、何度でも食べたくなる定番の味「醤油」、まろやかで深みのある濃厚な味わいの「味噌」よりスープをお選びください♪
            </blockquote>
            <cite className="space-quote-author">店長より</cite>
          </div>
        </div>
      </section>

      {/* もつ鍋セクション */}
      <section className="motsunabe-section" id="motsunabe">
        <div className="motsunabe-container">
          <div className="motsunabe-header fade-up">
            <h2 className="motsunabe-title jp-title">名物もつ鍋</h2>
            <p className="motsunabe-subtitle">本場博多の味を、横浜で</p>
          </div>
          
          <div className="motsunabe-content">
            <div className="motsunabe-main fade-up">
              <div className="motsunabe-image-wrapper">
                <img src="/images/no1-0241.jpg" alt="博多もつ鍋" className="motsunabe-image" />
                <div className="motsunabe-badge">
                  <span>創業以来の</span>
                  <span>秘伝の味</span>
                </div>
              </div>
              
              <div className="motsunabe-info">
                <h3 className="motsunabe-catch">
                  厳選された国産牛もつを使用した<br />
                  こだわりの博多もつ鍋
                </h3>
                
                <p className="motsunabe-description">
                  新鮮な国産牛の「もつ」を丁寧に下処理し、
                  創業以来受け継がれる秘伝のスープで炊き上げる本場博多の味。
                  プリプリとした食感と、深いコクのあるスープが自慢です。
                </p>
                
                <div className="motsunabe-features">
                  <div className="motsunabe-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <h4>厳選素材</h4>
                    <p>国産牛もつを100%使用</p>
                  </div>
                  
                  <div className="motsunabe-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3h18v18H3zM12 8v8M8 12h8"/>
                      </svg>
                    </div>
                    <h4>２つの味</h4>
                    <p>醤油・味噌からお選びいただけます</p>
                  </div>
                  
                  <div className="motsunabe-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <h4>〆まで美味しい</h4>
                    <p>ちゃんぽん麺や雑炊で最後まで</p>
                  </div>
                </div>
                
                <div className="motsunabe-price">
                  <div className="price-label">お一人様</div>
                  <div className="price-amount">
                    <span className="price-number">1,680</span>
                    <span className="price-unit">円〜</span>
                    <span className="price-tax">（税込）</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="motsunabe-options fade-up">
              <h3 className="options-title">お好みの味をお選びください</h3>
              <div className="options-grid">
                <div className="option-card">
                  <img src="/images/DSC00440.jpg" alt="醤油もつ鍋" />
                  <h4>醤油もつ鍋</h4>
                  <p>あっさりとした醤油ベースに、にんにくと唐辛子がアクセント。定番の人気メニューです。</p>
                </div>
                <div className="option-card">
                  <img src="/images/DSC00439.jpg" alt="味噌もつ鍋" />
                  <h4>味噌もつ鍋</h4>
                  <p>数種類の味噌をブレンドした濃厚スープ。コクと深みのある味わいが特徴です。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* お品書き */}
      <section className="room-section" id="room">
        <div className="room-container">
          <h2 className="section-title jp-title fade-up">{content.menu.textFields.sectionTitle}</h2>
          <p className="section-subtitle fade-up">{content.menu.textFields.subTitle}</p>
          
          <div className="menu-grid">
            {/* 博多もつ鍋 */}
            <div className="menu-card fade-scale">
              <div className="menu-category">HAKATA MOTSUNABE</div>
              <h3 className="menu-title jp-title">博多もつ鍋</h3>
              <div className="menu-items">
                <div className="menu-item">
                  <span className="menu-item-name">濃厚味噌</span>
                  <span className="menu-item-price">¥1,628</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">醤油</span>
                  <span className="menu-item-price">¥1,628</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">塩</span>
                  <span className="menu-item-price">¥1,628</span>
                </div>
              </div>
              <p className="menu-note">※ 鍋のご注文は2人前から承ります。価格は1人前（税込）</p>
            </div>

            {/* 逸品料理 */}
            <div className="menu-card fade-scale">
              <div className="menu-category">SPECIAL DISHES</div>
              <h3 className="menu-title jp-title">逸品料理</h3>
              <div className="menu-items">
                <div className="menu-item">
                  <span className="menu-item-name">チョレギサラダ</span>
                  <span className="menu-item-price">¥858</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">大分 鶏唐揚げ</span>
                  <span className="menu-item-price">¥528</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">本鮪のお刺身</span>
                  <span className="menu-item-price">¥968</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">明太子入り 出汁巻き玉子</span>
                  <span className="menu-item-price">¥748</span>
                </div>
              </div>
              <p className="menu-note">※ 価格は税込みです</p>
            </div>

            {/* ホルモン・ちりとり焼肉 */}
            <div className="menu-card fade-scale">
              <div className="menu-category">HORMONE & CHIRITRI</div>
              <h3 className="menu-title jp-title">ホルモン ちりとり焼肉</h3>
              <div className="menu-items">
                <div className="menu-item">
                  <span className="menu-item-name">ちりとり焼肉</span>
                  <span className="menu-item-price">¥1,518</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">追加ホルモンセット</span>
                  <span className="menu-item-price">¥858</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">追加野菜セット</span>
                  <span className="menu-item-price">¥550</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">〆のちゃんぽん麺</span>
                  <span className="menu-item-price">¥528</span>
                </div>
              </div>
              <p className="menu-note">※ ご注文は2人前より承ります（価格は1人前・税込）</p>
            </div>

            {/* お食事（スマホでは非表示） */}
            <div className="menu-card fade-scale hidden-menu-mobile" data-menu-extra="true">
              <div className="menu-category">MEALS</div>
              <h3 className="menu-title jp-title">お食事</h3>
              <div className="menu-items">
                <div className="menu-item">
                  <span className="menu-item-name">親富孝通り 屋台名物 鉄板焼きラーメン</span>
                  <span className="menu-item-price">¥858</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">宮崎辛麺</span>
                  <span className="menu-item-price">¥858</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">本鮪漬け丼</span>
                  <span className="menu-item-price">¥1,078</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">石焼きペッパーガーリックライス</span>
                  <span className="menu-item-price">¥990</span>
                </div>
              </div>
              <p className="menu-note">※ 価格は税込みです</p>
            </div>

            {/* 鍋の追加と〆（スマホでは非表示） */}
            <div className="menu-card fade-scale hidden-menu-mobile" data-menu-extra="true">
              <div className="menu-category">NABE TOPPINGS</div>
              <h3 className="menu-title jp-title">鍋の追加と〆</h3>
              <div className="menu-items">
                <div className="menu-item">
                  <span className="menu-item-name">もつ鍋〆セット</span>
                  <span className="menu-item-price">¥858</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">野菜</span>
                  <span className="menu-item-price">¥638</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">特製ちゃんぽん麺</span>
                  <span className="menu-item-price">¥462</span>
                </div>
                <div className="menu-item">
                  <span className="menu-item-name">雑炊セット</span>
                  <span className="menu-item-price">¥462</span>
                </div>
              </div>
              <p className="menu-note">※ 価格は税込みです</p>
            </div>
          </div>
        </div>
      </section>

      {/* 宴会or一人飲みセクション */}
      <section className="dining-style-section" id="dining-style">
        <div className="dining-style-container">
          <h2 className="dining-section-title fade-up">{content.diningStyle?.textFields?.sectionTitle || '選べる当店の楽しみ方！'}</h2>
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
                  <h3 className="dining-title jp-title">{content.diningStyle?.textFields?.partyTitle || '宴会'}</h3>
                </div>
                <div className="dining-description">
                  <p>{content.diningStyle?.textFields?.partyDescription || '大人数でのご利用も歓迎！最大110名様まで対応可能な貸切スペースで、会社の宴会や歓送迎会に最適です。'}</p>
                  <ul className="dining-features">
                    <li>{content.diningStyle?.textFields?.partyFeature1 || '豊富な宴会コース'}</li>
                    <li>{content.diningStyle?.textFields?.partyFeature2 || '貸切対応可能'}</li>
                    <li>{content.diningStyle?.textFields?.partyFeature3 || '飲み放題充実'}</li>
                  </ul>
                </div>
                <button className="dining-cta-btn" onClick={() => setShowCoursesModal(true)}>
                  <span>{content.diningStyle?.textFields?.partyCTA || '宴会コースを見る'}</span>
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
                  <h3 className="dining-title jp-title">{content.diningStyle?.textFields?.sakeTitle || '日本酒'}</h3>
                </div>
                <div className="dining-description">
                  <p>{content.diningStyle?.textFields?.sakeDescription || '全国から厳選した日本酒を多数ご用意。季節限定の銘柄や希少な地酒も楽しめます。'}</p>
                  <ul className="dining-features">
                    <li>{content.diningStyle?.textFields?.sakeFeature1 || '厳選された銘柄'}</li>
                    <li>{content.diningStyle?.textFields?.sakeFeature2 || '季節限定酒あり'}</li>
                    <li>{content.diningStyle?.textFields?.sakeFeature3 || '利き酒セット'}</li>
                  </ul>
                </div>
                <button className="dining-cta-btn" onClick={() => setShowDrinksModal(true)}>
                  <span>{content.diningStyle?.textFields?.sakeCTA || '日本酒メニューを見る'}</span>
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
            <h2 className="seats-title jp-title">{content.seats.textFields.title}</h2>
            <p className="seats-subtitle">{content.seats.textFields.subTitle}</p>
          </div>
          
          {/* スライダーコンテナ */}
          <div className="seats-slider-container fade-up">
            {/* メインスライダー */}
            <div className="seats-main-slider">
              <div className="seats-slides">
                {content.seats.seatData ? (
                  // 新しいseatData形式の場合
                  content.seats.seatData.map((seat: any, index: number) => (
                    <div key={seat.id} className={`seat-slide ${index === 0 ? 'active' : ''}`} data-seat={index}>
                      <div className="seat-image">
                        <img src={seat.image} alt={seat.name} loading="lazy" />
                      </div>
                      <div className="seat-details">
                        <h3 className="seat-name">{seat.name}</h3>
                        <div className="seat-capacity">
                          <span className="capacity-icon">👥</span>
                          <span className="capacity-text">{seat.capacity}</span>
                        </div>
                        <p className="seat-description">
                          {seat.description}
                        </p>
                        <div className="seat-features">
                          {seat.tags.map((tag: string, tagIndex: number) => (
                            <div key={tagIndex} className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span>{tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // 旧imageFields形式の場合（互換性のため）
                  <>
                    {/* 貸切スペース */}
                    <div className="seat-slide active" data-seat="0">
                      <div className="seat-image">
                        <img src={content.seats.imageFields.privateSpace} alt="貸切スペース" loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">貸切スペース</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">最大110名様</span>
                    </div>
                    <p className="seat-description">
                      着席最大110名。広々とした快適空間で貸切宴会が可能です。
                      会社の歓送迎会、忘年会・新年会など大人数のご宴会に最適です。
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>大人数OK</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>貸切可能</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>レイアウト変更可</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 半個室風ボックス席 */}
                <div className="seat-slide" data-seat="1">
                  <div className="seat-image">
                    <img src={content.seats.imageFields.semiPrivateBox} alt="半個室風ボックス席" loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">半個室風ボックス席</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">4〜6名様</span>
                    </div>
                    <p className="seat-description">
                      窓際の開放的な快適空間。プライベート感のあるボックス席で、
                      女子会や気の置けない仲間との飲み会に最適です。
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>落ち着いた空間</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>窓際席</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>女子会におすすめ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* テーブル席 */}
                <div className="seat-slide" data-seat="2">
                  <div className="seat-image">
                    <img src={content.seats.imageFields.tableSeats} alt="テーブル席" loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">スタンダードテーブル席</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">4名様</span>
                    </div>
                    <p className="seat-description">
                      落ち着いた雰囲気のテーブル席。お席もしっかりとスペースを
                      確保しており、ゆったりとお食事をお楽しみいただけます。
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>ゆったり空間</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>少人数向け</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* グループ席 */}
                <div className="seat-slide" data-seat="3">
                  <div className="seat-image">
                    <img src={content.seats.imageFields.groupSeats} alt="グループ席" loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">グループ席</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">6〜8名様</span>
                    </div>
                    <p className="seat-description">
                      仕事終わりの部署飲みに最適な広々とした席。
                      皆で顔を見て話せる一体感のある配置で、楽しいひとときを。
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>大人数対応</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>宴会向け</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>レイアウト変更可</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 窓際デート席 */}
                <div className="seat-slide" data-seat="4">
                  <div className="seat-image">
                    <img src={content.seats.imageFields.windowDateSeats} alt="窓際デート席" loading="lazy" />
                  </div>
                  <div className="seat-details">
                    <h3 className="seat-name">窓際デート席</h3>
                    <div className="seat-capacity">
                      <span className="capacity-icon">👥</span>
                      <span className="capacity-text">2〜4名様</span>
                    </div>
                    <p className="seat-description">
                      外の景色を眺めながらお食事を楽しめる開放的な席。
                      デートや記念日など、特別な日のお食事におすすめです。
                    </p>
                    <div className="seat-features">
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>景色が良い</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>デートに人気</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>開放的</span>
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
                content.seats.seatData.map((seat: any, index: number) => (
                  <div key={seat.id} className={`thumbnail ${index === 0 ? 'active' : ''}`} data-seat={index}>
                    <img src={seat.image} alt={seat.name} />
                    <span className="thumbnail-label">{seat.name.length > 6 ? seat.name.substring(0, 6) : seat.name}</span>
                  </div>
                ))
              ) : (
                // 旧imageFields形式の場合（互換性のため）
                <>
                  <div className="thumbnail active" data-seat="0">
                    <img src={content.seats.imageFields.privateSpace} alt="貸切スペース" />
                    <span className="thumbnail-label">貸切スペース</span>
                  </div>
                  <div className="thumbnail" data-seat="1">
                    <img src={content.seats.imageFields.semiPrivateBox} alt="半個室風ボックス席" />
                    <span className="thumbnail-label">半個室風</span>
                  </div>
                  <div className="thumbnail" data-seat="2">
                    <img src={content.seats.imageFields.tableSeats} alt="テーブル席" />
                    <span className="thumbnail-label">テーブル席</span>
                  </div>
                  <div className="thumbnail" data-seat="3">
                    <img src={content.seats.imageFields.groupSeats} alt="グループ席" />
                    <span className="thumbnail-label">グループ席</span>
                  </div>
                  <div className="thumbnail" data-seat="4">
                    <img src={content.seats.imageFields.windowDateSeats} alt="窓際デート席" />
                    <span className="thumbnail-label">デート席</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* フォトギャラリー */}
      <section className="gallery-section" id="gallery">
        <div className="gallery-container">
          <div className="gallery-header fade-up">
            <h2 className="gallery-title jp-title">{content.gallery.textFields.title}</h2>
            <p className="gallery-subtitle">{content.gallery.textFields.subTitle}</p>
          </div>
          
          <div className="gallery-grid">
            {/* メイン画像（PC/タブレットで全表示、スマホで３枚） */}
            <div className="gallery-item fade-up">
              <img src={content.gallery.imageFields.gallery1} alt="木村屋本店サンプル店の風景1" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">店内の雰囲気</span>
              </div>
            </div>
            <div className="gallery-item fade-up">
              <img src={content.gallery.imageFields.gallery2} alt="木村屋本店サンプル店の風景2" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">ちょっとは九州じゃない料理</span>
              </div>
            </div>
            <div className="gallery-item fade-up">
              <img src={content.gallery.imageFields.gallery3} alt="木村屋本店サンプル店の風景3" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">伝統の味</span>
              </div>
            </div>
            
            {/* 追加画像（PC/タブレットのみ最初から表示） */}
            <div className="gallery-item fade-up desktop-only">
              <img src={content.gallery.imageFields.gallery4} alt="木村屋本店サンプル店の風景4" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">カウンター席</span>
              </div>
            </div>
            <div className="gallery-item fade-up desktop-only">
              <img src={content.gallery.imageFields.gallery5} alt="木村屋本店サンプル店の風景5" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">こだわりの内装</span>
              </div>
            </div>
            <div className="gallery-item fade-up desktop-only">
              <img src={content.gallery.imageFields.gallery6} alt="木村屋本店サンプル店の風景6" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">夜のエントランス</span>
              </div>
            </div>
            
            {/* 追加画像（スマホで「もっと見る」で表示） */}
            <div className={`gallery-item fade-up hidden-mobile ${showAllGallery ? 'show' : ''}`} data-extra="true">
              <img src={content.gallery.imageFields.gallery4} alt="木村屋本店サンプル店の風景4" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">カウンター席</span>
              </div>
            </div>
            <div className={`gallery-item fade-up hidden-mobile ${showAllGallery ? 'show' : ''}`} data-extra="true">
              <img src={content.gallery.imageFields.gallery5} alt="木村屋本店サンプル店の風景5" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">こだわりの内装</span>
              </div>
            </div>
            <div className={`gallery-item fade-up hidden-mobile ${showAllGallery ? 'show' : ''}`} data-extra="true">
              <img src={content.gallery.imageFields.gallery6} alt="木村屋本店サンプル店の風景6" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">夜のエントランス</span>
              </div>
            </div>
            <div className={`gallery-item fade-up hidden-mobile ${showAllGallery ? 'show' : ''}`} data-extra="true">
              <img src={content.gallery.imageFields.gallery7} alt="木村屋本店サンプル店の風景7" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">広々とした客席</span>
              </div>
            </div>
            <div className={`gallery-item fade-up hidden-mobile ${showAllGallery ? 'show' : ''}`} data-extra="true">
              <img src={content.gallery.imageFields.gallery8} alt="木村屋本店サンプル店の風景8" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">特別個室</span>
              </div>
            </div>
            <div className={`gallery-item fade-up hidden-mobile ${showAllGallery ? 'show' : ''}`} data-extra="true">
              <img src={content.gallery.imageFields.gallery9} alt="木村屋本店サンプル店の風景9" className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-caption">おもてなしの心</span>
              </div>
            </div>
          </div>
          
          {/* スマホ用「すべての写真を見る」ボタン */}
          {!showAllGallery && (
          <div className="gallery-more-btn-wrapper mobile-only fade-up">
            <button className="gallery-more-btn" onClick={() => setShowAllGallery(true)}>
              <span>すべての写真を見る</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          )}
        </div>
      </section>

      {/* 新着情報 */}
      <section className="news-section" id="news">
        <div className="news-container">
          <h2 className="section-title jp-title fade-up">新着情報</h2>
          
          <div className="news-grid">
            <article className="news-item fade-up">
              <time className="news-date">2024.01.15</time>
              <h3 className="news-title">冬季限定メニューのご案内</h3>
              <span className="news-category">MENU</span>
              <div className="news-arrow">→</div>
            </article>
            
            <article className="news-item fade-up">
              <time className="news-date">2024.01.08</time>
              <h3 className="news-title">年始の営業時間について</h3>
              <span className="news-category">INFO</span>
              <div className="news-arrow">→</div>
            </article>
            
            <article className="news-item fade-up">
              <time className="news-date">2023.12.20</time>
              <h3 className="news-title">年末年始の営業日のお知らせ</h3>
              <span className="news-category">INFO</span>
              <div className="news-arrow">→</div>
            </article>
          </div>

          <div className="news-more fade-up">
            <a href="#" className="news-more-link">すべての新着情報を見る</a>
          </div>
        </div>
      </section>

      {/* 店舗情報 */}
      <section className="info-section" id="info">
        <div className="container">
          <h2 className="section-title jp-title fade-up">{content.info.textFields.title}</h2>
          
          <dl className="info-list">
            <dt>店名</dt>
            <dd>{content.info.textFields.shopName}</dd>
            
            <dt>住所</dt>
            <dd dangerouslySetInnerHTML={{ __html: content.info.textFields.address.replace(/\n/g, '<br />') }} />
            
            <dt>アクセス</dt>
            <dd>{content.info.textFields.access}</dd>
            
            <dt>電話番号</dt>
            <dd>{content.info.textFields.phone}</dd>
            
            <dt>営業時間</dt>
            <dd dangerouslySetInnerHTML={{ __html: content.info.textFields.businessHours.replace(/\n/g, '<br />') }} />
            
            <dt>定休日</dt>
            <dd>{content.info.textFields.closedDays}</dd>
            
            <dt>席数</dt>
            <dd>{content.info.textFields.seats}</dd>
            
            <dt>喫煙</dt>
            <dd>全席喫煙可（20歳未満入店不可）</dd>
            
            <dt>駐車場</dt>
            <dd>近隣にコインパーキング多数有</dd>
          </dl>
        </div>
        
        {/* Google Map */}
        <div className="map-container fade-up">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.1974859659476!2d139.70330741525882!3d35.672099780197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b5a42881701%3A0x8e54b3de5e8e3d9f!2z5p2x5Lqs6YO95riL6LC35Yy656We5a6u5YmNNC0xMi0xMA!5e0!3m2!1sja!2sjp!4v1635835200000!5m2!1sja!2sjp" 
            width="100%" 
            height="500" 
            style={{border: 0}} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
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
            <a href="#reservation" className="footer-reservation-btn">WEB予約はこちら</a>
          </div>
          <div className="footer-right">
            <div className="footer-info-group">
              <div className="footer-info-item">
                <span className="footer-label">住所</span>
                <span className="footer-value" dangerouslySetInnerHTML={{ __html: content.info.textFields.address.replace(/\n/g, ' ') }} />
              </div>
              <div className="footer-info-item">
                <span className="footer-label">アクセス</span>
                <span className="footer-value">{content.info.textFields.access}</span>
              </div>
              <div className="footer-info-item">
                <span className="footer-label">営業時間</span>
                <span className="footer-value" dangerouslySetInnerHTML={{ __html: content.info.textFields.businessHours.replace(/\n/g, '<br />') }} />
              </div>
              <div className="footer-info-item">
                <span className="footer-label">定休日</span>
                <span className="footer-value">{content.info.textFields.closedDays}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">&copy; 2024 {content.info.textFields.shopName.split(' ')[0]}. All rights reserved.</p>
          <button className="page-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
            <span>PAGE TOP</span>
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
            <li><a href="#home" className="mobile-link">ホーム</a></li>
            <li><a href="#features" className="mobile-link">特徴</a></li>
            <li><a href="#space" className="mobile-link">本場九州仕込み</a></li>
            <li><a href="#room" className="mobile-link">お品書き</a></li>
            <li><a href="#dining-style" className="mobile-link">楽しみ方</a></li>
            <li><a href="#seats" className="mobile-link">お席</a></li>
            <li><a href="#gallery" className="mobile-link">ギャラリー</a></li>
            <li><a href="#news" className="mobile-link">新着情報</a></li>
            <li><a href="#info" className="mobile-link">店舗案内</a></li>
          </ul>
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
          <a href="#reservation" className="bottom-nav-item">
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
              {/* スライド1 */}
              <div className={`course-slide ${currentCourseSlide === 0 ? 'active' : ''}`}>
                <div className="course-header">
                  <div className="course-image">
                    <img src="/images/DSC00406.jpg" alt="夏の宴会コース" />
                  </div>
                  <h2 className="course-title">～夏の宴会～<br />3時間飲み放題付き！夏の食材＆佐賀牛を堪能<br /><span className="title-price">5,000円（税込）</span></h2>
                  <p className="course-subtitle">※金曜・土曜は2時間でのご案内になります</p>
                </div>
                <div className="course-body">
                  <div className="course-info">
                    <div className="course-items">全<span>8</span>品</div>
                    <p className="course-description">佐賀牛のステーキや本マグロも入ったお刺身、夏の食材にもこだわった全8品。暑気払いや納涼会などに最適。</p>
                    
                    <div className="course-menu">
                      <h4 className="menu-title">コース内容</h4>
                      <ul className="menu-items">
                        <li>季節の前菜</li>
                        <li>本マグロお刺身</li>
                        <li>佐賀牛ステーキ</li>
                        <li>夏野菜の天ぷら</li>
                        <li>冷製スープ</li>
                        <li>季節の焼き物</li>
                        <li>〆のもつ鍋</li>
                        <li>デザート</li>
                      </ul>
                    </div>
                    <div className="course-features">
                      <div className="feature-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 11l3 3L22 4"/>
                          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                        </svg>
                        飲み放題（平日3時間／金・土2時間）
                      </div>
                      <div className="feature-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        3名様～50名様
                      </div>
                    </div>
                  </div>
                  <button className="course-cta">このコースを予約する</button>
                </div>
              </div>
              
              {/* スライド2 */}
              <div className={`course-slide ${currentCourseSlide === 1 ? 'active' : ''}`}>
                <div className="course-header">
                  <div className="course-image">
                    <img src="/images/DSC00440.jpg" alt="もつ鍋食べ飲み放題コース" />
                  </div>
                  <h2 className="course-title">もつ鍋食べ飲み放題♪<br /><span className="title-price">２時間　4,280円（税込）</span></h2>
                  <p className="course-subtitle">※金曜日・土曜日のご利用は＋300円になります</p>
                </div>
                <div className="course-body">
                  <div className="course-info">
                    <div className="course-items">全<span>16</span>品</div>
                    <p className="course-description">木村屋自慢のもつ鍋が完全予約制で食べ飲み放題。サイドメニューも充実で大満足間違いなし。</p>
                    
                    <div className="course-menu">
                      <h4 className="menu-title">コース内容</h4>
                      <ul className="menu-items">
                        <li>季節の小鉢3品</li>
                        <li>お刺身3点盛り</li>
                        <li>名物もつ鍋（醤油・味噌・塩から選択）</li>
                        <li>野菜盛り合わせ</li>
                        <li>唐揚げ</li>
                        <li>焼き餃子</li>
                        <li>馬刺し</li>
                        <li>枝豆</li>
                        <li>冷奴</li>
                        <li>キムチ</li>
                        <li>漬物</li>
                        <li>焼き鳥（塩・タレ）</li>
                        <li>フライドポテト</li>
                        <li>サラダ</li>
                        <li>〆のちゃんぽん麺</li>
                        <li>アイスクリーム</li>
                      </ul>
                    </div>
                    <div className="course-features">
                      <div className="feature-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 11l3 3L22 4"/>
                          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                        </svg>
                        飲み放題（2時間）
                      </div>
                      <div className="feature-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 11l3 3L22 4"/>
                          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                        </svg>
                        食べ放題（メイン・サイドメニュー）
                      </div>
                      <div className="feature-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        16:00～23:30
                      </div>
                    </div>
                  </div>
                  <button className="course-cta">このコースを予約する</button>
                </div>
              </div>
              
              {/* スライダーコントロール */}
              <button className="slider-control prev" onClick={() => setCurrentCourseSlide((prev) => prev === 0 ? 1 : prev - 1)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button className="slider-control next" onClick={() => setCurrentCourseSlide((prev) => (prev + 1) % 2)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              
              {/* ドットインジケーター */}
              <div className="slider-dots">
                <button className={`slider-dot ${currentCourseSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentCourseSlide(0)}></button>
                <button className={`slider-dot ${currentCourseSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentCourseSlide(1)}></button>
              </div>
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
                <h2 className="drinks-title">お酒メニュー</h2>
                <p className="drinks-subtitle">全国から厳選した日本酒と焼酎、季節限定の銘柄から定番まで</p>
              </div>
              
              <div className="drinks-categories">
                {/* ビール */}
                <div className="drink-category">
                  <div className="category-header">ビール</div>
                  <div className="category-items">
                    <div className="drink-item">
                      <span className="drink-name">プレミアムモルツ中ジョッキ</span>
                      <span className="drink-price">¥605</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">プレミアムモルツ中瓶</span>
                      <span className="drink-price">¥748</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">アサヒスーパードライ中瓶</span>
                      <span className="drink-price">¥748</span>
                    </div>
                  </div>
                </div>
                
                {/* ハイボール */}
                <div className="drink-category">
                  <div className="category-header">ハイボール</div>
                  <div className="category-items">
                    <div className="drink-item">
                      <span className="drink-name">ジムビームハイボール</span>
                      <span className="drink-price">¥319</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">ジムビームハイボール メガサイズ</span>
                      <span className="drink-price">¥594</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">角ハイボール</span>
                      <span className="drink-price">¥572</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">角ハイボール メガサイズ</span>
                      <span className="drink-price">¥704</span>
                    </div>
                  </div>
                </div>
                
                {/* プレミアムウイスキー */}
                <div className="drink-category">
                  <div className="category-header">プレミアムウイスキー</div>
                  <div className="category-items">
                    <div className="drink-item">
                      <div className="drink-main">
                        <span className="drink-name">知多</span>
                        <span className="drink-price">¥1,078</span>
                      </div>
                      <p className="drink-description">軽やかな味わいとほのかに甘い香りのシングルグレーン</p>
                    </div>
                    <div className="drink-item">
                      <div className="drink-main">
                        <span className="drink-name">余市</span>
                        <span className="drink-price">¥1,078</span>
                      </div>
                      <p className="drink-description">力強いピートの味わいと香ばしさ</p>
                    </div>
                    <div className="drink-item">
                      <div className="drink-main">
                        <span className="drink-name">白州</span>
                        <span className="drink-price">¥1,078</span>
                      </div>
                      <p className="drink-description">華やかでフルーティな香り</p>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">碧Ao</span>
                      <span className="drink-price">¥748</span>
                    </div>
                  </div>
                </div>
                
                {/* サワー */}
                <div className="drink-category">
                  <div className="category-header">サワー</div>
                  <div className="category-items">
                    <div className="drink-item">
                      <span className="drink-name">ごろごろレモンサワー</span>
                      <span className="drink-price">¥550</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">タコハイ</span>
                      <span className="drink-price">¥429</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">こだわり酒場のレモンサワー</span>
                      <span className="drink-price">¥429</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">すっぱいレモンサワー</span>
                      <span className="drink-price">¥429</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">コーラレモンサワー</span>
                      <span className="drink-price">¥429</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">梅干しサワー</span>
                      <span className="drink-price">¥495</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">奏ゆずサワー</span>
                      <span className="drink-price">¥495</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">奏ももサワー</span>
                      <span className="drink-price">¥495</span>
                    </div>
                  </div>
                </div>
                
                {/* お茶割り */}
                <div className="drink-category">
                  <div className="category-header">お茶割り</div>
                  <div className="category-items">
                    <div className="drink-item">
                      <span className="drink-name">玄米緑茶ハイ</span>
                      <span className="drink-price">¥440</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">JJジャスミンハイ</span>
                      <span className="drink-price">¥462</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">ウーロンハイ</span>
                      <span className="drink-price">¥418</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">コーン茶ハイ</span>
                      <span className="drink-price">¥418</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">緑茶ハイ</span>
                      <span className="drink-price">¥462</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">黒ウーロンハイ</span>
                      <span className="drink-price">¥462</span>
                    </div>
                  </div>
                </div>
                
                {/* 焼酎 */}
                <div className="drink-category">
                  <div className="category-header">焼酎</div>
                  <div className="category-items">
                    <div className="drink-item">
                      <span className="drink-name">大隅（芋）</span>
                      <span className="drink-price">¥418</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">大隅（芋）ボトル</span>
                      <span className="drink-price">¥2,728</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">大隅（麦）</span>
                      <span className="drink-price">¥418</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">大隅（麦）ボトル</span>
                      <span className="drink-price">¥2,728</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">茉莉花ボトル</span>
                      <span className="drink-price">¥3,058</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">キンミヤボトル</span>
                      <span className="drink-price">¥3,058</span>
                    </div>
                  </div>
                </div>
                
                {/* 日本酒 */}
                <div className="drink-category">
                  <div className="category-header">日本酒</div>
                  <div className="category-items">
                    <div className="drink-item">
                      <span className="drink-name">獺祭 純米大吟醸45</span>
                      <span className="drink-price">¥1,408</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">黒龍 大吟醸</span>
                      <span className="drink-price">¥1,100</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">天狗舞 山廃仕込純米酒</span>
                      <span className="drink-price">¥825</span>
                    </div>
                    <div className="drink-item">
                      <span className="drink-name">賀茂鶴 本醸造</span>
                      <span className="drink-price">¥550</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}