import React from 'react';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-sm text-gray-600 mb-6">Effective Date: January 29, 2025</p>
          
          <p className="mb-6">Welcome to MarketVibe.app. Your privacy is important to us. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our website and services. By accessing or using MarketVibe.app, you agree to the terms outlined in this Privacy Policy.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect the following types of information when you use our lead generation quiz:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Email Address:</strong> Collected when you complete the quiz.</li>
            <li><strong>Quiz Responses:</strong> Your answers to quiz questions and your resulting score.</li>
            <li><strong>User Interaction Data:</strong> We track which investment options you click on to learn more about.</li>
            <li><strong>Tracking Data:</strong> We use the Meta Conversion API and Meta pixel to collect site interaction data, which may include non-personally identifiable tracking information.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>To provide you with high-yield investment ideas based on your quiz responses.</li>
            <li>To send you emails with further details about your quiz results and future investment opportunities that match your preferences.</li>
            <li>To share your email address and relevant quiz data with our investment partner platforms so they can send additional information about their offerings.</li>
            <li>To analyze and improve our services, including tracking quiz performance and user engagement.</li>
            <li>To run targeted marketing campaigns through the Meta Conversion API and Meta pixel.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Share Your Information</h2>
          <p>We only share your data with:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Investment Partner Platforms</strong>: Your email and quiz-related data may be shared with our high-yield investment partners for the purpose of sending you investment opportunities that match your results.</li>
            <li><strong>Marketing and Analytics Services</strong>: We use Meta Conversion API and Meta pixel for tracking and marketing purposes.</li>
          </ul>
          <p className="mb-6"><strong>We do not sell or share your data with any other third parties.</strong> Our partners have agreed not to share your data with anyone else, but we are not responsible for enforcing their data policies.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Control & Data Deletion Requests</h2>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Opt-Out:</strong> You may unsubscribe from our emails or our partners' emails at any time using the unsubscribe link included in the emails.</li>
            <li><strong>Data Deletion:</strong> If you wish to have your personal data removed from our database, you can contact us through our <a href="/contact" className="text-blue-600 hover:underline">contact page</a>. We will delete your information upon request. However, we cannot control how partners handle your data once it has been shared with them.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p className="mb-6">We take appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no online platform can guarantee absolute security.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Updates to This Privacy Policy</h2>
          <p className="mb-6">We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of MarketVibe.app constitutes your acceptance of any changes.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Information</h2>
          <p className="mb-6">If you have any questions about this Privacy Policy or how your data is handled, please visit our <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}