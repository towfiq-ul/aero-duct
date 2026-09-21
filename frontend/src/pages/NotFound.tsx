import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Button from "../components/Button";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-inter">
      <NavBar />
      <main className="flex-1 flex items-center justify-center py-20">
        <Container>
          <div className="max-w-xl mx-auto text-center px-4">
            <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 mb-4 border border-sky-200 dark:border-sky-800">
              404 Error • Path Not Found
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#203060] dark:text-white tracking-tight mb-4">
              Ventilation Route Disconnected
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
              The page or airway duct you are looking for does not exist, has been rerouted, or requires NADCA certification credentials to access.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/">
                <Button variant="primary" size="lg">
                  Return to Homepage
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="secondary" size="lg">
                  View Flat-Rate Pricing
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
