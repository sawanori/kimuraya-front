'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, MessageCircle, Clock, ChevronLeft, Send, Search, AlertCircle, CheckCircle, Settings, X, Save } from 'lucide-react'
import { useGoogleBusinessProfileSettings, ApiSettingsProvider } from '@/contexts/ApiSettingsContext'
import './gbp.css'

// モックデータ
const mockReviews = [
  {
    id: 1,
    author: '山田太郎',
    profileImage: 'https://via.placeholder.com/50',
    rating: 5,
    date: '2024年1月15日',
    text: '本格的な九州料理が楽しめる素晴らしいお店です。特に、馬刺しは絶品でした。スタッフの方々も親切で、居心地の良い空間でした。また必ず訪れたいと思います。',
    hasReply: true,
    reply: {
      text: 'この度はご来店いただき、誠にありがとうございました。馬刺しをお楽しみいただけたようで大変嬉しく思います。スタッフ一同、お客様に快適な時間をお過ごしいただけるよう努めております。またのお越しを心よりお待ちしております。',
      date: '2024年1月16日'
    }
  },
  {
    id: 2,
    author: '佐藤花子',
    profileImage: 'https://via.placeholder.com/50',
    rating: 5,
    date: '2024年1月10日',
    text: '会社の宴会で利用させていただきました。個室でゆったりと過ごせ、料理のクオリティも高く、みんな大満足でした。特に、もつ鍋が絶品で、締めのちゃんぽん麺も最高でした。',
    hasReply: false
  },
  {
    id: 3,
    author: '鈴木一郎',
    profileImage: 'https://via.placeholder.com/50',
    rating: 4,
    date: '2024年1月5日',
    text: 'デートで利用しました。窓際の席で夜景を見ながらの食事は本当にロマンチックでした。お料理も美味しく、特に地鶏の炭火焼きが香ばしくて忘れられない味です。',
    hasReply: false
  },
  {
    id: 4,
    author: '田中美咲',
    profileImage: 'https://via.placeholder.com/50',
    rating: 3,
    date: '2023年12月28日',
    text: '料理は美味しかったのですが、金曜日の夜ということもあり、かなり混雑していて注文から提供まで時間がかかりました。もう少しスムーズだと良かったです。',
    hasReply: true,
    reply: {
      text: '貴重なご意見をいただき、ありがとうございます。金曜日の混雑時にお待たせしてしまい、申し訳ございませんでした。スタッフの配置やオペレーションの改善に努めてまいります。',
      date: '2023年12月29日'
    }
  },
  {
    id: 5,
    author: '高橋健二',
    profileImage: 'https://via.placeholder.com/50',
    rating: 5,
    date: '2023年12月20日',
    text: '雰囲気、料理、サービス、すべてが最高でした。特別な日の食事にぴったりのお店です。コース料理を注文しましたが、どれも丁寧に作られていて感動しました。',
    hasReply: false
  }
]

type Review = typeof mockReviews[0]

function GBPPageContent() {
  const router = useRouter()
  const gbpSettings = useGoogleBusinessProfileSettings()
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showOnlyNoReply, setShowOnlyNoReply] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const [isMobile, setIsMobile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [template1, setTemplate1] = useState('この度はご来店いただき、誠にありがとうございました。')
  const [template2, setTemplate2] = useState('貴重なご意見をいただき、ありがとうございます。')
  const [tempTemplate1, setTempTemplate1] = useState('')
  const [tempTemplate2, setTempTemplate2] = useState('')


  // レスポンシブ検出
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // フィルタリング
  const filteredReviews = mockReviews.filter(review => {
    if (searchQuery && !review.text.includes(searchQuery) && !review.author.includes(searchQuery)) {
      return false
    }
    if (filterRating && review.rating !== filterRating) {
      return false
    }
    if (showOnlyNoReply && review.hasReply) {
      return false
    }
    return true
  })

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSubmitting(true)
    
    // API呼び出しのシミュレーション
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    setReplyText('')
    
    // 成功メッセージを3秒後に非表示
    setTimeout(() => {
      setShowSuccess(false)
      if (selectedReview) {
        selectedReview.hasReply = true
        selectedReview.reply = {
          text: replyText,
          date: new Date().toLocaleDateString('ja-JP')
        }
      }
    }, 3000)
  }

  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length

  // モバイル用のレビュー選択ハンドラー
  const handleReviewSelect = (review: Review) => {
    setSelectedReview(review)
    // モバイルでは詳細ビューに切り替え
    if (isMobile) {
      setMobileView('detail')
    }
  }

  // モバイル用の戻るボタンハンドラー
  const handleMobileBack = () => {
    setMobileView('list')
  }

  // 設定を開く
  const openSettings = () => {
    setTempTemplate1(template1)
    setTempTemplate2(template2)
    setShowSettings(true)
  }

  // 設定を保存
  const saveSettings = () => {
    setTemplate1(tempTemplate1)
    setTemplate2(tempTemplate2)
    setShowSettings(false)
  }

  // 設定をキャンセル
  const cancelSettings = () => {
    setShowSettings(false)
  }

  return (
    <div className="gbp-container">
      {/* ヘッダー */}
      <header className="gbp-header">
        <div className="gbp-header-content">
          <button onClick={() => router.back()} className="back-button">
            <ChevronLeft />
            戻る
          </button>
          <h1 className="gbp-title">口コミ管理</h1>
          <div className="flex items-center gap-3">
            {gbpSettings.isConfigured ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>API設定済み</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>API未設定</span>
              </div>
            )}
            <button onClick={openSettings} className="settings-btn">
              <Settings />
              <span>返信テンプレート設定</span>
            </button>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">総レビュー数</span>
              <span className="stat-value">{mockReviews.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">平均評価</span>
              <span className="stat-value">{averageRating.toFixed(1)} ★</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">未返信</span>
              <span className="stat-value">{mockReviews.filter(r => !r.hasReply).length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="gbp-content">
        {/* サイドバー - レビューリスト */}
        <aside className={`reviews-sidebar ${mobileView === 'detail' ? 'mobile-hidden' : ''}`}>
          <div className="sidebar-header">
            <h2>レビュー一覧</h2>
            
            {/* 検索・フィルター */}
            <div className="search-filter-container">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="レビューを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-options">
                <select 
                  value={filterRating || ''} 
                  onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                  className="filter-select"
                >
                  <option value="">すべての評価</option>
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★☆ (4)</option>
                  <option value="3">★★★☆☆ (3)</option>
                  <option value="2">★★☆☆☆ (2)</option>
                  <option value="1">★☆☆☆☆ (1)</option>
                </select>
                
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={showOnlyNoReply}
                    onChange={(e) => setShowOnlyNoReply(e.target.checked)}
                  />
                  <span>未返信のみ</span>
                </label>
              </div>
            </div>
          </div>

          <div className="reviews-list">
            {filteredReviews.map(review => (
              <div
                key={review.id}
                className={`review-item ${selectedReview?.id === review.id ? 'active' : ''} ${!review.hasReply ? 'no-reply' : ''}`}
                onClick={() => handleReviewSelect(review)}
              >
                <div className="review-item-header">
                  <img src={review.profileImage} alt={review.author} className="reviewer-avatar" />
                  <div className="reviewer-info">
                    <h3>{review.author}</h3>
                    <div className="review-meta">
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={i < review.rating ? 'filled' : ''} />
                        ))}
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                  {!review.hasReply && <span className="no-reply-badge">未返信</span>}
                </div>
                <p className="review-preview">{review.text.substring(0, 80)}...</p>
              </div>
            ))}
          </div>
        </aside>

        {/* メインコンテンツ - レビュー詳細 */}
        <main className={`review-detail ${mobileView === 'detail' ? 'mobile-visible' : ''}`}>
          {selectedReview ? (
            <>
              {/* モバイル用戻るボタン */}
              {isMobile && (
                <button onClick={handleMobileBack} className="mobile-back-button">
                  <ChevronLeft /> レビュー一覧に戻る
                </button>
              )}
              <div className="detail-header">
                <div className="reviewer-detail">
                  <img src={selectedReview.profileImage} alt={selectedReview.author} className="reviewer-avatar-large" />
                  <div>
                    <h2>{selectedReview.author}</h2>
                    <div className="review-meta-detail">
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={i < selectedReview.rating ? 'filled' : ''} />
                        ))}
                      </div>
                      <span className="review-date">{selectedReview.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="review-content">
                <p className="review-text">{selectedReview.text}</p>
              </div>

              {/* 返信セクション */}
              {selectedReview.hasReply ? (
                <div className="reply-section existing-reply">
                  <h3><MessageCircle /> 返信済み</h3>
                  <div className="reply-content">
                    <p>{selectedReview.reply?.text}</p>
                    <span className="reply-date">
                      <Clock /> {selectedReview.reply?.date}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="reply-section">
                  <h3><MessageCircle /> 返信を作成</h3>
                  <form onSubmit={handleReplySubmit} className="reply-form">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="お客様への返信を入力してください..."
                      className="reply-textarea"
                      rows={6}
                      disabled={isSubmitting}
                    />
                    <div className="reply-actions">
                      <div className="template-buttons">
                        <button
                          type="button"
                          className="template-btn"
                          onClick={() => setReplyText(template1)}
                        >
                          定型文1
                        </button>
                        <button
                          type="button"
                          className="template-btn"
                          onClick={() => setReplyText(template2)}
                        >
                          定型文2
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="submit-reply-btn"
                        disabled={!replyText.trim() || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>送信中...</>
                        ) : (
                          <>
                            <Send /> 返信を送信
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  {showSuccess && (
                    <div className="success-message">
                      <CheckCircle /> 返信が正常に送信されました
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <AlertCircle />
              <p>レビューを選択してください</p>
            </div>
          )}
        </main>

        {/* モバイルビュー切り替えボタン */}
        {isMobile && (
          <div className="mobile-view-toggle">
            <button 
              className={mobileView === 'list' ? 'active' : ''} 
              onClick={() => setMobileView('list')}
            >
              レビュー一覧
            </button>
            <button 
              className={mobileView === 'detail' ? 'active' : ''} 
              onClick={() => setMobileView('detail')}
              disabled={!selectedReview}
            >
              詳細
            </button>
          </div>
        )}
      </div>

      {/* 返信テンプレート設定モーダル */}
      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <div className="settings-header">
              <h2>返信テンプレート設定</h2>
              <button onClick={cancelSettings} className="close-btn">
                <X />
              </button>
            </div>
            
            <div className="settings-body">
              {/* 定型文設定セクション */}
              <div className="settings-section">
                <h3>定型文設定</h3>
                <div className="settings-input-group">
                  <label htmlFor="template1">定型文1</label>
                  <textarea
                    id="template1"
                    value={tempTemplate1}
                    onChange={(e) => setTempTemplate1(e.target.value)}
                    className="settings-input textarea"
                    rows={3}
                    placeholder="定型文1を入力してください..."
                  />
                </div>
                
                <div className="settings-input-group">
                  <label htmlFor="template2">定型文2</label>
                  <textarea
                    id="template2"
                    value={tempTemplate2}
                    onChange={(e) => setTempTemplate2(e.target.value)}
                    className="settings-input textarea"
                    rows={3}
                    placeholder="定型文2を入力してください..."
                  />
                </div>
              </div>

            </div>
            
            <div className="settings-footer">
              <button onClick={cancelSettings} className="cancel-btn">
                キャンセル
              </button>
              <button onClick={saveSettings} className="save-btn">
                <Save />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GBPPage() {
  return (
    <ApiSettingsProvider>
      <GBPPageContent />
    </ApiSettingsProvider>
  )
}