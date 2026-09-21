import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-inter transition-colors duration-200">
      <NavBar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-md">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-xl font-bold text-[#203060] dark:text-white">Reset Link Sent</h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>, you will receive an email with instructions to reset your password.
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center px-4 py-2.5 text-xs font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-lg transition-colors"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                Reset Password
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 text-center">
                Enter your email address to receive password reset instructions.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0050a0]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center py-2.5 bg-[#203060] hover:bg-[#0050a0] text-white"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Remember your password?{" "}
                <Link to="/login" className="text-[#0050a0] dark:text-[#60a0d0] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
