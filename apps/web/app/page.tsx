import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";
import { TierCard } from "@/components/TierCard";
import { SERVICE_TIERS, TESTIMONIALS, FAQ } from "@/lib/mockData";
import { getAllMarkets } from "@/lib/api";

// ── Sub-components (server only) ──────────────────────────────────

function TrustBar() {
  return (
    <div className="border-y border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="text-green-600 font-bold">✓</span> 4.9/5 from 600+ customers
          </span>
          <span className="text-gray-300 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-600 font-bold">✓</span> Licensed &amp; Insured
          </span>
          <span className="text-gray-300 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-600 font-bold">✓</span> Guaranteed 2-Hour Windows
          </span>
          <span className="text-gray-300 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-600 font-bold">✓</span> Digital Health Passport™ Included
          </span>
        </div>
      </div>
    </div>
  );
}

function HowItWorksStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mb-4 flex-shrink-0">
        {number}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{description}</p>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function HomePage() {
  const markets = getAllMarkets();
  const chicagoTiers = SERVICE_TIERS["chicago"] ?? [];

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <p className="text-sm font-medium text-blue-600 mb-4 uppercase tracking-widest">
          Chicago &amp; India
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
          Duct Cleaning Done Right.{" "}
          <span className="text-blue-600">Every Time.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Flat-rate pricing. No surprises. Guaranteed 2-hour arrival windows. Every service includes
          a Digital Health Passport™ documenting your duct condition.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/pricing" size="lg">
            See Pricing
          </Button>
          <Button href="/#how-it-works" variant="ghost" size="lg">
            How It Works →
          </Button>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <TrustBar />

      {/* ── How It Works ── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-500">From quote to clean in four steps</p>
        </div>
        <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-8">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-gray-200" aria-hidden="true" />
          <HowItWorksStep
            number={1}
            title="Get an Instant Quote"
            description="Choose your market and service tier. The price you see is exactly what you'll pay."
          />
          <HowItWorksStep
            number={2}
            title="Pick a 2-Hour Window"
            description="Select a date and time that works for you. We commit to arriving within your window."
          />
          <HowItWorksStep
            number={3}
            title="We Clean &amp; Document"
            description="Our certified technicians clean your full duct system and record findings."
          />
          <HowItWorksStep
            number={4}
            title="Receive Your Passport™"
            description="Get a signed Digital Duct Health Passport with airflow scores and photos."
          />
        </div>
      </section>

      {/* ── Pricing Preview ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Flat-Rate Pricing. Nothing Hidden.</h2>
            <p className="mt-2 text-gray-500">Chicago residential plans shown · India commercial also available</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {chicagoTiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                currencySymbol="$"
                locale="en-US"
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button href="/pricing" variant="secondary">
              See All Plans including India →
            </Button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">What Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
              <StarRating rating={t.rating} />
              <p className="text-gray-700 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.location} · {t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQ.slice(0, 4).map((item) => (
              <div key={item.question} className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button href="/pricing#faq" variant="ghost">
              More questions →
            </Button>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-blue-700 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready for Cleaner Air?</h2>
          <p className="mt-3 text-blue-200 text-lg">
            Book your service in under 90 seconds. Certified technicians, flat-rate price, no surprises.
          </p>
          <div className="mt-6">
            <Button href="/book" variant="secondary" size="lg">
              Book Your Service
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
