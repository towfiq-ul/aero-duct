import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";
import { signupUser } from "@/lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signupUser({
        name,
        email,
        phone: phone || "(312) 555-0100",
        password,
      });
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-inter transition-colors duration-200">
      <NavBar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            Create an AeroDuct Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 text-center">
            Join thousands of homeowners and facilities managing hospital-grade indoor air quality.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0050a0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0050a0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(312) 555-0199"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0050a0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Password (min. 6 characters)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0050a0]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-2.5 bg-[#203060] hover:bg-[#0050a0] text-white"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0050a0] dark:text-[#60a0d0] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
