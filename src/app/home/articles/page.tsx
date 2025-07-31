import React from 'react'
import { Metadata } from 'next'
import ArticlesList from '@/components/admin/articles/ArticlesList'
import '../globals.css'
import '@/lib/news/debug'

export const metadata: Metadata = {
  title: '記事管理 | 木村屋本店',
  description: '新着情報の記事を管理します'
}

export default function ArticlesManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-articles-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">記事管理</h1>
          <p className="admin-page-description">
            新着情報の記事を作成・編集・削除できます
          </p>
        </div>
        
        <ArticlesList />
      </div>
    </div>
  )
}