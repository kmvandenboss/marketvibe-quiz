// src/components/TaboolaPixel.tsx
'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    _tfa: any[];
  }
}

export default function TaboolaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views
    if (window._tfa) {
      window._tfa.push({ notify: 'event', name: 'page_view', id: 1820605 });
    }
  }, [pathname]);

  return (
    <>
      <Script
        id="taboola-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window._tfa = window._tfa || [];
            window._tfa.push({notify: 'event', name: 'page_view', id: 1820605});
            !function (t, f, a, x) {
                   if (!document.getElementById(x)) {
                      t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f);
                   }
            }(document.createElement('script'),
            document.getElementsByTagName('script')[0],
            '//cdn.taboola.com/libtrc/unip/1820605/tfa.js',
            'tb_tfa_script');
          `,
        }}
      />
    </>
  );
}

// Helper functions to track Taboola events
export const trackTaboolaLeadSubmit = () => {
  if (typeof window !== 'undefined' && window._tfa) {
    window._tfa.push({ notify: 'event', name: 'lead_submit', id: 1820605 });
    console.log('Taboola lead_submit event tracked');
  }
};

export const trackTaboolaQualifiedLead = () => {
  if (typeof window !== 'undefined' && window._tfa) {
    window._tfa.push({ notify: 'event', name: 'qualified_lead', id: 1820605 });
    console.log('Taboola qualified_lead event tracked');
  }
};
