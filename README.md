# AeroDuct — Duct Cleaning Service Platform

A full-stack omnichannel service platform for residential HVAC and commercial duct cleaning across Chicago, IL and surrounding areas (Evanston, Oak Park, Cicero, Skokie, Berwyn).

## Architecture

```
duct-cleaning-service/         # Turborepo monorepo root
├── apps/
│   ├── web/                   # Next.js 14 (App Router) — customer-facing PWA
│   └── api/                   # Go + Gin — REST API gateway
├── packages/
│   ├── types/                 # Shared TypeScript types (API contracts)
│   ├── ui/                    # Shared React component library (Tailwind CSS)
│   └── config/                # Shared ESLint, TypeScript, Prettier configs
├── infra/
│   ├── docker/                # Docker Compose for local dev
│   └── prisma/                # Database schema & migrations (Prisma)
└── docs/                      # Architecture decisions & API specs
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Go 1.27, Gin, SQLC |
| Database | PostgreSQL 17 |
| ORM/Migrations | Prisma (schema) + golang-migrate |
| Monorepo | Turborepo + pnpm workspaces |
| CDN/Storage | AWS S3 + CloudFront |
| Containerization | Docker + Docker Compose |

## Key Features

- 🎨 **Premium UI/UX** — Apple-inspired minimalist design, glassy effects, and a day/night (dark/bright) mode toggle.
- 💰 **Service Area Dynamic Pricing** — interactive fee calculator that adjusts pricing based on the selected service area (Chicago, Evanston, etc.).
- 📅 **Real-time booking** — 2-hour confirmed arrival windows with dispatch sync.
- 📱 **Technician PWA** — mobile dispatch routes, checklists, media upload.
- 🎫 **Digital Duct Health Passport™** — permanent borescope video link per customer.
- 🏭 **Enterprise portal** — multi-site AMC management and invoicing.
- 📄 **Compliance engine** — fire safety and health certificate generation.
- 🔍 **Programmatic SEO** — dynamic landing pages across suburbs/cities.

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 12
- Go >= 1.21
- Docker + Docker Compose
- PostgreSQL (via Docker)

### Installation

```bash
# Install dependencies
pnpm install

# Start local infrastructure (Postgres)
docker compose -f infra/docker/docker-compose.yml up -d

# Run all services in development
pnpm dev
```

### Environment Setup

Copy env files and fill in values:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

## Development

```bash
pnpm dev          # Start all apps in watch mode
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm type-check   # TypeScript type checking
pnpm test         # Run all tests
pnpm format       # Format with Prettier
```

## Service Areas

We provide comprehensive residential and commercial cleaning packages (Air Duct, Dryer Vent, Chimney/Fireplace, IAQ Solutions, etc.) across the following areas:

| City | State | Country |
|---|---|---|
| Chicago | IL | USA |
| Evanston | IL | USA |
| Oak Park | IL | USA |
| Cicero | IL | USA |
| Skokie | IL | USA |
| Berwyn | IL | USA |

## License

Private — All rights reserved.
