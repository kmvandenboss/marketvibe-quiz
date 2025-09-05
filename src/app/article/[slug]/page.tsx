// src/app/article/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticleSlugs } from '@/lib/sanity';
import ArticleContent from './ArticleContent';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug: string) => ({
    slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} />;
}