// モックデータ
import { Article, Author } from '@/types/news';

const authors: Author[] = [
  {
    id: 1,
    name: '木村屋 太郎',
    avatar: '/images/avatars/author1.jpg',
    bio: '木村屋本店の広報担当。お客様に最新情報をお届けします。',
    socialLinks: {
      twitter: 'https://twitter.com/kimuraya',
    }
  },
  {
    id: 2,
    name: '鈴木 花子',
    avatar: '/images/avatars/author2.jpg',
    bio: 'イベント企画担当。楽しいイベント情報を発信します。',
  }
];

export const mockArticles: Article[] = [
  {
    id: 1,
    title: '【期間限定】冬の特別コース「雪見鍋」が登場！',
    content: `<h2>冬の味覚を堪能できる特別コース</h2>
    <p>寒い冬にぴったりの、身体も心も温まる特別コース「雪見鍋」が期間限定で登場しました。厳選された冬の食材をふんだんに使用し、木村屋本店ならではの味わいをお楽しみいただけます。</p>
    <h3>コース内容</h3>
    <ul>
      <li>前菜：季節の小鉢3種盛り</li>
      <li>お造り：本日の鮮魚5種盛り</li>
      <li>メイン：特製雪見鍋（国産牛もつ、冬野菜たっぷり）</li>
      <li>〆：特製雑炊またはうどん</li>
      <li>デザート：季節のフルーツとアイスクリーム</li>
    </ul>
    <p>期間：2024年12月1日〜2025年2月28日<br>
    価格：お一人様 5,500円（税込）</p>`,
    excerpt: '寒い冬にぴったりの、身体も心も温まる特別コース「雪見鍋」が期間限定で登場。厳選された冬の食材をふんだんに使用した贅沢なコースです。',
    featuredImage: '/images/no1-0241.jpg',
    publishedAt: '2025-07-25T09:00:00Z',
    updatedAt: '2025-07-25T09:00:00Z',
    categories: [
      { id: 4, name: 'キャンペーン', slug: 'campaign', color: '#EF4444' }
    ],
    tags: [
      { id: 1, name: '新商品', slug: 'new-product' },
      { id: 2, name: '限定', slug: 'limited' }
    ],
    author: authors[0],
    slug: 'winter-special-course-yukimi-nabe',
    status: 'published',
    readingTime: 3,
    viewCount: 245,
    metaTitle: '【期間限定】冬の特別コース「雪見鍋」登場 | 木村屋本店',
    metaDescription: '木村屋本店の冬季限定特別コース「雪見鍋」のご案内。厳選された冬の食材を使用した贅沢なコースをお楽しみください。'
  },
  {
    id: 2,
    title: '年末年始の営業時間のお知らせ',
    content: `<p>いつも木村屋本店をご利用いただき、誠にありがとうございます。年末年始の営業時間についてお知らせいたします。</p>
    <h3>年末年始の営業時間</h3>
    <table>
      <tr><th>日付</th><th>営業時間</th></tr>
      <tr><td>12月30日（月）</td><td>17:00〜23:00（通常営業）</td></tr>
      <tr><td>12月31日（火）</td><td>17:00〜22:00（短縮営業）</td></tr>
      <tr><td>1月1日（水）</td><td>休業</td></tr>
      <tr><td>1月2日（木）</td><td>休業</td></tr>
      <tr><td>1月3日（金）</td><td>17:00〜23:00（通常営業）</td></tr>
    </table>
    <p>新年は1月3日より通常営業いたします。皆様のご来店を心よりお待ちしております。</p>`,
    excerpt: '年末年始の営業時間についてお知らせいたします。12月31日は短縮営業、1月1日・2日は休業とさせていただきます。',
    featuredImage: '/images/DSC00424.jpg',
    publishedAt: '2025-07-20T10:00:00Z',
    categories: [
      { id: 1, name: 'お知らせ', slug: 'announcement', color: '#3B82F6' }
    ],
    tags: [],
    author: authors[0],
    slug: 'year-end-business-hours',
    status: 'published',
    readingTime: 2,
    viewCount: 523
  },
  {
    id: 3,
    title: '忘年会・新年会のご予約受付中！',
    content: `<p>忘年会・新年会シーズンが近づいてまいりました。木村屋本店では、各種宴会プランをご用意して皆様のご予約をお待ちしております。</p>
    <h3>おすすめ宴会プラン</h3>
    <h4>スタンダードプラン（2時間飲み放題付き）</h4>
    <p>お一人様 4,500円（税込）<br>
    もつ鍋をメインに、前菜からデザートまで全8品</p>
    <h4>プレミアムプラン（3時間飲み放題付き）</h4>
    <p>お一人様 6,000円（税込）<br>
    特選和牛もつ鍋、お造り盛り合わせなど全10品</p>
    <h4>特典</h4>
    <ul>
      <li>10名様以上で幹事様1名無料</li>
      <li>20名様以上で幹事様2名無料</li>
      <li>早期予約（11月中）で飲み放題30分延長サービス</li>
    </ul>`,
    excerpt: '忘年会・新年会のご予約を受付中です。2時間飲み放題付きプランから、豪華なプレミアムプランまで各種ご用意しております。',
    featuredImage: '/images/DSC00689.jpg',
    publishedAt: '2025-07-15T08:00:00Z',
    categories: [
      { id: 2, name: 'イベント', slug: 'event', color: '#10B981' },
      { id: 4, name: 'キャンペーン', slug: 'campaign', color: '#EF4444' }
    ],
    tags: [
      { id: 4, name: 'お得情報', slug: 'special-offer' }
    ],
    author: authors[1],
    slug: 'year-end-party-reservation',
    status: 'published',
    readingTime: 3,
    viewCount: 892
  },
  {
    id: 4,
    title: 'テレビ東京「食の極み」で紹介されました',
    content: `<p>11月10日放送のテレビ東京「食の極み」にて、当店の名物もつ鍋が紹介されました。</p>
    <p>番組では、当店のもつ鍋の特徴である「秘伝の味噌だれ」と「厳選された国産牛もつ」について詳しく取り上げていただきました。</p>
    <h3>放送内容</h3>
    <ul>
      <li>もつの下処理から仕込みまでのこだわり</li>
      <li>3代目店主による味噌だれの解説</li>
      <li>常連客へのインタビュー</li>
    </ul>
    <p>放送後、多くのお客様にご来店いただいております。混雑が予想されますので、ご予約をおすすめいたします。</p>`,
    excerpt: 'テレビ東京「食の極み」で当店の名物もつ鍋が紹介されました。秘伝の味噌だれと厳選された国産牛もつのこだわりを取り上げていただきました。',
    featuredImage: '/images/DSC00452.jpg',
    publishedAt: '2025-07-12T14:00:00Z',
    categories: [
      { id: 3, name: 'メディア掲載', slug: 'media', color: '#F59E0B' }
    ],
    tags: [],
    author: authors[0],
    slug: 'tv-tokyo-food-program',
    status: 'published',
    readingTime: 2,
    viewCount: 1567
  },
  {
    id: 5,
    title: '【コラボ企画】地元酒蔵との日本酒ペアリングイベント開催',
    content: `<p>木村屋本店×地元酒蔵「月の雫」のコラボレーションイベントを開催いたします。</p>
    <h3>イベント詳細</h3>
    <p><strong>日時：</strong>2024年12月15日（日）18:00〜21:00<br>
    <strong>定員：</strong>30名様（要予約）<br>
    <strong>料金：</strong>8,800円（税込）</p>
    <h3>内容</h3>
    <ul>
      <li>月の雫酒造の蔵元による日本酒講座</li>
      <li>5種類の日本酒と当店料理のペアリング</li>
      <li>特別料理5品コース</li>
      <li>お土産付き（月の雫 純米吟醸 300ml）</li>
    </ul>
    <p>ご予約は店頭またはお電話にて承っております。</p>`,
    excerpt: '地元酒蔵「月の雫」とのコラボイベントを12月15日に開催。5種類の日本酒と特別料理のペアリングをお楽しみいただけます。',
    featuredImage: '/images/DSC00493.jpg',
    publishedAt: '2025-07-08T11:00:00Z',
    updatedAt: '2024-11-10T15:00:00Z',
    categories: [
      { id: 2, name: 'イベント', slug: 'event', color: '#10B981' }
    ],
    tags: [
      { id: 3, name: 'コラボ', slug: 'collaboration' },
      { id: 2, name: '限定', slug: 'limited' }
    ],
    author: authors[1],
    slug: 'sake-pairing-event',
    status: 'published',
    readingTime: 3,
    viewCount: 678
  },
  {
    id: 6,
    title: '新メニュー「博多明太もつ鍋」が仲間入り',
    content: `<p>お客様のご要望にお応えして、新しい味のもつ鍋が登場しました。</p>
    <h3>博多明太もつ鍋の特徴</h3>
    <ul>
      <li>博多直送の辛子明太子をたっぷり使用</li>
      <li>ピリッとした辛さと旨味のハーモニー</li>
      <li>〆は明太子雑炊がおすすめ</li>
    </ul>
    <p>価格：お一人様 1,780円（税込）※2人前より承ります</p>
    <p>辛さは3段階からお選びいただけます。お子様向けに辛さ控えめもご用意しております。</p>`,
    excerpt: '新メニュー「博多明太もつ鍋」が登場。博多直送の辛子明太子をたっぷり使用した、ピリッと辛い新しい味わいです。',
    featuredImage: '/images/no1-0283.jpg',
    publishedAt: '2025-07-05T09:30:00Z',
    categories: [
      { id: 1, name: 'お知らせ', slug: 'announcement', color: '#3B82F6' }
    ],
    tags: [
      { id: 1, name: '新商品', slug: 'new-product' }
    ],
    author: authors[0],
    slug: 'new-menu-mentai-motsunabe',
    status: 'published',
    readingTime: 2,
    viewCount: 445
  },
  {
    id: 7,
    title: '開店5周年記念！感謝の特別キャンペーン実施中',
    content: `<p>おかげさまで木村屋本店は開店5周年を迎えることができました。日頃のご愛顧に感謝を込めて、特別キャンペーンを実施いたします。</p>
    <h3>キャンペーン内容</h3>
    <ul>
      <li>全コース料理10%OFF</li>
      <li>ドリンク1杯サービス（ディナータイムのみ）</li>
      <li>5,000円以上のご利用で次回使える500円クーポンプレゼント</li>
    </ul>
    <p>期間：2024年11月1日〜11月30日</p>
    <p>※他の割引との併用不可</p>`,
    excerpt: '開店5周年を記念して、全コース料理10%OFFなどの特別キャンペーンを11月限定で実施中です。',
    featuredImage: '/images/DSC00440.jpg',
    publishedAt: '2025-07-01T08:00:00Z',
    categories: [
      { id: 4, name: 'キャンペーン', slug: 'campaign', color: '#EF4444' }
    ],
    tags: [
      { id: 4, name: 'お得情報', slug: 'special-offer' },
      { id: 5, name: '記念', slug: 'anniversary' }
    ],
    author: authors[0],
    slug: '5th-anniversary-campaign',
    status: 'published',
    readingTime: 2,
    viewCount: 1234
  },
  {
    id: 8,
    title: 'Instagram投稿キャンペーン開催中',
    content: `<p>木村屋本店の公式Instagramをフォロー＆投稿で、豪華賞品が当たるキャンペーンを開催中です。</p>
    <h3>参加方法</h3>
    <ol>
      <li>@kimuraya_honten をフォロー</li>
      <li>当店のお料理を撮影</li>
      <li>#木村屋本店 #もつ鍋大好き を付けて投稿</li>
    </ol>
    <h3>賞品</h3>
    <ul>
      <li>特賞：ペアディナーコースご招待（1組2名様）</li>
      <li>木村屋賞：お食事券5,000円分（5名様）</li>
      <li>参加賞：次回使える10%OFFクーポン（全員）</li>
    </ul>
    <p>締切：2024年12月31日</p>`,
    excerpt: 'Instagram投稿キャンペーン開催中！フォロー＆投稿で豪華賞品が当たります。',
    featuredImage: '/images/DSC00527.jpg',
    publishedAt: '2025-06-28T10:00:00Z',
    categories: [
      { id: 2, name: 'イベント', slug: 'event', color: '#10B981' },
      { id: 4, name: 'キャンペーン', slug: 'campaign', color: '#EF4444' }
    ],
    tags: [
      { id: 6, name: 'SNS', slug: 'sns' }
    ],
    author: authors[1],
    slug: 'instagram-campaign',
    status: 'published',
    readingTime: 2,
    viewCount: 892
  },
  {
    id: 9,
    title: '秋の味覚フェア開催！旬の食材を使った限定メニュー',
    content: `<p>実りの秋を迎え、旬の食材をふんだんに使った限定メニューをご用意いたしました。</p>
    <h3>秋の限定メニュー</h3>
    <ul>
      <li>松茸と地鶏の土瓶蒸し：1,580円</li>
      <li>秋刀魚の塩焼き：980円</li>
      <li>栗ご飯：680円</li>
      <li>柿とクリームチーズの白和え：780円</li>
    </ul>
    <p>期間：2024年10月1日〜11月30日</p>
    <p>※数量限定のため、売り切れの際はご容赦ください。</p>`,
    excerpt: '秋の味覚をお楽しみいただける限定メニューが登場。松茸、秋刀魚、栗など旬の食材を使った逸品です。',
    featuredImage: '/images/DSC00473.jpg',
    publishedAt: '2025-06-15T09:00:00Z',
    categories: [
      { id: 1, name: 'お知らせ', slug: 'announcement', color: '#3B82F6' }
    ],
    tags: [
      { id: 2, name: '限定', slug: 'limited' },
      { id: 7, name: '季節', slug: 'seasonal' }
    ],
    author: authors[0],
    slug: 'autumn-special-menu',
    status: 'published',
    readingTime: 2,
    viewCount: 567
  }
];