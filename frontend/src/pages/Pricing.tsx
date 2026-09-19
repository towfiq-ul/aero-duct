import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { SERVICE_AREAS, SERVICES, FAQ_LIST } from "@/lib/mockData";

export default function Pricing() {
  const [activeArea, setActiveArea] = useState<string>("chicago");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(["res-air-duct"]));
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleService = (id: string) => {
    const next = new Set(selectedServices);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedServices(next);
  };

  const selectedAreaObj = SERVICE_AREAS.find((a) => a.id === activeArea) || SERVICE_AREAS[0];

  // Calculate pricing
  const [subtotal, setSubtotal] = useState(0);
  const [hasCustomQuote, setHasCustomQuote] = useState(false);

  useEffect(() => {
    let total = 0;
    let custom = false;
    selectedServices.forEach((id) => {
      const svc = SERVICES.find((s) => s.id === id);
      if (svc) {
        // Extract number from price string (e.g. "$299" -> 299)
        const match = svc.price.match(/\d+/);
        if (match) {
          total += parseInt(match[0], 10);
        } else {
          custom = true;
        }
      }
    });
    setSubtotal(total * selectedAreaObj.feeMultiplier);
    setHasCustomQuote(custom);
  }, [selectedServices, activeArea, selectedAreaObj]);

  const tax = subtotal * 0.08; // Flat 8% tax for IL
  const total = subtotal + tax;

  const resServices = SERVICES.filter(s => s.category === 'residential');
  const comServices = SERVICES.filter(s => s.category === 'commercial');
  const packages = SERVICES.filter(s => s.category === 'package');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      <NavBar />

      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 pt-20 pb-16 px-4 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Transparent, Flat-Rate Pricing
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Build your custom cleaning package. Our interactive calculator adjusts pricing based on your service area. No hidden fees.
          </p>
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Services List */}
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white dark:bg-[#0d1225] rounded-lg border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Select Service Area</h2>
              <select 
                value={activeArea}
                onChange={(e) => setActiveArea(e.target.value)}
                className="w-full sm:w-64 px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
              >
                {SERVICE_AREAS.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-[#0d1225] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Residential Services</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {resServices.map((svc) => (
                  <label key={svc.id} className="flex items-start gap-4 p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group">
                    <div className="pt-1">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedServices.has(svc.id) ? 'bg-[#203060] border-[#203060]' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-[#0050a0] dark:group-hover:border-[#60a0d0]'}`}>
                        {selectedServices.has(svc.id) && <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                      </div>
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={selectedServices.has(svc.id)}
                        onChange={() => toggleService(svc.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{svc.name}</h3>
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-700 dark:text-slate-300">{svc.price}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{svc.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#0d1225] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Commercial Services</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {comServices.map((svc) => (
                  <label key={svc.id} className="flex items-start gap-4 p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group">
                    <div className="pt-1">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedServices.has(svc.id) ? 'bg-[#203060] border-[#203060]' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-[#0050a0] dark:group-hover:border-[#60a0d0]'}`}>
                        {selectedServices.has(svc.id) && <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                      </div>
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={selectedServices.has(svc.id)}
                        onChange={() => toggleService(svc.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{svc.name}</h3>
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-700 dark:text-slate-300">{svc.price}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{svc.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#0d1225] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Service Packages</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {packages.map((svc) => (
                  <label key={svc.id} className="flex items-start gap-4 p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group">
                    <div className="pt-1">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedServices.has(svc.id) ? 'bg-amber-500 border-amber-500' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-amber-400 dark:group-hover:border-amber-400'}`}>
                        {selectedServices.has(svc.id) && <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                      </div>
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={selectedServices.has(svc.id)}
                        onChange={() => toggleService(svc.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{svc.name}</h3>
                        <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-semibold text-amber-800 dark:text-amber-400">{svc.price}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{svc.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Checkout Sticky Card */}
          <div className="w-full lg:w-1/3 sticky top-24">
            <div className="bg-white dark:bg-[#0d1225] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-none overflow-hidden">
              <div className="bg-[#203060] p-6 text-center border-b border-[#0050a0]/30">
                <span className="text-sm font-bold tracking-widest uppercase text-emerald-400">Total Estimate</span>
                <div className="text-white mt-1 font-medium">
                  {selectedAreaObj.name}
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                {selectedServices.size === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 font-medium">
                    Select a service to see pricing.
                  </div>
                ) : (
                  <>
                    <PriceBreakdown
                      subtotal={subtotal}
                      tax={tax}
                      total={total}
                      taxLabel="IL State Tax (8%)"
                      currency="USD"
                      locale="en-US"
                    />
                    
                    {hasCustomQuote && (
                      <div className="mt-4 p-4 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium text-center">
                          One or more selected services require a custom quote. The total shown is a partial estimate.
                        </p>
                      </div>
                    )}

                    <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">Secure your appointment today</p>
                      <div className="flex flex-col gap-3">
                        <button className="w-full flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#4B45D6] text-white font-semibold py-3 px-4 rounded-md shadow-md transition-colors">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13.976 9.15c-2.172-.806-3.356-1.143-3.356-2.076 0-.839.92-1.4 2.382-1.4 1.508 0 2.92.513 4.14 1.34l.732-3.13C16.64 2.89 15.01 2.37 13.08 2.37c-3.79 0-6.19 1.95-6.19 4.75 0 3.32 3.84 4.3 6.38 5.17 2.45.83 3.1 1.48 3.1 2.41 0 1-.92 1.63-2.61 1.63-1.89 0-3.69-.73-5.2-1.92l-.76 3.23c1.58.98 3.5 1.5 5.56 1.5 4.02 0 6.46-1.96 6.46-4.94 0-3.1-3.65-4.22-5.84-5.05z" />
                          </svg>
                          Pay with Stripe
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-md shadow-md transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Direct Bank Transfer
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button href="/quote" variant="secondary" size="xl" className="w-full justify-center">
                        Request Custom Quote Instead
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
          Pricing &amp; Service FAQ
        </h2>
        <div className="space-y-3.5">
          {FAQ_LIST.map((item, index) => {
            const isOpen = faqOpen === index;
            return (
              <div key={item.question} className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">{item.question}</span>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform ${isOpen ? "rotate-180 bg-[#203060]/10 text-[#203060]" : "bg-slate-100 text-slate-500"}`}><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
