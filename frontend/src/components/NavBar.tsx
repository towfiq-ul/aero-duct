import { Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span>Guaranteed 2-Hour Arrival Windows in Chicago, IL</span>
        <span className="hidden md:inline text-slate-500">|</span>
        <a
          href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
          className="hidden md:inline-flex items-center gap-1 text-white hover:text-blue-300 font-semibold transition-colors"
        >
          📞 {import.meta.env.VITE_CONTACT_PHONE_FORMATTED}
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with airflow icon */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src="/logo.jpg" 
              alt="AeroDuct Icon" 
              className="h-10 w-10 object-cover mix-blend-multiply rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Aero<span className="text-blue-600 dark:text-blue-400">Duct</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                HVAC Sanitization
              </span>
            </div>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              href="/#services"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Services
            </a>
            <a
              href="/#reviews"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Reviews
            </a>
            <a
              href="/#faq"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              FAQ
            </a>
            <a
              href="/#contact"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a
              href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden lg:inline-flex items-center gap-1.5"
            >
              <span>Questions?</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{import.meta.env.VITE_CONTACT_PHONE_FORMATTED}</span>
            </a>
            <Link
              to="/quote"
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm hover:shadow-glow-blue hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-95"
            >
              <span>Request a Quote →</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button 
              onClick={toggleTheme} 
              className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link
              to="/quote"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-sm"
            >
              Get a Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <a
            href="/#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Services
          </a>
          <a
            href="/#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Reviews
          </a>
          <a
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50"
          >
            FAQ
          </a>
          <a
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Contact
          </a>
          <div className="pt-2">
            <Link
              to="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
