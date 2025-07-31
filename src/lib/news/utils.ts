// 新着情報関連のユーティリティ関数

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}`;
}

export function calculateReadingTime(content: string): number {
  // 日本語の場合、1分間に約400文字読めると仮定
  const wordsPerMinute = 400;
  const textLength = content.replace(/<[^>]*>/g, '').length;
  return Math.ceil(textLength / wordsPerMinute);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => query.append(key, String(v)));
      } else {
        query.append(key, String(value));
      }
    }
  });
  
  return query.toString();
}

export function parseQueryString(queryString: string): Record<string, string | string[]> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string | string[]> = {};
  
  params.forEach((value, key) => {
    const values = params.getAll(key);
    result[key] = values.length > 1 ? values : value;
  });
  
  return result;
}

export function getArchiveMonths(articles: any[]): Array<{ year: number; month: number; count: number }> {
  const monthCounts = new Map<string, number>();
  
  articles.forEach(article => {
    const date = new Date(article.publishedAt);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
  });
  
  return Array.from(monthCounts.entries())
    .map(([key, count]) => {
      const [year, month] = key.split('-').map(Number);
      return { year, month, count };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
}