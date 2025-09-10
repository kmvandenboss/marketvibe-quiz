// src/app/article/[slug]/ArticleContent.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';
import { portableTextComponents } from '@/components/sanity/PortableTextComponents';
import Footer from '@/components/Footer';

type ArticleContentProps = {
  article: any;
};

export default function ArticleContent({ article }: ArticleContentProps) {
  const publishedDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        {/* Header Section */}
        <div className="container max-w-5xl mx-auto px-6 py-4 md:py-8">
          <div className="flex justify-between items-center mb-12">
            <div className="w-[20%] max-w-[200px]">
              <Link href="/">
                <Image
                  src="/images/MarketVibe-logo.png"
                  alt="MarketVibe Logo"
                  width={748}
                  height={368}
                  className="w-full h-auto"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Article Content */}
          <article className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
                  {article.excerpt}
                </p>
              )}

              {publishedDate && (
                <div className="flex items-center text-gray-500 mb-10 text-base">
                  <time dateTime={article.publishedAt}>
                    Published on {publishedDate}
                  </time>
                  {article.estimatedReadingTime && (
                    <>
                      <span className="mx-3">•</span>
                      <span>{article.estimatedReadingTime} min read</span>
                    </>
                  )}
                </div>
              )}

              {/* Featured Image */}
              {article.featuredImage && (
                <div className="mb-12">
                  <Image
                    src={urlFor(article.featuredImage)
                      .width(1200)
                      .height(600)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={article.featuredImage.alt || article.title}
                    width={1200}
                    height={600}
                    className="rounded-lg w-full h-auto shadow-lg"
                    priority
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="article-content max-w-none">
              <PortableText
                value={article.content}
                components={portableTextComponents}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-12 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-6 sm:mb-0">
                  <p className="text-lg text-gray-600 mb-3">
                    Want to learn more about building wealth?
                  </p>
                  <Link 
                    href="/quiz" 
                    className="inline-flex items-center text-[rgb(50,205,50)] hover:text-[rgb(45,185,45)] hover:underline font-semibold text-lg transition-colors"
                  >
                    Take our investment quiz →
                  </Link>
                </div>
                
                <div className="flex space-x-6">
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-gray-800 transition-colors text-base font-medium"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}