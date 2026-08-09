# 🏰 Armonitex Enterprise Software Architecture & Operations Handover

## 📌 Executive Summary

The Armonitex Platform is an enterprise-grade, zero-technical-debt full-stack software application built for modern scalability, maximum performance, and automated continuous quality assurance.

The platform physically decouples development and command operations (Mac Workstation) from automated builds, containerized integration testing, and deployment validation (Ubuntu Master Orchestrator Server).

---

## 🏗️ System Architecture Overview

```
                        +-----------------------------------------+
                        |           Mac Workstation               |
                        |      (Development & Command)            |
                        +--------------------+--------------------+
                                             |
                                    git push / SSH trigger
                                             v
                        +--------------------+--------------------+
                        |           Ubuntu Host Server            |
                        |      (Master Orchestrator Engine)       |
                        +--------------------+--------------------+
                                             |
             +-------------------------------+-------------------------------+
             |                               |                               |
             v                               v                               v
+------------------------+      +------------------------+      +------------------------+
|      FastAPI Backend   |      |    Refine Admin Panel  |      |   Armonitex Showcase   |
|   (Async SQLAlchemy,   |      |  (React Enterprise CMS |      |  (Next.js App Router,  |
| PostgreSQL, OAuth2 JWT)|      |      Port 5173)        |      |    ISR, Port 3000)     |
+------------------------+      +------------------------+      +------------------------+
```

---

## 🛠️ Technology Stack & Core Components

### 1. Backend Service (`backend/`)
- **Framework:** FastAPI (Python 3.11+, Async/Await)
- **Database ORM:** Async SQLAlchemy 2.0 with PostgreSQL 16
- **Database Migrations:** Alembic (`alembic upgrade head`)
- **Authentication:** OAuth2 JWT Bearer Tokens (`HS256`, 30-min expiration)
- **Validation & DTOs:** Pydantic v2 schemas
- **Email Service:** Async SMTP Notification Service (`backend/app/core/email.py`)
- **Public API Endpoints:**
  - `GET /api/v1/contents` — Dynamic published corporate articles
  - `POST /api/v1/contact` — Public contact form & email trigger
  - `POST /api/v1/auth/token` — OAuth2 Form-urlencoded authentication
  - `POST /api/v1/auth/forgot-password` — Password reset link email dispatch
  - `POST /api/v1/users` — Public user registration

### 2. Enterprise Admin Panel (`admin-panel/`)
- **Framework:** Refine (React + Vite + TypeScript)
- **State & Data Management:** Automated REST Data Provider matching FastAPI schemas
- **Features:** Content CRUD, User RBAC Management, System Settings Control

### 3. Corporate Showcase Vitrin (`armonitex-web/`)
- **Framework:** Next.js (App Router, React Server Components, ISR Cache 60s)
- **Styling:** Tailwind CSS
- **Analytics:** Native `@next/third-parties/google` (GA4 event tracking)
- **SEO Engine:**
  - Global `metadataBase` & Canonical URL management
  - Dynamic TypeScript `sitemap.ts` (`/sitemap.xml`)
  - Configurable `robots.ts` (`/robots.txt`)
  - Schema.org JSON-LD Article structured data (`/icerik/[slug]`)
- **Internationalization (i18n):** Native dictionary-based TR/EN language switcher (`src/lib/i18n.ts`)

### 4. Autonomous Master Orchestrator Agent (`scripts/`)
- **Test Engine:** Playwright E2E Browser Testing Framework (`tests/e2e`)
- **JSON Reporter:** Generates structured metrics in `agent-report/test-results.json`
- **Orchestrator Agent (`scripts/master_orchestrator.py`):**
  - Parses JSON test results & Docker container logs
  - Performs root-cause failure analysis
  - Issues `🟢 APPROVED FOR PRODUCTION` or `🔴 PRODUCTION RELEASE BLOCKED` deployment clearance
- **Ubuntu Host Runner (`scripts/ubuntu-runner.sh`):** Automated container build & test pipeline
- **Mac Command Trigger (`scripts/trigger-ubuntu-runner.sh`):** Remote SSH execution script

---

## 🚀 Deployment & Operations Guide

### 1. Local Development Stack
```bash
# Start all 4 containerized services locally
docker compose up -d --build

# Run Next.js showcase locally
cd armonitex-web
npm run dev
```

### 2. Running E2E Tests & AI Orchestrator Audit
```bash
# Execute Playwright E2E tests
cd armonitex-web
npm run test:e2e

# Run Master Orchestrator Agent
python scripts/master_orchestrator.py
```

### 3. Production Deployment (Ubuntu Server + Nginx + Vercel)
- **Frontend (Vercel):** Configured via `armonitex-web/vercel.json`.
- **Backend & Containers:** Configured via `docker-compose.prod.yml` and `nginx.conf`.
- **Remote Execution Command:**
```bash
bash scripts/trigger-ubuntu-runner.sh
```

---

## 🛡️ Zero Technical Debt Verification Matrix

| Requirement | Implementation | Status |
| :--- | :--- | :---: |
| **Backend Async IO** | Async SQLAlchemy + Asyncpg + FastAPI | ✅ 100% |
| **Authentication Standard** | OAuth2 Password Request Form & JWT | ✅ 100% |
| **Page Load Optimization** | Next.js Server Components + ISR Cache (60s) | ✅ 100% |
| **Native SEO** | Built-in App Router Metadata, Sitemap, Robots, JSON-LD | ✅ 100% |
| **Web Vitals GA4** | Native `@next/third-parties/google` | ✅ 100% |
| **Automated QA** | Playwright E2E + Claude Master Orchestrator Agent | ✅ 100% |

---
*Documentation compiled for Armonitex Enterprise Operations.*
