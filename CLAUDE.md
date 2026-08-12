# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

Three deployables plus infra glue, wired together by Docker Compose:

- `backend/` — FastAPI + async SQLAlchemy 2.0 + PostgreSQL (asyncpg). The single source of truth API at `/api/v1`. Python 3.12+.
- `armonitex-web/` — Next.js 16 / React 19 public marketing + customer site (Turkish, App Router). Has its own `AGENTS.md`/`CLAUDE.md` — **read those before touching frontend code** (see Design system rule below).
- `admin-panel/` — Refine 6 + Ant Design 5 + Vite admin SPA that talks to `/api/v1/admin/*`.
- `docs/` — architecture notes and ADRs (`docs/adr/`); start with `docs/ARCHITECTURE_AND_HANDOVER.md`. ADRs record binding decisions — check them before changing a load-bearing choice.

## Running everything

Full stack is Docker-first; no host Python/Node/Postgres needed.

```bash
cp .env.example .env      # then replace every placeholder secret
docker compose up --build
```

Compose ordering matters and is encoded in `depends_on`: `db` (healthcheck) → `migrate` (one-off `alembic upgrade head`) → `api` → `admin-panel` + `armonitex-web`. The DB has **no host port mapping** by design; inspect via `docker compose exec db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"`.

Default host ports (override via `.env`): API `8080→8000`, admin `5180→5173`, web `3005→3000`.

Create the first admin once (idempotent, refuses to elevate an existing non-admin):

```powershell
$env:ADMIN_EMAIL="admin@example.com"; $env:ADMIN_PASSWORD="min-12-chars"
docker compose run --rm --no-deps -e ADMIN_EMAIL -e ADMIN_PASSWORD api python -m app.scripts.bootstrap_superuser
Remove-Item Env:ADMIN_EMAIL, Env:ADMIN_PASSWORD
```

`docker-compose.prod.yml` is the production variant (gunicorn/uvicorn workers, `restart: always`, SMTP env).

## Per-app commands

**backend/** (run inside the `api` container, or a local venv with the deps in `pyproject.toml`):
- Lint/format: `ruff check .` and `black .` (line length 100; ruff rules `E,F,I,UP,B,SIM,RUF`).
- Migrations: `alembic revision --autogenerate -m "msg"` then `alembic upgrade head`. Autogenerate works because `alembic/env.py` imports `app.models` and diffs against `Base.metadata` — **any new model must be exported from `app/models/__init__.py`** or it won't be seen.
- There is **no backend test suite** yet — do not claim tests pass.

**armonitex-web/**: `npm run dev` · `npm run build` · `npm run lint` · `npm run test:e2e` (Playwright; specs in `tests/e2e/`).

**admin-panel/**: `npm run dev` · `npm run build` (runs `tsc -b` then `vite build`) · `npm run lint`.

## Backend architecture

Async top to bottom. Request flow: **route → Service → Repository → model**, sessions injected via FastAPI deps.

- **Layers.** `api/v1/routes/*` are thin HTTP adapters. `services/*` hold business rules. `repositories/*` own all SQLAlchemy queries. Models live in `models/`, request/response shapes in `schemas/` (Pydantic v2, `model_validate` at the route boundary).
- **Sessions & auth deps** are in `app/api/deps.py`: `SessionDep` yields one `AsyncSession` per request; `CurrentUser` decodes the JWT and loads the active user; `CurrentSuperuser` gates admin routes. The whole `admin` router is guarded by `Depends(get_current_superuser)`.
- **Error handling contract.** Services raise `DomainError` subclasses from `app/domain/exceptions.py` (`ResourceNotFoundError`, `ResourceConflictError`, `EmailAlreadyRegisteredError`, `InvalidCredentialsError`). Routes catch these and translate to `HTTPException` (see the `not_found`/`conflict` helpers in `routes/admin.py`). Services should **not** import `fastapi` — keep HTTP concerns in the route layer.
- **Config** is validated Pydantic settings (`app/core/config.py`, cached via `get_settings()`): `DATABASE_URL` must use the `postgresql+asyncpg://` scheme; `JWT_SECRET_KEY` must be ≥32 chars. Config errors surface at startup, not runtime.

Keep this pattern consistent across the backend: new features should follow the class-based Service→Repository→DomainError structure (see the users/contents/admin/settings code), not raise `HTTPException` from services or write queries inline in routes.

## Admin panel ↔ API contract

`admin-panel/src/providers/dataProvider.ts` maps Refine CRUD onto the API: list expects `{ data, total }` with `page`/`page_size` query params, and CRUD verbs map to `GET/POST /{resource}`, `PATCH/DELETE /{resource}/{id}`. Keep new admin endpoints paginated as `Page[...]` (`schemas/pagination.py`) or the grid breaks. `authProvider.ts` holds the JWT flow; `axios.ts` sets the base URL from `VITE_API_URL`.

## Frontend design system (armonitex-web) — hard rule

Ad-hoc/manual color classes are **banned**. Do not use `bg-slate-900`, `text-slate-600`, `gray-*`, `black`, etc. All color/style goes through the semantic token classes defined in `src/app/globals.css` (`.bg-white-token`, `.text-brand-token`, `.card-token`, `.btn-primary-token`). Reference: `docs/adr/0007-design-system-tokens.md`. Also note `armonitex-web/AGENTS.md`'s warning that this Next.js version has breaking changes vs. training data — consult `node_modules/next/dist/docs/` before writing Next code.
