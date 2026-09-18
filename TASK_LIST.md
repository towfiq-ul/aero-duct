# Development Task List — AeroDuct

> Last updated: 2026-09-19

---

## ✅ Implemented

### Infrastructure & Tooling
- **Monorepo scaffolding** – Turborepo, `pnpm-workspace.yaml`, root `package.json`
- **Root Makefile** – 50+ targets: `setup`, `dev`, `build`, `db-*`, `test`, `lint`, `docker-*`, etc.
- **API Makefile** – `dev` (air hot-reload), `build`, `build-local`, `test`, `lint`, `swagger`, `loc`
- **`.air.toml`** – Hot-reload config for the Go API
- **Docker Compose** – Postgres container + optional pgAdmin (`infra/docker/docker-compose.yml`)
- **Shared TS config** – `packages/config` (tsconfig, ESLint, Prettier variants)
- **Domain Types** – `packages/types/src/index.ts` with all business models
- **UI utility** – `packages/ui/src/lib/cn.ts` (class-name merger)

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
- **Prisma workspace** – `infra/prisma/package.json` + seed script (slots, technicians, demo customer)

### Frontend (Next.js)
- **Root layout** – `app/layout.tsx` with Inter font, metadata, smooth scroll, antialiasing
- **Design tokens** – `app/globals.css` with Tailwind v4 `@theme` (brand palette, accent colours, radius)
- **`lib/mockData.ts`** – Fully typed mock data: 2 markets, 3 tiers each (5 features), 9 slots, passport with findings, 2 bookings, testimonials, 6 FAQs
- **`lib/api.ts`** – Typed API client (mock-backed, `// TODO` comments ready for real fetch swap)
- **`components/Button`** – `<a>`/`<button>` discriminated union; primary/secondary/ghost × sm/md/lg
- **`components/Badge`** – Status chip: success/warning/info/destructive/default
- **`components/NavBar`** – Sticky header, logo, nav links, mobile-safe Book Now CTA
- **`components/Footer`** – 4-column layout (brand, company, services, legal) + licensed strip
- **`components/TierCard`** – Features list, "Most Popular" badge, selectable state
- **`components/SlotPicker`** – Date-grouped grid, available/selected/unavailable states
- **`components/PriceBreakdown`** – Subtotal → tax (8% US / 18% GST) → total via `Intl.NumberFormat`
- **`components/MarketSelector`** – Chicago / India pill toggle
- **`/` Home page** – Hero, trust bar, 4-step "How It Works", pricing preview, testimonials, FAQ, CTA band
- **`/pricing` page** – Market toggle, selectable tier cards, live price breakdown, full FAQ
- **`/book` page** – 3-step flow: contact info → slot picker → review/confirm → success screen
- **`/passport/[id]` page** – Score cards, findings table, technician info, video placeholder, download/share actions

---

## 🟡 Partial — Scaffolded, Needs Real Logic

### Backend Handlers (all return stub JSON)
- **`POST /api/v1/pricing/calculate`** – Handler exists but doesn't call `pricing.Calculate`; needs request parsing + engine wiring
- **`GET /api/v1/bookings/slots`** – Returns empty array; needs DB query + date filtering
- **`POST /api/v1/bookings`** – Returns stub; needs validation, DB insert, slot locking
- **`GET /api/v1/bookings/:id`** – Returns stub; needs DB lookup
- **`GET /api/v1/geo/detect`** – Hardcoded "chicago"; needs IP → market logic
- **`GET /api/v1/passport/:id`** – Returns stub; needs DB lookup + CDN URL
- **`GET /api/v1/technician/dispatch/:id`** – Returns empty; needs daily job list from DB
- **`POST /api/v1/technician/checklist/:bookingId`** – Returns stub; needs validation + DB write

### Frontend — Wiring
- **`lib/api.ts`** – All functions use mock data; each has a `// TODO` comment to replace with `fetch()` to the Go backend

---

## ❌ Not Yet Started

### Backend (Go)
- **Database layer** – No `internal/database/` package; no pgx pool, no connection lifecycle
- **Go model structs** – No `internal/model/` mirroring DB schema (used by handlers/services)
- **Booking service** – No `internal/service/booking/`; slot conflict checks, availability logic
- **Geo service** – No IP-to-market detection (MaxMind GeoIP or similar)
- **Passport service** – No `internal/service/passport/`; no video CDN URL storage/retrieval
- **Notification service** – No email/SMS (`internal/service/notify/`); SendGrid + Twilio
- **Payment integration** – No Stripe (US) or Razorpay (IN) checkout in `internal/service/payment/`
- **Auth middleware** – JWT secret exists in config but no `middleware/auth.go`; no login/signup routes
- **RBAC / authorization** – No role checks (customer, technician, enterprise, admin)
- **Rate limiting middleware** – Referenced but not implemented
- **Swagger docs** – `make swagger` target ready but `swag init` not run; no `docs/swagger/` yet
- **Integration tests** – No `*_test.go` in handler/service packages (only pricing has tests)

### Frontend (Next.js)
- **Auth pages** – `/login`, `/signup`, `/forgot-password` not created
- **Enterprise portal** – `/enterprise` (AMC management, invoice download) not created
- **Technician PWA** – `/dashboard` with dispatch view, checklist form, offline support
- **PWA manifest** – `public/manifest.json` not created
- **Service worker** – Offline caching for technician app not set up
- **Programmatic SEO** – Dynamic `app/[city]/duct-cleaning/page.tsx` routes not created
- **`components/Input`** – Exists as basic shell (`components/Input.tsx`) but not used in pages; needs label, error state, helper text
- **`components/Card`** – Exists as basic shell; not integrated into design system
- **`components/Container`** – Exists as basic shell; not used after page refactor
- **`components/Select`** – Not created
- **`components/Modal`** – Not created
- **Frontend tests** – No `vitest`/`jest` config; no `*.test.tsx` files; no Playwright E2E setup

### DevOps / CI-CD
- **`apps/api/Dockerfile`** – Referenced in `make docker-build` but file does not exist
- **`apps/web/Dockerfile`** – Referenced in `make docker-build` but file does not exist
- **GitHub Actions** – No `.github/workflows/` directory; no CI pipeline
- **E2E CI** – No Playwright test runner configured
- **Release tagging** – No automated `git tag` on merge

---

## 🚀 Recommended Next Steps

```
Phase 1 — Wire the Backend (makes the app real)
  1.1  Database layer: pgx pool + internal/model structs
  1.2  Wire pricing handler → pricing engine
  1.3  Booking service: slots, create, get (with DB)
  1.4  Auth: JWT middleware + login/signup endpoints
  1.5  Geo detection handler

Phase 2 — Swap Frontend Mock → Real API
  2.1  Replace lib/api.ts stubs with real fetch() calls
  2.2  Handle loading/error states on all pages

Phase 3 — Payments & Notifications
  3.1  Stripe (Chicago) + Razorpay (India) checkout
  3.2  SendGrid email confirmations
  3.3  Twilio SMS reminders

Phase 4 — Technician PWA & Enterprise
  4.1  /dashboard — dispatch + checklist
  4.2  PWA manifest + service worker
  4.3  /enterprise — AMC portal

Phase 5 — Production Readiness
  5.1  Dockerfiles for API and Web
  5.2  GitHub Actions CI (lint, test, build, push)
  5.3  E2E tests (Playwright)
  5.4  Programmatic SEO city pages
```

---

*✅ = done · 🟡 = scaffolded but hollow · ❌ = not started*
