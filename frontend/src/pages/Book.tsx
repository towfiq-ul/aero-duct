import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";
import { SERVICE_AREAS, SERVICES } from "@/lib/mockData";
import { createBooking } from "@/lib/api";

export default function Book() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [confirmed, setConfirmed] = useState(false);

  // Form state
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    serviceArea: SERVICE_AREAS[0]?.id || "chicago",
  });

  const [booking, setBooking] = useState({
    serviceId: SERVICES[0]?.id || "res-air-duct",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    slotTime: "09:00 AM - 11:00 AM",
    notes: "",
  });

  const timeSlots = [
    { time: "08:00 AM - 10:00 AM", available: true },
    { time: "10:00 AM - 12:00 PM", available: true },
    { time: "01:00 PM - 03:00 PM", available: true },
    { time: "03:00 PM - 05:00 PM", available: false },
    { time: "05:00 PM - 07:00 PM", available: true },
  ];

  const [bookingRef, setBookingRef] = useState(`AERO-${Math.floor(100000 + Math.random() * 900000)}`);
  const [submitting, setSubmitting] = useState(false);

  const selectedService = SERVICES.find((s) => s.id === booking.serviceId) || SERVICES[0];
  const selectedArea = SERVICE_AREAS.find((a) => a.id === contact.serviceArea) || SERVICE_AREAS[0];

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => (prev + 1) as 2 | 3);
    } else {
      setSubmitting(true);
      try {
        const res = await createBooking({
          customerName: `${contact.firstName} ${contact.lastName}`,
          email: contact.email,
          phone: contact.phone,
          address: contact.address,
          serviceAreaId: contact.serviceArea,
          selectedPackage: booking.serviceId,
          preferredDate: booking.date,
          arrivalWindow: booking.slotTime,
          accessNotes: booking.notes,
        });
        setBookingRef(res.referenceNumber);
        setConfirmed(true);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0f1e] transition-colors duration-200">
      <NavBar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0050a0] dark:text-[#60a0d0] bg-[#e6f0f9] dark:bg-[#0050a0]/10 border border-[#c0d9f0] dark:border-[#0050a0]/20 rounded-md mb-3">
            Online Scheduling
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#203060] dark:text-white tracking-tight">
            Schedule Your Service Appointment
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Guaranteed 2-hour arrival windows with hospital-grade negative-pressure HEPA equipment.
          </p>
        </div>

        {confirmed ? (
          <div className="bg-white dark:bg-[#0d1225] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-card">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-[#203060] dark:text-white">
              Appointment Confirmed!
            </h2>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
              Confirmation Reference: <span className="font-bold text-[#0050a0] dark:text-[#60a0d0]">{bookingRef}</span>
            </p>

            <div className="max-w-md mx-auto my-6 p-5 rounded-lg bg-slate-50 dark:bg-[#0a0f1e] border border-slate-200 dark:border-slate-800 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Arrival Window:</span>
                <span className="font-semibold text-[#0050a0] dark:text-[#60a0d0]">{booking.slotTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{contact.address}, {selectedArea.name}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-bold text-[#203060] dark:text-white">
                <span>Estimated Total:</span>
                <span>{selectedService.price}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              A confirmation email and SMS dispatch link will be sent to <span className="font-semibold">{contact.email}</span>. No prepayment required—pay only after inspection.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors"
              >
                Return to Homepage
              </Link>
              <Link
                to="/pricing"
                className="px-6 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                View Service Pricing
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0d1225] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-card">
            {/* Step indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
              {[
                { stepNumber: 1, title: "Contact & Address" },
                { stepNumber: 2, title: "Date & Slot" },
                { stepNumber: 3, title: "Review & Book" },
              ].map((s) => (
                <div key={s.stepNumber} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === s.stepNumber
                        ? "bg-[#203060] text-white"
                        : step > s.stepNumber
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {step > s.stepNumber ? "✓" : s.stepNumber}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      step === s.stepNumber ? "text-[#203060] dark:text-white" : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              {/* Step 1: Contact Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-[#203060] dark:text-white">Step 1: Your Contact Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={contact.firstName}
                        onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                        placeholder="John"
                        className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={contact.lastName}
                        onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        placeholder="(312) 555-0192"
                        className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={contact.address}
                        onChange={(e) => setContact({ ...contact, address: e.target.value })}
                        placeholder="e.g. 1420 N Michigan Ave"
                        className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Area *</label>
                      <select
                        value={contact.serviceArea}
                        onChange={(e) => setContact({ ...contact, serviceArea: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                      >
                        {SERVICE_AREAS.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Service & Slot Selection */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-[#203060] dark:text-white">Step 2: Service & 2-Hour Window</h2>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Service Package *</label>
                    <select
                      value={booking.serviceId}
                      onChange={(e) => setBooking({ ...booking, serviceId: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.price} ({s.category})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedService.description}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Appointment Date *</label>
                    <input
                      type="date"
                      required
                      value={booking.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                      className="w-full sm:w-64 px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Guaranteed 2-Hour Arrival Window *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {timeSlots.map((slot) => (
                        <label
                          key={slot.time}
                          className={`flex items-center justify-between p-3 rounded-md border text-xs cursor-pointer transition-colors ${
                            booking.slotTime === slot.time
                              ? "border-[#203060] bg-[#e6f0f9] dark:bg-[#0050a0]/20 font-semibold"
                              : slot.available
                              ? "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                              : "border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="slot"
                              disabled={!slot.available}
                              checked={booking.slotTime === slot.time}
                              onChange={() => setBooking({ ...booking, slotTime: slot.time })}
                              className="text-[#203060]"
                            />
                            <span>{slot.time}</span>
                          </div>
                          <span className={`text-[10px] uppercase font-bold ${slot.available ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                            {slot.available ? "Available" : "Filled"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Access Notes (Optional)</label>
                    <textarea
                      rows={2}
                      value={booking.notes}
                      onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                      placeholder="e.g. Basement entrance located on west side, dogs will be crated."
                      className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review & Book */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-[#203060] dark:text-white">Step 3: Review & Confirm</h2>

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0a0f1e] border border-slate-200 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Customer:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{contact.firstName} {contact.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Contact:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{contact.phone} · {contact.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Address:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{contact.address}, {selectedArea.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Service:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Date & Window:</span>
                      <span className="font-semibold text-[#0050a0] dark:text-[#60a0d0]">{booking.date} ({booking.slotTime})</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1 text-[#203060] dark:text-white">
                      <span>Rate Estimate:</span>
                      <span>{selectedService.price}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-md text-xs text-emerald-800 dark:text-emerald-300">
                    🛡️ <strong>Zero Risk Policy:</strong> 100% flat-rate quote. If your technician arrives outside the 2-hour window, you receive a $50 credit automatically.
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-md transition-colors"
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}

                <Button type="submit" size="md" disabled={submitting}>
                  {step === 3 ? (submitting ? "Processing..." : "Confirm & Book Service") : "Continue →"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
