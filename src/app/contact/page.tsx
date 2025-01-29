'use client';

import React, { useEffect } from 'react';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    jotformEmbedHandler?: (iframe: string, baseURL: string) => void;
  }
}

export default function Contact() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.jotformEmbedHandler) {
        window.jotformEmbedHandler(
          "iframe[id='JotFormIFrame-250286134861154']",
          "https://form.jotform.com/"
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
        <div className="mb-8">
          <p className="text-gray-600">Have questions or need assistance? Fill out the form below and we'll get back to you as soon as possible.</p>
        </div>
        <div className="w-full">
          <iframe
            id="JotFormIFrame-250286134861154"
            title="Contact Form"
            src="https://form.jotform.com/250286134861154"
            style={{
              minWidth: '100%',
              maxWidth: '100%',
              height: '539px',
              border: 'none'
            }}
            scrolling="no"
            allow="geolocation; microphone; camera; fullscreen"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}