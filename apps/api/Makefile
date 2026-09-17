.PHONY: dev build run test lint clean

# ── Variables ────────────────────────────────────────────
BINARY_NAME=aeroduct-api
BUILD_DIR=./bin
CMD_DIR=./cmd/api

# ── Development ───────────────────────────────────────────
dev:
	@echo "Starting API in watch mode..."
	air -c .air.toml

run:
	go run $(CMD_DIR)/main.go

# ── Build ─────────────────────────────────────────────────
build:
	@echo "Building $(BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)/main.go

# ── Test ──────────────────────────────────────────────────
test:
	go test ./... -v -race -coverprofile=coverage.out

test-coverage:
	go tool cover -html=coverage.out

# ── Lint ──────────────────────────────────────────────────
lint:
	golangci-lint run ./...

# ── Clean ─────────────────────────────────────────────────
clean:
	rm -rf $(BUILD_DIR) coverage.out tmp/
