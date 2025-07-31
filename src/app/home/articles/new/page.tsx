import React from 'react'
import { Metadata } from 'next'
import ArticleForm from '@/components/admin/articles/ArticleForm'
import '../../globals.css'

export const metadata: Metadata = {
  title: '記事作成 | 木村屋本店',
  description: '新しい記事を作成します'
}

export default function NewArticlePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-article-new-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">記事作成</h1>
          <p className="admin-page-description">
            新着情報に掲載する記事を作成します
          </p>
        </div>
        
        <ArticleForm />
      </div>
    </div>
  )
}