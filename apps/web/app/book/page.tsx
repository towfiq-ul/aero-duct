"use client";

import { useState, useEffect } from "react";
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
function StepIndicator({ step, current }: { step: number; current: number }) {
  const steps = ["Contact Info", "Pick a Slot", "Review & Confirm"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
                  done
                    ? "bg-blue-600 border-blue-600 text-white"
                    : active
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-gray-300 text-gray-400 bg-white",
                ].join(" ")}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx
                )}
              </div>
              <span
                className={`mt-1 text-xs font-medium whitespace-nowrap hidden sm:block ${
                  active ? "text-blue-600" : done ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-3 min-w-8 sm:min-w-16 transition-colors ${
                  done ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
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
  const valid = data.name && data.email && data.phone && data.address;

  const field = (label: string, key: keyof ContactData, type = "text", placeholder = "") => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={data[key]}
        onChange={(e) => onChange({ ...data, [key]: e.target.value })}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Your Contact Info</h2>
        <p className="text-sm text-gray-500 mt-1">Used only to confirm and manage your booking.</p>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">Market</label>
        <MarketSelector value={data.marketId} onChange={(id) => onChange({ ...data, marketId: id })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Full Name", "name", "text", "Jordan Lee")}
        {field("Email Address", "email", "email", "jordan@example.com")}
        {field("Phone Number", "phone", "tel", "+1 (312) 555-0100")}
      </div>
      {field("Service Address", "address", "text", "2847 N. Lincoln Ave, Chicago, IL 60657")}

      <div className="pt-2">
        <Button onClick={onNext} size="lg" disabled={!valid} className={!valid ? "opacity-50 cursor-not-allowed" : ""}>
          Continue to Slot Selection →
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
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Pick a 2-Hour Slot</h2>
        <p className="text-sm text-gray-500 mt-1">
          Technicians arrive within your chosen window — guaranteed.
        </p>
      </div>

      {tier && breakdown && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900">
          <span className="font-semibold">{tier.name} Plan</span>
          {" — "}
          {new Intl.NumberFormat(market.locale, {
            style: "currency",
            currency: market.currency,
          }).format(breakdown.total)}{" "}
          total incl. tax
        </div>
      )}

      <SlotPicker slots={SLOTS} selectedId={selectedSlotId} onSelect={onSelect} />

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} disabled={!selectedSlotId} className={!selectedSlotId ? "opacity-50 cursor-not-allowed" : ""}>
          Review Booking →
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
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-xs">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Review Your Booking</h2>
        <p className="text-sm text-gray-500 mt-1">Please confirm the details below before submitting.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</p>
        </div>
        <div className="px-4">
          <Row label="Name" value={contact.name} />
          <Row label="Email" value={contact.email} />
          <Row label="Phone" value={contact.phone} />
          <Row label="Address" value={contact.address} />
        </div>
        <div className="bg-gray-50 px-4 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</p>
        </div>
        <div className="px-4">
          <Row label="Market" value={market.tagline} />
          <Row label="Plan" value={tier?.name ?? "—"} />
          <Row label="Date" value={formatSlotDate(slot.date)} />
          <Row label="Window" value={`${formatSlotTime(slot.start)} – ${formatSlotTime(slot.end)}`} />
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

      <p className="text-xs text-gray-400">
        By confirming, you agree to our Terms of Service. Payment is collected on the day of service.
      </p>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button onClick={onConfirm} size="lg">Confirm Booking</Button>
      </div>
    </div>
  );
}

// ── Success state ─────────────────────────────────────────────────
function SuccessState({ confirmationCode }: { confirmationCode: string }) {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
      <p className="text-gray-500 text-sm">
        Your confirmation code is{" "}
        <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
          {confirmationCode}
        </span>
      </p>
      <p className="text-sm text-gray-500">
        We've sent details to your email. Our technician will text you 30 minutes before arrival.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button href="/passport/PASS-2026-0842" variant="secondary">
          View Health Passport™ (Demo)
        </Button>
        <Button href="/" variant="ghost">
          Back to Home
        </Button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function BookPage() {
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
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Step indicator */}
        {!confirmed && (
          <div className="mb-10 flex justify-center">
            <StepIndicator step={step} current={step} />
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
      </main>

      <Footer />
    </div>
  );
}
