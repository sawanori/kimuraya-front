'use client'

import React, { useEffect, useState } from 'react'

export default function TestTagsPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [tagSummary, setTagSummary] = useState<any>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kimuraya_news_articles')
      if (stored) {
        const parsedArticles = JSON.parse(stored)
        setArticles(parsedArticles)
        
        // タグごとの記事数を集計
        const summary: any = {}
        parsedArticles.forEach((article: any) => {
          if (article.tags && Array.isArray(article.tags)) {
            article.tags.forEach((tag: any) => {
              const key = `${tag.slug} (${tag.name})`
              if (!summary[key]) {
                summary[key] = {
                  count: 0,
                  articles: []
                }
              }
              summary[key].count++
              summary[key].articles.push(article.title)
            })
          }
        })
        setTagSummary(summary)
      }
    }
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>タグテストページ</h1>
      
      <h2>記事一覧（{articles.length}件）</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>記事タイトル</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>ステータス</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>タグ</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{article.title}</td>
              <td style={{ padding: '10px' }}>{article.status}</td>
              <td style={{ padding: '10px' }}>
                {article.tags && article.tags.length > 0 ? (
                  article.tags.map((tag: any) => (
                    <span key={tag.id} style={{ 
                      display: 'inline-block', 
                      margin: '2px', 
                      padding: '2px 8px', 
                      background: '#e0e0e0', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {tag.name} ({tag.slug})
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#999' }}>タグなし</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>タグ別集計</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>タグ</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>記事数</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>記事タイトル</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tagSummary).map(([tag, data]: [string, any]) => (
            <tr key={tag} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{tag}</td>
              <td style={{ padding: '10px' }}>{data.count}</td>
              <td style={{ padding: '10px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {data.articles.map((title: string, index: number) => (
                    <li key={index}>{title}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>タグページへのリンク</h2>
      <div>
        <a href="/news/tag/new-product" style={{ display: 'block', margin: '5px 0' }}>→ 新商品タグページ</a>
        <a href="/news/tag/limited" style={{ display: 'block', margin: '5px 0' }}>→ 限定タグページ</a>
        <a href="/news/tag/collaboration" style={{ display: 'block', margin: '5px 0' }}>→ コラボタグページ</a>
        <a href="/news/tag/special-offer" style={{ display: 'block', margin: '5px 0' }}>→ お得情報タグページ</a>
        <a href="/news/tag/anniversary" style={{ display: 'block', margin: '5px 0' }}>→ 記念タグページ</a>
        <a href="/news/tag/sns" style={{ display: 'block', margin: '5px 0' }}>→ SNSタグページ</a>
        <a href="/news/tag/seasonal" style={{ display: 'block', margin: '5px 0' }}>→ 季節タグページ</a>
      </div>
    </div>
  )
}