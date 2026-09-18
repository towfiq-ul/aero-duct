// lib/mockData.ts
// All mock data for frontend development.
// TODO: replace each export with a real API call to the Go backend.

export type Market = {
  id: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  tagline: string;
};

export type Tier = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: true;
};

export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

// ── Markets ───────────────────────────────────────────────────────
export const MARKETS: Market[] = [
  {
    id: "chicago",
    name: "Chicago",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    tagline: "Chicago Residential",
  },
];

// ── Service Tiers ─────────────────────────────────────────────────
export const SERVICE_TIERS: Record<string, Tier[]> = {
  chicago: [
    {
      id: "essential",
      name: "Essential",
      price: 149,
      description: "Core duct cleaning for standard homes up to 1,800 sq ft.",
      features: [
        "Up to 12 supply & return vents",
        "Main trunk line brushing",
        "Debris extraction & bag-out",
        "Before & after photos",
        "30-day service guarantee",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      popular: true,
      price: 229,
      description: "Full-system clean for most Chicago homes up to 3,000 sq ft.",
      features: [
        "Up to 20 supply & return vents",
        "Main trunk line brushing",
        "Furnace filter replacement (MERV-11 included)",
        "Duct sanitisation fogging",
        "60-day service guarantee",
      ],
    },
    {
      id: "elite",
      name: "Elite",
      price: 349,
      description: "Hospital-grade decontamination for severe allergies & large properties.",
      features: [
        "Unlimited vents (up to 5,000 sq ft)",
        "Blower motor & AC coil surface clean",
        "Duct pressure testing",
        "HEPA vacuuming of all branch lines",
        "Antimicrobial fogging treatment",
        "12-month AMC option available",
      ],
    },
  ],
};

// ── Testimonials ──────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Karen M.",
    location: "Lincoln Park, Chicago",
    rating: 5,
    text: "I've used three other duct cleaning companies over the years. AeroDuct is the first one that actually showed me before-and-after documentation.",
    date: "September 2026",
  },
  {
    name: "Tom B.",
    location: "Wicker Park, Chicago",
    rating: 5,
    text: "Hired them for our new build after the construction crew left the place dusty. They cleaned 22 vents and the main trunk in about three hours. Pricing was exactly what the website quoted — no upsells, no surprises.",
    date: "July 2026",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────
export const FAQ: FAQ[] = [
  {
    question: "How often should I have my ducts cleaned?",
    answer:
      "The EPA recommends duct cleaning every 3–5 years for most residential properties. If you have pets, recent construction, allergy sufferers, or visible mold near vents, we recommend annual service.",
  },
  {
    question: "How long does the service take?",
    answer:
      "Most homes are completed within the 2-hour arrival window. Larger properties or heavily contaminated systems may require up to 4 hours. We'll always call ahead if we expect to run long.",
  },
  {
    question: "Is the pricing really flat-rate? No add-ons?",
    answer:
      "Yes. The price you see on the pricing page is the price you pay. We don't charge per vent, and we don't add fees at the door. The only exception is if structural duct repairs are needed, which we'll discuss with you before starting.",
  },
  {
    question: "Are your technicians certified?",
    answer:
      "All AeroDuct technicians are NADCA-certified (National Air Duct Cleaners Association) and carry full general liability insurance.",
  },
];
