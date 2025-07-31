'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface SortSelectProps {
  currentSort: string;
  searchParams: { [key: string]: string | string[] | undefined };
  basePath?: string;
}

export default function NewsSortSelect({ currentSort, searchParams, basePath = '/news' }: SortSelectProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    
    // 既存のパラメータを保持
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'sort' && value) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });
    
    // 新しいソート値を設定
    if (e.target.value !== 'newest') {
      params.set('sort', e.target.value);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;
    router.push(url);
  };

  return (
    <select
      value={currentSort}
      onChange={handleSortChange}
      className="news-sort-select"
    >
      <option value="newest">新着順</option>
      <option value="oldest">古い順</option>
      <option value="popularity">人気順</option>
      <option value="alphabetical">タイトル順</option>
    </select>
  );
}