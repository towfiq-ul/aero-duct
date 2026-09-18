# Development Task List — AeroDuct

> Last updated: 2026-09-19

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
- **`backend/Dockerfile`** – Referenced in `make docker-build` but file does not exist
- **`frontend/Dockerfile`** – Referenced in `make docker-build` but file does not exist
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


## Tasks Moved from PLAN.md

### Phase F1 — Core (Done ✅)
- [x] Design tokens — Tailwind v4 `@theme` (brand palette, radius, fonts)
- [x] `Button` — `<a>` / `<button>` discriminated union, 3 variants × 3 sizes
- [x] `Badge` — 5 status variants
- [x] `NavBar` — sticky header, mobile-safe
- [x] `Footer` — 4-column layout, legal strip
- [x] `TierCard` — features list, popular badge, selectable state
- [x] `SlotPicker` — date-grouped grid, available / selected / unavailable states
- [x] `PriceBreakdown` — Intl.NumberFormat, US sales tax + India GST
- [x] `MarketSelector` — Chicago / India pill toggle
- [x] Mock data (`lib/mockData.ts`) — markets, tiers, slots, passport, bookings, testimonials, FAQs
- [x] API client (`lib/api.ts`) — typed, mock-backed, `// TODO` comments for real fetch swap

### Phase F2 — Pages (Done ✅)
- [ ] Catchy Heading: Add an attractive, high-converting hero heading. (from PRD)
- [ ] Trust Signals: Display a prominent review score/rating (e.g., "4.9/5 stars based on 200+ reviews") near the heading. (from PRD)
- [ ] Design Quality: Remove "AI slop" in FE design (ensure authentic, professional, and human-centric UI/UX). (from PRD)
- [ ] Design Reference: Base UI/UX ideas on the existing project at `/home/towfiq/workspace/cleanduct/frontend`. (from PRD)
- [ ] Exclusions: Remove "Live Dispatch" from the design completely. (from PRD)
- [ ] Top Menu: Include tabs for "Services", "Reviews", "FAQ", and "Contact". (from PRD)
- [ ] Smooth Scrolling: Implementing animated, smooth scrolling when a menu tab is clicked, directing the user to the relevant section on the page. (from PRD)
- [ ] Air Duct Cleaning: From $299 (Removing dust, debris, and allergens from home ductwork systems to improve airflow and reduce indoor pollutants.) (from PRD)
- [ ] Dryer Vent Cleaning: From $129 (Clearing lint and blockages from dryer exhaust vent lines to prevent fire hazards and improve appliance efficiency.) (from PRD)
- [ ] Chimney Sweep & Fireplace Cleaning: From $189 (Removing dangerous soot, creosote buildup, and physical blockages from residential chimneys.) (from PRD)
- [ ] UV Light & Air Purification: From $449 (from PRD)
- [ ] Duct Sanitizing & Odor Removal: From $99 (from PRD)
- [ ] Duct Repair & Sealing: Custom quote (from PRD)
- [ ] HVAC & Air Duct Inspection: From $79 (from PRD)
- [ ] Fireplace Cleaning: Scrubbing and maintaining the internal firebox and surrounding hearth area for safety and aesthetic upkeep. (from PRD)
- [ ] Carpet Cleaning: Deep extraction cleaning to lift embedded dirt, stains, and allergens from residential and commercial carpets. (from PRD)
- [ ] Upholstery Cleaning: Specialized stain removal, deodorizing, and fabric refreshing for home and office furniture. (from PRD)
- [ ] Pressure Washing: High-pressure water cleaning for hard exterior surfaces like building facades, driveways, and sidewalks. (from PRD)
- [ ] Indoor Air Quality (IAQ) Testing and Assessment: Measuring airborne pollutants, mold spores, and particulate matter to establish a baseline for indoor air health. (from PRD)
- [ ] Indoor Air Quality Solutions: Installing permanent fixtures like UV lights, whole-home humidifiers, and high-efficiency air purifiers directly into the HVAC system. (from PRD)
- [ ] Antimicrobial Duct Treatments: Applying EPA-registered sanitizing fogs or sprays within the ductwork to actively eliminate mold, bacteria, and lingering odors. (from PRD)
- [ ] Furnace Cleaning and Maintenance: Inspecting, cleaning, and tuning up internal furnace components (blowers, burners, heat exchangers) to ensure safe and efficient winter operation. (from PRD)
- [ ] AC Repair, Maintenance, and Installation: Troubleshooting broken central air conditioning units, performing seasonal refrigerant checks, and installing new condenser systems. (from PRD)
- [ ] Full HVAC System Cleaning: A comprehensive service that goes beyond the vents to clean the entire mechanical heating and cooling system, including evaporator coils and blower motors. (from PRD)
- [ ] Multi-Point Video Air Duct Inspections: Deploying robotic or scoped cameras to visually inspect, document, and record the interior condition of ductwork before and after cleaning. (from PRD)
- [ ] Commercial Air Duct Cleaning: Custom quote (Large-scale vent and HVAC system cleaning designed to meet corporate compliance and handle multi-zone facilities.) (from PRD)
- [ ] Commercial Dryer Vent Cleaning: Custom quote (from PRD)
- [ ] Pot of Gold Maintenance Plan: A recurring seasonal membership that provides regular tune-ups and priority scheduling for heating and cooling units to prevent breakdowns and extend equipment lifespans. (from PRD)
- [ ] Asure Extended Service Plans: Extended warranty packages for specific new HVAC installations that cover labor and replacement parts with zero deductibles for unbudgeted repairs. (from PRD)
- [ ] Furnace Package Units: Flat-rate, all-in-one maintenance and cleaning tiers specifically tailored for packaged HVAC systems (combined heating and cooling units). (from PRD)
- [ ] Comprehensive Chimney and Fireplace Packages: Bundled service tiers that combine standard chimney sweeping, Level 1 visual safety inspections, and minor internal masonry repairs into a single cost. (from PRD)
- [ ] Indoor Air Quality Long-Term Monitoring Packages: Subscription or bundled services that include initial air testing, customized remediation reports, and ongoing sensor tracking of a property's air health. (from PRD)
- [ ] Whole-Home Air Duct Cleaning Packages: Tiered pricing models that cover the cleaning of all supply and return vents in a standard-sized home, frequently bundled with dryer vent cleaning or baseline antimicrobial treatments at a discounted rate. (from PRD)
- [ ] Fees Calculator: Add an interactive calculator that adjusts fees dynamically based on the selected service area. (from PRD)
- [ ] Request for Quote Form: (from PRD)
- [ ] Collect basic user contact information. (from PRD)
- [ ] Include a "Service Area" dropdown/list. (Note: Remove India as service area) (from PRD)
- [ ] Include a "Package/Services" selection list. (from PRD)
- [ ] Service Areas: (from PRD)
- [ ] Chicago, IL (from PRD)
- [ ] Evanston, IL (from PRD)
- [ ] Oak Park, IL (from PRD)
- [ ] Cicero, IL (from PRD)
- [ ] Skokie, IL (from PRD)
- [ ] Berwyn, IL (from PRD)
- [ ] Google Reviews Integration: A dedicated section or tab that automatically parses and displays reviews directly from the company's Google Reviews page. (from PRD)
- [ ] Catchy Heading: Add an attractive, high-converting hero heading. (from PRD)
- [ ] Trust Signals: Display a prominent review score/rating (e.g., "4.9/5 stars based on 200+ reviews") near the heading. (from PRD)
- [ ] Design Quality: Remove "AI slop" in FE design (ensure authentic, professional, and human-centric UI/UX). (from PRD)
- [ ] Top Menu: Include tabs for "Services", "Reviews", and "Contact". (from PRD)
- [ ] Smooth Scrolling: Implementing animated, smooth scrolling when a menu tab is clicked, directing the user to the relevant section on the page. (from PRD)
- [ ] Services List: Clearly list all available services. (from PRD)
- [ ] Service Details: Include a description and base price for each service. (from PRD)
- [ ] Packages: List available service packages (e.g., Basic, Premium, Full-House). (from PRD)
- [ ] Fees Calculator: Add an interactive calculator that adjusts fees dynamically based on the selected service area. (from PRD)
- [ ] Request for Quote Form: (from PRD)
- [ ] Collect basic user contact information. (from PRD)
- [ ] Include a "Service Area" dropdown/list. (from PRD)
- [ ] Include a "Package/Services" selection list. (from PRD)
- [ ] Google Reviews Integration: A dedicated section or tab that automatically parses and displays reviews directly from the company's Google Reviews page. (from PRD)
- [x] `/` — Hero, trust bar, How It Works (4 steps), pricing preview, testimonials, FAQ, CTA
- [x] `/pricing` — Market toggle, selectable tier cards, live price breakdown, FAQ
- [x] `/book` — 3-step flow: contact info → slot picker → review/confirm → success screen
- [x] `/passport/[id]` — Score cards, findings table, technician info, video placeholder

### Phase F3 — Auth Pages
- [ ] `/login` — Email + password form, "Forgot password?" link
- [ ] `/signup` — Name, email, password, market selection
- [ ] `/forgot-password` — Email input, confirmation message
- [ ] `/reset-password/[token]` — New password form

### Phase F4 — Swap Mock → Real API
- [ ] Replace all `lib/api.ts` stubs with real `fetch()` calls to Go backend
- [ ] Add loading skeletons on tier cards, slot picker, passport page
- [ ] Add error boundary / error.tsx per route segment
- [ ] Handle 4xx / 5xx responses gracefully on all forms

### Phase F5 — Enterprise Portal
- [ ] `/enterprise` — Landing page for AMC / annual maintenance contract enquiries
- [ ] `/enterprise/dashboard` — Contract list, invoice download, renewal status
- [ ] `/enterprise/new` — AMC onboarding form (property details, contact, tier selection)

### Phase F6 — Technician PWA
- [ ] `/dashboard` — Today's dispatch list (job cards with address, tier, slot)
- [ ] `/dashboard/job/[id]` — Job detail: customer info, checklist form, photo upload
- [ ] `/dashboard/checklist/[bookingId]` — Submit service checklist
- [ ] `public/manifest.json` — PWA manifest (name, icons, theme colour, start URL)
- [ ] Service worker — Offline caching for dispatch list and checklist form
- [ ] Push notifications — "New job assigned" alerts

### Phase F7 — Programmatic SEO
- [ ] `app/[city]/duct-cleaning/page.tsx` — City landing pages (Chicago neighbourhoods, Indian cities)
- [ ] `app/sitemap.ts` — Dynamic sitemap generation
- [ ] `app/robots.ts` — Robots.txt
- [ ] JSON-LD structured data on home, pricing, and city pages

### Phase F8 — Testing
- [ ] Configure `vitest` + `@testing-library/react`
- [ ] Unit tests for `Button`, `Badge`, `TierCard`, `PriceBreakdown`, `SlotPicker`
- [ ] Unit tests for `lib/mockData.ts` and `lib/api.ts`
- [ ] `Playwright` E2E: full booking flow, pricing page market switch, passport view

### Phase B1 — Database Layer
- [ ] `internal/database/db.go` — pgx connection pool, `Open()`, `Close()`, health ping
- [ ] `internal/model/` — Go structs mirroring every Prisma table (Booking, Slot, Customer, Technician, Passport, etc.)
- [ ] `golang-migrate` integration — run migrations from `backend/prisma/migrations/`
- [ ] Repository pattern — `internal/repository/` with typed query methods per domain

### Phase B2 — Wire Existing Handlers
- [ ] `POST /api/v1/pricing/calculate` — parse request body, call `pricing.Calculate`, return breakdown
- [ ] `GET /api/v1/bookings/slots` — query DB for available slots by date + market
- [ ] `GET /api/v1/geo/detect` — IP → market via MaxMind GeoLite2 or Cloudflare header
- [ ] `GET /api/v1/passport/:id` — DB lookup, return passport with CDN video URL

### Phase B3 — Auth
- [ ] `POST /api/v1/auth/signup` — create customer, hash password (bcrypt), return JWT
- [ ] `POST /api/v1/auth/login` — verify credentials, return JWT + refresh token
- [ ] `POST /api/v1/auth/refresh` — issue new access token from refresh token
- [ ] `POST /api/v1/auth/logout` — invalidate refresh token
- [ ] `middleware/auth.go` — JWT validation, inject user into Gin context
- [ ] RBAC — `customer`, `technician`, `enterprise`, `admin` roles; guard protected routes

### Phase B4 — Booking Service
- [ ] `internal/service/booking/` — business logic package
- [ ] Slot locking — pessimistic lock or DB transaction to prevent double-booking
- [ ] `POST /api/v1/bookings` — validate input, lock slot, insert booking, return confirmation
- [ ] `GET /api/v1/bookings/:id` — fetch booking with tier, slot, customer
- [ ] `PATCH /api/v1/bookings/:id/reschedule` — swap slot (within 24h policy)
- [ ] `DELETE /api/v1/bookings/:id` — cancel (policy enforcement)

### Phase B5 — Technician API
- [ ] `GET /api/v1/technician/dispatch/:technicianId` — today's jobs ordered by slot start
- [ ] `POST /api/v1/technician/checklist/:bookingId` — persist findings, set booking status = completed
- [ ] `POST /api/v1/technician/passport/:bookingId` — generate passport, store CDN URL, issue passport ID

### Phase B6 — Payments
- [ ] `internal/service/payment/stripe.go` — Stripe PaymentIntent for Chicago (USD)
- [ ] `internal/service/payment/razorpay.go` — Razorpay Order for India (INR)
- [ ] `POST /api/v1/payments/intent` — create payment intent, return client secret
- [ ] `POST /api/v1/payments/webhook` — handle Stripe / Razorpay webhooks, update booking status
- [ ] Currency formatting + tax computation per market (already in pricing engine)

### Phase B7 — Notifications
- [ ] `internal/service/notify/email.go` — SendGrid transactional email (booking confirmation, day-before reminder)
- [ ] `internal/service/notify/sms.go` — Twilio SMS (30-min arrival alert, booking confirmation)
- [ ] Email templates — confirmation, reminder, passport-ready
- [ ] Notification queue — async delivery (goroutine or Redis queue)

### Phase B8 — Passport Generation
- [ ] `internal/service/passport/` — create passport record post-service
- [ ] Upload technician photos to S3 / CloudFront
- [ ] Upload service video to S3 (presigned URL flow)
- [ ] Generate signed passport PDF (optional; can use html-pdf or external service)
- [ ] `GET /api/v1/passport/:id` — fully implemented with CDN URLs

### Phase B9 — Code Quality & Tests
- [ ] `golangci-lint` config (`.golangci.yml`) with strict rules
- [ ] Integration tests for all handler packages (using testcontainers-go)
- [ ] Table-driven tests for booking service (slot locking, conflict cases)
- [ ] Swagger docs — run `make swagger`, commit `docs/swagger/`
- [ ] Rate limiting middleware (go-rate or token bucket)

### Phase D1 — Dockerfiles
- [ ] `backend/Dockerfile` — multi-stage: `golang:1.23-alpine` builder → `scratch` / `alpine` runner
- [ ] `frontend/Dockerfile` — multi-stage: `node:22-alpine` builder → standalone Next.js output
- [ ] Verify `make docker-build` produces working images
- [ ] Add `.dockerignore` for both apps

### Phase D2 — Docker Compose (full stack)
- [ ] Add `api` and `web` services to `docker-compose.yml`
- [ ] Wire environment variables from `.env` into containers
- [ ] Add `depends_on: postgres` with health-check condition for the API service
- [ ] `make dev` brings up all three services (postgres + api + web)

### Phase D3 — CI Pipeline (GitHub Actions)
- [ ] `.github/workflows/ci.yml`
  - Trigger: push to `main`, all PRs
  - Jobs: `lint-api` (golangci-lint), `test-api` (go test -race), `build-api`
  - Jobs: `lint-web` (next lint), `type-check` (tsc --noEmit), `build-web`
- [ ] Cache: Go module cache, pnpm store
- [ ] Fail PR if any job fails

### Phase D4 — CD Pipeline
- [ ] `.github/workflows/deploy.yml`
  - Trigger: push to `main` after CI passes
  - Build + push Docker images to GitHub Container Registry (ghcr.io)
  - Tag images with Git SHA and `latest`
- [ ] Deploy to target environment (Railway / Fly.io / EC2 — TBD)
- [ ] Automated `git tag vX.Y.Z` on release

### Phase D5 — E2E in CI
- [ ] Install Playwright in CI environment
- [ ] `.github/workflows/e2e.yml` — spin up API + Web in Docker, run Playwright tests
- [ ] Screenshot / video artefacts on failure

### Phase D6 — Observability
- [ ] Structured logging in Go API (`slog` or `zap`)
- [ ] Request tracing with `X-Request-ID` propagated to logs
- [ ] Health check endpoint extended: DB ping, version, uptime
- [ ] Error tracking integration (Sentry for both API and Web)
- [ ] Uptime monitoring (Better Uptime or similar)
