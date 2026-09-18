import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | AeroDuct",
    default: "AeroDuct — Professional Duct Cleaning Service",
  },
  description:
    "Transparent flat-rate duct cleaning for residential Chicago and commercial India. Book in 90 seconds with guaranteed 2-hour arrival windows.",
  openGraph: {
    title: "AeroDuct — Professional Duct Cleaning Service",
    description: "Transparent flat-rate duct cleaning. No hidden fees. Instant booking.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased text-gray-900 bg-white`}>{children}</body>
    </html>
  );
}
