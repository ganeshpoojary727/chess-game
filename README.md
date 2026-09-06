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
