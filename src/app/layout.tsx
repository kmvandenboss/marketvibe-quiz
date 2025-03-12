import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import TaboolaPixel from "@/components/TaboolaPixel";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MarketVibe Investment Quiz",
  description: "Find your ideal investment strategy",
  other: {
    'impact-site-verification': '806b7c6d-8093-4d0f-a5ea-ecb52b93580e'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <MetaPixel />
        <TaboolaPixel />
        {children}
      </body>
    </html>
  );
}
