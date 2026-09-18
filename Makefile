.PHONY: help setup dev dev/backend dev/frontend db-up db-migrate db-seed clean

COMPOSE_FILE := docker-compose.yml

help:
	@echo "Available commands:"
	@echo "  make setup        - Install dependencies and setup project"
	@echo "  make dev          - Run both backend and frontend"
	@echo "  make dev/backend  - Run backend (Go API) with hot-reload"
	@echo "  make dev/frontend - Run frontend (Next.js)"
	@echo "  make db-up        - Start Postgres container"
	@echo "  make db-migrate   - Run Prisma migrations"
	@echo "  make db-seed      - Seed the database"

setup: db-up db-migrate db-seed
	cd frontend && pnpm install
	cd backend && go mod tidy

dev:
	make -j2 dev/backend dev/frontend

dev/backend:
	cd backend && air -c .air.toml

dev/frontend:
	cd frontend && pnpm dev

db-up:
	docker-compose -f $(COMPOSE_FILE) up -d postgres
	@until docker-compose -f $(COMPOSE_FILE) exec -T postgres pg_isready -U aeroduct -d aeroduct_dev > /dev/null 2>&1; do sleep 1; done

db-migrate: db-up
	cd backend/prisma && DATABASE_URL=$$(grep DATABASE_URL ../.env | cut -d= -f2-) pnpm migrate:dev

db-seed: db-up
	cd backend/prisma && DATABASE_URL=$$(grep DATABASE_URL ../.env | cut -d= -f2-) pnpm seed

db-studio:
	cd backend/prisma && pnpm studio

clean:
	rm -rf backend/bin backend/tmp
	rm -rf frontend/.next frontend/out frontend/node_modules
