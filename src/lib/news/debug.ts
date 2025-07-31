// デバッグユーティリティ

export function debugArticles() {
  if (typeof window === 'undefined') return
  
  const articles = JSON.parse(localStorage.getItem('kimuraya_news_articles') || '[]')
  
  console.group('📰 記事デバッグ情報')
  console.log('記事総数:', articles.length)
  console.log('公開中の記事:', articles.filter((a: any) => a.status === 'published').length)
  console.log('下書きの記事:', articles.filter((a: any) => a.status === 'draft').length)
  console.log('非公開の記事:', articles.filter((a: any) => a.status === 'private').length)
  
  console.group('最新5件の記事')
  articles
    .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5)
    .forEach((article: any) => {
      console.log(`- [${article.status}] ${article.title} (ID: ${article.id}, Slug: ${article.slug})`)
    })
  console.groupEnd()
  
  console.log('ローカルストレージのキー:', Object.keys(localStorage).filter(k => k.includes('kimuraya')))
  console.groupEnd()
}

// グローバルに公開
if (typeof window !== 'undefined') {
  (window as any).debugArticles = debugArticles
}