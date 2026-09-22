# Chess App Monorepo

A full-stack, real-time chess platform built with **Java 21 Spring Boot** and **React (Vite + Tailwind CSS)**.

## Monorepo Layout

```
chess-game/
├── backend/                  # Java 21 Spring Boot Maven Application
│   ├── pom.xml               # Spring Boot 3.3, WebSocket, chesslib (JitPack)
│   └── src/                  # Controllers, Services, DTOs, WebSocket Config
├── frontend/                 # React 18 + Vite + Tailwind CSS Application
│   ├── src/                  # Components, chess.js, react-chessboard, STOMP hooks
│   └── package.json
├── docs/                     # Shared protocol contracts & architectural specifications
│   ├── CONTRACT.md           # STOMP topics, REST endpoints, JSON schemas
│   └── ARCHITECTURE.md       # System design & authoritative server flow
├── package.json              # Monorepo orchestration scripts
└── README.md
```

## Quick Start

### Prerequisites
- **Java 21 LTS**
- **Maven 3.8+**
- **Node.js 18+** & **npm 9+**

### 1. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
- API Base URL: `http://localhost:8085/api`
- WebSocket STOMP Endpoint: `http://localhost:8085/ws` (with SockJS fallback)

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

### 3. Running from Root
```bash
npm run dev:backend    # Runs Spring Boot server
npm run dev:frontend   # Runs Vite client
```

## Shared Data Contract
See [docs/CONTRACT.md](docs/CONTRACT.md) for full WebSocket STOMP destination definitions, REST endpoint documentation, JSON payloads, and TypeScript/Java type mappings.

---

## Checkmate Dashboard & Backend Integration Status

The frontend home dashboard has been redesigned as **"Checkmate"** matching the dark, luxury frosted-glass aesthetic with a **100% SVG/CSS hero section** (zero raster images).

### Discovered Backend Endpoints (Implemented & Connected)
- `POST /api/rooms` — Create room with `{ initialMinutes, incrementSeconds, roomCode? }`.
- `GET /api/rooms/{roomCode}` — Retrieve room authoritative `GameStateMessage`.
- `GET /api/rooms` — List all active rooms and player count.
- `STOMP /ws` & `/ws-direct` — WebSocket endpoints.
  - Inbound: `/app/room/{roomCode}/join`, `/app/room/{roomCode}/move`, `/app/room/{roomCode}/resign`, `/app/room/{roomCode}/draw`, `/app/room/{roomCode}/reset`.
  - Outbound: `/topic/room/{roomCode}`, `/queue/errors-{playerToken}`.

### Assumed / Stubbed Endpoints (Marked with `// TODO:` in `src/services/api.ts`)
The following endpoints are currently stubbed on the client with fallbacks/local storage until implemented in the backend:
1. **User Authentication (`/api/auth/login`, `/api/auth/register`)**:
   - Backend currently uses ephemeral player tokens.
   - Frontend stubs with persisted `playerToken` and profile in `localStorage`.
2. **Player Profile & Stats (`/api/users/{id}/stats`)**:
   - Backend has no player stats persistence.
   - Frontend stubs with default stats: `Rating: 1530`, `Wins: 42`, `Accuracy: 68%`.
3. **Openings Catalog (`/api/openings`)**:
   - Backend has no ECO opening dictionary.
   - Frontend populates opening choices from local dataset (`src/ai/data/openings.json`).
4. **Player Match History (`/api/users/{id}/matches`)**:
   - Backend only holds active moves in-memory.
   - Frontend stubs match history list for the profile modal.

---

## Design System: Unified Warm Cream & Terracotta Red Palette (Single Source of Truth)

> [!NOTE]
> **Unified Design System (Supersedes earlier dark-theme concept)**:
> - **Unified Visual Identity**: The entire platform — both the public landing page (`LandingHero.tsx`) and authenticated dashboard (`CheckmateDashboard.tsx`) — now shares ONE consistent visual identity.
> - **Color Tokens**:
>   - **Background**: Warm cream (`#f5f2ec` / `#f7f5f0`).
>   - **Surfaces**: Slightly whiter warm card surfaces (`#fbfaf7`), subtle 1px border (`rgba(0,0,0,0.06)` / `#e8e4db`), soft elevation shadow.
>   - **Accents**: Terracotta / brick red (`#b5493c`) for icon badges, primary CTAs, active indicators, and focal headlines.
>   - **Typography**: Near-black (`#1c1c1c`) headings, mid-gray (`#6b6b6b`) labels, with serif italic treatment (*Same Game / Deeper Minds*).
> - **Hero Integration**: The dual-knight photography blends seamlessly into the warm background arch via radial gradient edge feathering, color grading, idle motion, and SVG grain overlays without rectangular photo cuts.
