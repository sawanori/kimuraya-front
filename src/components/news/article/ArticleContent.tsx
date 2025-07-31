'use client'

import React from 'react'
import Image from 'next/image'
import { Article } from '@/types/news'
import { formatDate } from '@/lib/news/utils'
import Link from 'next/link'

interface ArticleContentProps {
  article: Article;
  showAuthorBio?: boolean;
}

export default function ArticleContent({ article, showAuthorBio = true }: ArticleContentProps) {
  const publishedDate = new Date(article.publishedAt);
  const updatedDate = article.updatedAt ? new Date(article.updatedAt) : null;

  return (
    <article className="max-w-4xl mx-auto">
      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        {/* メタ情報 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <time dateTime={publishedDate.toISOString()}>
            公開日: {formatDate(publishedDate)}
          </time>
          {updatedDate && updatedDate > publishedDate && (
            <time dateTime={updatedDate.toISOString()}>
              更新日: {formatDate(updatedDate)}
            </time>
          )}
          {article.readingTime && (
            <span>{article.readingTime}分で読めます</span>
          )}
        </div>

        {/* カテゴリーとタグ */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.categories.map(category => (
            <Link
              key={category.id}
              href={`/news/category/${category.slug}`}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white rounded-full hover:opacity-90 transition-opacity"
              style={{ backgroundColor: category.color || '#3B82F6' }}
            >
              {category.name}
            </Link>
          ))}
          {article.tags.map(tag => (
            <Link
              key={tag.id}
              href={`/news/tag/${tag.slug}`}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </header>

      {/* アイキャッチ画像 */}
      {article.featuredImage && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      {/* 記事本文 */}
      <div 
        className="prose prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* 著者情報 */}
      {showAuthorBio && (
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="flex items-start gap-4">
            {article.author.avatar && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {article.author.name}
              </h3>
              {article.author.bio && (
                <p className="text-gray-600 text-sm mb-2">{article.author.bio}</p>
              )}
              {article.author.socialLinks && (
                <div className="flex gap-3">
                  {article.author.socialLinks.twitter && (
                    <a
                      href={article.author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                  {article.author.socialLinks.facebook && (
                    <a
                      href={article.author.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}