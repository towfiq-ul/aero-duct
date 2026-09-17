export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AeroDuct
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Professional duct cleaning with transparent flat-rate pricing.
            <br />
            Chicago residential · India commercial.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/book"
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              Book Now — 90 seconds
            </a>
            <a href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">
              View Pricing <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
