# Development Task List — AeroDuct

> Last updated: 2026-09-21 (verified against actual codebase)

---

## ✅ Implemented

### Infrastructure & Tooling
- **Monorepo scaffolding** – Turborepo, `pnpm-workspace.yaml`, root `package.json`
- **Root Makefile** – 50+ targets: `setup`, `dev`, `build`, `db-*`, `test`, `lint`, `docker-*`, etc.
- **API Makefile** – `dev` (air hot-reload), `build`, `build-local`, `test`, `lint`, `swagger`, `loc`
- **`.air.toml`** – Hot-reload config for the Go API
- **Docker Compose** – Postgres container + optional pgAdmin (`docker-compose.yml`)
- **Shared TS config** – `packages/config` (tsconfig, ESLint, Prettier variants)
- **Domain Types** – `packages/types/src/index.ts` with all business models
- **UI utility** – `packages/ui/src/lib/cn.ts` (class-name merger)
- **GitHub Actions CI/CD** – `.github/workflows/deploy.yml` for automated GitHub Pages hosting (`https://towfiq-ul.github.io/aero-duct`)

### Backend (Go API)
- **API entrypoint** – `cmd/api/main.go` with env loading and Gin mode detection
- **Config** – `internal/config/config.go` covering all env vars
- **Error helpers** – `internal/apierr/apierr.go` with standard JSON error responses
- **Middleware** – `internal/middleware/middleware.go`: CORS, RequestID
- **Router** – `internal/router/router.go` with all route groups declared
- **Health endpoint** – `GET /health` fully implemented
- **Pricing engine** – `internal/pricing/pricing.go` with full flat-rate logic + unit tests
- **Stub handlers** – All 8 domain handlers exist in `handler/handlers.go` (stubs only)

### Database
- **Prisma schema** – Full data model: 10+ tables, enums, relations
- **Prisma workspace** – `backend/prisma/package.json` + seed script (slots, technicians, demo customer)

### Frontend — Core Components
- **Design tokens** – `src/index.css` with Tailwind v4 `@theme` (brand palette extracted from `logo.jpg`, radius, fonts)
- **`lib/mockData.ts`** – Fully typed mock data: service areas, services, testimonials, FAQs
- **`lib/api.ts`** – Typed API client (mock-backed, `// TODO` comments ready for real fetch swap)
- **`components/Button`** – `<a>`/`<button>` discriminated union; primary/secondary/ghost/outline/gradient × sm/md/lg/xl
- **`components/Badge`** – Status chip (file exists)
- **`components/Input`** – Label, error state, helper text, and dark mode support ✅
- **`components/Select`** – Accessible styled dropdown with chevron icon and validation states ✅
- **`components/TierCard`** – Package card with features checklist, selection state, and popular badges ✅
- **`components/SlotPicker`** – 2-hour arrival window date/slot picker with availability telemetry ✅
- **`components/Modal`** – Accessible modal dialog with backdrop blur, ESC key handler, and smooth transitions ✅
- **`components/NavBar`** – Sticky header, scroll-aware shadow, logo (`/logo.jpg`), nav links with `useScrollTo` hook, dark mode toggle, mobile drawer
- **`components/Footer`** – 4-column layout, trust strip, inline CTA card, `useScrollTo` for anchor links
- **`components/PriceBreakdown`** – Subtotal → tax (8% IL) → total via `Intl.NumberFormat`
- **`hooks/useScrollTo`** – Smooth scroll hook with 92px sticky-nav offset compensation, cross-page navigation support

### Frontend — Pages
- **`/`** – Hero, trust bar, 4-step "How It Works", services preview, digital certificate mockup, testimonials, FAQ accordion, CTA banner
- **`/pricing`** – Service area dropdown, selectable service checkboxes (residential/commercial/packages), live price breakdown, Stripe + Bank Transfer CTAs, FAQ
- **`/quote`** – Contact form with service area + package dropdowns, success state
- **`/login`** – Email + password form, forgot password link
- **`/signup`** – Name, email, password form
- **`/forgot-password`** – Email input, confirmation message
- **`/enterprise`** – Landing page for AMC enquiries
- **`/enterprise/dashboard`** – Contract list stub
- **`/technician`** – Dispatch list (today's jobs)
- **`/technician/job/:id`** – Job detail page
- **`/book`** – 3-step online booking flow with 2-hour arrival window slots and confirmation ✅
- **`/passport/:id`** – Digital compliance audit passport with borescope visual cards and CFM telemetry ✅
- **`/reset-password/:token`** – Password reset form with token verification and validation ✅
- **`/enterprise/new`** – Commercial AMC onboarding & customized proposal enquiry form ✅
- **`/technician/checklist/:bookingId`** – NADCA ACR 2021 field checklist with CFM verification and passport generation ✅
- **`/:city/duct-cleaning`** – City SEO landing page (`CityLanding.tsx`)

### Frontend — UX
- **Dark/light mode toggle** – `useTheme` hook, persists to `localStorage`, respects OS preference
- **Smooth scroll with offset** – `useScrollTo` hook used in NavBar + Footer; `scroll-padding-top: 92px` in CSS
- **About Menu & Section** – "About" navigation in NavBar & Footer with smooth scroll to dedicated `#about` section in `Home.tsx` ✅
- **PWA manifest** – `public/manifest.json` exists (AeroDuct Technician, standalone mode)
- **Vitest config** – `vitest.config.ts` configured with jsdom + react plugin

- **`lib/api.ts`** – Typed API client with live backend integration (`VITE_API_URL`) and graceful fallback for static hosting/offline ✅
- **Push notifications** – Web Push listeners in `public/sw.js`, `lib/notifications.ts` helper, and technician dispatch alert controls in `technician/Dashboard.tsx` ✅
- **`components/ErrorBoundary`** – Route-level error boundary with brand error UI and retry fallback ✅
- **`components/LoadingSkeleton`** – Configurable animated loading skeleton for text, circular, rectangular, and card views ✅
- **`components/OfflineBanner`** – Live online/offline status detection banner for PWA offline operation ✅
- **`pages/NotFound`** – 404 error page with brand header and navigation CTAs ✅

### Frontend — Testing
- **Unit Tests (Vitest)** – 14 test suites / 40 tests passing (Button, Badge, PriceBreakdown, Input, TierCard, SlotPicker, Select, Modal, useTheme, useScrollTo, api, notifications, ErrorBoundary, LoadingSkeleton, OfflineBanner) ✅
- **Playwright E2E** – Flow tests covering homepage, pricing calculator, 3-step booking flow, and digital airway passport ✅

### Frontend — Payment UI
- **Stripe + Bank Transfer buttons** – Present on Pricing page sticky checkout card

### Frontend — SEO & PWA
- **Service Worker** – `public/sw.js` with offline caching, stale-while-revalidate strategy, Web Push handler, registered in `main.tsx` ✅
- **JSON-LD Schema** – `schema.org/HVACBusiness` structured data in `index.html` with geo coordinates and service areas ✅
- **Sitemap & Robots** – `public/sitemap.xml` covering all routes and SEO cities, `public/robots.txt` ✅

---

## 🟡 Partial — Scaffolded but Incomplete

### Backend Handlers (all return stub JSON)
- **`POST /api/v1/pricing/calculate`** – Handler exists but doesn't call `pricing.Calculate`; needs request parsing + engine wiring
- **`GET /api/v1/bookings/slots`** – Returns empty array; needs DB query + date filtering
- **`POST /api/v1/bookings`** – Returns stub; needs validation, DB insert, slot locking
- **`GET /api/v1/bookings/:id`** – Returns stub; needs DB lookup
- **`GET /api/v1/geo/detect`** – Hardcoded "chicago"; needs IP → market logic
- **`GET /api/v1/passport/:id`** – Returns stub; needs DB lookup + CDN URL
- **`GET /api/v1/technician/dispatch/:id`** – Returns empty; needs daily job list from DB
- **`POST /api/v1/technician/checklist/:bookingId`** – Returns stub; needs validation + DB write

---

## ❌ Not Yet Started


### Backend (Go)
- **Database layer** – No `internal/database/` package; no pgx pool, no connection lifecycle
- **Go model structs** – No `internal/model/` mirroring DB schema
- **Booking service** – No `internal/service/booking/`
- **Geo service** – No IP-to-market detection
- **Passport service** – No `internal/service/passport/`
- **Notification service** – No email/SMS (`internal/service/notify/`)
- **Payment integration** – No Stripe or bank transfer backend in `internal/service/payment/`
- **Auth middleware** – JWT config exists but no `middleware/auth.go`; no login/signup routes
- **RBAC / authorization** – No role checks
- **Rate limiting middleware** – Referenced but not implemented
- **Swagger docs** – `make swagger` target ready but never run; no `docs/swagger/`
- **Integration tests** – Only `pricing_test.go` exists

### DevOps / CI-CD
- **GitHub Actions (Frontend Pages)** – `.github/workflows/deploy.yml` deployed to GitHub Pages ✅
- **`backend/Dockerfile`** – Does not exist
- **`frontend/Dockerfile`** – Does not exist
- **E2E CI** – Not configured
- **Release tagging** – Not automated

---

## 🚀 Recommended Next Steps

```
Phase 1 — Fix false-positive [x] items (critical)
  1.1  Create /book — 3-step booking flow page + register route
  1.2  Create /passport/:id — digital certificate page + register route
  1.3  Create /reset-password/:token — password reset page + register route
  1.4  Create /enterprise/new — AMC onboarding form + register route
  1.5  Create /technician/checklist/:bookingId — checklist form + register route
  1.6  Create TierCard, SlotPicker, MarketSelector components (or remove claims)

Phase 2 — Wire the Backend (makes the app real)
  2.1  Database layer: pgx pool + internal/model structs
  2.2  Wire pricing handler → pricing engine
  2.3  Booking service: slots, create, get (with DB)
  2.4  Auth: JWT middleware + login/signup endpoints
  2.5  Geo detection handler

Phase 3 — Swap Frontend Mock → Real API
  3.1  Replace lib/api.ts stubs with real fetch() calls
  3.2  Handle loading/error states on all pages

Phase 4 — Payments & Notifications
  4.1  Stripe backend + webhook handler
  4.2  SendGrid email confirmations
  4.3  Twilio SMS reminders

Phase 5 — Technician PWA & Enterprise
  5.1  Service worker + offline support
  5.2  Real PWA icons in manifest.json
  5.3  /enterprise/new AMC form

Phase 6 — Testing
  6.1  Write unit tests for Button, PriceBreakdown, useScrollTo
  6.2  Write Playwright E2E: home scroll, pricing calculator, quote form

Phase 7 — Production Readiness
  7.1  Dockerfiles for API and Web
  7.2  GitHub Actions CI (lint, test, build, push)
  7.3  E2E tests in CI
```

---

*✅ = verified in codebase · 🟡 = partially implemented · ❌ = not started or falsely marked done*
