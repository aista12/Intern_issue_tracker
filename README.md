# Intern Issue Tracker (Fullstack)

Small fullstack Issue Tracker built with the internship stack to demonstrate:
- clean backend layering (router → controller → service → repository)
- raw SQL with PostgreSQL (no ORM)
- JWT auth + protected routes
- React + React Query UI with predictable requests/state

---

## Tech Stack

### Backend
- **Node.js + Express + TypeScript** — API server with clear separation of concerns
- **PostgreSQL** — relational DB fits issues/labels many-to-many well
- **pg** — database driver
- **Raw SQL only** — all queries are hand-written and parameterized
- **dotenv** — environment variables
- **JWT** — stateless auth for protected endpoints

### Frontend
- **React + TypeScript + Vite**
- **React Router** — routing (list page, detail page, auth pages)
- **React Query** — caching + request state (loading/error/refetch)
- **ShadCN UI** — the only UI library used

---

## Features

### Authentication
- Register with email + password
- Login (returns JWT token + user)
- Protected routes (backend checks JWT; frontend stores token)

### Issues
- Create issue (title, description, status, priority, labels)
- List issues (pagination + status filter + search + label filter)
- Issue detail page (view + edit)
- Delete issue (only creator can delete)

### Labels
- Create labels
- Assign labels to issues
- Filter issues by label
- Delete labels:
  - If a label is attached to any issue, deletion is blocked and UI shows the usage info.

---

## Project Structure

### Backend (`/backend`)
Typical layering (no business logic in routes):

- `src/app.ts` — express app setup (middlewares, routers)
- `src/routes/*` — define routes only
- `src/controllers/*` — handle req/res, call services, map errors → HTTP
- `src/services/*` — business rules (ownership checks, validation decisions)
- `src/repositories/*` — raw SQL only (db access)
- `src/db/db.ts` — pg Pool/client setup
- `src/middlewares/auth.middleware.ts` — reads JWT, sets `req.userId`

### Frontend (`/frontend`)
- `src/api/*` — api functions (typed)
- `src/auth/*` — token + current user storage
- `src/pages/*` — pages (Issues list, Issue detail, Login/Register)
- `src/components/*` — reusable UI pieces (dialogs etc.)

---

## Database Schema

Core tables:
- `users`
- `issues` (includes `created_by_id`)
- `labels`
- `issue_labels` (many-to-many)

Important constraints:
- `issues.created_by_id REFERENCES users(id) ON DELETE RESTRICT`
- `issue_labels.issue_id REFERENCES issues(id) ON DELETE CASCADE`
- `issue_labels.label_id REFERENCES labels(id) ON DELETE RESTRICT`

That means:
- deleting an issue removes its mappings automatically
- deleting a label is blocked if used by any issue (unless you unassign first)

---

## Setup (Local)

### 1) clone
```bash
git clone https://github.com/aista12/Intern_issue_tracker.git
cd Intern_issue_tracker
```

### 2) run backend
```bash
cd backend
npm install
npm run dev
```
### 3) run frontend
```bash
cd frontend
npm install
npm run dev
```

