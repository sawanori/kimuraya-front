'use client'

import React, { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import NewsOnlyHeader from '@/components/news/layout/NewsOnlyHeader'
import NewsFooter from '@/components/news/layout/Footer'
import Breadcrumb from '@/components/news/layout/Breadcrumb'
import ArticleCard from '@/components/news/article/ArticleCard'
import Pagination from '@/components/news/navigation/Pagination'
import { fetchArticles, fetchTags } from '@/lib/news/api'
import { Article, Tag } from '@/types/news'
import { useSearchParams } from 'next/navigation'

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export default function TagPage({ params }: TagPageProps) {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [tag, setTag] = useState<Tag | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [slug, setSlug] = useState<string>('')

  const pageParam = searchParams.get('page')

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam))
    }
  }, [pageParam])

  useEffect(() => {
    if (!slug) return

    const loadData = async () => {
      try {
        setLoading(true)
        
        // タグ情報を取得
        const tags = await fetchTags()
        console.log('利用可能なタグ:', tags)
        console.log('検索するタグslug:', slug)
        
        const currentTag = tags.find(t => t.slug === slug)
        console.log('見つかったタグ:', currentTag)
        
        if (!currentTag) {
          notFound()
          return
        }
        
        setTag(currentTag)
        
        // タグでフィルタリングした記事を取得
        console.log('fetchArticles呼び出し - tag:', slug)
        const articlesResponse = await fetchArticles({
          tag: slug,
          page: currentPage,
          limit: 12
        })
        
        console.log('取得した記事数:', articlesResponse.articles.length)
        console.log('記事の詳細:', articlesResponse.articles)

        setArticles(articlesResponse.articles)
        setTotalPages(articlesResponse.pagination.totalPages)
      } catch (error) {
        console.error('データの取得に失敗しました:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [slug, currentPage])

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

  if (!tag) {
    notFound()
    return null
  }

  const breadcrumbItems = [
    { name: 'ホーム', href: '/' },
    { name: '新着情報', href: '/news' },
    { name: `タグ: ${tag.name}` }
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <NewsOnlyHeader />
      
      <main className="news-main">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              タグ: {tag.name}
            </h1>
            <p className="text-gray-600">
              「{tag.name}」タグが付いた記事一覧
            </p>
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
                    basePath={`/news/tag/${slug}`}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">このタグが付いた記事はありません。</p>
            </div>
          )}
        </div>
      </main>
      
      <NewsFooter />
    </div>
  )
}