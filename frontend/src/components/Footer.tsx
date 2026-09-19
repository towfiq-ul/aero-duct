import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 mt-28 transition-colors duration-200">
      {/* Pre-footer trust highlights */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/60 py-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2 grayscale opacity-80">🛡️</span>
              <span className="text-slate-900 dark:text-white font-bold text-sm tracking-wide">NADCA Certified</span>
              <span className="text-xs text-slate-500 mt-0.5">Member #78294</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2 grayscale opacity-80">⏱️</span>
              <span className="text-slate-900 dark:text-white font-bold text-sm tracking-wide">2-Hour Arrival</span>
              <span className="text-xs text-slate-500 mt-0.5">Guaranteed or $50 Credit</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2 grayscale opacity-80">💵</span>
              <span className="text-slate-900 dark:text-white font-bold text-sm tracking-wide">Flat-Rate Guarantee</span>
              <span className="text-xs text-slate-500 mt-0.5">Zero Hidden Surcharges</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 inline-flex group">
              <img 
                src="/logo.jpg" 
                alt="AeroDuct Icon" 
                className="h-10 w-10 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                Aero<span className="text-blue-600 dark:text-blue-500">Duct</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
              Hospital-grade indoor air quality restoration and HVAC ventilation decontamination.
              Serving residential Chicago single-family homes.
            </p>
            <div className="pt-4 flex flex-col gap-1.5 text-sm">
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white font-semibold">Emergency &amp; Dispatch Line:</strong>{" "}
                <a href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold">
                  {import.meta.env.VITE_CONTACT_PHONE_FORMATTED}
                </a>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Midwest Operations HQ:</span> {import.meta.env.VITE_CONTACT_ADDRESS}
              </p>
              <p className="text-xs text-slate-400">7 Days a Week: 7:00 AM – 8:00 PM CST</p>
            </div>
          </div>

          {/* Markets & Coverage */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Service Areas
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li className="text-slate-800 dark:text-slate-300 font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Chicago Metro (IL)
              </li>
              {["Chicago City", "Naperville", "Evanston", "Schaumburg", "Oak Park", "Arlington Heights"].map((city) => (
                <li key={city}>
                  <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Flat-Rate Calculator
                </Link>
              </li>
              <li>
                <a href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`} className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Call to Schedule
                </a>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  NADCA 4-Step Process
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Customer FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} AeroDuct Technologies, Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Illinois HVAC License #058-2941</span>
            <span>·</span>
            <span>EPA Registration #92841-IL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
