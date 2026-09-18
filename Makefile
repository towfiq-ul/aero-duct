.PHONY: help setup dev dev/backend dev/frontend db-migrate db-seed db-studio clean

help:
	@echo "Available commands:"
	@echo "  make setup        - Install dependencies and setup project (SQLite)"
	@echo "  make dev          - Run both backend and frontend"
	@echo "  make dev/backend  - Run backend (Go API) with hot-reload"
	@echo "  make dev/frontend - Run frontend (Next.js)"
	@echo "  make db-migrate   - Run Prisma migrations (creates SQLite DB)"
	@echo "  make db-seed      - Seed the SQLite database"
	@echo "  make db-studio    - Open Prisma Studio to view database"

setup: db-migrate db-seed
	cd frontend && pnpm install
	cd backend && go mod tidy

dev:
	make -j2 dev/backend dev/frontend

dev/backend:
	cd backend && air -c .air.toml

dev/frontend:
	cd frontend && pnpm dev

db-migrate:
	cd backend/prisma && DATABASE_URL="file:./dev.db" pnpm migrate:dev --name init

db-seed:
	cd backend/prisma && DATABASE_URL="file:./dev.db" pnpm seed

db-studio:
	cd backend/prisma && DATABASE_URL="file:./dev.db" pnpm studio

clean:
	rm -rf backend/bin backend/tmp
	rm -rf frontend/.next frontend/out frontend/node_modules
