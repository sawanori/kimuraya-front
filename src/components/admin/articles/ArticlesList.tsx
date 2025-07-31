'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchArticles } from '@/lib/news/api'
import { deleteArticle } from '@/lib/news/admin-api'
import { Article } from '@/types/news'
import { Calendar, Eye, Edit, Trash2, Plus, Search, Filter, ChevronDown } from 'lucide-react'

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popularity'>('newest')
  const [selectedArticles, setSelectedArticles] = useState<Set<string | number>>(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    loadArticles()
  }, [])
  
  useEffect(() => {
    // ソート変更時に再読み込み
    loadArticles()
  }, [sortBy])

  const loadArticles = async () => {
    try {
      setLoading(true)
      // 管理画面ではすべてのステータスの記事を取得
      const response = await fetchArticles({ limit: 1000, sort: sortBy })
      // localStorageから直接取得して、すべてのステータスを含む
      if (typeof window !== 'undefined') {
        const allArticles = JSON.parse(localStorage.getItem('kimuraya_news_articles') || '[]')
        setArticles(allArticles)
      }
    } catch (error) {
      console.error('記事の読み込みに失敗しました:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (article: Article) => {
    setArticleToDelete(article)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!articleToDelete) return
    
    try {
      await deleteArticle(articleToDelete.id)
      await loadArticles()
      setShowDeleteModal(false)
      setArticleToDelete(null)
    } catch (error) {
      console.error('削除に失敗しました:', error)
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedArticles(new Set(filteredArticles.map(a => a.id)))
    } else {
      setSelectedArticles(new Set())
    }
  }

  const handleSelectArticle = (id: string | number) => {
    const newSelected = new Set(selectedArticles)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedArticles(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedArticles.size === 0) return
    
    if (confirm(`選択した${selectedArticles.size}件の記事を削除しますか？`)) {
      try {
        await Promise.all(Array.from(selectedArticles).map(id => deleteArticle(id)))
        await loadArticles()
        setSelectedArticles(new Set())
      } catch (error) {
        console.error('一括削除に失敗しました:', error)
      }
    }
  }

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || article.categories.some(c => c.slug === selectedCategory)
      const matchesStatus = !selectedStatus || article.status === selectedStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        case 'popularity':
          return (b.viewCount || 0) - (a.viewCount || 0)
        case 'newest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }
    })

  const getStatusBadge = (status: Article['status']) => {
    const statusConfig = {
      published: { label: '公開中', className: 'badge-success' },
      draft: { label: '下書き', className: 'badge-warning' },
      private: { label: '非公開', className: 'badge-secondary' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`article-status-badge ${config.className}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="articles-management">
      {/* ツールバー */}
      <div className="articles-toolbar">
        <div className="toolbar-left">
          <Link href="/home/articles/new" className="btn-primary">
            <Plus size={20} />
            <span>新規作成</span>
          </Link>
          
          {selectedArticles.size > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedArticles.size}件選択中</span>
              <button 
                className="btn-danger-outline"
                onClick={handleBulkDelete}
              >
                <Trash2 size={16} />
                <span>削除</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="toolbar-right">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">すべてのカテゴリー</option>
              <option value="announcement">お知らせ</option>
              <option value="event">イベント</option>
              <option value="media">メディア掲載</option>
              <option value="campaign">キャンペーン</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">すべてのステータス</option>
              <option value="published">公開中</option>
              <option value="draft">下書き</option>
              <option value="private">非公開</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="popularity">人気順</option>
            </select>
          </div>
        </div>
      </div>

      {/* 記事一覧テーブル */}
      <div className="articles-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>記事を読み込んでいます...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="empty-state">
            <p>記事が見つかりません</p>
            <Link href="/home/articles/new" className="btn-primary">
              <Plus size={20} />
              <span>最初の記事を作成</span>
            </Link>
          </div>
        ) : (
          <table className="articles-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                  />
                </th>
                <th className="image-column">画像</th>
                <th className="title-column">タイトル</th>
                <th className="category-column">カテゴリー</th>
                <th className="status-column">ステータス</th>
                <th className="stats-column">統計</th>
                <th className="date-column">公開日</th>
                <th className="actions-column">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className={selectedArticles.has(article.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedArticles.has(article.id)}
                      onChange={() => handleSelectArticle(article.id)}
                    />
                  </td>
                  <td>
                    {article.featuredImage ? (
                      <div className="article-thumbnail">
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          width={80}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className="article-thumbnail placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="article-title-cell">
                      <Link 
                        href={`/news/${article.slug}`} 
                        target="_blank"
                        className="article-title-link"
                      >
                        {article.title}
                      </Link>
                      <div className="article-excerpt">{article.excerpt}</div>
                    </div>
                  </td>
                  <td>
                    <div className="article-categories">
                      {article.categories.map((category) => (
                        <span 
                          key={category.id} 
                          className="category-tag"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{getStatusBadge(article.status)}</td>
                  <td>
                    <div className="article-stats">
                      <div className="stat-item">
                        <Eye size={14} />
                        <span>{article.viewCount || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="article-date">
                      <Calendar size={14} />
                      <span>{new Date(article.publishedAt).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </td>
                  <td>
                    <div className="article-actions">
                      <Link 
                        href={`/home/articles/${article.id}/edit`}
                        className="action-btn edit"
                        title="編集"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article)}
                        className="action-btn delete"
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 削除確認モーダル */}
      {showDeleteModal && articleToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>記事を削除しますか？</h3>
            <p>「{articleToDelete.title}」を削除します。この操作は取り消せません。</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                キャンセル
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .articles-management {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .articles-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e1e4e8;
          flex-wrap: wrap;
          gap: 16px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          justify-content: flex-end;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #0066ff;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #0052cc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .selected-count {
          color: #666;
          font-weight: 500;
        }

        .btn-danger-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: white;
          color: #dc3545;
          border: 1px solid #dc3545;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger-outline:hover {
          background: #dc3545;
          color: white;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 300px;
        }

        .search-box svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .search-box input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #e1e4e8;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #0066ff;
        }

        .filter-controls {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 10px 36px 10px 16px;
          border: 1px solid #e1e4e8;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #0066ff;
        }

        .articles-table-container {
          overflow-x: auto;
        }

        .articles-table {
          width: 100%;
          border-collapse: collapse;
        }

        .articles-table th {
          text-align: left;
          padding: 16px 20px;
          background: #f8f9fa;
          font-weight: 600;
          font-size: 14px;
          color: #666;
          border-bottom: 1px solid #e1e4e8;
          white-space: nowrap;
        }

        .articles-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f0f1f3;
          vertical-align: middle;
        }

        .articles-table tr:hover {
          background: #f8f9fa;
        }

        .articles-table tr.selected {
          background: #e7f3ff;
        }

        .checkbox-column {
          width: 40px;
        }

        .image-column {
          width: 100px;
        }

        .title-column {
          min-width: 300px;
        }

        .category-column {
          width: 200px;
        }

        .status-column {
          width: 100px;
        }

        .stats-column {
          width: 100px;
        }

        .date-column {
          width: 140px;
        }

        .actions-column {
          width: 100px;
        }

        .article-thumbnail {
          width: 80px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          background: #f0f1f3;
        }

        .article-thumbnail.placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 12px;
        }

        .article-title-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .article-title-link {
          color: #1a1a1a;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .article-title-link:hover {
          color: #0066ff;
        }

        .article-excerpt {
          font-size: 13px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 400px;
        }

        .article-categories {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .category-tag {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }

        .article-status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge-success {
          background: #d4edda;
          color: #155724;
        }

        .badge-warning {
          background: #fff3cd;
          color: #856404;
        }

        .badge-secondary {
          background: #e2e3e5;
          color: #383d41;
        }

        .article-stats {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #666;
          font-size: 13px;
        }

        .article-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 13px;
        }

        .article-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          background: white;
          color: #666;
          transition: all 0.2s;
          cursor: pointer;
        }

        .action-btn:hover {
          border-color: #0066ff;
          color: #0066ff;
        }

        .action-btn.delete:hover {
          border-color: #dc3545;
          color: #dc3545;
        }

        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0066ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state p {
          color: #666;
          margin-bottom: 20px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-content h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 700;
        }

        .modal-content p {
          margin: 0 0 24px 0;
          color: #666;
          line-height: 1.6;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-secondary {
          padding: 10px 20px;
          background: #f8f9fa;
          color: #666;
          border: 1px solid #e1e4e8;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e9ecef;
        }

        .btn-danger {
          padding: 10px 20px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        @media (max-width: 768px) {
          .articles-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-left,
          .toolbar-right {
            width: 100%;
            justify-content: flex-start;
          }

          .search-box {
            max-width: none;
          }

          .filter-controls {
            flex-wrap: wrap;
          }

          .filter-select {
            flex: 1;
            min-width: 120px;
          }

          .articles-table {
            font-size: 14px;
          }

          .articles-table th,
          .articles-table td {
            padding: 12px 16px;
          }

          .article-excerpt {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}