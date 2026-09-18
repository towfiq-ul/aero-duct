# Development Plan for AeroDuct

> Generated: 2026-09-18

## ✅ Implemented (already in codebase)
- **Monorepo scaffolding** – Turborepo, `pnpm-workspace.yaml`, root `package.json`.
- **Root Makefile** – All helper commands (`setup`, `dev`, `build`, `db-*`, `test`, `lint`, `docker-*`, etc.).
- **API Makefile** – Dev (air), build, test, lint, swagger, loc.
- **Docker Compose** – Postgres container + optional pgAdmin.
- **Prisma schema** – Full data model (enums + 10+ tables).
- **Prisma workspace package** – `infra/prisma/package.json` + seed script.
- **Shared TS config** – `packages/config` (tsconfig, ESLint, Prettier).
- **Domain Types** – `packages/types/src/index.ts` with all business models.
- **UI utility** – `packages/ui/src/lib/cn.ts` (class‑name merger).
- **API core** – `cmd/api/main.go`, `internal/router/router.go`, `internal/middleware`, `internal/config`, `internal/apierr`.
- **Pricing engine** – `internal/pricing/pricing.go` + unit tests.
- **Health endpoint** – `handler.Health`.
- **Root layout & globals** – Next.js `app/layout.tsx`, `app/globals.css` with Tailwind v4 design tokens.
- **Landing page** – Minimal home page (`apps/web/app/page.tsx`).
- **`.air.toml`** – Hot‑reload config for API development.

## 🟡 Partially implemented (scaffolded, needs real logic)
- **API Handlers** (`apps/api/internal/handler/handlers.go`): all endpoints exist but return placeholder JSON.
- **API `pricing` handler** – stub; should invoke `pricing.Calculate`.
- **API `bookings` handlers** – stub; need DB queries, validation, payment.
- **API `geo` handler** – stub; should detect market from IP.
- **API `passport` handler** – stub; should fetch Duct Health Passport data.
- **API `technician` handlers** – stub; need dispatch logic and checklist persistence.
- **UI components** – only `cn()` utility; UI library missing Button, Input, Card, etc.
- **Home page** – only hero; navigation/header/footer not built.

## ❌ Not yet started / missing
### Backend (Go)
- **Database layer** – pgx pool, model structs, migrations integration.
- **Authentication** – JWT middleware, login/signup routes.
- **Authorization / RBAC** – role checks for technicians, enterprise users.
- **Rate limiting** – middleware for API abuse protection.
- **Booking service** – business logic for slot allocation, conflict checks.
- **Payment integration** – Stripe (US) & Razorpay (IN) checkout flows.
- **Notification service** – email/SMS via SendGrid/Twilio.
- **Passport generation** – store/retrieve video CDN URLs, timestamps.
- **Swagger docs** – `make swagger` generates but no `docs/swagger` folder yet.
- **Dockerfiles** – `apps/api/Dockerfile` and `apps/web/Dockerfile` referenced but not present.
- **Integration tests** – API endpoint tests beyond pricing.

### Frontend (Next.js)
- **API client** – wrapper (`lib/api.ts`) to call Go endpoints.
- **Navigation component** – header with market‑aware links.
- **Footer component** – branding & legal links.
- **Pricing page** – interactive calculator calling `/pricing/calculate`.
- **Booking flow** – multi‑step form: service tier → slot picker → checkout.
- **Time‑slot picker UI** – calendar/grid component.
- **Passport page** – public view of a duct‑health passport.
- **Enterprise portal** – AMC management, invoice download.
- **Technician PWA** – offline support, service‑worker, manifest.
- **Auth pages** – login, signup, password reset.
- **Programmatic SEO pages** – dynamic `[city]/duct-cleaning` routes.
- **Shared UI components** – Button, Input, Badge, Card, Select, Modal, Stepper, PriceBreakdown, TimeSlotPicker, etc.
- **Testing** – `vitest`/`jest` config, component tests, E2E (Playwright/Cypress).
- **PWA manifest & service worker** – offline caching for technician app.

### DevOps / CI‑CD
- **GitHub Actions workflow** – lint, test, build, Docker image push.
- **Docker image builds** – `make docker-build` should output images.
- **E2E CI pipeline** – run Playwright tests on PRs.
- **Release tagging** – automated `git tag` on successful CI.

## 🚀 Suggested Phase Order
1. **Backend Core** – DB layer, models, auth, booking service, integrate pricing handler.
2. **Frontend Core** – API client, shared UI components, navigation/footer.
3. **Feature Pages** – Pricing calculator, booking flow, passport view.
4. **Payments & Notifications** – Stripe, Razorpay, email/SMS.
5. **Technician PWA** – dispatch, checklist, offline support.
6. **Enterprise Portal & SEO Pages**.
7. **Dockerfiles & CI/CD** – final polishing for production.

---

*All points flagged with ✅, 🟡, or ❌ reflect the current state of the repository.*
