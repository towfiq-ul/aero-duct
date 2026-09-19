// lib/mockData.ts

export type ServiceArea = {
  id: string;
  name: string;
  feeMultiplier: number;
};

export type Service = {
  id: string;
  name: string;
  price: string;
  description: string;
  isPackage?: boolean;
  category: 'residential' | 'commercial' | 'package';
};

export const SERVICE_AREAS: ServiceArea[] = [
  { id: "chicago", name: "Chicago, IL", feeMultiplier: 1.0 },
  { id: "evanston", name: "Evanston, IL", feeMultiplier: 1.05 },
  { id: "oak_park", name: "Oak Park, IL", feeMultiplier: 1.05 },
  { id: "cicero", name: "Cicero, IL", feeMultiplier: 1.1 },
  { id: "skokie", name: "Skokie, IL", feeMultiplier: 1.1 },
  { id: "berwyn", name: "Berwyn, IL", feeMultiplier: 1.05 },
];

export const SERVICES: Service[] = [
  {
    id: "res-air-duct",
    category: "residential",
    name: "Air Duct Cleaning",
    price: "$299",
    description: "Removing dust, debris, and allergens from home ductwork systems to improve airflow and reduce indoor pollutants.",
  },
  {
    id: "res-dryer-vent",
    category: "residential",
    name: "Dryer Vent Cleaning",
    price: "$129",
    description: "Clearing lint and blockages from dryer exhaust vent lines to prevent fire hazards and improve appliance efficiency.",
  },
  {
    id: "res-chimney",
    category: "residential",
    name: "Chimney Sweep & Fireplace Cleaning",
    price: "$189",
    description: "Removing dangerous soot, creosote buildup, and physical blockages from residential chimneys.",
  },
  {
    id: "res-uv-light",
    category: "residential",
    name: "UV Light & Air Purification",
    price: "$449",
    description: "Installation of UV air purifiers inside HVAC systems to neutralize airborne pathogens.",
  },
  {
    id: "res-duct-sanitizing",
    category: "residential",
    name: "Duct Sanitizing & Odor Removal",
    price: "$99",
    description: "Eliminating mold, bacteria, and lingering odors with specialized fogging treatments.",
  },
  {
    id: "res-duct-repair",
    category: "residential",
    name: "Duct Repair & Sealing",
    price: "Custom Quote",
    description: "Professional repair and sealing of leaky ducts to improve system efficiency and air quality.",
  },
  {
    id: "res-hvac-inspection",
    category: "residential",
    name: "HVAC & Air Duct Inspection",
    price: "$79",
    description: "Comprehensive visual and camera-assisted inspection of your HVAC system and ductwork.",
  },
  {
    id: "res-fireplace",
    category: "residential",
    name: "Fireplace Cleaning",
    price: "$149",
    description: "Scrubbing and maintaining the internal firebox and surrounding hearth area for safety and aesthetic upkeep.",
  },
  {
    id: "res-carpet",
    category: "residential",
    name: "Carpet Cleaning",
    price: "From $149",
    description: "Deep extraction cleaning to lift embedded dirt, stains, and allergens from carpets.",
  },
  {
    id: "res-upholstery",
    category: "residential",
    name: "Upholstery Cleaning",
    price: "From $99",
    description: "Specialized stain removal, deodorizing, and fabric refreshing for furniture.",
  },
  {
    id: "res-pressure",
    category: "residential",
    name: "Pressure Washing",
    price: "Custom Quote",
    description: "High-pressure water cleaning for hard exterior surfaces like facades, driveways, and sidewalks.",
  },
  {
    id: "res-iaq-testing",
    category: "residential",
    name: "Indoor Air Quality (IAQ) Testing",
    price: "$199",
    description: "Measuring airborne pollutants, mold spores, and particulate matter to establish a baseline for indoor air health.",
  },
  {
    id: "com-air-duct",
    category: "commercial",
    name: "Commercial Air Duct Cleaning",
    price: "Custom Quote",
    description: "Large-scale vent and HVAC system cleaning designed to meet corporate compliance and handle multi-zone facilities.",
  },
  {
    id: "com-dryer-vent",
    category: "commercial",
    name: "Commercial Dryer Vent Cleaning",
    price: "Custom Quote",
    description: "Heavy-duty lint removal for laundromats, hotels, and large commercial facilities.",
  },
  {
    id: "pkg-pot-gold",
    category: "package",
    name: "Pot of Gold Maintenance Plan",
    price: "Subscription",
    description: "A recurring seasonal membership that provides regular tune-ups and priority scheduling for heating and cooling units.",
    isPackage: true,
  },
  {
    id: "pkg-asure",
    category: "package",
    name: "Asure Extended Service Plans",
    price: "Custom Quote",
    description: "Extended warranty packages for specific new HVAC installations that cover labor and replacement parts.",
    isPackage: true,
  },
  {
    id: "pkg-furnace",
    category: "package",
    name: "Furnace Package Units",
    price: "From $249",
    description: "Flat-rate, all-in-one maintenance and cleaning tiers specifically tailored for packaged HVAC systems.",
    isPackage: true,
  },
];

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
    text: "Hired them for our new build after the construction crew left the place dusty. Pricing was exactly what the website quoted — no upsells, no surprises.",
    date: "July 2026",
  },
];

export const FAQ_LIST: FAQ[] = [
  {
    question: "How often should I have my ducts cleaned?",
    answer: "The EPA recommends duct cleaning every 3–5 years for most residential properties.",
  },
  {
    question: "How long does the service take?",
    answer: "Most homes are completed within the 2-hour arrival window.",
  },
  {
    question: "Is the pricing really flat-rate? No add-ons?",
    answer: "Yes. The price you see on the pricing page is the price you pay. We don't charge per vent.",
  },
  {
    question: "Are your technicians certified?",
    answer: "All AeroDuct technicians are NADCA-certified (National Air Duct Cleaners Association).",
  },
];
