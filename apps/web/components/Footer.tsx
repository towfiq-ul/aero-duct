import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-1">
            <span className="text-base font-semibold text-gray-900">
              Aero<span className="text-blue-600">Duct</span>
            </span>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Professional duct cleaning for residential Chicago and commercial India.
              Licensed, insured, and NADCA-certified.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              {[
                { label: "About", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Press", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Services
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Residential Chicago", href: "/pricing" },
                { label: "Commercial India", href: "/pricing" },
                { label: "Enterprise AMC", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Cookie Policy", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} AeroDuct, Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Licensed &amp; Insured in Illinois · ISHRAE-compliant across India
          </p>
        </div>
      </div>
    </footer>
  );
}
