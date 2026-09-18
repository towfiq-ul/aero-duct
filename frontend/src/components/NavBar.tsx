import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Dispatch
        </span>
        <span className="text-slate-500">|</span>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Aero<span className="text-blue-600">Duct</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                HVAC Sanitization
              </span>
            </div>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/pricing"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Plans &amp; Pricing
            </Link>
            <Link
              to="/#how-it-works"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/#faq"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors hidden lg:inline-flex items-center gap-1.5"
            >
              <span>Questions?</span>
              <span className="text-blue-600 font-bold">{import.meta.env.VITE_CONTACT_PHONE_FORMATTED}</span>
            </a>
            <a
              href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm hover:shadow-glow-blue hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-95"
            >
              <span>Call Now →</span>
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-sm"
            >
              Call Now
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200"
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
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Plans &amp; Pricing
          </Link>
          <Link
            to="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50"
          >
            How It Works
          </Link>
          <Link
            to="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50"
          >
            FAQ
          </Link>
          <div className="pt-2">
            <a
              href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl"
            >
              Call Service Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
