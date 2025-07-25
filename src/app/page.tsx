import HomePage from './HomePage';
import { getPageContent } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const content = await getPageContent();
  
  return <HomePage content={content} />;
}
