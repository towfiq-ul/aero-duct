import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0a0f1e] border-t border-slate-200 dark:border-slate-800">
      {/* Trust strip */}
      <div className="border-b border-slate-100 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            {[
              { icon: "🛡️", title: "NADCA Certified", sub: "Member #78294" },
              { icon: "⏱️", title: "2-Hour Arrival",  sub: "Guaranteed or $50 Credit" },
              { icon: "💵", title: "Flat-Rate Pricing", sub: "Zero Hidden Surcharges" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-4 px-8 py-7">
                <span className="text-2xl grayscale opacity-60">{b.icon}</span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{b.title}</p>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand col */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.jpg" alt="AeroDuct" className="h-9 w-9 object-contain" />
              <span className="text-[18px] font-bold tracking-tight text-[#203060] dark:text-white">
                Aero<span className="text-[#0050a0] dark:text-[#60a0d0]">Duct</span>
              </span>
            </Link>

            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Hospital-grade indoor air quality restoration and HVAC ventilation decontamination. Serving residential Chicago homes and commercial facilities.
            </p>

            <div className="pt-1 space-y-1.5 text-[13px]">
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Emergency & Dispatch:</span>{" "}
                <a
                  href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
                  className="text-[#0050a0] dark:text-[#60a0d0] font-semibold hover:underline underline-offset-2"
                >
                  {import.meta.env.VITE_CONTACT_PHONE_FORMATTED}
                </a>
              </p>
              <p className="text-[12px] text-slate-400">
                {import.meta.env.VITE_CONTACT_ADDRESS}
              </p>
              <p className="text-[11.5px] text-slate-400">7 Days a Week · 7:00 AM – 8:00 PM CST</p>
            </div>
          </div>

          {/* Service Areas */}
          <div className="md:col-span-3">
            <h3 className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-4">
              Service Areas
            </h3>
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#0050a0] dark:text-[#60a0d0] mb-3">
              Chicago Metro (IL)
            </p>
            <ul className="space-y-2">
              {["Chicago City", "Naperville", "Evanston", "Schaumburg", "Oak Park", "Arlington Heights"].map((city) => (
                <li key={city}>
                  <Link
                    to="/pricing"
                    className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-[#203060] dark:hover:text-white transition-colors"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links + CTA */}
          <div className="md:col-span-4">
            <h3 className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 mb-7">
              {[
                { to: "/pricing",       label: "Flat-Rate Calculator" },
                { to: "/#how-it-works", label: "NADCA 4-Step Process" },
                { to: "/#faq",          label: "Customer FAQ" },
                { to: "/#reviews",      label: "Google Reviews" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-[#203060] dark:hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Inline CTA */}
            <div className="border border-[#203060]/15 dark:border-[#60a0d0]/10 rounded-lg p-4 bg-slate-50 dark:bg-[#0d1225]">
              <p className="text-[12.5px] font-semibold text-slate-800 dark:text-white mb-1">Ready to schedule?</p>
              <p className="text-[11.5px] text-slate-400 mb-3 leading-relaxed">
                Instant flat-rate quote in under 60 seconds.
              </p>
              <Link
                to="/quote"
                className="inline-flex items-center px-4 py-2 text-[12px] font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors"
              >
                Get a Quote →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-[11.5px] text-slate-400">
            © {year} AeroDuct Technologies, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Illinois HVAC License #058-2941</span>
            <span className="text-slate-200 dark:text-slate-700">·</span>
            <span>EPA Registration #92841-IL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
