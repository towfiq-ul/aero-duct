import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Quote from "./pages/Quote";
import Book from "./pages/Book";
import Passport from "./pages/Passport";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import EnterpriseLanding from "./pages/enterprise/EnterpriseLanding";
import EnterpriseDashboard from "./pages/enterprise/EnterpriseDashboard";
import EnterpriseNew from "./pages/enterprise/EnterpriseNew";
import TechDashboard from "./pages/technician/Dashboard";
import JobDetail from "./pages/technician/JobDetail";
import Checklist from "./pages/technician/Checklist";
import CityLanding from "./pages/CityLanding";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineBanner from "./components/OfflineBanner";
import "./index.css";

function App() {
  return (
    <ErrorBoundary>
      <div className="antialiased text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-inter min-h-screen transition-colors duration-200">
        <OfflineBanner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/book" element={<Book />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/passport/:id" element={<Passport />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Enterprise */}
            <Route path="/enterprise" element={<EnterpriseLanding />} />
            <Route path="/enterprise/dashboard" element={<EnterpriseDashboard />} />
            <Route path="/enterprise/new" element={<EnterpriseNew />} />
            
            {/* Technician PWA */}
            <Route path="/technician" element={<TechDashboard />} />
            <Route path="/technician/job/:id" element={<JobDetail />} />
            <Route path="/technician/checklist/:bookingId" element={<Checklist />} />
            
            {/* SEO Landing Pages */}
            <Route path="/:city/duct-cleaning" element={<CityLanding />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;
