# ═══════════════════════════════════════════════════════════════════
#  AeroDuct — Root Makefile
#  Orchestrates the full monorepo: infra, API (Go), and Web (Next.js)
# ═══════════════════════════════════════════════════════════════════

.DEFAULT_GOAL := help
SHELL         := /bin/bash
COMPOSE_FILE  := infra/docker/docker-compose.yml

# Colours (only when stdout is a TTY)
ifeq ($(shell tty -s && echo yes),yes)
  BOLD  := $(shell tput bold)
  GREEN := $(shell tput setaf 2)
  CYAN  := $(shell tput setaf 6)
  RESET := $(shell tput sgr0)
else
  BOLD  :=
  GREEN :=
  CYAN  :=
  RESET :=
endif

# ── Help ──────────────────────────────────────────────────────────
.PHONY: help
help: ## Show this help message
	@echo ""
	@echo "  $(BOLD)AeroDuct Monorepo$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_\-\/]+:.*##/ {printf "  $(CYAN)%-28s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""

# ═══════════════════════════════════════════════════════════════════
#  SETUP
# ═══════════════════════════════════════════════════════════════════

.PHONY: setup
setup: ## Bootstrap the full project (install deps + copy env files)
	@echo "$(GREEN)▶ Installing Node dependencies...$(RESET)"
	pnpm install
	@echo "$(GREEN)▶ Downloading Go dependencies...$(RESET)"
	cd apps/api && go mod download
	@$(MAKE) env-copy
	@echo ""
	@echo "  $(BOLD)✅ Setup complete!$(RESET)"
	@echo "  Next: run $(CYAN)make dev$(RESET) to start everything."
	@echo ""

.PHONY: env-copy
env-copy: ## Copy .env.example → .env files (skips if already exists)
	@[ -f apps/web/.env.local ]  || (cp apps/web/.env.example  apps/web/.env.local  && echo "  Created apps/web/.env.local")
	@[ -f apps/api/.env ]        || (cp apps/api/.env.example  apps/api/.env         && echo "  Created apps/api/.env")

# ═══════════════════════════════════════════════════════════════════
#  DEVELOPMENT
# ═══════════════════════════════════════════════════════════════════

.PHONY: dev
dev: db-up ## Start all services (DB + API + Web) in development mode
	@echo "$(GREEN)▶ Starting all services...$(RESET)"
	pnpm dev

.PHONY: dev/web
dev/web: ## Start only the Next.js web app
	pnpm --filter @aeroduct/web dev

.PHONY: dev/api
dev/api: ## Start only the Go API (with hot-reload via air)
	$(MAKE) -C apps/api dev

.PHONY: dev/api-run
dev/api-run: ## Start only the Go API (plain go run, no hot-reload)
	$(MAKE) -C apps/api run

# ═══════════════════════════════════════════════════════════════════
#  BUILD
# ═══════════════════════════════════════════════════════════════════

.PHONY: build
build: ## Build all apps (web + api)
	@echo "$(GREEN)▶ Building all packages...$(RESET)"
	pnpm build
	$(MAKE) -C apps/api build

.PHONY: build/web
build/web: ## Build only the Next.js web app
	pnpm --filter @aeroduct/web build

.PHONY: build/api
build/api: ## Build only the Go API binary
	$(MAKE) -C apps/api build

.PHONY: build/packages
build/packages: ## Build shared packages (types, ui)
	pnpm --filter @aeroduct/types build
	pnpm --filter @aeroduct/ui build

# ═══════════════════════════════════════════════════════════════════
#  DATABASE
# ═══════════════════════════════════════════════════════════════════

.PHONY: db-up
db-up: ## Start the Postgres container
	@echo "$(GREEN)▶ Starting Postgres...$(RESET)"
	docker-compose -f $(COMPOSE_FILE) up -d postgres
	@echo "  Waiting for Postgres to be ready..."
	@until docker-compose -f $(COMPOSE_FILE) exec -T postgres pg_isready -U aeroduct -d aeroduct_dev > /dev/null 2>&1; do sleep 1; done
	@echo "  $(GREEN)✅ Postgres ready$(RESET)"

.PHONY: db-down
db-down: ## Stop and remove containers (keeps volume data)
	docker-compose -f $(COMPOSE_FILE) down

.PHONY: db-reset
db-reset: ## ⚠ Destroy and recreate the database volume
	docker-compose -f $(COMPOSE_FILE) down -v
	$(MAKE) db-up

.PHONY: db-logs
db-logs: ## Tail Postgres container logs
	docker-compose -f $(COMPOSE_FILE) logs -f postgres

.PHONY: db-shell
db-shell: ## Open a psql shell inside the Postgres container
	docker-compose -f $(COMPOSE_FILE) exec postgres psql -U aeroduct -d aeroduct_dev

.PHONY: db-migrate
db-migrate: db-up ## Run pending Prisma migrations
	@echo "$(GREEN)▶ Running Prisma migrations...$(RESET)"
	cd infra/prisma && DATABASE_URL=$$(grep DATABASE_URL apps/api/.env | cut -d= -f2-) pnpm migrate:dev

.PHONY: db-seed
db-seed: db-up ## Seed the database with development data
	@echo "$(GREEN)▶ Seeding database...$(RESET)"
	cd infra/prisma && DATABASE_URL=$$(grep DATABASE_URL apps/api/.env | cut -d= -f2-) pnpm seed

.PHONY: db-studio
db-studio: ## Open Prisma Studio (database GUI)
	cd infra/prisma && pnpm studio

.PHONY: pgadmin
pgadmin: ## Start PgAdmin UI at http://localhost:5050
	docker-compose -f $(COMPOSE_FILE) --profile tools up -d pgadmin
	@echo "  $(CYAN)PgAdmin → http://localhost:5050$(RESET) (admin@aeroduct.local / admin)"

# ═══════════════════════════════════════════════════════════════════
#  TESTING
# ═══════════════════════════════════════════════════════════════════

.PHONY: test
test: ## Run all tests (Go + Node)
	$(MAKE) test/api
	$(MAKE) test/web

.PHONY: test/api
test/api: ## Run Go API tests with race detector
	$(MAKE) -C apps/api test

.PHONY: test/api-coverage
test/api-coverage: ## Run Go tests and open HTML coverage report
	$(MAKE) -C apps/api test
	$(MAKE) -C apps/api test-coverage

.PHONY: test/web
test/web: ## Run Next.js tests
	pnpm --filter @aeroduct/web test

.PHONY: test/pricing
test/pricing: ## Run only the pricing engine tests
	cd apps/api && go test ./internal/pricing/... -v -race

# ═══════════════════════════════════════════════════════════════════
#  CODE QUALITY
# ═══════════════════════════════════════════════════════════════════

.PHONY: lint
lint: ## Lint all packages (Go + TypeScript)
	@echo "$(GREEN)▶ Linting Go...$(RESET)"
	$(MAKE) -C apps/api lint
	@echo "$(GREEN)▶ Linting TypeScript...$(RESET)"
	pnpm lint

.PHONY: lint/api
lint/api: ## Lint only the Go API
	$(MAKE) -C apps/api lint

.PHONY: lint/web
lint/web: ## Lint only the Next.js web app
	pnpm --filter @aeroduct/web lint

.PHONY: fmt
fmt: ## Format all code (Go + Prettier)
	@echo "$(GREEN)▶ Formatting Go...$(RESET)"
	cd apps/api && gofmt -w .
	@echo "$(GREEN)▶ Formatting TypeScript/CSS...$(RESET)"
	pnpm format

.PHONY: fmt/api
fmt/api: ## Format only Go code
	cd apps/api && gofmt -w .

.PHONY: type-check
type-check: ## Run TypeScript type checking
	pnpm type-check

.PHONY: vet
vet: ## Run go vet on the API
	cd apps/api && go vet ./...

# ═══════════════════════════════════════════════════════════════════
#  DEPENDENCIES
# ═══════════════════════════════════════════════════════════════════

.PHONY: install
install: ## Install / update all Node.js dependencies
	pnpm install

.PHONY: update
update: ## Interactively update outdated Node packages
	pnpm update --interactive --recursive

.PHONY: go-tidy
go-tidy: ## Tidy Go module dependencies
	cd apps/api && go mod tidy

.PHONY: go-update
go-update: ## Update all Go dependencies to latest compatible versions
	cd apps/api && go get -u ./... && go mod tidy

# ═══════════════════════════════════════════════════════════════════
#  DOCKER
# ═══════════════════════════════════════════════════════════════════

.PHONY: docker-build
docker-build: ## Build Docker images for API and Web
	docker build -t aeroduct-api:dev -f apps/api/Dockerfile apps/api
	docker build -t aeroduct-web:dev -f apps/web/Dockerfile apps/web

.PHONY: docker-ps
docker-ps: ## Show running containers for this project
	docker-compose -f $(COMPOSE_FILE) ps

.PHONY: docker-prune
docker-prune: ## Remove all stopped containers and dangling images
	docker system prune -f

# ═══════════════════════════════════════════════════════════════════
#  UTILITIES
# ═══════════════════════════════════════════════════════════════════

.PHONY: clean
clean: ## Remove all build artifacts and caches
	@echo "$(GREEN)▶ Cleaning build artifacts...$(RESET)"
	rm -rf apps/api/bin apps/api/tmp apps/api/coverage.out
	rm -rf apps/web/.next apps/web/out
	rm -rf packages/types/dist packages/ui/dist
	pnpm --filter @aeroduct/types clean 2>/dev/null || true
	pnpm --filter @aeroduct/ui    clean 2>/dev/null || true
	@echo "  $(GREEN)✅ Clean done$(RESET)"

.PHONY: clean/turbo
clean/turbo: ## Clear Turborepo cache
	rm -rf .turbo
	pnpm exec turbo daemon stop 2>/dev/null || true

.PHONY: logs
logs: ## Tail logs from all running Docker services
	docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: status
status: ## Show current status of all services
	@echo ""
	@echo "$(BOLD)  Docker services:$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) ps 2>/dev/null || echo "  (none running)"
	@echo ""
	@echo "$(BOLD)  Go module:$(RESET)"
	@cd apps/api && go version
	@echo ""
	@echo "$(BOLD)  Node / pnpm:$(RESET)"
	@node --version && pnpm --version
	@echo ""

.PHONY: api-routes
api-routes: ## Print all registered API routes (requires running API)
	@curl -s http://localhost:8080/health | python3 -m json.tool || echo "API not running — start with: make dev/api"

.PHONY: generate
generate: ## Run all code generators (Go, Prisma client)
	@echo "$(GREEN)▶ Generating Prisma client...$(RESET)"
	cd infra/prisma && pnpm generate
	@echo "$(GREEN)▶ Running go generate...$(RESET)"
	cd apps/api && go generate ./...
