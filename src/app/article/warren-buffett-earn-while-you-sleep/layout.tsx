// src/app/article/warren-buffett-earn-while-you-sleep/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Warren Buffett Says You Need To 'Find A Way To Make Money While You Sleep' Or You'll Work Until You Die",
  description: "Learn how to build passive income streams and make your money work for you 24/7 with high-yield investment strategies used by the wealthy.",
  openGraph: {
    title: "Warren Buffett Says You Need To 'Find A Way To Make Money While You Sleep' Or You'll Work Until You Die",
    description: "Learn how to build passive income streams and make your money work for you 24/7 with high-yield investment strategies used by the wealthy.",
    images: [
      {
        url: '/images/buffett-dividends.png',
        width: 746,
        height: 412,
        alt: 'Warren Buffett passive income strategies',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Warren Buffett Says You Need To 'Find A Way To Make Money While You Sleep' Or You'll Work Until You Die",
    description: "Learn how to build passive income streams and make your money work for you 24/7 with high-yield investment strategies used by the wealthy.",
    images: ['/images/buffett-dividends.png'],
  },
};

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}