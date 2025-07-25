'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Edit3, Image, Type, Palette } from 'lucide-react'
import './editor.css'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface SectionEdit {
  id: string
  name: string
  hasBackground: boolean
  hasText: boolean
  hasImage: boolean
  textFields?: { label: string; value: string; multiline?: boolean }[]
  imageFields?: { label: string; value: string }[]
  backgroundField?: { label: string; value: string }
  hasSeats?: boolean
}

interface SeatData {
  id: string
  name: string
  capacity: string
  description: string
  tags: string[]
  image: string
}

export default function EditorPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [isSaving, setIsSaving] = useState(false)
  const [editedContent, setEditedContent] = useState<Record<string, any>>({})
  const [savedContent, setSavedContent] = useState<Record<string, any>>({})
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set())

  // デフォルトの席データ
  const defaultSeats: SeatData[] = [
    {
      id: 'private-space',
      name: '貸切スペース',
      capacity: '最大110名様',
      description: '着席最大110名。広々とした快適空間で貸切宴会が可能です。会社の歓送迎会、忘年会・新年会など大人数のご宴会に最適です。',
      tags: ['大人数OK', '貸切可能', '宴会向け'],
      image: '/images/DSC00424.jpg'
    },
    {
      id: 'semi-private-box',
      name: '半個室風ボックス席',
      capacity: '4〜6名様',
      description: '窓際の開放的な快適空間。プライベート感のあるボックス席で、女子会や気の置けない仲間との飲み会に最適です。',
      tags: ['落ち着いた空間', '女子会向け'],
      image: '/images/DSC00401.jpg'
    },
    {
      id: 'table-seats',
      name: 'スタンダードテーブル席',
      capacity: '4名様',
      description: '落ち着いた雰囲気のテーブル席。お席もしっかりとスペースを確保しており、ゆったりとお食事をお楽しみいただけます。',
      tags: ['ゆったり空間', 'カジュアル'],
      image: '/images/DSC00406.jpg'
    },
    {
      id: 'group-seats',
      name: 'グループ席',
      capacity: '6〜8名様',
      description: '仕事終わりの部署飲みに最適な広々とした席。皆で顔を見て話せる一体感のある配置で、楽しいひとときを。',
      tags: ['大人数対応', '部署飲み向け'],
      image: '/images/DSC00429.jpg'
    },
    {
      id: 'window-date-seats',
      name: '窓際デート席',
      capacity: '2〜4名様',
      description: '外の景色を眺めながらお食事を楽しめる開放的な席。デートや記念日など、特別な日のお食事におすすめです。',
      tags: ['景色が良い', 'デート向け'],
      image: '/images/DSC00396.jpg'
    }
  ]

  // セクション編集データ
  const sections: SectionEdit[] = [
    {
      id: 'hero',
      name: 'ヒーローセクション',
      hasBackground: true,
      hasText: true,
      hasImage: true,
      textFields: [
        { label: 'メインタイトル', value: '博多もつ鍋専門店' },
        { label: 'サブタイトル', value: '九州料理と美酒で楽しい宴会を' },
        { label: '営業時間（開店）', value: 'OPEN 10:00' },
        { label: '営業時間（閉店）', value: 'CLOSE 22:00' },
        { label: '定休日', value: '定休日 水曜日' }
      ],
      imageFields: [
        { label: 'ロゴ画像', value: '/images/log.png' },
        { label: '背景画像1（PC）', value: '/images/DSC00442.jpg' },
        { label: '背景画像2（PC）', value: '/images/DSC00456.jpg' },
        { label: '背景画像3（PC）', value: '/images/DSC00398.jpg' },
        { label: '背景画像4（PC）', value: '/images/DSC00406.jpg' },
        { label: '背景画像1（スマホ）', value: '/images/DSC00400.jpg' },
        { label: '背景画像2（スマホ）', value: '/images/DSC00480.jpg' },
        { label: '背景画像3（スマホ）', value: '/images/DSC00653.jpg' }
      ]
    },
    {
      id: 'introParallax',
      name: '冒頭メッセージ',
      hasBackground: false,
      hasText: true,
      hasImage: true,
      textFields: [
        { label: 'メッセージ', value: '季節折々、\nいいもの作りやす', multiline: true }
      ],
      imageFields: [
        { label: 'パララックス背景画像', value: '/images/DSC00400.jpg' }
      ]
    },
    {
      id: 'craft',
      name: 'こだわりセクション',
      hasBackground: false,
      hasText: true,
      hasImage: true,
      textFields: [
        { label: '左側縦書きテキスト', value: 'ちょっとは九州じゃない料理' },
        { label: '右側縦書きテキスト', value: '九州料理と美味い酒' }
      ],
      imageFields: [
        { label: '画像1', value: '/images/DSC00473.jpg' },
        { label: '画像2', value: '/images/no1-0357.jpg' },
        { label: '画像3', value: '/images/no1-0208.jpg' }
      ]
    },
    {
      id: 'features',
      name: '特徴セクション',
      hasBackground: false,
      hasText: true,
      hasImage: true,
      textFields: [
        { label: 'メインタイトル', value: '当店の４つのこだわり' },
        { label: 'こだわり1タイトル', value: '当店名物！\nこだわりの博多もつ鍋' },
        { label: 'こだわり1説明', value: '厳選した国産牛もつと秘伝の特製スープで作る本場博多の味。', multiline: true },
        { label: 'こだわり2タイトル', value: '季節の食材と調理で\n味わう逸品料理' },
        { label: 'こだわり2説明', value: '本マグロ入りお刺身盛り合わせ、馬刺しユッケ、桜鯛のなめろうなど', multiline: true },
        { label: 'こだわり3タイトル', value: '幹事様に朗報！\n大好評宴会コース' },
        { label: 'こだわり3説明', value: '3時間飲み放題付きコースや食べ飲み放題プランなど多彩なコースをご用意。', multiline: true },
        { label: 'こだわり4タイトル', value: '様々なシーンに\n最適な各種空間' },
        { label: 'こだわり4説明', value: '半個室風ボックス席、窓際デート席、グループ席など多彩な席をご用意。', multiline: true }
      ],
      imageFields: [
        { label: 'こだわり1画像', value: '/images/no1-0241.jpg' },
        { label: 'こだわり2画像', value: '/images/DSC00440.jpg' },
        { label: 'こだわり3画像', value: '/images/DSC00689.jpg' },
        { label: 'こだわり4画像', value: '/images/DSC00424.jpg' }
      ]
    },
    {
      id: 'menu',
      name: 'お品書き',
      hasBackground: false,
      hasText: true,
      hasImage: false,
      textFields: [
        { label: 'セクションタイトル', value: 'お品書き' },
        { label: 'サブタイトル', value: '心安らぐ空間で、特別なひとときを' },
        { label: 'メニュー内容', value: '※メニュー内容はJSON形式で管理', multiline: true }
      ]
    },
    {
      id: 'diningStyle',
      name: '選べる当店の楽しみ方',
      hasBackground: false,
      hasText: true,
      hasImage: true,
      textFields: [
        { label: 'セクションタイトル', value: '選べる当店の楽しみ方！' },
        { label: '宴会タイトル', value: '宴会' },
        { label: '宴会説明', value: '大人数でのご利用も歓迎！最大110名様まで対応可能な貸切スペースで、会社の宴会や歓送迎会に最適です。', multiline: true },
        { label: '宴会特徴1', value: '豊富な宴会コース' },
        { label: '宴会特徴2', value: '貸切対応可能' },
        { label: '宴会特徴3', value: '飲み放題充実' },
        { label: '宴会CTA', value: '宴会コースを見る' },
        { label: '日本酒タイトル', value: '日本酒' },
        { label: '日本酒説明', value: '全国から厳選した日本酒を多数ご用意。季節限定の銘柄や希少な地酒も楽しめます。', multiline: true },
        { label: '日本酒特徴1', value: '厳選された銘柄' },
        { label: '日本酒特徴2', value: '季節限定酒あり' },
        { label: '日本酒特徴3', value: '利き酒セット' },
        { label: '日本酒CTA', value: '日本酒メニューを見る' }
      ],
      imageFields: [
        { label: '宴会背景画像', value: '/images/DSC00452.jpg' },
        { label: '日本酒背景画像', value: '/images/DSC00493.jpg' }
      ]
    },
    {
      id: 'seats',
      name: '席紹介',
      hasBackground: false,
      hasText: true,
      hasImage: false,
      hasSeats: true,
      textFields: [
        { label: 'タイトル', value: 'お席のご案内' },
        { label: 'サブタイトル', value: '大切なひとときを過ごすための、さまざまな空間をご用意' }
      ]
    },
    {
      id: 'gallery',
      name: 'フォトギャラリー',
      hasBackground: false,
      hasText: true,
      hasImage: true,
      textFields: [
        { label: 'タイトル', value: 'フォトギャラリー' },
        { label: 'サブタイトル', value: '木村屋本店の様々な風景' }
      ],
      imageFields: [
        { label: 'ギャラリー画像1', value: '/images/no1-0241.jpg' },
        { label: 'ギャラリー画像2', value: '/images/no1-0283.jpg' },
        { label: 'ギャラリー画像3', value: '/images/no1-0361.jpg' },
        { label: 'ギャラリー画像4', value: '/images/no1-0151.jpg' },
        { label: 'ギャラリー画像5', value: '/images/DSC00439.jpg' },
        { label: 'ギャラリー画像6', value: '/images/DSC00680.jpg' },
        { label: 'ギャラリー画像7', value: '/images/DSC00571.jpg' },
        { label: 'ギャラリー画像8', value: '/images/DSC00566.jpg' },
        { label: 'ギャラリー画像9', value: '/images/DSC00527.jpg' }
      ]
    },
    {
      id: 'info',
      name: '店舗情報',
      hasBackground: false,
      hasText: true,
      hasImage: false,
      textFields: [
        { label: 'タイトル', value: '店舗案内' },
        { label: '店名', value: '木村屋本店 横浜鶴屋町' },
        { label: '住所', value: '神奈川県横浜市神奈川区鶴屋町2-15\nエフテム白十字ビル 2F・3F', multiline: true },
        { label: 'アクセス', value: '横浜駅きた西口 徒歩1分' },
        { label: '電話番号', value: '050-5484-9698' },
        { label: '営業時間', value: '月～金: 17:00～23:30 (L.O.23:00)\n土日祝: 16:00～23:30 (L.O.23:00)', multiline: true },
        { label: '定休日', value: '無休' },
        { label: '席数', value: '110席（貸切最大110名様まで）' }
      ]
    }
  ]

  const currentSection = sections.find(s => s.id === activeSection)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // 保存済みコンテンツを読み込む
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content')
        if (response.ok) {
          const content = await response.json()
          setSavedContent(content)
        }
      } catch (error) {
        console.error('Failed to load content:', error)
      }
    }

    loadContent()
  }, [])

  const handleSave = async () => {
    // 現在のスクロール位置を保存
    const scrollPosition = window.scrollY
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedContent),
      })
      
      if (response.ok) {
        const updatedContent = await response.json()
        // 保存されたコンテンツを更新
        setSavedContent(updatedContent.content)
        setEditedContent({})
        
        // スクロール位置を復元
        setTimeout(() => {
          window.scrollTo(0, scrollPosition)
        }, 0)
        
        // 成功メッセージを表示（alertの代わりに）
        const message = document.createElement('div')
        message.className = 'editor-success-message'
        message.textContent = '保存しました'
        document.body.appendChild(message)
        
        // ルーターキャッシュをリフレッシュ
        router.refresh()
        
        setTimeout(() => {
          message.remove()
        }, 2000)
      } else {
        alert('保存に失敗しました')
      }
    } catch (error) {
      alert('保存中にエラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (sectionId: string, fieldType: string, fieldKey: string, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldType]: {
          ...prev[sectionId]?.[fieldType],
          [fieldKey]: value
        }
      }
    }))
  }

  const handleImageUpload = async (sectionId: string, fieldKey: string, file: File) => {
    const uploadKey = `${sectionId}-${fieldKey}`
    
    try {
      // アップロード中の状態を設定
      setUploadingImages(prev => new Set(prev).add(uploadKey))
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const { url } = await response.json()
        handleFieldChange(sectionId, 'imageFields', fieldKey, url)
      } else {
        alert('画像のアップロードに失敗しました')
      }
    } catch (error) {
      alert('画像のアップロード中にエラーが発生しました')
    } finally {
      // アップロード完了後、状態をクリア
      setUploadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(uploadKey)
        return newSet
      })
    }
  }

  const handleSeatFieldChange = (seatIndex: number, field: string, value: any) => {
    setEditedContent(prev => {
      const seats = prev.seats || { seatData: savedContent.seats?.seatData || defaultSeats }
      const updatedSeats = [...seats.seatData]
      updatedSeats[seatIndex] = {
        ...updatedSeats[seatIndex],
        [field]: value
      }
      
      return {
        ...prev,
        seats: {
          ...seats,
          seatData: updatedSeats
        }
      }
    })
  }

  const handleSeatImageUpload = async (seatIndex: number, seatId: string, file: File) => {
    const uploadKey = `seats-${seatId}`
    
    try {
      setUploadingImages(prev => new Set(prev).add(uploadKey))
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const { url } = await response.json()
        handleSeatFieldChange(seatIndex, 'image', url)
      } else {
        alert('画像のアップロードに失敗しました')
      }
    } catch (error) {
      alert('画像のアップロード中にエラーが発生しました')
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(uploadKey)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="editor-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="editor-spinner rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--editor-accent)' }}></div>
      </div>
    )
  }

  return (
    <div className="editor-container">
      {/* ヘッダー */}
      <header className="editor-header">
        <div className="editor-header-content">
          <div className="editor-header-inner">
            <div className="editor-header-left">
              <button
                onClick={() => router.push('/home')}
                className="editor-back-button"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="editor-title">ページ編集</h1>
            </div>
            <div className="editor-header-actions">
              <button
                onClick={() => window.open('/', '_blank')}
                className="editor-button editor-button-secondary"
              >
                <Eye className="w-4 h-4" />
                <span>プレビュー</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="editor-button editor-button-primary"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? '保存中...' : '保存'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="editor-main">
        {/* サイドバー */}
        <aside className="editor-sidebar">
          <div className="editor-sidebar-content">
            <h2 className="editor-sidebar-title">セクション一覧</h2>
            <nav className="editor-nav">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`editor-nav-button ${activeSection === section.id ? 'active' : ''}`}
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="editor-content">
          <div className="editor-content-inner">
            {currentSection && (
              <>
                <div className="editor-section-header">
                  <h2 className="editor-section-title">{currentSection.name}</h2>
                  <div className="editor-section-meta">
                    {currentSection.hasBackground && (
                      <span className="editor-section-tag">
                        <Palette className="w-4 h-4" />
                        背景
                      </span>
                    )}
                    {currentSection.hasText && (
                      <span className="editor-section-tag">
                        <Type className="w-4 h-4" />
                        テキスト
                      </span>
                    )}
                    {currentSection.hasImage && (
                      <span className="editor-section-tag">
                        <Image className="w-4 h-4" />
                        画像
                      </span>
                    )}
                  </div>
                </div>

                {/* 背景設定 */}
                {currentSection.hasBackground && currentSection.backgroundField && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Palette className="w-5 h-5" />
                      背景設定
                    </h3>
                    <div className="editor-field">
                      <label className="editor-label">
                        {currentSection.backgroundField.label}
                      </label>
                      <input
                        type="text"
                        className="editor-input"
                        defaultValue={currentSection.backgroundField.value}
                        onChange={(e) => handleFieldChange(currentSection.id, 'backgroundField', '', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* テキスト編集 */}
                {currentSection.hasText && currentSection.textFields && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Type className="w-5 h-5" />
                      テキスト編集
                    </h3>
                    <div>
                      {currentSection.textFields.map((field, index) => {
                        const fieldKey = field.label === 'メインタイトル' ? 'mainTitle' :
                                       field.label === 'サブタイトル' ? 'subTitle' :
                                       field.label === '営業時間（開店）' ? 'openTime' :
                                       field.label === '営業時間（閉店）' ? 'closeTime' :
                                       field.label === '定休日' ? 'closedDay' :
                                       field.label === 'メッセージ' ? 'message' :
                                       field.label === '左側縦書きテキスト' ? 'leftText' :
                                       field.label === '右側縦書きテキスト' ? 'rightText' :
                                       field.label === 'セクションタイトル' ? 'sectionTitle' :
                                       field.label === 'タイトル' ? 'title' :
                                       field.label === '店名' ? 'shopName' :
                                       field.label === '住所' ? 'address' :
                                       field.label === 'アクセス' ? 'access' :
                                       field.label === '電話番号' ? 'phone' :
                                       field.label === '営業時間' ? 'businessHours' :
                                       field.label === '席数' ? 'seats' :
                                       field.label === '定休日' ? 'closedDays' :
                                       field.label === '宴会タイトル' ? 'partyTitle' :
                                       field.label === '宴会説明' ? 'partyDescription' :
                                       field.label === '宴会特徴1' ? 'partyFeature1' :
                                       field.label === '宴会特徴2' ? 'partyFeature2' :
                                       field.label === '宴会特徴3' ? 'partyFeature3' :
                                       field.label === '宴会CTA' ? 'partyCTA' :
                                       field.label === '日本酒タイトル' ? 'sakeTitle' :
                                       field.label === '日本酒説明' ? 'sakeDescription' :
                                       field.label === '日本酒特徴1' ? 'sakeFeature1' :
                                       field.label === '日本酒特徴2' ? 'sakeFeature2' :
                                       field.label === '日本酒特徴3' ? 'sakeFeature3' :
                                       field.label === '日本酒CTA' ? 'sakeCTA' :
                                       field.label.replace(/\d+/g, '').replace('こだわり', 'feature').replace('タイトル', 'Title').replace('説明', 'Description').replace(' ', '')
                        
                        const currentValue = editedContent[currentSection.id]?.textFields?.[fieldKey] || 
                                           savedContent[currentSection.id]?.textFields?.[fieldKey] || 
                                           field.value
                        
                        return (
                          <div key={index} className="editor-field">
                            <label className="editor-label">
                              {field.label}
                            </label>
                            {field.multiline ? (
                              <textarea
                                className="editor-textarea"
                                rows={4}
                                value={currentValue}
                              onChange={(e) => {
                                const fieldKey = field.label === 'メインタイトル' ? 'mainTitle' :
                                               field.label === 'サブタイトル' ? 'subTitle' :
                                               field.label === '営業時間（開店）' ? 'openTime' :
                                               field.label === '営業時間（閉店）' ? 'closeTime' :
                                               field.label === '定休日' ? 'closedDay' :
                                               field.label === 'メッセージ' ? 'message' :
                                               field.label === '左側縦書きテキスト' ? 'leftText' :
                                               field.label === '右側縦書きテキスト' ? 'rightText' :
                                               field.label === 'セクションタイトル' ? 'sectionTitle' :
                                               field.label === 'タイトル' ? 'title' :
                                               field.label === '店名' ? 'shopName' :
                                               field.label === '住所' ? 'address' :
                                               field.label === 'アクセス' ? 'access' :
                                               field.label === '電話番号' ? 'phone' :
                                               field.label === '営業時間' ? 'businessHours' :
                                               field.label === '席数' ? 'seats' :
                                               field.label === '定休日' ? 'closedDays' :
                                               field.label === '宴会タイトル' ? 'partyTitle' :
                                               field.label === '宴会説明' ? 'partyDescription' :
                                               field.label === '宴会特徴1' ? 'partyFeature1' :
                                               field.label === '宴会特徴2' ? 'partyFeature2' :
                                               field.label === '宴会特徴3' ? 'partyFeature3' :
                                               field.label === '宴会CTA' ? 'partyCTA' :
                                               field.label === '日本酒タイトル' ? 'sakeTitle' :
                                               field.label === '日本酒説明' ? 'sakeDescription' :
                                               field.label === '日本酒特徴1' ? 'sakeFeature1' :
                                               field.label === '日本酒特徴2' ? 'sakeFeature2' :
                                               field.label === '日本酒特徴3' ? 'sakeFeature3' :
                                               field.label === '日本酒CTA' ? 'sakeCTA' :
                                               field.label.replace(/\d+/g, '').replace('こだわり', 'feature').replace('タイトル', 'Title').replace('説明', 'Description').replace(' ', '')
                                handleFieldChange(currentSection.id, 'textFields', fieldKey, e.target.value)
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              className="editor-input"
                              value={currentValue}
                              onChange={(e) => {
                                const fieldKey = field.label === 'メインタイトル' ? 'mainTitle' :
                                               field.label === 'サブタイトル' ? 'subTitle' :
                                               field.label === '営業時間（開店）' ? 'openTime' :
                                               field.label === '営業時間（閉店）' ? 'closeTime' :
                                               field.label === '定休日' ? 'closedDay' :
                                               field.label === 'メッセージ' ? 'message' :
                                               field.label === '左側縦書きテキスト' ? 'leftText' :
                                               field.label === '右側縦書きテキスト' ? 'rightText' :
                                               field.label === 'セクションタイトル' ? 'sectionTitle' :
                                               field.label === 'タイトル' ? 'title' :
                                               field.label === '店名' ? 'shopName' :
                                               field.label === '住所' ? 'address' :
                                               field.label === 'アクセス' ? 'access' :
                                               field.label === '電話番号' ? 'phone' :
                                               field.label === '営業時間' ? 'businessHours' :
                                               field.label === '席数' ? 'seats' :
                                               field.label === '定休日' ? 'closedDays' :
                                               field.label === '宴会タイトル' ? 'partyTitle' :
                                               field.label === '宴会説明' ? 'partyDescription' :
                                               field.label === '宴会特徴1' ? 'partyFeature1' :
                                               field.label === '宴会特徴2' ? 'partyFeature2' :
                                               field.label === '宴会特徴3' ? 'partyFeature3' :
                                               field.label === '宴会CTA' ? 'partyCTA' :
                                               field.label === '日本酒タイトル' ? 'sakeTitle' :
                                               field.label === '日本酒説明' ? 'sakeDescription' :
                                               field.label === '日本酒特徴1' ? 'sakeFeature1' :
                                               field.label === '日本酒特徴2' ? 'sakeFeature2' :
                                               field.label === '日本酒特徴3' ? 'sakeFeature3' :
                                               field.label === '日本酒CTA' ? 'sakeCTA' :
                                               field.label.replace(/\d+/g, '').replace('こだわり', 'feature').replace('タイトル', 'Title').replace('説明', 'Description').replace(' ', '')
                                handleFieldChange(currentSection.id, 'textFields', fieldKey, e.target.value)
                              }}
                            />
                          )}
                        </div>
                      )})}
                    </div>
                  </div>
                )}

                {/* 画像編集 */}
                {currentSection.hasImage && currentSection.imageFields && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Image className="w-5 h-5" />
                      画像編集
                    </h3>
                    <div className="editor-grid">
                      {currentSection.imageFields.map((field, index) => {
                        const fieldKey = field.label === 'ロゴ画像' ? 'logo' :
                                       field.label === '背景画像1（PC）' ? 'bgPC1' :
                                       field.label === '背景画像2（PC）' ? 'bgPC2' :
                                       field.label === '背景画像3（PC）' ? 'bgPC3' :
                                       field.label === '背景画像4（PC）' ? 'bgPC4' :
                                       field.label === '背景画像1（スマホ）' ? 'bgMobile1' :
                                       field.label === '背景画像2（スマホ）' ? 'bgMobile2' :
                                       field.label === '背景画像3（スマホ）' ? 'bgMobile3' :
                                       field.label === '画像1' ? 'image1' :
                                       field.label === '画像2' ? 'image2' :
                                       field.label === '画像3' ? 'image3' :
                                       field.label === '貸切スペース画像' ? 'privateSpace' :
                                       field.label === '半個室風ボックス席画像' ? 'semiPrivateBox' :
                                       field.label === 'テーブル席画像' ? 'tableSeats' :
                                       field.label === 'グループ席画像' ? 'groupSeats' :
                                       field.label === '窓際デート席画像' ? 'windowDateSeats' :
                                       field.label === '宴会背景画像' ? 'partyBg' :
                                       field.label === '日本酒背景画像' ? 'sakeBg' :
                                       field.label === 'パララックス背景画像' ? 'parallaxBg' :
                                       field.label.replace(/[^0-9]/g, '') ? `gallery${field.label.replace(/[^0-9]/g, '')}` :
                                       field.label.replace(/こだわり(\d+)画像/, 'feature$1Image')
                        
                        const currentValue = editedContent[currentSection.id]?.imageFields?.[fieldKey] || 
                                             savedContent[currentSection.id]?.imageFields?.[fieldKey] || 
                                             field.value
                        
                        const uploadKey = `${currentSection.id}-${fieldKey}`
                        const isUploading = uploadingImages.has(uploadKey)
                        
                        return (
                          <div key={index} className="editor-image-field">
                            <label className="editor-label">
                              {field.label}
                            </label>
                            <div>
                              <div className="editor-image-preview">
                                <img
                                  id={`img-${currentSection.id}-${fieldKey}`}
                                  src={currentValue}
                                  alt={field.label}
                                />
                                {isUploading && (
                                  <div className="editor-image-loading">
                                    <div className="editor-spinner rounded-full h-12 w-12 border-b-2 border-white"></div>
                                  </div>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleImageUpload(currentSection.id, fieldKey, file)
                                  }
                                }}
                                className="hidden"
                                id={`file-${currentSection.id}-${fieldKey}`}
                                disabled={isUploading}
                              />
                              <label
                                htmlFor={`file-${currentSection.id}-${fieldKey}`}
                                className={`editor-upload-button ${isUploading ? 'disabled' : ''}`}
                              >
                                {isUploading ? 'アップロード中...' : '画像を変更'}
                              </label>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 席編集 */}
                {currentSection && currentSection.hasSeats && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Image className="w-5 h-5" />
                      席情報編集
                    </h3>
                    <div>
                      {(savedContent.seats?.seatData || defaultSeats).map((seat: SeatData, index: number) => {
                        const currentSeat = editedContent.seats?.seatData?.[index] || seat
                        const isUploadingSeat = uploadingImages.has(`seats-${seat.id}`)
                        
                        return (
                          <div key={seat.id} className="editor-seat-card">
                            <div className="editor-seat-grid">
                              {/* 画像編集 */}
                              <div>
                                <label className="editor-label">
                                  席画像
                                </label>
                                <div className="editor-image-preview">
                                  <img
                                    src={currentSeat.image}
                                    alt={currentSeat.name}
                                  />
                                  {isUploadingSeat && (
                                    <div className="editor-image-loading">
                                      <div className="editor-spinner rounded-full h-12 w-12 border-b-2 border-white"></div>
                                    </div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      handleSeatImageUpload(index, seat.id, file)
                                    }
                                  }}
                                  className="hidden"
                                  id={`seat-file-${seat.id}`}
                                  disabled={isUploadingSeat}
                                />
                                <label
                                  htmlFor={`seat-file-${seat.id}`}
                                  className={`editor-upload-button ${isUploadingSeat ? 'disabled' : ''}`}
                                >
                                  {isUploadingSeat ? 'アップロード中...' : '画像を変更'}
                                </label>
                              </div>
                              
                              {/* 詳細編集 */}
                              <div>
                                <div className="editor-field">
                                  <label className="editor-label">
                                    席名
                                  </label>
                                  <input
                                    type="text"
                                    value={currentSeat.name}
                                    onChange={(e) => handleSeatFieldChange(index, 'name', e.target.value)}
                                    className="editor-input"
                                  />
                                </div>
                                
                                <div className="editor-field">
                                  <label className="editor-label">
                                    最大人数
                                  </label>
                                  <input
                                    type="text"
                                    value={currentSeat.capacity}
                                    onChange={(e) => handleSeatFieldChange(index, 'capacity', e.target.value)}
                                    className="editor-input"
                                  />
                                </div>
                                
                                <div className="editor-field">
                                  <label className="editor-label">
                                    紹介文
                                  </label>
                                  <textarea
                                    value={currentSeat.description}
                                    onChange={(e) => handleSeatFieldChange(index, 'description', e.target.value)}
                                    rows={3}
                                    className="editor-textarea"
                                  />
                                </div>
                                
                                <div className="editor-field">
                                  <label className="editor-label">
                                    タグ（カンマ区切り）
                                  </label>
                                  <input
                                    type="text"
                                    value={currentSeat.tags.join(', ')}
                                    onChange={(e) => {
                                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                                      handleSeatFieldChange(index, 'tags', tags)
                                    }}
                                    className="editor-input"
                                    placeholder="例: 大人数OK, 貸切可能, 宴会向け"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}