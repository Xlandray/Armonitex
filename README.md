# Armonitex

## Local development with Docker

No host Python or PostgreSQL installation is required.

1. Copy `.env.example` to `.env`.
2. Replace all placeholder secrets in `.env` with unique values.
3. Run `docker compose up --build` from the project root.

Docker Compose starts PostgreSQL, waits for its health check, applies Alembic
migrations through the one-off `migrate` service, and starts the FastAPI service.
The API is available at `http://localhost:8000`; OpenAPI documentation is at
`http://localhost:8000/docs`. The Refine-based administration panel is available
at `http://localhost:5173`.

The database deliberately has no host port mapping. Use `docker compose exec db
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"` for local inspection. This avoids
unnecessarily exposing PostgreSQL on the host network.

## First administrator

After the stack is running, create the first administrator once. Provide the
credentials only in the command environment; do not add them to source files.

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = "use-a-unique-password-with-at-least-12-characters"
docker compose run --rm --no-deps -e ADMIN_EMAIL -e ADMIN_PASSWORD api python -m app.scripts.bootstrap_superuser
Remove-Item Env:ADMIN_EMAIL, Env:ADMIN_PASSWORD
```

The command is idempotent for an existing superuser and refuses to silently
elevate an existing non-administrator account.

For development, the Compose configuration mounts `backend/app` and runs Uvicorn
with reload. The image's default command omits reload, so the same image remains
suitable for a non-development runtime configuration.

To stop services while retaining database data, run `docker compose down`. To
remove the local database volume as well, run `docker compose down --volumes`.
