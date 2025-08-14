'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/news'
import { formatDate } from '@/lib/news/utils'

interface ArticleCardProps {
  article: Article;
  layout?: 'grid' | 'list';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showReadingTime?: boolean;
}

export default function ArticleCard({
  article,
  layout = 'grid',
  showExcerpt = true,
  showAuthor = true,
  showCategories = true,
  showTags: _showTags = false,
  showReadingTime = true
}: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt);
  const updatedDate = article.updatedAt ? new Date(article.updatedAt) : null;

  if (layout === 'list') {
    return (
      <article className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0">
          <Image
            src={article.featuredImage || '/images/DSC00442.jpg'}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 192px"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm text-gray-600">
            <time dateTime={publishedDate.toISOString()}>
              {formatDate(publishedDate)}
            </time>
            {updatedDate && updatedDate > publishedDate && (
              <>
                <span>•</span>
                <span>更新: {formatDate(updatedDate)}</span>
              </>
            )}
            {showReadingTime && article.readingTime && (
              <>
                <span>•</span>
                <span>{article.readingTime}分で読めます</span>
              </>
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
            <Link href={`/news/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          
          {showExcerpt && (
            <p className="text-gray-700 mb-3 line-clamp-2">{article.excerpt}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-3">
            {showCategories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.categories.map(category => (
                  <Link
                    key={category.id}
                    href={`/news/category/${category.slug}`}
                    className="inline-block px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                    style={{ backgroundColor: category.color || undefined }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
            
            {showAuthor && (
              <div className="flex items-center gap-2">
                {article.author.avatar && (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">{article.author.name}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Grid layout
  return (
    <Link href={`/news/${article.slug}`} className="block">
      <article className="news-card">
        <div className="news-card-image">
          <Image
            src={article.featuredImage || '/images/DSC00442.jpg'}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        
        <div className="news-card-content">
          <div className="news-card-meta">
            <time className="news-card-date" dateTime={publishedDate.toISOString()}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM8 14.4C4.4654 14.4 1.6 11.5346 1.6 8C1.6 4.4654 4.4654 1.6 8 1.6C11.5346 1.6 14.4 4.4654 14.4 8C14.4 11.5346 11.5346 14.4 8 14.4Z" fill="currentColor" opacity="0.5"/>
                <path d="M8.8 4H7.2V8.4L10.8 10.6L11.6 9.32L8.8 7.6V4Z" fill="currentColor" opacity="0.5"/>
              </svg>
              {formatDate(publishedDate)}
            </time>
            {showCategories && article.categories.length > 0 && (
              <span
                className="news-card-category"
                style={{ backgroundColor: article.categories[0].color || undefined }}
              >
                {article.categories[0].name}
              </span>
            )}
          </div>
          
          <h3 className="news-card-title">
            {article.title}
          </h3>
          
          {showExcerpt && (
            <p className="news-card-excerpt">{article.excerpt}</p>
          )}
          
          <div className="news-card-footer">
            {showAuthor && (
              <div className="news-card-author">
                {article.author.avatar && (
                  <div className="news-card-author-avatar">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                )}
                <span className="news-card-author-name">{article.author.name}</span>
              </div>
            )}
            
            <span className="news-card-read-more">
              読む
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.33301 2.66666L10.6663 8L5.33301 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}