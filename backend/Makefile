.DEFAULT_GOAL := help
SHELL         := /bin/bash

BINARY_NAME   := aeroduct-api
BUILD_DIR     := ./bin
CMD_DIR       := ./cmd/api
COVERAGE_OUT  := coverage.out

BOLD  :=
GREEN :=
CYAN  :=
RESET :=
ifeq ($(shell tty -s && echo yes),yes)
  BOLD  := $(shell tput bold)
  GREEN := $(shell tput setaf 2)
  CYAN  := $(shell tput setaf 6)
  RESET := $(shell tput sgr0)
endif

# ── Help ──────────────────────────────────────────────────────────
.PHONY: help
help: ## Show available commands
	@echo ""
	@echo "  $(BOLD)AeroDuct API (Go + Gin)$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_\-]+:.*##/ {printf "  $(CYAN)%-22s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""

# ── Development ───────────────────────────────────────────────────
.PHONY: dev
dev: air-check ## Start with hot-reload (requires air)
	@echo "$(GREEN)▶ Starting API with hot-reload...$(RESET)"
	air -c .air.toml

.PHONY: run
run: ## Start without hot-reload (plain go run)
	@echo "$(GREEN)▶ Starting API...$(RESET)"
	go run $(CMD_DIR)/main.go

.PHONY: air-check
air-check: ## Ensure 'air' hot-reload tool is installed
	@which air > /dev/null 2>&1 || (echo "Installing air..." && go install github.com/air-verse/air@latest)

# ── Build ─────────────────────────────────────────────────────────
.PHONY: build
build: ## Build a production binary (linux/amd64, no CGO)
	@echo "$(GREEN)▶ Building $(BINARY_NAME)...$(RESET)"
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
	  go build -ldflags="-w -s -X main.version=$$(git describe --tags --always)" \
	  -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)/main.go
	@echo "  $(GREEN)✅ Binary → $(BUILD_DIR)/$(BINARY_NAME)$(RESET)"

.PHONY: build-local
build-local: ## Build for the current OS/arch
	@mkdir -p $(BUILD_DIR)
	go build -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)/main.go

# ── Test ──────────────────────────────────────────────────────────
.PHONY: test
test: ## Run all tests with race detector
	go test ./... -v -race -coverprofile=$(COVERAGE_OUT)

.PHONY: test-short
test-short: ## Run tests without verbose output
	go test ./... -race -coverprofile=$(COVERAGE_OUT)

.PHONY: test-coverage
test-coverage: ## Open HTML coverage report in browser
	go tool cover -html=$(COVERAGE_OUT)

.PHONY: test-watch
test-watch: ## Re-run tests on file changes (requires entr)
	@which entr > /dev/null 2>&1 || (echo "Install entr: sudo apt install entr" && exit 1)
	find . -name '*.go' | entr -c go test ./... -race

# ── Code Quality ─────────────────────────────────────────────────
.PHONY: lint
lint: ## Run golangci-lint (installs if missing)
	@which golangci-lint > /dev/null 2>&1 || \
	  (echo "Installing golangci-lint..." && \
	   curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $$(go env GOPATH)/bin)
	golangci-lint run ./...

.PHONY: fmt
fmt: ## Format all Go source files
	gofmt -w .
	goimports -w . 2>/dev/null || true

.PHONY: vet
vet: ## Run go vet
	go vet ./...

.PHONY: check
check: vet fmt test-short ## Quick sanity check: vet + fmt + tests

# ── Dependencies ─────────────────────────────────────────────────
.PHONY: tidy
tidy: ## Tidy go.mod and go.sum
	go mod tidy

.PHONY: update-deps
update-deps: ## Update all dependencies to latest compatible
	go get -u ./...
	go mod tidy

.PHONY: vendor
vendor: ## Create vendor directory
	go mod vendor

# ── Generation ────────────────────────────────────────────────────
.PHONY: generate
generate: ## Run go generate on all packages
	go generate ./...

.PHONY: swagger
swagger: ## Generate Swagger docs (requires swag)
	@which swag > /dev/null 2>&1 || go install github.com/swaggo/swag/cmd/swag@latest
	swag init -g $(CMD_DIR)/main.go -o ./docs/swagger

# ── Utilities ─────────────────────────────────────────────────────
.PHONY: clean
clean: ## Remove build artefacts and coverage files
	rm -rf $(BUILD_DIR) $(COVERAGE_OUT) tmp/
	@echo "  $(GREEN)✅ Cleaned$(RESET)"

.PHONY: routes
routes: ## Print all registered routes (requires jq)
	curl -s http://localhost:8080/health | jq . || echo "API not running"

.PHONY: loc
loc: ## Count lines of Go code
	@find . -name '*.go' -not -path './vendor/*' | xargs wc -l | tail -1
