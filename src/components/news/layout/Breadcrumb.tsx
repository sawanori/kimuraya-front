'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  current?: string;
}

export default function Breadcrumb({ items, current }: BreadcrumbProps) {
  const pathname = usePathname();

  // 自動的にパスからパンくずを生成
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'ホーム', href: '/' }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      if (path === 'news') {
        breadcrumbs.push({ name: '新着情報', href: '/news' });
      } else if (path === 'category' && paths[index + 1]) {
        // カテゴリー名の変換
        const categoryNames: Record<string, string> = {
          'announcement': 'お知らせ',
          'event': 'イベント',
          'media': 'メディア掲載',
        };
        const categorySlug = paths[index + 1];
        breadcrumbs.push({
          name: categoryNames[categorySlug] || categorySlug,
          href: currentPath + '/' + categorySlug
        });
      } else if (path === 'tag' && paths[index + 1]) {
        breadcrumbs.push({
          name: `タグ: ${paths[index + 1]}`,
          href: currentPath + '/' + paths[index + 1]
        });
      } else if (path === 'search') {
        breadcrumbs.push({ name: '検索結果' });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // 構造化データ用のJSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.href ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${item.href}` : undefined
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="news-breadcrumb">
        <div className="container">
          <ol className="news-breadcrumb-list">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="news-breadcrumb-item">
                {index > 0 && (
                  <span className="news-breadcrumb-separator">/</span>
                )}
                {item.href && index < breadcrumbItems.length - 1 ? (
                  <Link
                    href={item.href}
                    className="news-breadcrumb-link"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="news-breadcrumb-current">
                    {current || item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}