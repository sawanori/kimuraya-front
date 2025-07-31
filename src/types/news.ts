// 新着情報関連の型定義

export interface Author {
  id: string | number;
  name: string;
  avatar: string;
  bio: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | number | null;
  color?: string;
  order?: number;
  articleCount?: number;
}

export interface Tag {
  id: string | number;
  name: string;
  slug: string;
  color?: string;
  articleCount?: number;
}

export interface Article {
  id: string | number;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: Date | string;
  updatedAt?: Date | string;
  categories: Category[];
  tags: Tag[];
  author: Author;
  slug: string;
  status: 'draft' | 'published' | 'private';
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  viewCount?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ArticleListResponse {
  articles: Article[];
  pagination: PaginationInfo;
}

export interface SearchParams {
  keyword?: string;
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'newest' | 'oldest' | 'popularity' | 'alphabetical';
  page?: number;
  limit?: number;
}