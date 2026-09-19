# Feedback — AeroDuct

> Generated: 2026-09-19 after full codebase verification

---

## 🔴 Critical — False Positives in TASK_LIST.md

The following items were marked `[x]` (done) in the original task list but **do not exist in the codebase**. These must be built before any further phase work.

### Missing Pages (routes not registered in `App.tsx`)

| Claimed Item | Status | Detail |
|---|---|---|
| `/book` — 3-step booking flow | ❌ Does not exist | No file, no route. One of the most important user-facing flows. |
| `/passport/:id` — digital certificate page | ❌ Does not exist | No file, no route. Core differentiating feature of the product. |
| `/reset-password/:token` — password reset form | ❌ Does not exist | Only `ForgotPassword.tsx` exists; the actual reset step is missing. |
| `/enterprise/new` — AMC onboarding form | ❌ Does not exist | Route not registered; `enterprise/new` page never created. |
| `/technician/checklist/:bookingId` — checklist form | ❌ Does not exist | `JobDetail.tsx` links to `/technician/checklist/${id}` which 404s. |

### Missing Components

| Claimed Item | Status | Detail |
|---|---|---|
| `TierCard` | ❌ Does not exist | Listed in component inventory but no file in `src/components/`. |
| `SlotPicker` | ❌ Does not exist | Listed but no file. Pricing + booking flows reference it. |
| `MarketSelector` | ❌ Does not exist | Listed but no file. Chicago/India toggle was never built (India removed, so possibly intentional — but should be removed from task list). |

---

## 🟡 Medium — Incomplete Implementations

### lib/api.ts — All Mock, No Real Fetch
Every function in `lib/api.ts` still returns mock data. The file has `// TODO: replace with real fetch()` comments on every method. The backend Go API exists at port 3000 but is completely disconnected from the frontend.

### Playwright E2E — Only a Title Check
`e2e/example.spec.ts` contains one test: `expect(page).toHaveTitle(/AeroDuct/)`. No actual user flows are tested (booking, pricing calculator interaction, form submission, scroll navigation).

### Vitest — Zero Unit Tests
`vitest.config.ts` is correctly set up but there are **zero `.test.tsx` files** in `src/`. The task list claims tests for Button, Badge, TierCard, PriceBreakdown, and SlotPicker are done — none exist.

### PWA Manifest — Placeholder Icon
`public/manifest.json` exists but uses `/vite.svg` as the app icon. Real AeroDuct icons (192×192, 512×512 PNG) are needed for the PWA to be installable on Android/iOS. The service worker also does not exist, so the PWA cannot function offline.

### `/technician/job/:id` — Broken Internal Link
`JobDetail.tsx` renders a link to `/technician/checklist/${id}`. That route does not exist in `App.tsx`. Any technician clicking "Start Checklist" gets a blank page.

---

## 🔵 Design / UX Feedback

### UI Redesign (completed this session)
- **Logo palette correctly applied**: Navy `#203060`, Royal `#0050a0`, Sky `#60a0d0` extracted from `logo.jpg` and used consistently across NavBar, Home, Footer, Pricing, Quote, and Button.
- **Scroll behavior fixed**: `useScrollTo` hook with 92px offset handles same-page and cross-page anchor navigation correctly. `scroll-padding-top: 92px` in CSS ensures native browser jumps (back button, bookmarks) are also offset.
- **Button variants consolidated**: `gradient` aliased to `primary` (navy fill) so no existing code breaks.

### Remaining UX Issues

1. **No `<Select>` component** — Native `<select>` elements are used across Quote and Pricing pages. On dark mode, browsers render these with OS-native styling that can clash with the brand palette. A styled Select component should be built.

2. **Pricing page uses `glass-panel` class partially** — After the sed patch, some `glass-panel` references in Pricing may have been partially replaced. The `glass-panel` CSS class is still defined as an alias for backward compatibility, but its `backdrop-filter` was removed. Visual QA needed on Pricing page cards.

3. **Technician PWA is incomplete UX** — The dispatch view (`/technician`) exists but has no checklist flow, no photo upload, and no offline capability. It's effectively a stub.

4. **No loading states on any page** — When `lib/api.ts` is eventually wired to real endpoints, all pages will briefly render empty. Loading skeletons should be added before the API swap.

5. **Quote form has no client-side validation feedback** — Fields are marked `required` (HTML5) but there are no inline error messages for invalid email format, short phone numbers, etc.

6. **Dark mode consistency** — Pricing page was scaffolded before the redesign and uses `dark:bg-slate-950` / `dark:border-slate-800` instead of the new `dark:bg-[#0a0f1e]` / `dark:border-slate-800` palette. Minor but worth aligning.

---

## 🟢 What's Working Well

- **Build is clean** — TypeScript + Vite build passes with 0 errors after all changes this session.
- **Routing structure** — React Router is set up correctly for all existing routes; dynamic params (`:id`, `:city`) work.
- **Brand consistency** — NavBar, Footer, Home, Quote now share the same 3-color logo palette with no invented colors.
- **Scroll UX** — Cross-page smooth scroll to anchors works correctly from any route.
- **Dark mode** — `useTheme` hook persists to localStorage and respects OS preference; toggle works on all pages.
- **Pricing calculator** — Service area dropdown + checkbox interaction + live total is functional with correct IL tax.
- **Form accessibility** — All form fields have associated `<label htmlFor>` elements with correct IDs.
