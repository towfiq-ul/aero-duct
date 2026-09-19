import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function CityLanding() {
  const { city } = useParams();
  const formattedCity = city ? city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' ') : 'Your City';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <NavBar />
      <main className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Duct Cleaning in {formattedCity}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">The #1 Rated Air Duct Cleaners in {formattedCity}.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
