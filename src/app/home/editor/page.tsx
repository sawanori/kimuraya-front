'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Edit3, Image, Type, Palette, Video } from 'lucide-react'
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
  hasVideo?: boolean
  textFields?: { label: string; value: string; multiline?: boolean; placeholder?: string }[]
  imageFields?: { label: string; value: string }[]
  videoFields?: { label: string; value: string }[]
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

interface MenuCard {
  id: string
  subTitle: string
  title: string
  items: { name: string; price: string }[]
  note: string
}

interface CourseCard {
  id: string
  image: string
  title: string
  subtitle: string
  price: string
  note: string
  itemCount: string
  description: string
  menuItems: string[]
  features: {
    icon: string
    title: string
    description: string
  }[]
  ctaText: string
}

interface DrinkCategory {
  id: string
  name: string
  items: DrinkItem[]
}

interface DrinkItem {
  name: string
  price: string
  description?: string
}

interface MotsunabeOption {
  id: string
  title: string
  description: string
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
      hasVideo: true,
      textFields: [
        { label: 'メインタイトル', value: '博多もつ鍋専門店' },
        { label: 'サブタイトル', value: '九州料理と美酒で楽しい宴会を' },
        { label: '営業時間（開店）', value: 'OPEN 10:00' },
        { label: '営業時間（閉店）', value: 'CLOSE 22:00' },
        { label: '定休日', value: '定休日 水曜日' },
        { label: '背景タイプ', value: 'slideshow' }
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
      ],
      videoFields: [
        { label: '背景動画', value: '' }
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
        { label: 'サブタイトル', value: '心安らぐ空間で、特別なひとときを' }
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
      id: 'courses',
      name: '宴会コース',
      hasBackground: false,
      hasText: false,
      hasImage: false
    },
    {
      id: 'drinks',
      name: 'ドリンクメニュー',
      hasBackground: false,
      hasText: true,
      hasImage: false,
      textFields: [
        { label: 'タイトル', value: 'お酒メニュー' },
        { label: 'サブタイトル', value: '全国から厳選した日本酒と焼酎、季節限定の銘柄から定番まで' }
      ]
    },
    {
      id: 'motsunabe',
      name: '名物もつ鍋',
      hasBackground: false,
      hasText: true,
      hasImage: true,
      textFields: [
        { label: 'セクションタイトル', value: '名物もつ鍋' },
        { label: 'セクションサブタイトル', value: '本場博多の味を、横浜で' },
        { label: 'キャッチフレーズ', value: '厳選された国産牛もつと秘伝のスープが織りなす極上の味わい' },
        { label: '説明文', value: '博多の伝統的な調理法で、新鮮な国産牛もつをじっくりと煮込みました。コラーゲンたっぷりの濃厚スープと、シャキシャキのキャベツ、ニラの組み合わせが絶品です。', multiline: true },
        { label: '価格ラベル', value: 'お一人様' },
        { label: '価格金額', value: '1,680' },
        { label: '価格単位', value: '円' },
        { label: '価格税込', value: '（税込）' },
        { label: '選べる味タイトル', value: '選べる味' },
        { label: '特徴1タイトル', value: '国産牛もつ' },
        { label: '特徴1説明', value: '新鮮な国産牛もつを厳選' },
        { label: '特徴2タイトル', value: '秘伝のスープ' },
        { label: '特徴2説明', value: '受け継がれる伝統の味' },
        { label: '特徴3タイトル', value: 'じっくり煮込み' },
        { label: '特徴3説明', value: '旨味を最大限に引き出す' },
        { label: 'バッジ1', value: '博多直伝' },
        { label: 'バッジ2', value: '横浜No.1' }
      ],
      imageFields: [
        { label: 'メイン画像', value: '/images/no1-0241.jpg' }
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
        { label: '席数', value: '110席（貸切最大110名様まで）' },
        { label: 'Googleマップ共有リンク', value: '', placeholder: 'https://maps.app.goo.gl/... または https://www.google.com/maps/...' }
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
        
        // 新しいタブでホームページを開く（確認用）
        setTimeout(() => {
          window.open('/', '_blank')
        }, 500)
        
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

  const handleVideoUpload = async (sectionId: string, fieldKey: string, file: File) => {
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
        handleFieldChange(sectionId, 'videoFields', fieldKey, url)
      } else {
        alert('動画のアップロードに失敗しました')
      }
    } catch (error) {
      alert('動画のアップロード中にエラーが発生しました')
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

  // メニューカード関連のハンドラー
  const handleMenuCardChange = (cardIndex: number, field: string, value: string) => {
    setEditedContent(prev => {
      const menu = prev.menu || savedContent.menu || {}
      const menuCards = [...(menu.menuCards || [])]
      menuCards[cardIndex] = {
        ...menuCards[cardIndex],
        [field]: value
      }
      
      return {
        ...prev,
        menu: {
          ...menu,
          menuCards
        }
      }
    })
  }

  const handleMenuItemChange = (cardIndex: number, itemIndex: number, field: string, value: string) => {
    setEditedContent(prev => {
      const menu = prev.menu || savedContent.menu || {}
      const menuCards = [...(menu.menuCards || [])]
      const items = [...menuCards[cardIndex].items]
      items[itemIndex] = {
        ...items[itemIndex],
        [field]: value
      }
      menuCards[cardIndex] = {
        ...menuCards[cardIndex],
        items
      }
      
      return {
        ...prev,
        menu: {
          ...menu,
          menuCards
        }
      }
    })
  }

  const handleAddMenuItem = (cardIndex: number) => {
    setEditedContent(prev => {
      const menu = prev.menu || savedContent.menu || {}
      const menuCards = [...(menu.menuCards || [])]
      menuCards[cardIndex] = {
        ...menuCards[cardIndex],
        items: [...menuCards[cardIndex].items, { name: '', price: '' }]
      }
      
      return {
        ...prev,
        menu: {
          ...menu,
          menuCards
        }
      }
    })
  }

  const handleDeleteMenuItem = (cardIndex: number, itemIndex: number) => {
    setEditedContent(prev => {
      const menu = prev.menu || savedContent.menu || {}
      const menuCards = [...(menu.menuCards || [])]
      menuCards[cardIndex] = {
        ...menuCards[cardIndex],
        items: menuCards[cardIndex].items.filter((_: any, i: number) => i !== itemIndex)
      }
      
      return {
        ...prev,
        menu: {
          ...menu,
          menuCards
        }
      }
    })
  }

  const handleAddMenuCard = () => {
    const newCard: MenuCard = {
      id: `card-${Date.now()}`,
      subTitle: '',
      title: '',
      items: [{ name: '', price: '' }],
      note: ''
    }
    
    setEditedContent(prev => {
      const menu = prev.menu || savedContent.menu || {}
      const menuCards = [...(menu.menuCards || []), newCard]
      
      return {
        ...prev,
        menu: {
          ...menu,
          menuCards
        }
      }
    })
  }

  const handleDeleteMenuCard = (cardIndex: number) => {
    if (window.confirm('このメニューカードを削除してもよろしいですか？')) {
      setEditedContent(prev => {
        const menu = prev.menu || savedContent.menu || {}
        const menuCards = (menu.menuCards || []).filter((_: any, i: number) => i !== cardIndex)
        
        return {
          ...prev,
          menu: {
            ...menu,
            menuCards
          }
        }
      })
    }
  }

  // 宴会コースカード関連の関数
  const handleCourseCardChange = (cardIndex: number, field: string, value: string) => {
    setEditedContent(prev => {
      const courses = prev.courses || savedContent.courses || {}
      const cards = [...(courses.cards || [])]
      cards[cardIndex] = {
        ...cards[cardIndex],
        [field]: value
      }
      
      return {
        ...prev,
        courses: {
          ...courses,
          cards
        }
      }
    })
  }

  const handleCourseMenuItemChange = (cardIndex: number, itemIndex: number, value: string) => {
    setEditedContent(prev => {
      const courses = prev.courses || savedContent.courses || {}
      const cards = [...(courses.cards || [])]
      const menuItems = [...cards[cardIndex].menuItems]
      menuItems[itemIndex] = value
      
      cards[cardIndex] = {
        ...cards[cardIndex],
        menuItems
      }
      
      return {
        ...prev,
        courses: {
          ...courses,
          cards
        }
      }
    })
  }

  const handleAddCourseMenuItem = (cardIndex: number) => {
    setEditedContent(prev => {
      const courses = prev.courses || savedContent.courses || {}
      const cards = [...(courses.cards || [])]
      const menuItems = [...cards[cardIndex].menuItems, '']
      
      cards[cardIndex] = {
        ...cards[cardIndex],
        menuItems
      }
      
      return {
        ...prev,
        courses: {
          ...courses,
          cards
        }
      }
    })
  }

  const handleDeleteCourseMenuItem = (cardIndex: number, itemIndex: number) => {
    setEditedContent(prev => {
      const courses = prev.courses || savedContent.courses || {}
      const cards = [...(courses.cards || [])]
      const menuItems = cards[cardIndex].menuItems.filter((_: any, i: number) => i !== itemIndex)
      
      cards[cardIndex] = {
        ...cards[cardIndex],
        menuItems
      }
      
      return {
        ...prev,
        courses: {
          ...courses,
          cards
        }
      }
    })
  }

  const handleCourseFeatureChange = (cardIndex: number, featureIndex: number, field: string, value: string) => {
    setEditedContent(prev => {
      const courses = prev.courses || savedContent.courses || {}
      const cards = [...(courses.cards || [])]
      const features = [...cards[cardIndex].features]
      
      features[featureIndex] = {
        ...features[featureIndex],
        [field]: value
      }
      
      cards[cardIndex] = {
        ...cards[cardIndex],
        features
      }
      
      return {
        ...prev,
        courses: {
          ...courses,
          cards
        }
      }
    })
  }

  const handleAddCourseFeature = (cardIndex: number) => {
    setEditedContent(prev => {
      const courses = prev.courses || savedContent.courses || {}
      const cards = [...(courses.cards || [])]
      const features = [...cards[cardIndex].features, { icon: '', title: '', description: '' }]
      
      cards[cardIndex] = {
        ...cards[cardIndex],
        features
      }
      
      return {
        ...prev,
        courses: {
          ...courses,
          cards
        }
      }
    })
  }

  const handleDeleteCourseFeature = (cardIndex: number, featureIndex: number) => {
    setEditedContent(prev => {
      const courses = prev.courses || savedContent.courses || {}
      const cards = [...(courses.cards || [])]
      const features = cards[cardIndex].features.filter((_: any, i: number) => i !== featureIndex)
      
      cards[cardIndex] = {
        ...cards[cardIndex],
        features
      }
      
      return {
        ...prev,
        courses: {
          ...courses,
          cards
        }
      }
    })
  }

  const handleAddCourseCard = () => {
    const newCard: CourseCard = {
      id: `course-${Date.now()}`,
      image: '/images/DSC00406.jpg',
      title: '',
      subtitle: '',
      price: '',
      note: '',
      itemCount: '',
      description: '',
      menuItems: [''],
      features: [
        { icon: 'users', title: '', description: '' }
      ],
      ctaText: 'このコースを予約する'
    }
    
    setEditedContent(prev => {
      const courses = prev.courses || savedContent.courses || {}
      const cards = [...(courses.cards || []), newCard]
      
      return {
        ...prev,
        courses: {
          ...courses,
          cards
        }
      }
    })
  }

  const handleDeleteCourseCard = (cardIndex: number) => {
    if (window.confirm('このコースカードを削除してもよろしいですか？')) {
      setEditedContent(prev => {
        const courses = prev.courses || savedContent.courses || {}
        const cards = (courses.cards || []).filter((_: any, i: number) => i !== cardIndex)
        
        return {
          ...prev,
          courses: {
            ...courses,
            cards
          }
        }
      })
    }
  }

  const handleCourseImageUpload = async (cardIndex: number, file: File) => {
    const uploadKey = `course-image-${cardIndex}`
    setUploadingImages(prev => new Set(prev).add(uploadKey))
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const { url } = await response.json()
        handleCourseCardChange(cardIndex, 'image', url)
      } else {
        alert('画像のアップロードに失敗しました')
      }
    } catch (error) {
      alert('画像のアップロード中にエラーが発生しました')
    } finally {
      setUploadingImages(prev => {
        const next = new Set(prev)
        next.delete(uploadKey)
        return next
      })
    }
  }

  // ドリンクメニュー関連の関数
  const handleDrinkCategoryChange = (categoryIndex: number, field: string, value: string) => {
    setEditedContent(prev => {
      const drinks = prev.drinks || savedContent.drinks || {}
      const categories = [...(drinks.categories || [])]
      categories[categoryIndex] = {
        ...categories[categoryIndex],
        [field]: value
      }
      
      return {
        ...prev,
        drinks: {
          ...drinks,
          categories
        }
      }
    })
  }

  const handleDrinkItemChange = (categoryIndex: number, itemIndex: number, field: string, value: string) => {
    setEditedContent(prev => {
      const drinks = prev.drinks || savedContent.drinks || {}
      const categories = [...(drinks.categories || [])]
      const items = [...categories[categoryIndex].items]
      items[itemIndex] = {
        ...items[itemIndex],
        [field]: value
      }
      
      categories[categoryIndex] = {
        ...categories[categoryIndex],
        items
      }
      
      return {
        ...prev,
        drinks: {
          ...drinks,
          categories
        }
      }
    })
  }

  const handleAddDrinkCategory = () => {
    const newCategory: DrinkCategory = {
      id: `category-${Date.now()}`,
      name: '',
      items: []
    }
    
    setEditedContent(prev => {
      const drinks = prev.drinks || savedContent.drinks || {}
      const categories = [...(drinks.categories || []), newCategory]
      
      return {
        ...prev,
        drinks: {
          ...drinks,
          categories
        }
      }
    })
  }

  const handleDeleteDrinkCategory = (categoryIndex: number) => {
    if (window.confirm('このカテゴリーを削除してもよろしいですか？')) {
      setEditedContent(prev => {
        const drinks = prev.drinks || savedContent.drinks || {}
        const categories = (drinks.categories || []).filter((_: any, i: number) => i !== categoryIndex)
        
        return {
          ...prev,
          drinks: {
            ...drinks,
            categories
          }
        }
      })
    }
  }

  const handleAddDrinkItem = (categoryIndex: number) => {
    const newItem: DrinkItem = {
      name: '',
      price: ''
    }
    
    setEditedContent(prev => {
      const drinks = prev.drinks || savedContent.drinks || {}
      const categories = [...(drinks.categories || [])]
      const items = [...(categories[categoryIndex]?.items || []), newItem]
      
      categories[categoryIndex] = {
        ...categories[categoryIndex],
        items
      }
      
      return {
        ...prev,
        drinks: {
          ...drinks,
          categories
        }
      }
    })
  }

  const handleDeleteDrinkItem = (categoryIndex: number, itemIndex: number) => {
    setEditedContent(prev => {
      const drinks = prev.drinks || savedContent.drinks || {}
      const categories = [...(drinks.categories || [])]
      const items = categories[categoryIndex].items.filter((_: any, i: number) => i !== itemIndex)
      
      categories[categoryIndex] = {
        ...categories[categoryIndex],
        items
      }
      
      return {
        ...prev,
        drinks: {
          ...drinks,
          categories
        }
      }
    })
  }

  // もつ鍋関連の関数
  const handleMotsunabeOptionChange = (optionIndex: number, field: string, value: string) => {
    setEditedContent(prev => {
      const motsunabe = prev.motsunabe || savedContent.motsunabe || {}
      const options = [...(motsunabe.options || [])]
      options[optionIndex] = {
        ...options[optionIndex],
        [field]: value
      }
      
      return {
        ...prev,
        motsunabe: {
          ...motsunabe,
          options
        }
      }
    })
  }

  const handleAddMotsunabeOption = () => {
    const newOption: MotsunabeOption = {
      id: `option-${Date.now()}`,
      title: '',
      description: '',
      image: '/images/DSC00440.jpg'
    }
    
    setEditedContent(prev => {
      const motsunabe = prev.motsunabe || savedContent.motsunabe || {}
      const options = [...(motsunabe.options || []), newOption]
      
      return {
        ...prev,
        motsunabe: {
          ...motsunabe,
          options
        }
      }
    })
  }

  const handleDeleteMotsunabeOption = (optionIndex: number) => {
    if (window.confirm('このオプションを削除してもよろしいですか？')) {
      setEditedContent(prev => {
        const motsunabe = prev.motsunabe || savedContent.motsunabe || {}
        const options = (motsunabe.options || []).filter((_: any, i: number) => i !== optionIndex)
        
        return {
          ...prev,
          motsunabe: {
            ...motsunabe,
            options
          }
        }
      })
    }
  }

  const handleMotsunabeImageUpload = async (optionIndex: number, file: File) => {
    const uploadKey = `motsunabe-image-${optionIndex}`
    setUploadingImages(prev => new Set(prev).add(uploadKey))
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const { url } = await response.json()
        handleMotsunabeOptionChange(optionIndex, 'image', url)
      } else {
        alert('画像のアップロードに失敗しました')
      }
    } catch (error) {
      alert('画像のアップロード中にエラーが発生しました')
    } finally {
      setUploadingImages(prev => {
        const next = new Set(prev)
        next.delete(uploadKey)
        return next
      })
    }
  }

  const handleMotsunabeBadgeChange = (badgeIndex: number, value: string) => {
    setEditedContent(prev => {
      const motsunabe = prev.motsunabe || savedContent.motsunabe || {}
      const badges = [...(motsunabe.badges || [])]
      badges[badgeIndex] = value
      
      return {
        ...prev,
        motsunabe: {
          ...motsunabe,
          badges
        }
      }
    })
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
                                       field.label === '背景タイプ' ? 'backgroundType' :
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
                                       field.label === 'Googleマップ共有リンク' ? 'googleMapUrl' :
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
                            {field.label === '背景タイプ' && currentSection.id === 'hero' ? (
                              <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="backgroundType"
                                    value="slideshow"
                                    checked={currentValue === 'slideshow'}
                                    onChange={(e) => handleFieldChange(currentSection.id, 'textFields', 'backgroundType', e.target.value)}
                                    className="mr-2"
                                  />
                                  <span>スライドショー</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="backgroundType"
                                    value="video"
                                    checked={currentValue === 'video'}
                                    onChange={(e) => handleFieldChange(currentSection.id, 'textFields', 'backgroundType', e.target.value)}
                                    className="mr-2"
                                  />
                                  <span>動画</span>
                                </label>
                              </div>
                            ) : field.multiline ? (
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
                                               field.label === '背景タイプ' ? 'backgroundType' :
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
                                               field.label === 'Googleマップ共有リンク' ? 'googleMapUrl' :
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
                              placeholder={field.placeholder}
                              onChange={(e) => {
                                const fieldKey = field.label === 'メインタイトル' ? 'mainTitle' :
                                               field.label === 'サブタイトル' ? 'subTitle' :
                                               field.label === '営業時間（開店）' ? 'openTime' :
                                               field.label === '営業時間（閉店）' ? 'closeTime' :
                                               field.label === '定休日' ? 'closedDay' :
                                               field.label === '背景タイプ' ? 'backgroundType' :
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
                                               field.label === 'Googleマップ共有リンク' ? 'googleMapUrl' :
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
                                {field.label === '背景動画' && currentValue ? (
                                  <video
                                    id={`img-${currentSection.id}-${fieldKey}`}
                                    src={currentValue}
                                    controls
                                    style={{ width: '100%', height: 'auto' }}
                                  />
                                ) : field.label === '背景動画' ? (
                                  <div style={{ 
                                    width: '100%', 
                                    height: '200px', 
                                    backgroundColor: '#f3f4f6', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#6b7280'
                                  }}>
                                    動画未設定
                                  </div>
                                ) : (
                                  <img
                                    id={`img-${currentSection.id}-${fieldKey}`}
                                    src={currentValue}
                                    alt={field.label}
                                  />
                                )}
                                {isUploading && (
                                  <div className="editor-image-loading">
                                    <div className="editor-spinner rounded-full h-12 w-12 border-b-2 border-white"></div>
                                  </div>
                                )}
                              </div>
                              <input
                                type="file"
                                accept={field.label === '背景動画' ? "video/*" : "image/*"}
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
                                {isUploading ? 'アップロード中...' : field.label === '背景動画' ? '動画を変更' : '画像を変更'}
                              </label>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 動画編集 */}
                {currentSection.hasVideo && currentSection.videoFields && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Video className="w-5 h-5" />
                      動画編集
                    </h3>
                    <div className="editor-grid">
                      {currentSection.videoFields.map((field, index) => {
                        const fieldKey = field.label === '背景動画' ? 'bgVideo' : field.label
                        
                        const currentValue = editedContent[currentSection.id]?.videoFields?.[fieldKey] || 
                                             savedContent[currentSection.id]?.videoFields?.[fieldKey] || 
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
                                {currentValue ? (
                                  <video
                                    id={`video-${currentSection.id}-${fieldKey}`}
                                    src={currentValue}
                                    controls
                                    style={{ width: '100%', height: 'auto' }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: '100%', 
                                    height: '200px', 
                                    backgroundColor: '#f3f4f6', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#6b7280'
                                  }}>
                                    動画未設定
                                  </div>
                                )}
                                {isUploading && (
                                  <div className="editor-image-loading">
                                    <div className="editor-spinner rounded-full h-12 w-12 border-b-2 border-white"></div>
                                  </div>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleVideoUpload(currentSection.id, fieldKey, file)
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
                                {isUploading ? 'アップロード中...' : '動画を変更'}
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

                {/* メニューカード編集 */}
                {currentSection && activeSection === 'menu' && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Type className="w-5 h-5" />
                      メニューカード編集
                    </h3>
                    <div className="space-y-6">
                      {/* 既存のメニューカード */}
                      {(editedContent.menu?.menuCards || savedContent.menu?.menuCards || []).map((card: MenuCard, index: number) => (
                        <div key={card.id} className="menu-card-editor">
                          <div className="menu-card-header">
                            <div className="menu-card-number">
                              <span className="menu-card-index">{index + 1}</span>
                            </div>
                            <div className="menu-card-header-content">
                              <h4 className="menu-card-title">{card.title || `カード ${index + 1}`}</h4>
                              <p className="menu-card-subtitle">{card.subTitle || 'サブタイトル未設定'}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteMenuCard(index)}
                              className="menu-card-delete"
                              title="カードを削除"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                              </svg>
                            </button>
                          </div>
                          
                          <div className="menu-card-body">
                            {/* タイトル情報 */}
                            <div className="menu-card-section">
                              <div className="menu-card-fields">
                                <div className="menu-field-group">
                                  <label className="menu-field-label">
                                    <span className="label-text">カテゴリー名（英字）</span>
                                    <span className="label-hint">例: HAKATA MOTSUNABE</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={card.subTitle}
                                    onChange={(e) => handleMenuCardChange(index, 'subTitle', e.target.value)}
                                    className="menu-field-input"
                                    placeholder="英語のカテゴリー名を入力"
                                  />
                                </div>
                                
                                <div className="menu-field-group">
                                  <label className="menu-field-label">
                                    <span className="label-text">メニュー名（日本語）</span>
                                    <span className="label-hint">例: 博多もつ鍋</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={card.title}
                                    onChange={(e) => handleMenuCardChange(index, 'title', e.target.value)}
                                    className="menu-field-input"
                                    placeholder="日本語のメニュー名を入力"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* 商品アイテム */}
                            <div className="menu-card-section">
                              <div className="menu-items-header">
                                <h5 className="menu-items-title">商品一覧</h5>
                                <span className="menu-items-count">{card.items.length}/10 アイテム</span>
                              </div>
                              
                              <div className="menu-items-list">
                                {card.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="menu-item-row">
                                    <div className="menu-item-number">{itemIndex + 1}</div>
                                    <div className="menu-item-fields">
                                      <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleMenuItemChange(index, itemIndex, 'name', e.target.value)}
                                        className="menu-item-input menu-item-name"
                                        placeholder="商品名を入力"
                                      />
                                      <input
                                        type="text"
                                        value={item.price}
                                        onChange={(e) => handleMenuItemChange(index, itemIndex, 'price', e.target.value)}
                                        className="menu-item-input menu-item-price"
                                        placeholder="¥0,000"
                                      />
                                    </div>
                                    <button
                                      onClick={() => handleDeleteMenuItem(index, itemIndex)}
                                      className="menu-item-delete"
                                      title="商品を削除"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12"/>
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                              
                              {card.items.length < 10 && (
                                <button
                                  onClick={() => handleAddMenuItem(index)}
                                  className="menu-add-item-btn"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14"/>
                                  </svg>
                                  商品を追加
                                </button>
                              )}
                            </div>
                            
                            {/* 備考 */}
                            <div className="menu-card-section">
                              <div className="menu-field-group">
                                <label className="menu-field-label">
                                  <span className="label-text">備考</span>
                                  <span className="label-hint">価格や注文条件などの補足情報</span>
                                </label>
                                <textarea
                                  value={card.note}
                                  onChange={(e) => handleMenuCardChange(index, 'note', e.target.value)}
                                  className="menu-field-textarea"
                                  placeholder="例: 鍋のご注文は2人前から承ります。価格は1人前（税込）"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* カード追加ボタン */}
                      {(!editedContent.menu?.menuCards && !savedContent.menu?.menuCards) ||
                       (editedContent.menu?.menuCards || savedContent.menu?.menuCards || []).length < 10 ? (
                        <button
                          onClick={handleAddMenuCard}
                          className="menu-add-card-btn"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
                            <path d="M12 9v6M9 12h6"/>
                          </svg>
                          <span>新しいメニューカードを追加</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* 宴会コースカード編集 */}
                {currentSection && activeSection === 'courses' && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Type className="w-5 h-5" />
                      宴会コースカード編集
                    </h3>
                    <div className="space-y-6">
                      {/* 既存のコースカード */}
                      {(editedContent.courses?.cards || savedContent.courses?.cards || []).map((card: CourseCard, index: number) => (
                        <div key={card.id} className="course-card-editor">
                          <div className="course-card-header">
                            <div className="course-card-number">
                              <span className="course-card-index">{index + 1}</span>
                            </div>
                            <div className="course-card-header-content">
                              <h4 className="course-card-title">{card.title || `コース ${index + 1}`}</h4>
                              <p className="course-card-subtitle">{card.price || '価格未設定'}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteCourseCard(index)}
                              className="course-card-delete"
                              title="カードを削除"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                              </svg>
                            </button>
                          </div>
                          
                          <div className="course-card-body">
                            {/* 基本情報 */}
                            <div className="course-card-section">
                              <h5 className="course-section-title">基本情報</h5>
                              <div className="course-card-fields">
                                <div className="course-field-group">
                                  <label className="course-field-label">画像</label>
                                  <div className="course-image-preview">
                                    <img src={card.image} alt={card.title} />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          handleCourseImageUpload(index, file)
                                        }
                                      }}
                                      className="hidden"
                                      id={`course-image-${index}`}
                                    />
                                    <label htmlFor={`course-image-${index}`} className="course-upload-button">
                                      画像を変更
                                    </label>
                                  </div>
                                </div>
                                
                                <div className="course-field-group">
                                  <label className="course-field-label">コース名</label>
                                  <input
                                    type="text"
                                    value={card.title}
                                    onChange={(e) => handleCourseCardChange(index, 'title', e.target.value)}
                                    className="course-field-input"
                                    placeholder="例: ～夏の宴会～"
                                  />
                                </div>
                                
                                <div className="course-field-group">
                                  <label className="course-field-label">サブタイトル</label>
                                  <input
                                    type="text"
                                    value={card.subtitle}
                                    onChange={(e) => handleCourseCardChange(index, 'subtitle', e.target.value)}
                                    className="course-field-input"
                                    placeholder="例: 3時間飲み放題付き！夏の食材＆佐賀牛を堪能"
                                  />
                                </div>
                                
                                <div className="course-field-group">
                                  <label className="course-field-label">価格</label>
                                  <input
                                    type="text"
                                    value={card.price}
                                    onChange={(e) => handleCourseCardChange(index, 'price', e.target.value)}
                                    className="course-field-input"
                                    placeholder="例: 5,000円（税込）"
                                  />
                                </div>
                                
                                <div className="course-field-group">
                                  <label className="course-field-label">注意事項</label>
                                  <input
                                    type="text"
                                    value={card.note}
                                    onChange={(e) => handleCourseCardChange(index, 'note', e.target.value)}
                                    className="course-field-input"
                                    placeholder="例: ※金曜・土曜は2時間でのご案内になります"
                                  />
                                </div>
                                
                                <div className="course-field-group">
                                  <label className="course-field-label">品数</label>
                                  <input
                                    type="text"
                                    value={card.itemCount}
                                    onChange={(e) => handleCourseCardChange(index, 'itemCount', e.target.value)}
                                    className="course-field-input"
                                    placeholder="例: 8"
                                  />
                                </div>
                                
                                <div className="course-field-group">
                                  <label className="course-field-label">説明文</label>
                                  <textarea
                                    value={card.description}
                                    onChange={(e) => handleCourseCardChange(index, 'description', e.target.value)}
                                    className="course-field-textarea"
                                    placeholder="例: 佐賀牛のステーキや本マグロも入ったお刺身、夏の食材にもこだわった全8品。暑気払いや納涼会などに最適。"
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="course-field-group">
                                  <label className="course-field-label">CTAボタンテキスト</label>
                                  <input
                                    type="text"
                                    value={card.ctaText}
                                    onChange={(e) => handleCourseCardChange(index, 'ctaText', e.target.value)}
                                    className="course-field-input"
                                    placeholder="例: このコースを予約する"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* メニュー内容 */}
                            <div className="course-card-section">
                              <div className="course-items-header">
                                <h5 className="course-items-title">メニュー内容</h5>
                                <span className="course-items-count">{card.menuItems.length} アイテム</span>
                              </div>
                              
                              <div className="course-items-list">
                                {card.menuItems.map((item, itemIndex) => (
                                  <div key={itemIndex} className="course-item-row">
                                    <div className="course-item-number">{itemIndex + 1}</div>
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => handleCourseMenuItemChange(index, itemIndex, e.target.value)}
                                      className="course-item-input"
                                      placeholder="メニュー項目を入力"
                                    />
                                    <button
                                      onClick={() => handleDeleteCourseMenuItem(index, itemIndex)}
                                      className="course-item-delete"
                                      title="項目を削除"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12"/>
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                              
                              <button
                                onClick={() => handleAddCourseMenuItem(index)}
                                className="course-add-item-btn"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 5v14M5 12h14"/>
                                </svg>
                                メニュー項目を追加
                              </button>
                            </div>
                            
                            {/* 特徴 */}
                            <div className="course-card-section">
                              <h5 className="course-section-title">特徴</h5>
                              <div className="course-features-list">
                                {card.features.map((feature, featureIndex) => (
                                  <div key={featureIndex} className="course-feature-item">
                                    <div className="course-feature-header">
                                      <span className="course-feature-number">{featureIndex + 1}</span>
                                      <button
                                        onClick={() => handleDeleteCourseFeature(index, featureIndex)}
                                        className="course-feature-delete"
                                        title="特徴を削除"
                                      >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="course-feature-fields">
                                      <input
                                        type="text"
                                        value={feature.icon}
                                        onChange={(e) => handleCourseFeatureChange(index, featureIndex, 'icon', e.target.value)}
                                        className="course-feature-input"
                                        placeholder="アイコン名 (例: users)"
                                      />
                                      <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(e) => handleCourseFeatureChange(index, featureIndex, 'title', e.target.value)}
                                        className="course-feature-input"
                                        placeholder="タイトル (例: 2名様〜)"
                                      />
                                      <input
                                        type="text"
                                        value={feature.description}
                                        onChange={(e) => handleCourseFeatureChange(index, featureIndex, 'description', e.target.value)}
                                        className="course-feature-input"
                                        placeholder="説明 (例: 少人数から大人数まで対応)"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {card.features.length < 4 && (
                                <button
                                  onClick={() => handleAddCourseFeature(index)}
                                  className="course-add-feature-btn"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14"/>
                                  </svg>
                                  特徴を追加
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* カード追加ボタン */}
                      {(!editedContent.courses?.cards && !savedContent.courses?.cards) ||
                       (editedContent.courses?.cards || savedContent.courses?.cards || []).length < 10 ? (
                        <button
                          onClick={handleAddCourseCard}
                          className="course-add-card-btn"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
                            <path d="M12 9v6M9 12h6"/>
                          </svg>
                          <span>新しいコースカードを追加</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* ドリンクメニュー編集 */}
                {currentSection && activeSection === 'drinks' && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Type className="w-5 h-5" />
                      ドリンクメニュー編集
                    </h3>
                    <div className="space-y-6">
                      {/* カテゴリー一覧 */}
                      {(editedContent.drinks?.categories || savedContent.drinks?.categories || []).map((category: DrinkCategory, categoryIndex: number) => (
                        <div key={category.id} className="drink-category-editor">
                          <div className="drink-category-header">
                            <div className="drink-category-number">
                              <span className="drink-category-index">{categoryIndex + 1}</span>
                            </div>
                            <input
                              type="text"
                              value={category.name}
                              onChange={(e) => handleDrinkCategoryChange(categoryIndex, 'name', e.target.value)}
                              className="drink-category-name-input"
                              placeholder="カテゴリー名（例: ビール）"
                            />
                            <button
                              onClick={() => handleDeleteDrinkCategory(categoryIndex)}
                              className="drink-category-delete"
                              title="カテゴリーを削除"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                              </svg>
                            </button>
                          </div>
                          
                          <div className="drink-category-body">
                            {/* ドリンクアイテム */}
                            <div className="drink-items-header">
                              <h5 className="drink-items-title">商品一覧</h5>
                              <span className="drink-items-count">{category.items.length}/20 アイテム</span>
                            </div>
                            
                            <div className="drink-items-list">
                              {category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="drink-item-editor">
                                  <div className="drink-item-number">{itemIndex + 1}</div>
                                  <div className="drink-item-fields">
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => handleDrinkItemChange(categoryIndex, itemIndex, 'name', e.target.value)}
                                      className="drink-item-name-input"
                                      placeholder="商品名"
                                    />
                                    <input
                                      type="text"
                                      value={item.price}
                                      onChange={(e) => handleDrinkItemChange(categoryIndex, itemIndex, 'price', e.target.value)}
                                      className="drink-item-price-input"
                                      placeholder="¥0,000"
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleDeleteDrinkItem(categoryIndex, itemIndex)}
                                    className="drink-item-delete"
                                    title="商品を削除"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M18 6L6 18M6 6l12 12"/>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            {category.items.length < 20 && (
                              <button
                                onClick={() => handleAddDrinkItem(categoryIndex)}
                                className="drink-add-item-btn"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 5v14M5 12h14"/>
                                </svg>
                                商品を追加
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* カテゴリー追加ボタン */}
                      {(!editedContent.drinks?.categories && !savedContent.drinks?.categories) ||
                       (editedContent.drinks?.categories || savedContent.drinks?.categories || []).length < 10 ? (
                        <button
                          onClick={handleAddDrinkCategory}
                          className="drink-add-category-btn"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
                            <path d="M12 9v6M9 12h6"/>
                          </svg>
                          <span>新しいカテゴリーを追加</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* もつ鍋編集 */}
                {currentSection && activeSection === 'motsunabe' && (
                  <div className="editor-card">
                    <h3 className="editor-card-title">
                      <Type className="w-5 h-5" />
                      名物もつ鍋編集
                    </h3>
                    
                    {/* テキストフィールド */}
                    {currentSection.textFields && (
                      <div className="editor-grid">
                        {currentSection.textFields.map((field, index) => {
                          const fieldKey = field.label
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
                                  value={currentValue}
                                  onChange={(e) => handleFieldChange(currentSection.id, 'textFields', fieldKey, e.target.value)}
                                  className="editor-textarea"
                                  rows={4}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={currentValue}
                                  onChange={(e) => handleFieldChange(currentSection.id, 'textFields', fieldKey, e.target.value)}
                                  className="editor-input"
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    {/* メイン画像 */}
                    {currentSection.imageFields && (
                      <div className="editor-image-section">
                        <h4 className="editor-subsection-title">メイン画像</h4>
                        <div className="editor-grid">
                          {currentSection.imageFields.map((field, index) => {
                            const fieldKey = field.label === 'メイン画像' ? 'mainImage' : field.label
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
                    
                    {/* バッジ */}
                    <div className="editor-badges-section">
                      <h4 className="editor-subsection-title">バッジ</h4>
                      <div className="editor-badges-list">
                        {(editedContent.motsunabe?.badges || savedContent.motsunabe?.badges || []).map((badge: string, index: number) => (
                          <input
                            key={index}
                            type="text"
                            value={badge}
                            onChange={(e) => handleMotsunabeBadgeChange(index, e.target.value)}
                            className="editor-badge-input"
                            placeholder={`バッジ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* 選べる味オプション */}
                    <div className="editor-options-section">
                      <h4 className="editor-subsection-title">選べる味オプション</h4>
                      
                      {/* 表示/非表示ラジオボタン */}
                      <div className="editor-field" style={{ marginBottom: '20px' }}>
                        <label className="editor-label">選べる味セクションの表示</label>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="showOptions"
                              value="true"
                              checked={(editedContent.motsunabe?.showOptions ?? savedContent.motsunabe?.showOptions ?? true) === true}
                              onChange={() => {
                                setEditedContent(prev => ({
                                  ...prev,
                                  motsunabe: {
                                    ...(prev.motsunabe || savedContent.motsunabe || {}),
                                    showOptions: true
                                  }
                                }))
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            表示
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="showOptions"
                              value="false"
                              checked={(editedContent.motsunabe?.showOptions ?? savedContent.motsunabe?.showOptions ?? true) === false}
                              onChange={() => {
                                setEditedContent(prev => ({
                                  ...prev,
                                  motsunabe: {
                                    ...(prev.motsunabe || savedContent.motsunabe || {}),
                                    showOptions: false
                                  }
                                }))
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            非表示
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {(editedContent.motsunabe?.options || savedContent.motsunabe?.options || []).map((option: MotsunabeOption, index: number) => (
                          <div key={option.id} className="motsunabe-option-editor">
                            <div className="option-header">
                              <div className="option-number">{index + 1}</div>
                              <button
                                onClick={() => handleDeleteMotsunabeOption(index)}
                                className="option-delete"
                                title="オプションを削除"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                                </svg>
                              </button>
                            </div>
                            
                            <div className="option-content">
                              <div className="option-image-section">
                                <div className="option-image-preview">
                                  <img src={option.image} alt={option.title} />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        handleMotsunabeImageUpload(index, file)
                                      }
                                    }}
                                    className="hidden"
                                    id={`motsunabe-image-${index}`}
                                  />
                                  <label htmlFor={`motsunabe-image-${index}`} className="option-upload-button">
                                    画像を変更
                                  </label>
                                </div>
                              </div>
                              
                              <div className="option-fields">
                                <input
                                  type="text"
                                  value={option.title}
                                  onChange={(e) => handleMotsunabeOptionChange(index, 'title', e.target.value)}
                                  className="option-title-input"
                                  placeholder="味の名前（例: 醤油味）"
                                />
                                <textarea
                                  value={option.description}
                                  onChange={(e) => handleMotsunabeOptionChange(index, 'description', e.target.value)}
                                  className="option-description-input"
                                  placeholder="味の説明"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* オプション追加ボタン */}
                        {(!editedContent.motsunabe?.options || editedContent.motsunabe?.options?.length < 5) && (
                          <button
                            onClick={handleAddMotsunabeOption}
                            className="motsunabe-add-option-btn"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 5v14M5 12h14"/>
                            </svg>
                            新しい味を追加
                          </button>
                        )}
                      </div>
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