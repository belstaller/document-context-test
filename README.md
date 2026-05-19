# document context test

A production-ready microservices application built with Next.js, React, PostgreSQL, Python, and Docker — structured according to Clean Architecture principles.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Clean Architecture Layers](#clean-architecture-layers)
- [Services](#services)
- [Environment Variables](#environment-variables)
- [Docker](#docker)
- [Linting & Formatting](#linting--formatting)

---

## Overview

**document context test** is a document management platform composed of loosely-coupled microservices. A Next.js frontend communicates with a Node.js API gateway, which delegates to specialised Python microservices for heavy document processing. All persistent state lives in PostgreSQL.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18 |
| API Gateway | Node.js / Express (TypeScript) |
| Document Service | Python 3.12 / FastAPI |
| Database | PostgreSQL 16 |
| Containerisation | Docker & Docker Compose |
| Language (TS) | TypeScript 5 |

---

## Getting Started

### Prerequisites

- Docker ≥ 24 and Docker Compose v2
- Node.js ≥ 20 (for local TS development without Docker)
- Python ≥ 3.12 (for local Python development without Docker)

### Run with Docker (recommended)

```bash
# 1. Copy environment files
cp .env.example .env

# 2. Build and start all services
docker compose up --build

# 3. Open the app
open http://localhost:3000
```

### Run services individually (development)

```bash
# Install Node dependencies
npm install

# Start the Next.js frontend
npm run dev:web

# Start the API gateway
npm run dev:api

# Start the Python document service
cd services/document-service
python -m uvicorn main:app --reload --port 8001
```

---

## Project Structure

```
.
├── docker-compose.yml
├── .env.example
├── package.json                     # Root workspace config
├── tsconfig.json                    # Root TypeScript config
├── services/
│   └── document-service/            # Python FastAPI microservice
│       ├── Dockerfile
│       ├── main.py
│       ├── requirements.txt
│       └── ...
├── web/                             # Next.js frontend
│   ├── Dockerfile
│   ├── next.config.js
│   ├── app/
│   └── ...
└── src/                             # Clean Architecture source
    ├── domain/                      # Entities, Value Objects, Repository interfaces
    ├── application/                 # Use Cases, DTOs, Application Services
    ├── infrastructure/              # DB clients, HTTP clients, adapters
    └── interfaces/                  # Controllers, Route handlers, entry points
```

---

## Clean Architecture Layers

The entire business logic of the system lives inside `src/` and is organised into four strictly-bounded layers. The dependency rule is **absolute**: dependencies only point inward.

```
interfaces → application → domain
infrastructure → application → domain
```

### `src/domain/`

The heart of the application. Contains **zero** framework or library dependencies.

- **Entities** — objects with identity and lifecycle (e.g. `Document`, `User`)
- **Value Objects** — immutable, equality-by-value (e.g. `DocumentTitle`, `EmailAddress`)
- **Repository Interfaces** — describe *what* data operations exist, not *how*
- **Domain Services** — logic spanning multiple entities

### `src/application/`

Orchestrates domain objects to fulfil use cases. Knows **what** to do, not how.

- **Use Cases** — one class per use case, always exposes `execute(dto)` 
- **DTOs** — plain data contracts crossing layer boundaries
- **Port Interfaces** — abstractions for infrastructure capabilities

### `src/infrastructure/`

All I/O lives here. Implements interfaces from `domain/` and `application/`.

- **Repository Implementations** — PostgreSQL via `pg` / `node-postgres`
- **HTTP Clients** — calls to the Python document microservice
- **Database** — connection pool, migrations

### `src/interfaces/`

Entry points into the application. Thin adapters between the outside world and use cases.

- **HTTP Controllers** — Express route handlers calling use cases
- **Next.js API Routes** — thin API handlers
- **Input Validation** — schema validation only (business rules stay in domain)

---

## Services

| Service | Port | Description |
|---|---|---|
| `web` | 3000 | Next.js frontend |
| `api` | 4000 | Express API gateway (TypeScript) |
| `document-service` | 8001 | Python FastAPI document processor |
| `postgres` | 5432 | PostgreSQL database |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `DOCUMENT_SERVICE_URL` | URL of the Python document service |
| `JWT_SECRET` | Secret for signing JWTs |
| `NEXT_PUBLIC_API_URL` | API URL exposed to the browser |

---

## Docker

Each service has its own `Dockerfile`. `docker-compose.yml` at the root wires everything together with a shared network and named volumes for PostgreSQL data.

```bash
# Build all images
docker compose build

# Tail logs for a specific service
docker compose logs -f api

# Run database migrations
docker compose exec api npm run migrate
```

---

## Linting & Formatting

```bash
# TypeScript / JavaScript
npm run lint        # ESLint
npm run format      # Prettier

# Python
cd services/document-service
ruff check .        # Ruff linter
ruff format .       # Ruff formatter
```
