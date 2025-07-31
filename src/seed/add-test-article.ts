// テスト記事を追加するスクリプト
import { Article } from '../types/news'

// ブラウザでのみ実行
if (typeof window !== 'undefined') {
  const newArticle: Article = {
    id: Date.now(),
    title: '新春特別メニューのご案内',
    content: '<p>新年あけましておめでとうございます。本年も木村屋本店をよろしくお願いいたします。</p><p>新春特別メニューとして、季節限定の鍋コースをご用意いたしました。厳選された食材を使用した特別なコースをぜひお楽しみください。</p>',
    excerpt: '新年あけましておめでとうございます。新春特別メニューのご案内です。',
    featuredImage: '/images/dishes/special-menu.jpg',
    publishedAt: new Date().toISOString(),
    categories: [{ id: 1, name: 'お知らせ', slug: 'announcement', color: '#3B82F6' }],
    tags: [{ id: 2, name: '限定', slug: 'limited' }, { id: 7, name: '季節', slug: 'seasonal' }],
    slug: `article-${Date.now()}`,
    status: 'published',
    viewCount: 0,
    readingTime: 1,
    author: {
      id: 1,
      name: '木村屋 太郎',
      avatar: '/images/avatars/author1.jpg',
      bio: '木村屋本店の広報担当'
    }
  }

  const existingArticles = JSON.parse(localStorage.getItem('kimuraya_news_articles') || '[]')
  existingArticles.push(newArticle)
  localStorage.setItem('kimuraya_news_articles', JSON.stringify(existingArticles))
  
  console.log('テスト記事を追加しました:', newArticle.title)
  console.log('現在の記事数:', existingArticles.length)
  
  // ページをリロード
  window.location.reload()
}

export {}