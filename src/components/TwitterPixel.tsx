// src/components/TwitterPixel.tsx
'use client';

import Script from 'next/script';

declare global {
  interface Window {
    twq: any;
  }
}

export default function TwitterPixel() {
  return (
    <>
      <Script
        id="twitter-base-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','on50n');
          `,
        }}
      />
    </>
  );
}

// Helper function to track Twitter lead conversions
export const trackTwitterLeadSubmit = () => {
  if (typeof window !== 'undefined' && window.twq) {
    window.twq('event', 'tw-on50n-pav9j', {
      value: 5.00, // $5 USD value per lead
      currency: 'USD' // USD currency
    });
    console.log('Twitter lead conversion event tracked');
  }
};
