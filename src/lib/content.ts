import fs from 'fs/promises'
import path from 'path'

// ページコンテンツを取得するユーティリティ
export async function getPageContent() {
  try {
    // サーバーサイドで直接ファイルを読み込む
    const contentPath = path.join(process.cwd(), 'src/data/page-content.json')
    const fileContent = await fs.readFile(contentPath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading content file:', error)
  }
  
  // エラー時はデフォルトコンテンツを返す
  return {
    hero: {
      textFields: {
        mainTitle: '博多もつ鍋専門店',
        subTitle: '九州料理と美酒で楽しい宴会を',
        openTime: 'OPEN 10:00',
        closeTime: 'CLOSE 22:00',
        closedDay: '定休日 水曜日'
      },
      imageFields: {
        logo: '/images/log.png',
        bgPC1: '/images/DSC00442.jpg',
        bgPC2: '/images/DSC00456.jpg',
        bgPC3: '/images/DSC00398.jpg',
        bgPC4: '/images/DSC00406.jpg',
        bgMobile1: '/images/DSC00400.jpg',
        bgMobile2: '/images/DSC00480.jpg',
        bgMobile3: '/images/DSC00653.jpg'
      }
    },
    introParallax: {
      textFields: {
        message: '季節折々、\nいいもの作りやす'
      },
      backgroundField: 'parallax-bg-1'
    },
    craft: {
      textFields: {
        leftText: 'ちょっとは九州じゃない料理',
        rightText: '九州料理と美味い酒'
      },
      imageFields: {
        image1: '/images/DSC00473.jpg',
        image2: '/images/no1-0357.jpg',
        image3: '/images/no1-0208.jpg'
      }
    },
    features: {
      textFields: {
        mainTitle: '当店の４つのこだわり',
        feature1Title: '当店名物！\nこだわりの博多もつ鍋',
        feature1Description: '厳選した国産牛もつと秘伝の特製スープで作る本場博多の味。',
        feature2Title: '季節の食材と調理で\n味わう逸品料理',
        feature2Description: '本マグロ入りお刺身盛り合わせ、馬刺しユッケ、桜鯛のなめろうなど',
        feature3Title: '幹事様に朗報！\n大好評宴会コース',
        feature3Description: '3時間飲み放題付きコースや食べ飲み放題プランなど多彩なコースをご用意。',
        feature4Title: '様々なシーンに\n最適な各種空間',
        feature4Description: '半個室風ボックス席、窓際デート席、グループ席など多彩な席をご用意。'
      },
      imageFields: {
        feature1Image: '/images/no1-0241.jpg',
        feature2Image: '/images/DSC00440.jpg',
        feature3Image: '/images/DSC00689.jpg',
        feature4Image: '/images/DSC00424.jpg'
      }
    },
    menu: {
      textFields: {
        sectionTitle: 'お品書き',
        subTitle: '心安らぐ空間で、特別なひとときを'
      }
    },
    diningStyle: {
      textFields: {
        sectionTitle: '選べる当店の楽しみ方！',
        partyTitle: '宴会',
        partySubtitle: 'PARTY',
        partyDescription: '大切な仲間との語らいに、木村屋本店サンプル店の個室をご用意。\n四季折々の食材を活かした会席料理で、\n記憶に残るひとときをお届けします。',
        partyFeature1: '完全個室（2〜12名様）',
        partyFeature2: '季節の会席コース',
        partyFeature3: '飲み放題プランあり',
        partyCta: 'コース料理を見る',
        sakeTitle: 'お酒',
        sakeSubtitle: 'SAKE',
        sakeDescription: '全国から厳選した日本酒と焼酎。\n季節限定の銘柄から定番まで、\n料理との最高のマリアージュをご提案。',
        sakeFeature1: '日本酒 常時30種以上',
        sakeFeature2: 'プレミアム焼酎',
        sakeFeature3: 'オリジナルカクテル',
        sakeCta: 'お酒メニューを見る'
      },
      imageFields: {
        partyBg: '/images/DSC00452.jpg',
        sakeBg: '/images/DSC00493.jpg'
      }
    },
    seats: {
      textFields: {
        title: 'お席のご案内',
        subTitle: '大切なひとときを過ごすための、さまざまな空間をご用意'
      },
      seatData: [
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
    },
    gallery: {
      textFields: {
        title: 'フォトギャラリー',
        subTitle: '木村屋本店の様々な風景'
      },
      imageFields: {
        gallery1: '/images/no1-0241.jpg',
        gallery2: '/images/no1-0283.jpg',
        gallery3: '/images/no1-0361.jpg',
        gallery4: '/images/no1-0151.jpg',
        gallery5: '/images/DSC00439.jpg',
        gallery6: '/images/DSC00680.jpg',
        gallery7: '/images/DSC00571.jpg',
        gallery8: '/images/DSC00566.jpg',
        gallery9: '/images/DSC00527.jpg'
      }
    },
    info: {
      textFields: {
        title: '店舗案内',
        shopName: '木村屋本店 横浜鶴屋町',
        address: '神奈川県横浜市神奈川区鶴屋町2-15\nエフテム白十字ビル 2F・3F',
        access: '横浜駅きた西口 徒歩1分',
        phone: '050-5484-9698',
        businessHours: '月～金: 17:00～23:30 (L.O.23:00)\n土日祝: 16:00～23:30 (L.O.23:00)',
        closedDays: '無休',
        seats: '110席（貸切最大110名様まで）'
      }
    }
  }
}