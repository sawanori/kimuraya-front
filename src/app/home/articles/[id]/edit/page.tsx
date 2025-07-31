import React from 'react'
import { Metadata } from 'next'
import ArticleForm from '@/components/admin/articles/ArticleForm'
import '../../../globals.css'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: '記事編集 | 木村屋本店',
  description: '記事を編集します'
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-article-edit-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">記事編集</h1>
          <p className="admin-page-description">
            記事の内容を編集します
          </p>
        </div>
        
        <ArticleForm articleId={id} />
      </div>
    </div>
  )
}