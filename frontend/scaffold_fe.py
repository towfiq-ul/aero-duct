import os

# Create directories
os.makedirs('src/pages/auth', exist_ok=True)
os.makedirs('src/pages/enterprise', exist_ok=True)
os.makedirs('src/pages/technician', exist_ok=True)

# Generate Auth Pages
pages = {
    'src/pages/auth/Login.tsx': '''import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Sign In</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <Button className="w-full justify-center">Sign In</Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
''',
    'src/pages/auth/Signup.tsx': '''import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Create Account</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <Button className="w-full justify-center">Sign Up</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
''',
    'src/pages/auth/ForgotPassword.tsx': '''import NavBar from "@/components/NavBar";
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
''',
    'src/pages/enterprise/EnterpriseLanding.tsx': '''import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

export default function EnterpriseLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Enterprise & AMC Portal</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Manage your Annual Maintenance Contracts, download invoices, and schedule priority services for multi-zone commercial facilities.</p>
        <div className="flex justify-center gap-4">
          <Button href="/enterprise/dashboard">Go to Dashboard</Button>
          <Button variant="secondary" href="/enterprise/new">Enquire about AMC</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
''',
    'src/pages/enterprise/EnterpriseDashboard.tsx': '''import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function EnterpriseDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Client Dashboard</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-600">Active Contracts: 0</p>
          <p className="text-slate-600 mt-2">Recent Invoices: None</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
''',
    'src/pages/technician/Dashboard.tsx': '''export default function TechDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-emerald-400">Dispatch Dashboard</h1>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <h3 className="font-bold">Job #8912 - 10:00 AM</h3>
          <p className="text-sm text-slate-400">123 Main St, Chicago IL</p>
          <a href="/technician/job/8912" className="mt-4 block text-center bg-blue-600 py-2 rounded-lg font-medium hover:bg-blue-500">View Details</a>
        </div>
      </div>
    </div>
  );
}
''',
    'src/pages/technician/JobDetail.tsx': '''import { useParams } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-emerald-400">Job #{id}</h1>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <p>Customer: John Doe</p>
        <p>Service: Premium Duct Clean</p>
        <a href={`/technician/checklist/${id}`} className="mt-6 block text-center bg-emerald-600 py-3 rounded-lg font-bold hover:bg-emerald-500">Start Checklist</a>
      </div>
    </div>
  );
}
''',
    'src/pages/CityLanding.tsx': '''import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function CityLanding() {
  const { city } = useParams();
  const formattedCity = city ? city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' ') : 'Your City';

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">Duct Cleaning in {formattedCity}</h1>
          <p className="mt-4 text-slate-600">The #1 Rated Air Duct Cleaners in {formattedCity}.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
'''
}

for path, content in pages.items():
    with open(path, 'w') as f:
        f.write(content)

# Generate Manifest for PWA
manifest = '''{
  "name": "AeroDuct Technician",
  "short_name": "AeroDuct",
  "start_url": "/technician",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "icons": [
    {
      "src": "/vite.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}'''
with open('public/manifest.json', 'w') as f:
    f.write(manifest)

