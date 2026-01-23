# Issue Tracker

## Requirements
- Node.js (LTS)
- PostgreSQL 16+
- npm

## Setup

### 1) Backend
cd backend
cp .env.example .env
npm install

# create DB + user (edit if needed)
# then run schema:
psql "postgres://issue_tracker_user:password@localhost:5432/issue_tracker" -f ./src/db/init.sql

npm run dev

### 2) Frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev

Frontend: http://localhost:5173
Backend: http://localhost:3000
