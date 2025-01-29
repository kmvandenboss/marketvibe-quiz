import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 mt-auto bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-600">© 2025 MarketVibe.app. All rights reserved.</p>
        </div>
        <nav className="flex gap-6">
          <Link 
            href="/privacy-policy" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/contact" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;