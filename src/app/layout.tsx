import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import TaboolaPixel from "@/components/TaboolaPixel";
import TwitterPixel from "@/components/TwitterPixel";

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
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s, p, i, c, e) {
                s[e] = s[e] || function() { (s[e].a = s[e].a || []).push(arguments); };
                s[e].l = 1 * new Date();
                var t = new Date().getTime();
                var k = c.createElement("script"), a = c.getElementsByTagName("script")[0];
                k.async = 1, k.src = p + "?request_id=" + i + "&t=" + t, a.parentNode.insertBefore(k, a);
                s.pixelClientId = i;
              })(window, "https://main.dashboard.datashopper.com/script", "marketvibe", document, "script");
            `
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <MetaPixel />
        <TaboolaPixel />
        <TwitterPixel />
        {children}
      </body>
    </html>
  );
}
