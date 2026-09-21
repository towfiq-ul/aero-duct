import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";
import {
  fetchServices,
  fetchServiceAreas,
  type Service,
  type ServiceArea,
} from "@/lib/api";
import { SERVICE_AREAS as DEFAULT_AREAS, SERVICES as DEFAULT_SERVICES } from "@/lib/mockData";

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [areas, setAreas] = useState<ServiceArea[]>(DEFAULT_AREAS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  useEffect(() => {
    fetchServiceAreas().then((data) => {
      if (data && data.length > 0) setAreas(data);
    });
    fetchServices().then((data) => {
      if (data && data.length > 0) setServices(data);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <NavBar />
      
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Request a Custom Quote
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Need a specialized service or commercial pricing? Send us a message and our team will get back to you within 2 hours.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0d1225] rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Request Sent Successfully!</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">We've received your information and will contact you shortly.</p>
                <div className="mt-8">
                  <Button href="/" variant="secondary">Return Home</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="serviceArea" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">Service Area</label>
                    <select
                      id="serviceArea"
                      className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all dark:text-white"
                    >
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>{area.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="package" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">Package / Service</label>
                    <select
                      id="package"
                      className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all dark:text-white"
                    >
                      <option value="">Select a service</option>
                      {services.map((svc) => (
                        <option key={svc.id} value={svc.id}>{svc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="propertyType" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">Property Type</label>
                  <select
                    id="propertyType"
                    className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all dark:text-white"
                  >
                    <option value="residential">Residential (Single Family)</option>
                    <option value="multi">Residential (Multi-Family/Condo)</option>
                    <option value="commercial">Commercial / Industrial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">Message / Service Needs</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#203060] focus:border-transparent outline-none transition-all resize-none dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Please describe what you need help with..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors shadow-sm"
                  >
                    Submit Request
                  </button>
                </div>
                <p className="text-center text-xs text-slate-500 mt-4">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
