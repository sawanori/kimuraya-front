'use client'

import React from 'react'

interface ClientSortSelectProps {
  value: 'newest' | 'oldest' | 'popularity';
  onChange: (value: 'newest' | 'oldest' | 'popularity') => void;
}

export default function ClientSortSelect({ value, onChange }: ClientSortSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as 'newest' | 'oldest' | 'popularity');
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="news-sort-select"
    >
      <option value="newest">新着順</option>
      <option value="oldest">古い順</option>
      <option value="popularity">人気順</option>
    </select>
  );
}