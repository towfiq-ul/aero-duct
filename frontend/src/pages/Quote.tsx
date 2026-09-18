import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // mock submit
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />
      
      <main className="flex-1 bg-gradient-to-b from-blue-50/60 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Request a Custom Quote
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Need a specialized service or commercial pricing? Send us a message and our team will get back to you within 2 hours.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200/60">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Request Sent Successfully!</h3>
                <p className="mt-2 text-slate-500">We've received your information and will contact you shortly.</p>
                <div className="mt-8">
                  <Button href="/" variant="secondary">Return Home</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-900">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-900">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-900">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="serviceArea" className="block text-sm font-semibold text-slate-900">Service Area</label>
                    <select
                      id="serviceArea"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="chicago">Chicago, IL</option>
                      <option value="evanston">Evanston, IL</option>
                      <option value="oak_park">Oak Park, IL</option>
                      <option value="cicero">Cicero, IL</option>
                      <option value="skokie">Skokie, IL</option>
                      <option value="berwyn">Berwyn, IL</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="package" className="block text-sm font-semibold text-slate-900">Package / Service</label>
                    <select
                      id="package"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="standard">Standard Vent Cleaning</option>
                      <option value="premium">Premium Deep Clean + Sanitizer</option>
                      <option value="commercial">Commercial Duct Cleaning</option>
                      <option value="custom">Custom / Unsure</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="propertyType" className="block text-sm font-semibold text-slate-900">Property Type</label>
                  <select
                    id="propertyType"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="residential">Residential (Single Family)</option>
                    <option value="multi">Residential (Multi-Family/Condo)</option>
                    <option value="commercial">Commercial / Industrial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-900">Message / Service Needs</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Please describe what you need help with..."
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="gradient" size="xl" className="w-full justify-center shadow-lg">
                    Submit Request
                  </Button>
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
