import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Reset Password</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <Button className="w-full justify-center">Send Reset Link</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
