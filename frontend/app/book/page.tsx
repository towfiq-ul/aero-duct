"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";
import { SlotPicker } from "@/components/SlotPicker";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { MarketSelector } from "@/components/MarketSelector";
import { SERVICE_TIERS, SLOTS } from "@/lib/mockData";
import { getMarket, calculatePrice, createBooking } from "@/lib/api";
import type { Slot } from "@/lib/mockData";

// ── Step indicator ────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  const steps = [
    { title: "Contact Info", icon: "👤" },
    { title: "Pick a Slot", icon: "⏱" },
    { title: "Review & Confirm", icon: "✓" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto flex items-center justify-between relative">
      {/* Background connector track */}
      <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0" />
      {/* Progress connector track */}
      <div
        className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 z-0"
        style={{ width: current === 1 ? "0%" : current === 2 ? "50%" : "calc(100% - 3rem)" }}
      />

      {steps.map((step, i) => {
        const idx = i + 1;
        const isDone = idx < current;
        const isActive = idx === current;

        return (
          <div key={step.title} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200 ${
                isDone
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : isActive
                  ? "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100 shadow-sm"
                  : "bg-white border-slate-300 text-slate-400"
              }`}
            >
              {isDone ? "✓" : idx}
            </div>
            <span
              className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                isActive ? "text-blue-600" : isDone ? "text-slate-800" : "text-slate-400"
              }`}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Contact form ──────────────────────────────────────────────────
type ContactData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  marketId: string;
};

function ContactStep({
  data,
  onChange,
  onNext,
}: {
  data: ContactData;
  onChange: (d: ContactData) => void;
  onNext: () => void;
}) {
  const valid = data.name.trim() && data.email.trim() && data.phone.trim() && data.address.trim();

  const field = (label: string, key: keyof ContactData, type = "text", placeholder = "", helper = "") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      <input
        type={type}
        value={data[key]}
        onChange={(e) => onChange({ ...data, [key]: e.target.value })}
        placeholder={placeholder}
        required
        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-2xs transition"
      />
      {helper && <span className="text-[11px] text-slate-400">{helper}</span>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900">Step 1: Contact &amp; Property Details</h2>
        <p className="text-sm text-slate-500 mt-1">
          We use this to send dispatch notifications and prepare the technician's route.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
          Service Location Market
        </label>
        <MarketSelector value={data.marketId} onChange={(id) => onChange({ ...data, marketId: id })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Full Name", "name", "text", "e.g. Jordan Lee")}
        {field("Email Address", "email", "email", "jordan@example.com", "For Digital Passport link")}
        {field("Phone Number", "phone", "tel", "+1 (312) 555-0100", "For 30-minute arrival SMS text")}
      </div>
      {field("Complete Service Address", "address", "text", "7-33 N Roselle Rd, Schaumburg, IL 60194")}

      <div className="pt-4 flex justify-end">
        <Button
          onClick={onNext}
          variant="gradient"
          size="xl"
          disabled={!valid}
          className={!valid ? "opacity-40 cursor-not-allowed" : "shadow-md"}
        >
          Next: Choose Arrival Window →
        </Button>
      </div>
    </div>
  );
}

// ── Slot step ─────────────────────────────────────────────────────
function SlotStep({
  marketId,
  tierId,
  selectedSlotId,
  onSelect,
  onBack,
  onNext,
}: {
  marketId: string;
  tierId: string;
  selectedSlotId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const market = getMarket(marketId);
  const tiers = SERVICE_TIERS[marketId] ?? [];
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[1] ?? tiers[0];
  const breakdown = tier ? calculatePrice(marketId, tier.id) : null;

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900">Step 2: Pick Your 2-Hour Arrival Window</h2>
        <p className="text-sm text-slate-500 mt-1">
          Our technician arrives during this window — guaranteed. You receive a live GPS link 30 minutes before arrival.
        </p>
      </div>

      {tier && breakdown && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Selected Plan</span>
            <p className="text-base font-bold text-slate-900">{tier.name} Plan</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Total Flat-Rate</span>
            <p className="text-lg font-extrabold text-blue-700">
              {new Intl.NumberFormat(market.locale, {
                style: "currency",
                currency: market.currency,
              }).format(breakdown.total)}
            </p>
          </div>
        </div>
      )}

      <SlotPicker slots={SLOTS} selectedId={selectedSlotId} onSelect={onSelect} />

      <div className="flex items-center justify-between pt-4">
        <Button variant="secondary" size="lg" onClick={onBack}>
          ← Back to Contact
        </Button>
        <Button
          onClick={onNext}
          variant="gradient"
          size="lg"
          disabled={!selectedSlotId}
          className={!selectedSlotId ? "opacity-40 cursor-not-allowed" : "shadow-md"}
        >
          Review &amp; Confirm →
        </Button>
      </div>
    </div>
  );
}

// ── Review step ───────────────────────────────────────────────────
function ReviewStep({
  contact,
  tierId,
  slot,
  onBack,
  onConfirm,
}: {
  contact: ContactData;
  tierId: string;
  slot: Slot;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const market = getMarket(contact.marketId);
  const tiers = SERVICE_TIERS[contact.marketId] ?? [];
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0];
  const breakdown = tier ? calculatePrice(contact.marketId, tier.id) : null;

  const formatSlotTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });

  const formatSlotDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2.5 border-b border-slate-100 last:border-0 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900 text-right max-w-xs">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900">Step 3: Review &amp; Confirm Booking</h2>
        <p className="text-sm text-slate-500 mt-1">
          No prepayment required. You only pay after our technician completes the service and inspects with you.
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Contact &amp; Location</span>
          <span className="text-xs text-blue-600 font-semibold">{market.tagline}</span>
        </div>
        <div className="px-5 py-2">
          <Row label="Customer Name" value={contact.name} />
          <Row label="Email Address" value={contact.email} />
          <Row label="Mobile Phone" value={contact.phone} />
          <Row label="Service Address" value={contact.address} />
        </div>

        <div className="bg-slate-50 px-5 py-3">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Appointment Window</span>
        </div>
        <div className="px-5 py-2">
          <Row label="Selected Plan" value={tier?.name ?? "—"} />
          <Row label="Scheduled Date" value={formatSlotDate(slot.date)} />
          <Row label="Arrival Window" value={`${formatSlotTime(slot.start)} – ${formatSlotTime(slot.end)}`} />
        </div>
      </div>

      {breakdown && (
        <PriceBreakdown
          subtotal={breakdown.subtotal}
          tax={breakdown.tax}
          total={breakdown.total}
          taxLabel={breakdown.taxLabel}
          currency={market.currency}
          locale={market.locale}
        />
      )}

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">✓ AeroDuct Service Guarantee:</p>
        <p>• If our crew is more than 15 minutes past your 2-hour window, you receive a $50 service credit.</p>
        <p>• Full borescope video before &amp; after inspection included with permanent digital link.</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="secondary" size="lg" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={onConfirm} variant="gradient" size="xl" className="shadow-lg">
          Confirm Appointment (Pay After) →
        </Button>
      </div>
    </div>
  );
}

// ── Success state ─────────────────────────────────────────────────
function SuccessState({ confirmationCode }: { confirmationCode: string }) {
  return (
    <div className="text-center py-12 px-4 space-y-5">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner text-4xl">
        ✓
      </div>
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Booking Confirmed
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900">Your Service is Scheduled!</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          We have reserved your 2-hour arrival window. A confirmation email and calendar invite are on the way.
        </p>
      </div>

      <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirmation Code</span>
        <p className="font-mono text-2xl font-black text-slate-900 bg-white border border-slate-200 py-2 rounded-xl">
          {confirmationCode}
        </p>
        <p className="text-xs text-slate-500">
          Our dispatch tech will text you 30 minutes before arriving with live GPS tracking.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
        <Button href="/passport/PASS-2026-0842" variant="gradient" size="lg">
          View Demo Health Passport™ →
        </Button>
        <Button href="/" variant="secondary" size="lg">
          Return to Home
        </Button>
      </div>
    </div>
  );
}

// ── Main content (uses searchParams) ─────────────────────────────
function BookContent() {
  const searchParams = useSearchParams();
  const initialMarket = searchParams.get("market") ?? "chicago";
  const initialTier = searchParams.get("tier") ?? "premium";

  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const [contact, setContact] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    marketId: initialMarket,
  });
  const [tierId] = useState(initialTier);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const selectedSlot = SLOTS.find((s) => s.id === selectedSlotId);

  const handleConfirm = () => {
    const booking = createBooking({
      marketId: contact.marketId,
      tierId,
      slotId: selectedSlotId!,
      customerName: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
    });
    setConfirmationCode(booking.confirmationCode);
    setConfirmed(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-10">
      {/* Step indicator */}
      {!confirmed && (
        <div className="mb-10">
          <StepIndicator current={step} />
        </div>
      )}

      {confirmed ? (
        <SuccessState confirmationCode={confirmationCode} />
      ) : step === 1 ? (
        <ContactStep data={contact} onChange={setContact} onNext={() => setStep(2)} />
      ) : step === 2 ? (
        <SlotStep
          marketId={contact.marketId}
          tierId={tierId}
          selectedSlotId={selectedSlotId}
          onSelect={setSelectedSlotId}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      ) : selectedSlot ? (
        <ReviewStep
          contact={contact}
          tierId={tierId}
          slot={selectedSlot}
          onBack={() => setStep(2)}
          onConfirm={handleConfirm}
        />
      ) : null}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function BookPage() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Suspense fallback={<div className="py-16 text-center text-slate-500 font-medium">Loading booking portal...</div>}>
          <BookContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
