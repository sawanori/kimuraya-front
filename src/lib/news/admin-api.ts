// 記事管理用のAPI
import { Article, Category, Tag, Author } from '@/types/news'
import { mockArticles } from './mock-data'

// ローカルストレージのキー
const ARTICLES_STORAGE_KEY = 'kimuraya_news_articles'

// ローカルストレージから記事を取得
function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return mockArticles
  
  const stored = localStorage.getItem(ARTICLES_STORAGE_KEY)
  if (!stored) {
    // 初回はモックデータをセット
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(mockArticles))
    return mockArticles
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    return mockArticles
  }
}

// ローカルストレージに記事を保存
function saveStoredArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles))
}

// IDで記事を取得
export async function fetchArticleById(id: string | number): Promise<Article | null> {
  const articles = getStoredArticles()
  const article = articles.find(a => a.id.toString() === id.toString())
  return article || null
}

// 記事を保存（作成/更新）
export async function saveArticle(article: Partial<Article>): Promise<Article> {
  const articles = getStoredArticles()
  
  if (article.id) {
    // 更新
    const index = articles.findIndex(a => a.id === article.id)
    if (index !== -1) {
      const updatedArticle = {
        ...articles[index],
        ...article,
        updatedAt: new Date().toISOString()
      }
      articles[index] = updatedArticle
      saveStoredArticles(articles)
      return updatedArticle
    }
  } else {
    // 新規作成
    const newId = articles.length > 0 
      ? Math.max(...articles.map(a => typeof a.id === 'number' ? a.id : 0)) + 1
      : 1
    const newArticle: Article = {
      id: newId,
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      featuredImage: article.featuredImage || '',
      publishedAt: article.publishedAt || new Date().toISOString(),
      categories: article.categories || [],
      tags: article.tags || [],
      slug: article.slug || `article-${newId}`,
      status: article.status || 'draft',
      viewCount: 0,
      readingTime: Math.ceil((article.content?.length || 0) / 400), // 400文字/分で計算
      author: article.author || {
        id: 1,
        name: '木村屋 太郎',
        avatar: '/images/avatars/author1.jpg',
        bio: '木村屋本店の広報担当'
      },
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      metaKeywords: article.metaKeywords,
      ogImage: article.ogImage,
      canonicalUrl: article.canonicalUrl
    }
    
    articles.push(newArticle)
    saveStoredArticles(articles)
    return newArticle
  }
  
  throw new Error('記事の保存に失敗しました')
}

// 記事を削除
export async function deleteArticle(id: string | number): Promise<void> {
  const articles = getStoredArticles()
  const filtered = articles.filter(a => a.id.toString() !== id.toString())
  saveStoredArticles(filtered)
}

// 画像をアップロード
export async function uploadImage(file: File): Promise<string> {
  // ファイルサイズチェック（10MB以下）
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('ファイルサイズは10MB以下にしてください')
  }
  
  // ファイルタイプチェック
  if (!file.type.startsWith('image/')) {
    throw new Error('画像ファイルを選択してください')
  }
  
  // FormData を使って /api/upload にPOST
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'アップロードに失敗しました')
    }
    
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('アップロードエラー:', error)
    throw error
  }
}

// 複数の記事を一括削除
export async function bulkDeleteArticles(ids: (string | number)[]): Promise<void> {
  const articles = getStoredArticles()
  const filtered = articles.filter(a => !ids.includes(a.id))
  saveStoredArticles(filtered)
}

// 記事のステータスを一括更新
export async function bulkUpdateStatus(ids: (string | number)[], status: Article['status']): Promise<void> {
  const articles = getStoredArticles()
  const updated = articles.map(article => {
    if (ids.includes(article.id)) {
      return { ...article, status, updatedAt: new Date().toISOString() }
    }
    return article
  })
  saveStoredArticles(updated)
}

// カテゴリー一覧を取得（管理用）
export async function fetchAllCategories(): Promise<Category[]> {
  return [
    { id: 1, name: 'お知らせ', slug: 'announcement', color: '#3B82F6' },
    { id: 2, name: 'イベント', slug: 'event', color: '#10B981' },
    { id: 3, name: 'メディア掲載', slug: 'media', color: '#F59E0B' },
    { id: 4, name: 'キャンペーン', slug: 'campaign', color: '#EF4444' }
  ]
}

// タグ一覧を取得（管理用）
export async function fetchAllTags(): Promise<Tag[]> {
  return [
    { id: 1, name: '新商品', slug: 'new-product' },
    { id: 2, name: '限定', slug: 'limited' },
    { id: 3, name: 'コラボ', slug: 'collaboration' },
    { id: 4, name: 'お得情報', slug: 'special-offer' },
    { id: 5, name: '記念', slug: 'anniversary' },
    { id: 6, name: 'SNS', slug: 'sns' },
    { id: 7, name: '季節', slug: 'seasonal' }
  ]
}

// 著者一覧を取得（管理用）
export async function fetchAllAuthors(): Promise<Author[]> {
  return [
    {
      id: 1,
      name: '木村屋 太郎',
      avatar: '/images/avatars/author1.jpg',
      bio: '木村屋本店の広報担当。お客様に最新情報をお届けします。',
      socialLinks: { twitter: 'https://twitter.com/kimuraya' }
    },
    {
      id: 2,
      name: '鈴木 花子',
      avatar: '/images/avatars/author2.jpg',
      bio: 'イベント企画担当。楽しいイベント情報を発信します。'
    }
  ]
}