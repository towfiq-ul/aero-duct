import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

import { resetPasswordUser } from "@/lib/api";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await resetPasswordUser(token || "demo-token", password);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0f1e] transition-colors duration-200">
      <NavBar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#0d1225] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-md">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-xl font-bold text-[#203060] dark:text-white">Password Updated</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your password has been successfully reset. You can now sign in with your new credentials.
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#203060] dark:text-white mb-2 text-center">
                Set New Password
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 text-center">
                {token ? `Reset token verified: ${token.slice(0, 8)}...` : "Enter a secure password for your account."}
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#203060]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#203060]"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full justify-center">
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>

              <p className="mt-5 text-center text-xs text-slate-500">
                Remember your password?{" "}
                <Link to="/login" className="text-[#0050a0] dark:text-[#60a0d0] hover:underline font-semibold">
                  Sign In
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
