import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useScrollTo } from "@/hooks/useScrollTo";

/* Brand palette (from logo.jpg)
   Navy  #203060  — dominant
   Royal #0050a0  — mid
   Sky   #60a0d0  — light accent
*/

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const { theme, toggleTheme }      = useTheme();
  const scrollTo                    = useScrollTo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "services",     label: "Services" },
    { id: "how-it-works", label: "How It Works" },
    { id: "about",        label: "About" },
    { id: "reviews",      label: "Reviews" },
    { id: "faq",          label: "FAQ" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled
          ? "bg-white dark:bg-[#0a0f1e] shadow-[0_1px_0_rgba(32,48,96,0.1)] dark:shadow-[0_1px_0_rgba(96,160,208,0.08)]"
          : "bg-white dark:bg-[#0a0f1e]"
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-[#203060] text-[#a8d6eb] text-[11.5px] font-medium py-2 px-4 text-center">
        Guaranteed 2-Hour Arrival Windows · Chicago Metro
        <span className="hidden md:inline">
          {" "}·{" "}
          <a
            href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
            className="text-white font-semibold hover:text-[#60a0d0] transition-colors"
          >
            {import.meta.env.VITE_CONTACT_PHONE_FORMATTED}
          </a>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}logo.jpg`}
              alt="AeroDuct logo"
              className="h-9 w-9 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-bold tracking-tight text-[#203060] dark:text-white">
                Aero<span className="text-[#0050a0] dark:text-[#60a0d0]">Duct</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 mt-0.5">
                HVAC Sanitization
              </span>
            </div>
          </Link>

          {/* Desktop nav — each link calls scrollTo with its section id */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={(e) => scrollTo(link.id, e)}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#203060] dark:hover:text-white rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "☀" : "☽"}
            </button>

            <a
              href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-[#0050a0] dark:hover:text-[#60a0d0] transition-colors"
            >
              {import.meta.env.VITE_CONTACT_PHONE_FORMATTED}
            </a>

            <Link
              to="/pricing"
              className="px-4 py-2 text-[13px] font-medium text-[#203060] dark:text-slate-300 border border-[#203060]/20 dark:border-slate-700 hover:border-[#203060]/40 rounded-md transition-colors"
            >
              Pricing
            </Link>

            <Link
              to="/quote"
              className="px-4 py-2 text-[13px] font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors shadow-sm"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors text-sm"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "☀" : "☽"}
            </button>
            <Link
              to="/quote"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#203060] rounded-md"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-500"
              aria-label="Toggle menu"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden bg-white dark:bg-[#0a0f1e] border-t border-slate-100 dark:border-slate-800 px-4 py-4">
          <nav className="space-y-0.5 mb-4">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={(e) => { scrollTo(link.id, e); setMobileOpen(false); }}
                className="w-full text-left block px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/pricing"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#203060] dark:text-slate-300 border border-[#203060]/20 dark:border-slate-700 rounded-md"
            >
              View Pricing
            </Link>
            <Link
              to="/quote"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
