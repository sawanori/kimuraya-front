import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NewsOnlyHeader from '@/components/news/layout/NewsOnlyHeader'
import NewsFooter from '@/components/news/layout/Footer'
import Breadcrumb from '@/components/news/layout/Breadcrumb'
import ArticleCard from '@/components/news/article/ArticleCard'
import Pagination from '@/components/news/navigation/Pagination'
import NewsSortSelect from '@/components/news/filtering/SortSelect'
import { fetchArticles, fetchCategories } from '@/lib/news/api'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await fetchCategories();
  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    return {
      title: 'カテゴリーが見つかりません | 木村屋本店',
    };
  }

  return {
    title: `${category.name}の記事一覧 | 木村屋本店`,
    description: `${category.description || `${category.name}に関する最新の記事をご覧いただけます。`}`,
    openGraph: {
      title: `${category.name}の記事一覧 | 木村屋本店`,
      description: category.description || `${category.name}に関する最新の記事をご覧いただけます。`,
      type: 'website',
      url: `/news/category/${category.slug}`,
    }
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const page = typeof searchParamsResolved.page === 'string' ? parseInt(searchParamsResolved.page) : 1;
  const sort = typeof searchParamsResolved.sort === 'string' ? searchParamsResolved.sort as any : 'newest';

  const [categories, articlesResponse] = await Promise.all([
    fetchCategories(),
    fetchArticles({ category: slug, page, sort, limit: 9 })
  ]);

  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    notFound();
  }

  const { articles, pagination } = articlesResponse;

  return (
    <div className="news-main">
      <NewsOnlyHeader />
      
      <main>
        <Breadcrumb />
        <div className="container news-content-section">
          {/* カテゴリー情報 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-flex items-center px-4 py-2 text-white rounded-full text-lg font-semibold"
                style={{ backgroundColor: category.color || '#3B82F6' }}
              >
                {category.name}
              </span>
            </div>
            {category.description && (
              <p className="text-gray-600">{category.description}</p>
            )}
          </div>

          {/* ソートオプション */}
          <div className="mb-6 flex justify-end">
            <NewsSortSelect 
              currentSort={sort} 
              searchParams={searchParamsResolved} 
              basePath={`/news/category/${category.slug}`} 
            />
          </div>

          {/* 記事一覧 */}
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    layout="grid"
                  />
                ))}
              </div>
              
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                basePath={`/news/category/${category.slug}`}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">このカテゴリーの記事はまだありません。</p>
            </div>
          )}
        </div>
      </main>
      
      <NewsFooter />
    </div>
  );
}