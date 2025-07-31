'use client'

import React, { useEffect, useState, Suspense } from 'react'
import NewsOnlyHeader from '@/components/news/layout/NewsOnlyHeader'
import NewsFooter from '@/components/news/layout/Footer'
import Breadcrumb from '@/components/news/layout/Breadcrumb'
import ArticleCard from '@/components/news/article/ArticleCard'
import Pagination from '@/components/news/navigation/Pagination'
import ClientSortSelect from '@/components/news/filtering/ClientSortSelect'
import { fetchArticles, fetchCategories } from '@/lib/news/api'
import { Article, Category } from '@/types/news'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function NewsListPageContent() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popularity'>('newest')

  const pageParam = searchParams.get('page')
  const sortParam = searchParams.get('sort') as 'newest' | 'oldest' | 'popularity' | null

  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam))
    }
    if (sortParam) {
      setSortBy(sortParam)
    }
  }, [pageParam, sortParam])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const [articlesResponse, categoriesData] = await Promise.all([
          fetchArticles({ page: currentPage, limit: 12, sort: sortBy }),
          fetchCategories()
        ])

        setArticles(articlesResponse.articles)
        setTotalPages(articlesResponse.pagination.totalPages)
        setCategories(categoriesData)
      } catch (error) {
        console.error('データの取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentPage, sortBy])

  const breadcrumbItems = [
    { name: 'ホーム', href: '/' },
    { name: '新着情報', href: '/news' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <NewsOnlyHeader />
        <main className="news-main">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">読み込み中...</div>
          </div>
        </main>
        <NewsFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <NewsOnlyHeader />
      
      <main className="news-main">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">新着情報</h1>
            <ClientSortSelect value={sortBy} onChange={setSortBy} />
          </div>
          
          {/* カテゴリーフィルター */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/news"
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white"
            >
              すべて
            </Link>
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/news/category/${category.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
          
          {/* 記事一覧 */}
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/news"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">記事がありません。</p>
            </div>
          )}
        </div>
      </main>
      
      <NewsFooter />
    </div>
  )
}

export default function NewsListPage() {
  return (
    <Suspense fallback={
      <div className="news-page">
        <NewsOnlyHeader />
        <main className="news-main">
          <div className="container mx-auto px-4 py-12">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">読み込み中...</p>
            </div>
          </div>
        </main>
        <NewsFooter />
      </div>
    }>
      <NewsListPageContent />
    </Suspense>
  )
}