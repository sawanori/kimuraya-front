'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Article, Category, Tag, Author } from '@/types/news'
import { fetchArticleById, saveArticle, uploadImage } from '@/lib/news/admin-api'
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Calendar,
  User,
  Tag as TagIcon,
  Folder,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'

interface ArticleFormProps {
  articleId?: string
}

export default function ArticleForm({ articleId }: ArticleFormProps) {
  const router = useRouter()
  const contentEditorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categories: [],
    tags: [],
    status: 'draft',
    publishedAt: new Date().toISOString(),
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    author: {
      id: 1,
      name: '木村屋 太郎',
      avatar: '/images/avatars/author1.jpg',
      bio: '木村屋本店の広報担当'
    }
  })
  
  const [availableCategories] = useState<Category[]>([
    { id: 1, name: 'お知らせ', slug: 'announcement', color: '#3B82F6' },
    { id: 2, name: 'イベント', slug: 'event', color: '#10B981' },
    { id: 3, name: 'メディア掲載', slug: 'media', color: '#F59E0B' },
    { id: 4, name: 'キャンペーン', slug: 'campaign', color: '#EF4444' }
  ])
  
  const [availableTags] = useState<Tag[]>([
    { id: 1, name: '新商品', slug: 'new-product' },
    { id: 2, name: '限定', slug: 'limited' },
    { id: 3, name: 'コラボ', slug: 'collaboration' },
    { id: 4, name: 'お得情報', slug: 'special-offer' },
    { id: 5, name: '記念', slug: 'anniversary' },
    { id: 6, name: 'SNS', slug: 'sns' },
    { id: 7, name: '季節', slug: 'seasonal' }
  ])
  
  const [selectedTab, setSelectedTab] = useState<'content' | 'seo' | 'settings'>('content')
  const [showPreview, setShowPreview] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (articleId) {
      loadArticle()
    }
  }, [articleId])

  const loadArticle = async () => {
    if (!articleId) return
    
    try {
      setLoading(true)
      const loadedArticle = await fetchArticleById(articleId)
      if (loadedArticle) {
        setArticle(loadedArticle)
        // コンテンツエディタに内容を設定
        if (contentEditorRef.current && loadedArticle.content) {
          contentEditorRef.current.innerHTML = loadedArticle.content
        }
      }
    } catch (error) {
      console.error('記事の読み込みに失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      
      // バリデーション
      if (!article.title?.trim()) {
        alert('タイトルを入力してください')
        return
      }
      
      if (!article.content?.trim()) {
        alert('本文を入力してください')
        return
      }
      
      // スラッグの自動生成（新規作成時）
      if (!articleId && !article.slug) {
        // 日本語タイトルの場合はタイムスタンプを使用
        const timestamp = new Date().getTime()
        article.slug = `article-${timestamp}`
      }
      
      // 公開日時が設定されていない場合は現在時刻を設定
      if (!article.publishedAt) {
        article.publishedAt = new Date().toISOString()
      }
      
      console.log('保存する記事データ:', {
        ...article,
        status: article.status,
        publishedAt: article.publishedAt,
        公開判定: article.status === 'published' && new Date(article.publishedAt) <= new Date()
      })
      
      const savedArticle = await saveArticle(article as Article)
      console.log('保存された記事:', savedArticle)
      
      // 保存後、ローカルストレージを確認
      const allArticles = JSON.parse(localStorage.getItem('kimuraya_news_articles') || '[]')
      console.log('全記事数:', allArticles.length)
      
      router.push('/home/articles')
    } catch (error) {
      console.error('保存に失敗しました:', error)
      alert('保存に失敗しました: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setUploadingImage(true)
      const url = await uploadImage(file)
      setArticle({ ...article, featuredImage: url })
    } catch (error) {
      console.error('画像のアップロードに失敗しました:', error)
      alert('画像のアップロードに失敗しました')
    } finally {
      setUploadingImage(false)
    }
  }

  const insertImageToContent = async () => {
    const file = await new Promise<File | null>((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement
        resolve(target.files?.[0] || null)
      }
      input.click()
    })
    
    if (!file) return
    
    try {
      const url = await uploadImage(file)
      const imgTag = `<img src="${url}" alt="" />`
      insertAtCursor(imgTag)
    } catch (error) {
      console.error('画像の挿入に失敗しました:', error)
    }
  }

  const insertAtCursor = (text: string) => {
    if (!contentEditorRef.current) return
    
    const selection = window.getSelection()
    if (!selection?.rangeCount) return
    
    const range = selection.getRangeAt(0)
    range.deleteContents()
    
    const node = document.createTextNode(text)
    range.insertNode(node)
    
    range.setStartAfter(node)
    range.setEndAfter(node)
    selection.removeAllRanges()
    selection.addRange(range)
    
    setArticle({ ...article, content: contentEditorRef.current.innerHTML })
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (contentEditorRef.current) {
      setArticle({ ...article, content: contentEditorRef.current.innerHTML })
    }
  }

  const toggleCategory = (category: Category) => {
    const categories = article.categories || []
    const exists = categories.some(c => c.id === category.id)
    
    if (exists) {
      setArticle({
        ...article,
        categories: categories.filter(c => c.id !== category.id)
      })
    } else {
      setArticle({
        ...article,
        categories: [...categories, category]
      })
    }
  }

  const toggleTag = (tag: Tag) => {
    const tags = article.tags || []
    const exists = tags.some(t => t.id === tag.id)
    
    if (exists) {
      setArticle({
        ...article,
        tags: tags.filter(t => t.id !== tag.id)
      })
    } else {
      setArticle({
        ...article,
        tags: [...tags, tag]
      })
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>記事を読み込んでいます...</p>
      </div>
    )
  }

  return (
    <div className="article-form-container">
      <form onSubmit={handleSave}>
        {/* ヘッダーツールバー */}
        <div className="form-header">
          <div className="header-left">
            <Link href="/home/articles" className="back-link">
              ← 記事一覧に戻る
            </Link>
          </div>
          
          <div className="header-right">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye size={20} />
              <span>{showPreview ? 'エディタ' : 'プレビュー'}</span>
            </button>
            
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              <Save size={20} />
              <span>{saving ? '保存中...' : '保存'}</span>
            </button>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="form-tabs">
          <button
            type="button"
            className={`tab ${selectedTab === 'content' ? 'active' : ''}`}
            onClick={() => setSelectedTab('content')}
          >
            <FileText size={18} />
            <span>コンテンツ</span>
          </button>
          <button
            type="button"
            className={`tab ${selectedTab === 'seo' ? 'active' : ''}`}
            onClick={() => setSelectedTab('seo')}
          >
            <LinkIcon size={18} />
            <span>SEO設定</span>
          </button>
          <button
            type="button"
            className={`tab ${selectedTab === 'settings' ? 'active' : ''}`}
            onClick={() => setSelectedTab('settings')}
          >
            <Folder size={18} />
            <span>詳細設定</span>
          </button>
        </div>

        {/* フォームコンテンツ */}
        <div className="form-content">
          {selectedTab === 'content' && (
            <div className="tab-content">
              {/* タイトル */}
              <div className="form-group">
                <label htmlFor="title">タイトル</label>
                <input
                  id="title"
                  type="text"
                  value={article.title}
                  onChange={(e) => setArticle({ ...article, title: e.target.value })}
                  placeholder="記事のタイトルを入力"
                  required
                />
              </div>

              {/* アイキャッチ画像 */}
              <div className="form-group">
                <label>アイキャッチ画像</label>
                <div className="featured-image-upload">
                  {article.featuredImage ? (
                    <div className="image-preview">
                      <Image
                        src={article.featuredImage}
                        alt="アイキャッチ画像"
                        width={300}
                        height={200}
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setArticle({ ...article, featuredImage: '' })}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-area"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadingImage ? (
                        <div className="spinner small"></div>
                      ) : (
                        <>
                          <Upload size={40} />
                          <p>クリックまたはドラッグ＆ドロップで画像をアップロード</p>
                          <span>推奨サイズ: 1200x630px</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* 抜粋 */}
              <div className="form-group">
                <label htmlFor="excerpt">抜粋</label>
                <textarea
                  id="excerpt"
                  value={article.excerpt}
                  onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                  placeholder="記事の概要を入力（一覧ページに表示されます）"
                  rows={3}
                />
              </div>

              {/* 本文エディタ */}
              <div className="form-group">
                <label>本文</label>
                {showPreview ? (
                  <div className="preview-content prose" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
                ) : (
                  <>
                    <div className="editor-toolbar">
                      <button type="button" onClick={() => execCommand('undo')} title="元に戻す">
                        <Undo size={18} />
                      </button>
                      <button type="button" onClick={() => execCommand('redo')} title="やり直す">
                        <Redo size={18} />
                      </button>
                      
                      <div className="toolbar-separator" />
                      
                      <button type="button" onClick={() => execCommand('formatBlock', 'h2')} title="見出し2">
                        <Heading size={18} />
                      </button>
                      <button type="button" onClick={() => execCommand('bold')} title="太字">
                        <Bold size={18} />
                      </button>
                      <button type="button" onClick={() => execCommand('italic')} title="斜体">
                        <Italic size={18} />
                      </button>
                      
                      <div className="toolbar-separator" />
                      
                      <button type="button" onClick={() => execCommand('insertUnorderedList')} title="箇条書き">
                        <List size={18} />
                      </button>
                      <button type="button" onClick={() => execCommand('insertOrderedList')} title="番号付きリスト">
                        <ListOrdered size={18} />
                      </button>
                      <button type="button" onClick={() => execCommand('formatBlock', 'blockquote')} title="引用">
                        <Quote size={18} />
                      </button>
                      
                      <div className="toolbar-separator" />
                      
                      <button type="button" onClick={() => execCommand('justifyLeft')} title="左寄せ">
                        <AlignLeft size={18} />
                      </button>
                      <button type="button" onClick={() => execCommand('justifyCenter')} title="中央寄せ">
                        <AlignCenter size={18} />
                      </button>
                      <button type="button" onClick={() => execCommand('justifyRight')} title="右寄せ">
                        <AlignRight size={18} />
                      </button>
                      
                      <div className="toolbar-separator" />
                      
                      <button type="button" onClick={insertImageToContent} title="画像を挿入">
                        <ImageIcon size={18} />
                      </button>
                      <button type="button" onClick={() => {
                        const url = prompt('リンクURL:')
                        if (url) execCommand('createLink', url)
                      }} title="リンク">
                        <LinkIcon size={18} />
                      </button>
                      <button type="button" onClick={() => execCommand('formatBlock', 'pre')} title="コード">
                        <Code size={18} />
                      </button>
                    </div>
                    
                    <div
                      ref={contentEditorRef}
                      className="content-editor"
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: article.content || '' }}
                      onInput={(e) => setArticle({ ...article, content: e.currentTarget.innerHTML })}
                      data-placeholder="記事の本文を入力..."
                    />
                  </>
                )}
              </div>

              {/* カテゴリー */}
              <div className="form-group">
                <label>カテゴリー</label>
                <div className="category-tags">
                  {availableCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`category-tag ${article.categories?.some(c => c.id === category.id) ? 'selected' : ''}`}
                      onClick={() => toggleCategory(category)}
                      style={{
                        backgroundColor: article.categories?.some(c => c.id === category.id) ? category.color : undefined,
                        borderColor: category.color
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* タグ */}
              <div className="form-group">
                <label>タグ</label>
                <div className="tag-list">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      className={`tag-item ${article.tags?.some(t => t.id === tag.id) ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      <TagIcon size={14} />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'seo' && (
            <div className="tab-content">
              {/* メタタイトル */}
              <div className="form-group">
                <label htmlFor="metaTitle">メタタイトル</label>
                <input
                  id="metaTitle"
                  type="text"
                  value={article.metaTitle}
                  onChange={(e) => setArticle({ ...article, metaTitle: e.target.value })}
                  placeholder="検索結果に表示されるタイトル（空欄の場合は記事タイトルを使用）"
                />
                <span className="field-hint">推奨: 50-60文字</span>
              </div>

              {/* メタディスクリプション */}
              <div className="form-group">
                <label htmlFor="metaDescription">メタディスクリプション</label>
                <textarea
                  id="metaDescription"
                  value={article.metaDescription}
                  onChange={(e) => setArticle({ ...article, metaDescription: e.target.value })}
                  placeholder="検索結果に表示される説明文（空欄の場合は抜粋を使用）"
                  rows={3}
                />
                <span className="field-hint">推奨: 120-160文字</span>
              </div>

              {/* メタキーワード */}
              <div className="form-group">
                <label htmlFor="metaKeywords">メタキーワード</label>
                <input
                  id="metaKeywords"
                  type="text"
                  value={article.metaKeywords?.join(', ')}
                  onChange={(e) => setArticle({ 
                    ...article, 
                    metaKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                  })}
                  placeholder="キーワードをカンマ区切りで入力"
                />
              </div>

              {/* OG画像 */}
              <div className="form-group">
                <label htmlFor="ogImage">OG画像URL</label>
                <input
                  id="ogImage"
                  type="text"
                  value={article.ogImage}
                  onChange={(e) => setArticle({ ...article, ogImage: e.target.value })}
                  placeholder="SNSシェア時の画像URL（空欄の場合はアイキャッチ画像を使用）"
                />
              </div>

              {/* カノニカルURL */}
              <div className="form-group">
                <label htmlFor="canonicalUrl">カノニカルURL</label>
                <input
                  id="canonicalUrl"
                  type="text"
                  value={article.canonicalUrl}
                  onChange={(e) => setArticle({ ...article, canonicalUrl: e.target.value })}
                  placeholder="正規URLを指定する場合に入力"
                />
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="tab-content">
              {/* ステータス */}
              <div className="form-group">
                <label htmlFor="status">ステータス</label>
                <select
                  id="status"
                  value={article.status}
                  onChange={(e) => setArticle({ ...article, status: e.target.value as Article['status'] })}
                >
                  <option value="draft">下書き</option>
                  <option value="published">公開</option>
                  <option value="private">非公開</option>
                </select>
              </div>

              {/* 公開日時 */}
              <div className="form-group">
                <label htmlFor="publishedAt">公開日時</label>
                <input
                  id="publishedAt"
                  type="datetime-local"
                  value={article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setArticle({ ...article, publishedAt: new Date(e.target.value).toISOString() })}
                />
              </div>

              {/* スラッグ */}
              <div className="form-group">
                <label htmlFor="slug">スラッグ（URL）</label>
                <input
                  id="slug"
                  type="text"
                  value={article.slug}
                  onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                  placeholder="記事のURL（自動生成されます）"
                />
                <span className="field-hint">例: winter-special-course-yukimi-nabe</span>
              </div>

              {/* 著者 */}
              <div className="form-group">
                <label htmlFor="author">著者</label>
                <select
                  id="author"
                  value={article.author?.id}
                  onChange={(e) => {
                    // 実際の実装では著者データを取得
                    const author: Author = {
                      id: parseInt(e.target.value),
                      name: '木村屋 太郎',
                      avatar: '/images/avatars/author1.jpg',
                      bio: '木村屋本店の広報担当'
                    }
                    setArticle({ ...article, author })
                  }}
                >
                  <option value="1">木村屋 太郎</option>
                  <option value="2">鈴木 花子</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </form>

      <style jsx>{`
        .article-form-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
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

        .spinner.small {
          width: 20px;
          height: 20px;
          border-width: 2px;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-left,
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-link {
          color: #666;
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #0066ff;
        }

        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #0066ff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0052cc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #666;
          border: 1px solid #e1e4e8;
        }

        .btn-secondary:hover {
          background: #e9ecef;
          border-color: #0066ff;
          color: #0066ff;
        }

        .form-tabs {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e1e4e8;
          background: white;
          padding: 0 20px;
          border-radius: 12px 12px 0 0;
        }

        .tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 0;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: #0066ff;
        }

        .tab.active {
          color: #0066ff;
          border-bottom-color: #0066ff;
        }

        .form-content {
          background: white;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tab-content {
          padding: 32px;
        }

        .form-group {
          margin-bottom: 28px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input[type="text"],
        .form-group input[type="datetime-local"],
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e1e4e8;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #0066ff;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .field-hint {
          display: block;
          margin-top: 4px;
          font-size: 13px;
          color: #666;
        }

        .featured-image-upload {
          border: 2px dashed #e1e4e8;
          border-radius: 12px;
          overflow: hidden;
        }

        .upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-area:hover {
          background: #f8f9fa;
          border-color: #0066ff;
        }

        .upload-area svg {
          color: #999;
          margin-bottom: 16px;
        }

        .upload-area p {
          margin: 0 0 8px 0;
          color: #333;
          font-weight: 500;
        }

        .upload-area span {
          font-size: 13px;
          color: #666;
        }

        .image-preview {
          position: relative;
          display: inline-block;
        }

        .image-preview img {
          display: block;
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
        }

        .remove-image {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .remove-image:hover {
          background: #dc3545;
          transform: scale(1.1);
        }

        .editor-toolbar {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px;
          border: 1px solid #e1e4e8;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          background: #f8f9fa;
          flex-wrap: wrap;
        }

        .editor-toolbar button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .editor-toolbar button:hover {
          background: #0066ff;
          border-color: #0066ff;
          color: white;
        }

        .toolbar-separator {
          width: 1px;
          height: 24px;
          background: #e1e4e8;
          margin: 0 4px;
        }

        .content-editor {
          min-height: 400px;
          padding: 20px;
          border: 1px solid #e1e4e8;
          border-radius: 0 0 8px 8px;
          font-size: 15px;
          line-height: 1.8;
        }

        .content-editor:focus {
          outline: none;
          border-color: #0066ff;
        }

        .content-editor:empty:before {
          content: attr(data-placeholder);
          color: #999;
          pointer-events: none;
        }

        .preview-content {
          min-height: 400px;
          padding: 20px;
          border: 1px solid #e1e4e8;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .category-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .category-tag {
          padding: 8px 16px;
          border: 2px solid;
          border-radius: 20px;
          background: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-tag.selected {
          color: white;
        }

        .category-tag:not(.selected):hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tag-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: white;
          border: 1px solid #e1e4e8;
          border-radius: 16px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag-item.selected {
          background: #0066ff;
          border-color: #0066ff;
          color: white;
        }

        .tag-item:not(.selected):hover {
          border-color: #0066ff;
          color: #0066ff;
        }

        /* プロースのスタイル */
        .prose h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 32px 0 16px 0;
          color: #1a1a1a;
        }

        .prose h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 24px 0 12px 0;
          color: #1a1a1a;
        }

        .prose p {
          margin: 16px 0;
          line-height: 1.8;
        }

        .prose ul,
        .prose ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .prose li {
          margin: 8px 0;
        }

        .prose blockquote {
          border-left: 4px solid #0066ff;
          padding-left: 20px;
          margin: 24px 0;
          font-style: italic;
          color: #666;
        }

        .prose pre {
          background: #1a1a1a;
          color: #f8f8f2;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 24px 0;
        }

        .prose code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 14px;
        }

        .prose img {
          max-width: 100%;
          height: auto;
          margin: 24px 0;
          border-radius: 8px;
        }

        .prose a {
          color: #0066ff;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .prose a:hover {
          border-bottom-color: #0066ff;
        }

        @media (max-width: 768px) {
          .form-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .header-left,
          .header-right {
            justify-content: space-between;
          }

          .form-tabs {
            padding: 0 16px;
            gap: 16px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .tab-content {
            padding: 20px;
          }

          .editor-toolbar {
            padding: 8px;
          }

          .editor-toolbar button {
            width: 32px;
            height: 32px;
          }

          .content-editor {
            padding: 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}