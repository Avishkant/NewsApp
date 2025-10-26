<!--
Guidance for AI coding agents working in this repository.
Keep this short, concrete, and specific to this codebase.
-->

# Copilot instructions — NewsApp

Short summary

- Monorepo-style layout with two primary parts: `client/` (React + Vite, Tailwind) and `server/` (Express + Mongoose and related middleware). Work on both sides when implementing features that cross the API boundary.

Quick starts (exact commands)

- Frontend (local dev):
  - cd into `client` then install and run dev server: `npm install` then `npm run dev` (Vite on port 5173 by default).
  - Build for production: `cd client && npm run build` and preview with `npm run preview`.
- Backend: there is a `server/package.json` declaring Express/Mongoose/JWT/etc., but no `start` script and no `index.js`/source files committed. Typical run command would be `cd server && node index.js` if server files exist. If you add or modify server sources, update `server/package.json` to include a `start` and (optionally) `dev` script.

Architecture notes (what to expect)

- Frontend: entry is `client/src/main.jsx` and primary component `client/src/App.jsx`. Uses ESM (`type: module`) and Vite plugin for React.
- Backend: dependencies in `server/package.json` indicate these integrations:
  - MongoDB via Mongoose (env var: `MONGO_URI` in `server/.env`)
  - JWT for auth (`JWT_SECRET` in `server/.env`)
  - File uploads + Cloudinary (`multer`, `cloudinary` and `CLOUDINARY_*` env vars)
  - Security & logging middleware (`helmet`, `cors`, `morgan`).

Important discoverable facts & conventions

- Environment config: `server/.env` exists and contains variable names used by the backend (e.g. `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_API_KEY`, `FRONTEND_URL`, `BACKEND_URL`). DO NOT expose or commit secrets; if you need to change secrets, prefer placeholder values.
- Frontend scripts are in `client/package.json`: `dev`, `build`, `preview`, and `lint` (ESLint).
- The client uses tailwind and `@vitejs/plugin-react` — prefer using Vite dev flow for HMR when changing UI.
- The server currently lacks committed source files. If you add server code, prefer organizing with `models/`, `routes/`, `controllers/`, and `middleware/` to match common Express+Mongoose patterns.

What an AI agent should do first

1. Confirm you can run the client: `cd client && npm ci && npm run dev` and verify the Vite app loads at `http://localhost:5173`.
2. Inspect `server/` — note `package.json` lists backend deps but source code is missing; look for `index.js`, `app.js`, or any route files. If missing, ask the maintainer before implementing backend features that assume existing endpoints.
3. Read `server/.env` locally to learn env var names (do not print or commit secrets). Use those env var names when wiring new code.

Files to inspect for patterns

- Frontend: `client/src/main.jsx`, `client/src/App.jsx`, `client/package.json`, `client/README.md`.
- Backend: `server/package.json`, `server/.env` (env variable names), then any `index.js`/`app.js`/`routes/`/`models/` if/when they are added.

Behavioral rules for the agent

- Prefer minimal, self-contained changes; update `client` and `server` in separate commits if touching both.
- Never add real secrets to the repo. If you detect secrets in files, warn the maintainer and suggest moving them to a secrets manager or `.env` excluded from Git.
- When adding server run scripts, follow the pattern: `"start": "node index.js"`, `"dev": "nodemon index.js"` and document in `server/README.md`.

If anything here is unclear or you need more backend/endpoint examples, reply and I will provide more context or grant access to the missing server sources.
