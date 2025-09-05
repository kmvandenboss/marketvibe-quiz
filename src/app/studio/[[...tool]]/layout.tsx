// src/app/studio/[[...tool]]/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketVibe CMS Studio',
  description: 'Content management system for MarketVibe',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}