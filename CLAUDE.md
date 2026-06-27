# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack fitness tracking web app. Monorepo with three directories: `client/` (React SPA), `server/` (Hono API), and `db/` (PostgreSQL Docker config).

## Development Commands

### Client (`cd client` first)
```bash
npm run dev       # Start dev server on port 5175 (localhost only)
npm run local     # Start dev server accessible on local network
npm run build     # Production build
npm run lint      # ESLint
```

### Server (`cd server` first)
```bash
npm run local     # Start with .env.local (for local development)
npm run dev       # Start with .env
npm run build     # TypeScript compile to dist/
npm start         # Run compiled dist/index.js with .env
```

### Full stack (Docker)
```bash
docker-compose up         # Start all three services
docker-compose up --build # Rebuild images and start
```

### Client Tests (`cd client` first)
```bash
npm run test          # Watch mode — re-runs on every save
npm run test:run      # Single run and exit (CI)
npm run test:ui       # Browser UI dashboard

# Run a single file (partial name match works)
npm run test:run src/tests/utils/utils_steps.test.ts
npm run test:run utils_steps

# Filter to a specific describe block or test by name
npm run test:run utils_steps -- -t "milesToSteps"
```

Test files live in `client/src/tests/` organized by domain (e.g., `utils/`, `components/`). Runner is Vitest; config is `client/vitest.config.ts`.

## Architecture

### Server

**Pattern: Route → Service → Module → DB**

- `src/routes/` — Hono route handlers; register in `src/routes/index.ts` and mount in `src/index.ts`
- `src/services/` — Service classes (e.g., `WorkoutsService`) instantiated once in `src/services/index.ts` with a shared `pg.Pool`, imported by routes
- `src/modules/` — Pure query functions organized by domain; called by services
- `src/db/db.ts` — Single `pg.Pool` export; sets timezone to `America/Phoenix` on every connection

**Auth**: JWT access + refresh tokens stored in `httpOnly` cookies. `withAuth` middleware in `src/modules/auth/utils.ts` extracts `userID` from the cookie and stores it on `ctx`. The global middleware is currently disabled (`ENABLE_MIDDLEWARE = false`); auth is enforced per-route.

**AI**: Google Gemini (`gemini-2.0-flash`) via `@ai-sdk/google` is the primary model. Ollama is configured as a local alternative. Models are defined in `src/modules/chat/models.ts`. AI insights live in `src/modules/ai-insights/`; chat with tool use lives in `src/modules/chat/`.

**API base path**: All routes are mounted under `/api/v1`.

**Environment detection** (`src/utils/env.ts`): Reads `ENVIRONMENT`, `IS_DOCKER`, `IS_REMOTE` env vars to select the correct server config. Use `npm run local` (loads `.env.local`) for local development.

### Client

**Stack**: React 19, TypeScript, Vite, Redux Toolkit (RTK Query), React Router v7, SCSS via Sass.

**Feature-based structure** (`src/features/`): Each feature folder typically contains:
- `types.ts` — TypeScript types
- `*Api.ts` — RTK Query `createApi` definition (data fetching, caching, mutations)
- `*Slice.ts` — Redux slice for local UI state
- `operations.ts` — Non-RTK async operations

All RTK Query APIs are registered in `src/store/store.ts`. The store exports `useAppDispatch` — always use this instead of the raw `useDispatch` hook.

**Hooks** (`src/hooks/`): Domain-specific hooks that compose RTK Query hooks with local logic. Name pattern: `use<Action><Domain>` (e.g., `useGetWeeklyRecap`).

**Utils** (`src/utils/`): Domain utilities prefixed with `utils_` (e.g., `utils_workouts.ts`). These contain the actual `fetch` calls using `fetchWithAuth` from `utils_requests.ts`, which wraps `fetch` with `credentials: "include"` for cookie auth. All API endpoint paths are defined in `utils_env.ts` under `API_ENDPOINTS`.

**Routing**: All pages lazy-loaded via `React.lazy` + `Suspense`. Routes are in `src/routes/routes.tsx`. The main layout (`DashboardLayout`) wraps all authenticated routes under `/`.

**Styling**: SCSS files per component. Vite auto-injects `@sass/variables`, `@sass/mixins`, and `@sass/custom` into every `.scss` file — no manual `@use` needed for these. The `@sass` alias resolves to `src/sass/`.

**Context**: `AppProviders` wraps the app with `OfflineContext` (network status) and `WorkoutContext` (active workout state).

**API base URL**: Controlled by `VITE_API_BASE` env var, read in `utils_env.ts`. `currentEnv.base` is what RTK Query `fetchBaseQuery` uses.
