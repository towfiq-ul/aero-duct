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

export type Slot = {
  id: string;
  date: string; // YYYY-MM-DD
  start: string; // ISO 8601
  end: string;
  available: boolean;
};

export type Passport = {
  id: string;
  propertyAddress: string;
  market: string;
  technicianName: string;
  technicianInitials: string;
  completedAt: string;
  rating: "Excellent" | "Good" | "Fair";
  airflowScore: number;
  contaminationScore: number;
  notes: string;
  videoUrl: string;
  findings: { area: string; status: "Clean" | "Needs Attention" | "Critical"; notes: string }[];
};

export type Booking = {
  id: string;
  confirmationCode: string;
  status: "pending" | "confirmed" | "completed";
  tierId: string;
  tierName: string;
  market: string;
  slotId: string;
  slotDate: string;
  slotTime: string;
  customerName: string;
  address: string;
  totalPrice: number;
  currency: string;
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
  {
    id: "india",
    name: "India",
    currency: "INR",
    currencySymbol: "₹",
    locale: "en-IN",
    tagline: "India Commercial",
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
        "Sanitiser treatment (EPA-approved)",
        "Digital Health Passport™ issued",
        "90-day service guarantee",
      ],
    },
    {
      id: "elite",
      name: "Elite",
      price: 349,
      description: "Whole-home deep clean for large homes and older duct systems.",
      features: [
        "Unlimited supply & return vents",
        "Full trunk & branch line treatment",
        "Furnace filter replacement (MERV-13 included)",
        "UV light inspection add-on",
        "Sanitiser treatment (EPA-approved)",
        "Digital Health Passport™ with video",
        "12-month service guarantee",
      ],
    },
  ],
  india: [
    {
      id: "essential",
      name: "Essential",
      price: 4999,
      description: "Baseline HVAC duct cleaning for small commercial premises.",
      features: [
        "Up to 10 diffusers & grilles",
        "AHU coil visual inspection",
        "Duct debris removal",
        "Before & after photos",
        "30-day service guarantee",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      popular: true,
      price: 8499,
      description: "Comprehensive cleaning for mid-size offices and retail spaces.",
      features: [
        "Up to 25 diffusers & grilles",
        "AHU coil & drain pan cleaning",
        "Flexible duct replacement (up to 3 m)",
        "Antimicrobial fogging treatment",
        "Digital Health Passport™ issued",
        "90-day service guarantee",
      ],
    },
    {
      id: "elite",
      name: "Elite",
      price: 13999,
      description: "Full HVAC system overhaul for large commercial properties.",
      features: [
        "Unlimited diffusers & grilles",
        "Complete AHU service (coil, fan, drain)",
        "Duct pressure testing",
        "HEPA vacuuming of all branch lines",
        "Antimicrobial fogging treatment",
        "Digital Health Passport™ with video report",
        "12-month AMC option available",
      ],
    },
  ],
};

// ── Available Slots ───────────────────────────────────────────────
export const SLOTS: Slot[] = [
  // Oct 6
  { id: "s1", date: "2026-10-06", start: "2026-10-06T08:00:00Z", end: "2026-10-06T10:00:00Z", available: true },
  { id: "s2", date: "2026-10-06", start: "2026-10-06T10:00:00Z", end: "2026-10-06T12:00:00Z", available: false },
  { id: "s3", date: "2026-10-06", start: "2026-10-06T14:00:00Z", end: "2026-10-06T16:00:00Z", available: true },
  // Oct 7
  { id: "s4", date: "2026-10-07", start: "2026-10-07T08:00:00Z", end: "2026-10-07T10:00:00Z", available: true },
  { id: "s5", date: "2026-10-07", start: "2026-10-07T10:00:00Z", end: "2026-10-07T12:00:00Z", available: true },
  { id: "s6", date: "2026-10-07", start: "2026-10-07T14:00:00Z", end: "2026-10-07T16:00:00Z", available: false },
  // Oct 8
  { id: "s7", date: "2026-10-08", start: "2026-10-08T08:00:00Z", end: "2026-10-08T10:00:00Z", available: true },
  { id: "s8", date: "2026-10-08", start: "2026-10-08T10:00:00Z", end: "2026-10-08T12:00:00Z", available: true },
  { id: "s9", date: "2026-10-08", start: "2026-10-08T14:00:00Z", end: "2026-10-08T16:00:00Z", available: true },
];

// ── Mock Passport ─────────────────────────────────────────────────
export const MOCK_PASSPORT: Passport = {
  id: "PASS-2026-0842",
  propertyAddress: "2847 N. Lincoln Ave, Chicago, IL 60657",
  market: "chicago",
  technicianName: "Marcus Webb",
  technicianInitials: "MW",
  completedAt: "2026-08-15T14:22:00Z",
  rating: "Excellent",
  airflowScore: 94,
  contaminationScore: 8,
  notes:
    "System is in excellent condition post-service. Main trunk was moderately dusty with minor pet dander accumulation near master bedroom return. All supply vents cleared and sanitised. Furnace filter replaced with MERV-11.",
  videoUrl: "",
  findings: [
    { area: "Main Supply Trunk", status: "Clean", notes: "Brushed and vacuumed. No blockages." },
    { area: "Master Bedroom Return", status: "Clean", notes: "Pet dander removed. Grille cleaned." },
    { area: "Kitchen Supply Vent", status: "Clean", notes: "Grease film removed. Sanitised." },
    { area: "Basement Return", status: "Needs Attention", notes: "Slight moisture detected. Monitor for 30 days." },
    { area: "Furnace Filter", status: "Clean", notes: "Replaced with MERV-11. Old filter disposed." },
  ],
};

// ── Mock Bookings ─────────────────────────────────────────────────
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "book-001",
    confirmationCode: "AD-2026-4821",
    status: "confirmed",
    tierId: "premium",
    tierName: "Premium",
    market: "chicago",
    slotId: "s4",
    slotDate: "Tuesday, Oct 7",
    slotTime: "8:00 – 10:00 AM",
    customerName: "Jordan Lee",
    address: "2847 N. Lincoln Ave, Chicago, IL 60657",
    totalPrice: 247.32,
    currency: "USD",
  },
  {
    id: "book-002",
    confirmationCode: "AD-2026-5103",
    status: "pending",
    tierId: "essential",
    tierName: "Essential",
    market: "india",
    slotId: "s7",
    slotDate: "Thursday, Oct 8",
    slotTime: "8:00 – 10:00 AM",
    customerName: "Priya Sharma",
    address: "Unit 4B, DLF Cyber City, Gurugram, HR 122002",
    totalPrice: 5899.18,
    currency: "INR",
  },
];

// ── Testimonials ──────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Karen M.",
    location: "Lincoln Park, Chicago",
    rating: 5,
    text: "I've used three other duct cleaning companies over the years. AeroDuct is the first one that actually showed me before-and-after documentation. The Health Passport alone made it worth it — I finally know my ducts are clean.",
    date: "September 2026",
  },
  {
    name: "Deepak R.",
    location: "Andheri West, Mumbai",
    rating: 5,
    text: "We had AeroDuct service our entire 12,000 sq ft office. Booking was straightforward, the technicians arrived exactly on time, and the digital report they left us was thorough. Our HVAC efficiency improved noticeably within a week.",
    date: "August 2026",
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
    question: "What is the Digital Health Passport™?",
    answer:
      "After every Premium and Elite service, we issue a Digital Duct Health Passport: a verified document with airflow scores, contamination index, technician findings, and (for Elite) a video walkthrough. It's yours permanently and can be shared with landlords or home buyers.",
  },
  {
    question: "Are your technicians certified?",
    answer:
      "All AeroDuct technicians are NADCA-certified (National Air Duct Cleaners Association) and carry full general liability insurance. In India, our team holds ISHRAE certifications and operates in compliance with local HVAC standards.",
  },
  {
    question: "What if I need to reschedule?",
    answer:
      "You can reschedule up to 24 hours before your slot at no charge. Changes within 24 hours are subject to a $25 / ₹800 rebooking fee.",
  },
];
