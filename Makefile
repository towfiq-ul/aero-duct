.DEFAULT_GOAL := help
SHELL         := /bin/bash
export PATH   := $(shell go env GOPATH 2>/dev/null)/bin:$(PATH)

BOLD  := $(shell tput bold 2>/dev/null || echo "")
GREEN := $(shell tput setaf 2 2>/dev/null || echo "")
CYAN  := $(shell tput setaf 6 2>/dev/null || echo "")
RESET := $(shell tput sgr0 2>/dev/null || echo "")

# ── Help ──────────────────────────────────────────────────────────
.PHONY: help
help: ## Show this interactive help menu
	@echo ""
	@echo "  $(BOLD)AeroDuct — Monorepo Command Center$(RESET)"
	@echo ""
	@echo "  $(BOLD)Development:$(RESET)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "setup" "Install all root, frontend, and backend dependencies"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "dev" "Start both backend (air) and frontend (vite) concurrently"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "backend" "Start Go API server with hot-reload"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "backend-run" "Start Go API server without hot-reload (plain go run)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "frontend" "Start React/Vite dev server with HMR"
	@echo ""
	@echo "  $(BOLD)Testing:$(RESET)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "test" "Run all test suites (frontend Vitest + backend Go tests)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "test-fe" "Run frontend Vitest unit test suite (40 tests)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "test-be" "Run backend Go integration & unit test suite"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "test-e2e" "Run Playwright end-to-end browser flows"
	@echo ""
	@echo "  $(BOLD)Building:$(RESET)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "build" "Build both backend binary and frontend production bundle"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "build-fe" "Build frontend production bundle (Vite dist)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "build-fe-sit" "Build frontend for GitHub Pages (/aero-duct/ base)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "build-be" "Build standalone Linux/AMD64 Go binary (no CGO)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "build-be-local" "Build backend binary for host OS/architecture"
	@echo ""
	@echo "  $(BOLD)Database (SQLite / Prisma):$(RESET)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "db-migrate" "Run Prisma database migrations"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "db-seed" "Seed database with technicians and time slots"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "db-studio" "Open Prisma Studio visual database inspector"
	@echo ""
	@echo "  $(BOLD)Quality & Maintenance:$(RESET)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "lint" "Typecheck frontend (tsc) and vet backend (go vet)"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "clean" "Remove all build artifacts, dist folders, and caches"
	@printf "    $(CYAN)%-22s$(RESET) %s\n" "tidy" "Tidy Go dependencies and sync pnpm lockfile"
	@echo ""

# ── Development ───────────────────────────────────────────────────
.PHONY: setup
setup: db-migrate db-seed ## Install all dependencies and bootstrap database
	@echo "$(GREEN)▶ Installing frontend and backend dependencies...$(RESET)"
	pnpm install
	cd backend && go mod tidy

.PHONY: dev
dev: ## Run both backend and frontend concurrently
	@echo "$(GREEN)▶ Launching backend + frontend concurrently...$(RESET)"
	make -j2 backend frontend

.PHONY: backend
backend: ## Run backend with Air hot-reload
	@echo "$(GREEN)▶ Starting Go API with Air hot-reload...$(RESET)"
	@which air > /dev/null 2>&1 || (echo "Installing air..." && go install github.com/air-verse/air@latest)
	cd backend && air -c .air.toml

.PHONY: backend-run
backend-run: ## Run backend without hot-reload
	@echo "$(GREEN)▶ Starting Go API (plain go run)...$(RESET)"
	cd backend && go run cmd/api/main.go

.PHONY: frontend
frontend: ## Run frontend dev server
	@echo "$(GREEN)▶ Starting Vite frontend dev server...$(RESET)"
	pnpm -C frontend dev

# ── Testing ───────────────────────────────────────────────────────
.PHONY: test
test: test-be test-fe ## Run both backend and frontend test suites
	@echo "  $(GREEN)✅ All test suites passed!$(RESET)"

.PHONY: test-fe
test-fe: ## Run frontend Vitest suite
	@echo "$(GREEN)▶ Running frontend unit tests (Vitest)...$(RESET)"
	pnpm -C frontend vitest run

.PHONY: test-be
test-be: ## Run backend Go tests
	@echo "$(GREEN)▶ Running backend integration & unit tests (go test)...$(RESET)"
	cd backend && go test -v ./...

.PHONY: test-e2e
test-e2e: ## Run Playwright E2E tests
	@echo "$(GREEN)▶ Running Playwright E2E browser tests...$(RESET)"
	pnpm -C frontend test:e2e

# ── Building ──────────────────────────────────────────────────────
.PHONY: build
build: build-be build-fe ## Build both backend binary and frontend web
	@echo "  $(GREEN)✅ Full stack build completed!$(RESET)"

.PHONY: build-fe
build-fe: ## Build frontend production assets
	@echo "$(GREEN)▶ Compiling frontend (Vite)...$(RESET)"
	pnpm -C frontend build

.PHONY: build-fe-sit
build-fe-sit: ## Build frontend for GitHub Pages deployment
	@echo "$(GREEN)▶ Compiling frontend for GitHub Pages (base: /aero-duct/)...$(RESET)"
	pnpm -C frontend build:sit

.PHONY: build-be
build-be: ## Build production backend binary (CGO_ENABLED=0 linux/amd64)
	@echo "$(GREEN)▶ Compiling production Go binary...$(RESET)"
	@mkdir -p backend/bin
	cd backend && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
	  go build -ldflags="-w -s" -o bin/aeroduct-api cmd/api/main.go
	@echo "  $(GREEN)✅ Binary created at backend/bin/aeroduct-api$(RESET)"

.PHONY: build-be-local
build-be-local: ## Build backend binary for local architecture
	@echo "$(GREEN)▶ Compiling local Go binary...$(RESET)"
	@mkdir -p backend/bin
	cd backend && go build -o bin/aeroduct-api cmd/api/main.go
	@echo "  $(GREEN)✅ Local binary created at backend/bin/aeroduct-api$(RESET)"

# ── Database ──────────────────────────────────────────────────────
.PHONY: db-migrate
db-migrate: ## Run Prisma migrations
	@echo "$(GREEN)▶ Running database migrations...$(RESET)"
	cd backend/prisma && DATABASE_URL="file:./dev.db" pnpm migrate:dev --name init 2>/dev/null || true

.PHONY: db-seed
db-seed: ## Seed database
	@echo "$(GREEN)▶ Seeding database...$(RESET)"
	cd backend/prisma && DATABASE_URL="file:./dev.db" pnpm seed 2>/dev/null || true

.PHONY: db-studio
db-studio: ## Open Prisma Studio
	cd backend/prisma && DATABASE_URL="file:./dev.db" pnpm studio

# ── Quality & Maintenance ─────────────────────────────────────────
.PHONY: lint
lint: ## Check TypeScript and run Go vet
	@echo "$(GREEN)▶ Running frontend TypeScript typecheck...$(RESET)"
	pnpm -C frontend tsc -b
	@echo "$(GREEN)▶ Running backend Go vet...$(RESET)"
	cd backend && go vet ./...
	@echo "  $(GREEN)✅ Lint & typecheck passed!$(RESET)"

.PHONY: clean
clean: ## Remove build artifacts, dist, and temporary caches
	@echo "$(GREEN)▶ Cleaning build artifacts...$(RESET)"
	rm -rf backend/bin backend/tmp backend/coverage.out
	rm -rf frontend/dist frontend/.turbo
	@echo "  $(GREEN)✅ Clean complete.$(RESET)"

.PHONY: tidy
tidy: ## Tidy Go dependencies and sync pnpm workspace
	@echo "$(GREEN)▶ Tidying backend Go dependencies...$(RESET)"
	cd backend && go mod tidy
	@echo "$(GREEN)▶ Syncing root dependencies...$(RESET)"
	pnpm install
