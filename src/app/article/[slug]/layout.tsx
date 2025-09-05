// src/app/article/[slug]/layout.tsx
import { Metadata } from 'next';
import { getArticleBySlug, urlFor } from '@/lib/sanity';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt || 'Read this article on MarketVibe';
  
  // Use SEO image if available, otherwise featured image, otherwise default
  const ogImage = article.seo?.ogImage 
    ? urlFor(article.seo.ogImage).width(1200).height(630).url()
    : article.featuredImage 
    ? urlFor(article.featuredImage).width(1200).height(630).url()
    : '/images/MarketVibe-logo.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.featuredImage?.alt || title,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !article.seo?.noIndex,
      follow: !article.seo?.noIndex,
    },
  };
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}