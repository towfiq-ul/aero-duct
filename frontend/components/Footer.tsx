import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-28">
      {/* Pre-footer trust highlights */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🛡️</span>
              <span className="text-white font-bold text-sm">NADCA Certified</span>
              <span className="text-xs text-slate-500">Member #78294</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">⏱️</span>
              <span className="text-white font-bold text-sm">2-Hour Arrival</span>
              <span className="text-xs text-slate-500">Guaranteed or $50 Credit</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">📱</span>
              <span className="text-white font-bold text-sm">Digital Passport™</span>
              <span className="text-xs text-slate-500">Borescope Video &amp; Lab Data</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">💵</span>
              <span className="text-white font-bold text-sm">Flat-Rate Guarantee</span>
              <span className="text-xs text-slate-500">Zero Hidden Surcharges</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                  <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                  <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Aero<span className="text-blue-500">Duct</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Hospital-grade indoor air quality restoration and HVAC ventilation decontamination.
              Serving residential Chicago single-family homes and commercial industrial spaces across India.
            </p>
            <div className="pt-2 flex flex-col gap-1 text-sm">
              <p className="text-slate-300">
                <strong className="text-white">Emergency &amp; Dispatch Line:</strong>{" "}
                <a href="tel:3128473828" className="text-blue-400 hover:text-blue-300 font-semibold">
                  (312) 847-DUCT
                </a>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-slate-300 font-medium">Midwest Operations HQ:</span> 7-33 N Roselle Rd, Schaumburg, IL 60194
              </p>
              <p className="text-xs text-slate-500">7 Days a Week: 7:00 AM – 8:00 PM CST</p>
            </div>
          </div>

          {/* Markets & Coverage */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Service Areas
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-300 font-semibold text-xs uppercase tracking-wider text-blue-400">
                Chicago Metro (IL)
              </li>
              {["Chicago City", "Naperville", "Evanston", "Schaumburg", "Oak Park", "Arlington Heights"].map((city) => (
                <li key={city}>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* India Commercial */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              India Commercial
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-300 font-semibold text-xs uppercase tracking-wider text-amber-400">
                Major Hubs
              </li>
              {["Delhi NCR / Gurugram", "Mumbai & Navi Mumbai", "Bengaluru Tech Parks", "Hyderabad HITEC City"].map((hub) => (
                <li key={hub}>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    {hub}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <span className="text-xs text-slate-500 block">FSSAI &amp; Fire Safety Audits</span>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Flat-Rate Calculator
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition-colors">
                  Book Service (90s)
                </Link>
              </li>
              <li>
                <Link href="/passport/PASS-2026-0842" className="hover:text-white transition-colors">
                  Digital Health Passport™
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  NADCA 4-Step Process
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Customer FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AeroDuct Technologies, Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Illinois HVAC License #058-2941</span>
            <span>·</span>
            <span>EPA Registration #92841-IL</span>
            <span>·</span>
            <span>ISHRAE Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
