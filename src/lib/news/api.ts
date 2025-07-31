// 新着情報APIのモック実装
import { Article, ArticleListResponse, SearchParams, Category, Tag, Author } from '@/types/news';
import { mockArticles } from './mock-data';

// APIのベースURL（将来的に環境変数から取得）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ローカルストレージのキー
const ARTICLES_STORAGE_KEY = 'kimuraya_news_articles';

// モックの遅延を追加（開発環境でのみ）
const delay = (ms: number) => process.env.NODE_ENV === 'development' 
  ? new Promise(resolve => setTimeout(resolve, ms))
  : Promise.resolve();

// ローカルストレージから記事を取得
function getStoredArticles(): Article[] {
  // サーバーサイドでは空の配列を返す（クライアントコンポーネントで処理するため）
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = localStorage.getItem(ARTICLES_STORAGE_KEY);
  
  if (!stored) {
    // 初回はモックデータをセット
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(mockArticles));
    return mockArticles;
  }
  
  try {
    const articles = JSON.parse(stored);
    return articles;
  } catch (error) {
    // エラー時はモックデータをセットし直す
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(mockArticles));
    return mockArticles;
  }
}

// 記事一覧を取得
export async function fetchArticles(params?: SearchParams): Promise<ArticleListResponse> {
  await delay(300);

  let filteredArticles = getStoredArticles();
  
  // デバッグ: 全記事のタグ情報を表示
  console.log('=== 全記事のタグ情報 ===');
  filteredArticles.forEach(article => {
    console.log(`記事: ${article.title}`);
    console.log('  タグ:', article.tags);
  });

  // 公開中の記事のみ表示（予約公開を考慮）
  const now = new Date();
  filteredArticles = filteredArticles.filter(article => {
    if (article.status !== 'published') return false;
    const publishDate = new Date(article.publishedAt);
    return publishDate <= now;
  });
  
  // フィルタリング
  if (params?.keyword) {
    const keyword = params.keyword.toLowerCase();
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(keyword) ||
      article.excerpt.toLowerCase().includes(keyword) ||
      article.content.toLowerCase().includes(keyword)
    );
  }

  if (params?.category) {
    filteredArticles = filteredArticles.filter(article =>
      article.categories.some(cat => cat.slug === params.category)
    );
  }

  if (params?.tag) {
    console.log('タグフィルタリング開始 - 検索タグ:', params.tag);
    console.log('フィルタリング前の記事数:', filteredArticles.length);
    
    filteredArticles = filteredArticles.filter(article => {
      const hasTag = article.tags.some(tag => {
        console.log(`記事「${article.title}」のタグ:`, tag.slug, '=', params.tag, '?', tag.slug === params.tag);
        return tag.slug === params.tag;
      });
      return hasTag;
    });
    
    console.log('フィルタリング後の記事数:', filteredArticles.length);
  }

  if (params?.author) {
    filteredArticles = filteredArticles.filter(article =>
      article.author.id.toString() === params.author
    );
  }

  // 日付フィルタリング
  if (params?.dateFrom) {
    const fromDate = new Date(params.dateFrom);
    filteredArticles = filteredArticles.filter(article =>
      new Date(article.publishedAt) >= fromDate
    );
  }

  if (params?.dateTo) {
    const toDate = new Date(params.dateTo);
    filteredArticles = filteredArticles.filter(article =>
      new Date(article.publishedAt) <= toDate
    );
  }

  // ソート
  switch (params?.sort) {
    case 'oldest':
      filteredArticles.sort((a, b) => 
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
      break;
    case 'popularity':
      filteredArticles.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      break;
    case 'alphabetical':
      filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'newest':
    default:
      filteredArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }

  // ページネーション
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  return {
    articles: paginatedArticles,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredArticles.length / limit),
      totalItems: filteredArticles.length,
      itemsPerPage: limit,
      hasNext: endIndex < filteredArticles.length,
      hasPrevious: page > 1
    }
  };
}

// 単一記事を取得
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  await delay(200);
  
  const articles = getStoredArticles();
  const article = articles.find(a => a.slug === slug);
  return article || null;
}

// カテゴリー一覧を取得
export async function fetchCategories(): Promise<Category[]> {
  await delay(100);
  
  const categories: Category[] = [
    { id: 1, name: 'お知らせ', slug: 'announcement', description: '重要なお知らせ', color: '#3B82F6', order: 1 },
    { id: 2, name: 'イベント', slug: 'event', description: 'イベント情報', color: '#10B981', order: 2 },
    { id: 3, name: 'メディア掲載', slug: 'media', description: 'メディア掲載情報', color: '#F59E0B', order: 3 },
    { id: 4, name: 'キャンペーン', slug: 'campaign', description: 'お得なキャンペーン情報', color: '#EF4444', order: 4 },
  ];
  
  return categories;
}

// タグ一覧を取得
export async function fetchTags(): Promise<Tag[]> {
  await delay(100);
  
  const tags: Tag[] = [
    { id: 1, name: '新商品', slug: 'new-product', color: '#8B5CF6' },
    { id: 2, name: '限定', slug: 'limited', color: '#EC4899' },
    { id: 3, name: 'コラボ', slug: 'collaboration', color: '#06B6D4' },
    { id: 4, name: 'お得情報', slug: 'special-offer', color: '#F97316' },
    { id: 5, name: '記念', slug: 'anniversary', color: '#10B981' },
    { id: 6, name: 'SNS', slug: 'sns', color: '#3B82F6' },
    { id: 7, name: '季節', slug: 'seasonal', color: '#F59E0B' }
  ];
  
  return tags;
}

// 関連記事を取得
export async function fetchRelatedArticles(articleId: string | number, limit: number = 4): Promise<Article[]> {
  await delay(200);
  
  const articles = getStoredArticles();
  const currentArticle = articles.find(a => a.id === articleId);
  if (!currentArticle) return [];
  
  // カテゴリーが同じ記事を優先的に取得
  const relatedArticles = articles
    .filter(a => a.id !== articleId)
    .sort((a, b) => {
      const aCategoryMatch = a.categories.some(cat => 
        currentArticle.categories.some(currentCat => currentCat.id === cat.id)
      );
      const bCategoryMatch = b.categories.some(cat => 
        currentArticle.categories.some(currentCat => currentCat.id === cat.id)
      );
      
      if (aCategoryMatch && !bCategoryMatch) return -1;
      if (!aCategoryMatch && bCategoryMatch) return 1;
      
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);
  
  return relatedArticles;
}

// 人気記事を取得
export async function fetchPopularArticles(limit: number = 5): Promise<Article[]> {
  await delay(200);
  
  const articles = getStoredArticles();
  return articles
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit);
}

// 最新記事を取得
export async function fetchLatestArticles(limit: number = 5): Promise<Article[]> {
  await delay(200);
  
  const articles = getStoredArticles();
  const now = new Date();
  
  return articles
    .filter(article => {
      // 公開済みで、公開日時が現在時刻より前の記事のみ
      if (article.status !== 'published') return false;
      const publishDate = new Date(article.publishedAt);
      return publishDate <= now;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// アーカイブ記事を取得（年月指定）
export async function fetchArchiveArticles(year: number, month: number): Promise<ArticleListResponse> {
  await delay(300);
  
  const articles = getStoredArticles();
  const filteredArticles = articles.filter(article => {
    const date = new Date(article.publishedAt);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
  
  return {
    articles: filteredArticles,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: filteredArticles.length,
      itemsPerPage: filteredArticles.length,
      hasNext: false,
      hasPrevious: false
    }
  };
}