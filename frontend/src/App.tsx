import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Quote from "./pages/Quote";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EnterpriseLanding from "./pages/enterprise/EnterpriseLanding";
import EnterpriseDashboard from "./pages/enterprise/EnterpriseDashboard";
import TechDashboard from "./pages/technician/Dashboard";
import JobDetail from "./pages/technician/JobDetail";
import CityLanding from "./pages/CityLanding";
import "./index.css";

function App() {
  return (
    <div className="antialiased text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-inter min-h-screen transition-colors duration-200">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/quote" element={<Quote />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Enterprise */}
          <Route path="/enterprise" element={<EnterpriseLanding />} />
          <Route path="/enterprise/dashboard" element={<EnterpriseDashboard />} />
          
          {/* Technician PWA */}
          <Route path="/technician" element={<TechDashboard />} />
          <Route path="/technician/job/:id" element={<JobDetail />} />
          
          {/* SEO Landing Pages */}
          <Route path="/:city/duct-cleaning" element={<CityLanding />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
