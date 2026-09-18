# AeroDuct — Development Plan

> This document outlines the full development roadmap, broken into three tracks: Frontend, Backend, and DevOps.
> Each track is ordered by dependency and priority.

---

## Frontend

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

---

## Backend

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

---

## DevOps

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

---

*Legend: ✅ done in this session · [ ] not started*
