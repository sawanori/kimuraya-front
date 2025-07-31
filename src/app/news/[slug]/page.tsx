'use client'

import React, { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import NewsOnlyHeader from '@/components/news/layout/NewsOnlyHeader'
import NewsFooter from '@/components/news/layout/Footer'
import Breadcrumb from '@/components/news/layout/Breadcrumb'
import ArticleContent from '@/components/news/article/ArticleContent'
import ArticleCard from '@/components/news/article/ArticleCard'
import { fetchArticleBySlug, fetchRelatedArticles } from '@/lib/news/api'
import { Article } from '@/types/news'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (!slug) return

    const loadArticle = async () => {
      try {
        setLoading(true)
        const fetchedArticle = await fetchArticleBySlug(slug)
        
        if (!fetchedArticle) {
          notFound()
          return
        }

        setArticle(fetchedArticle)

        // 関連記事を取得
        const related = await fetchRelatedArticles(fetchedArticle.id)
        setRelatedArticles(related)
      } catch (error) {
        console.error('記事の取得に失敗しました:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [slug])

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

  if (!article) {
    notFound()
    return null
  }

  const breadcrumbItems = [
    { name: 'ホーム', href: '/' },
    { name: '新着情報', href: '/news' },
    { name: article.title, href: `/news/${article.slug}` }
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <NewsOnlyHeader />
      
      <main className="news-main">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          
          <ArticleContent article={article} />
          
          {/* 関連記事 */}
          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-8">関連記事</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedArticles.map(relatedArticle => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <NewsFooter />
    </div>
  )
}