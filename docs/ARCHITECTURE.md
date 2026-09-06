# High-Performance Chess Monorepo Architecture

## 1. System Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   React 18 Frontend                    │
│  - Vite + TypeScript + Tailwind CSS                    │
│  - react-chessboard (Interactive Canvas & SVGs)        │
│  - chess.js (Optimistic UI & Legal Moves Calculation)  │
│  - @stomp/stompjs (WebSocket Client)                   │
└───────────────────────────┬────────────────────────────┘
                            │
            STOMP over WebSocket & HTTP REST
                            │
┌───────────────────────────▼────────────────────────────┐
│              Java 21 Spring Boot Backend               │
│  - Spring WebSocket / STOMP Broker (/topic, /app)      │
│  - GameService (Concurrent Session Store)              │
│  - chesslib 1.3.3 (Authoritative Bitboard Engine)      │
│  - REST Controllers & Error Interceptors               │
└────────────────────────────────────────────────────────┘
```

## 2. Key Design Principles

1. **Authoritative Server, Optimistic Client**:
   - The React client performs instant validation via `chess.js` to eliminate UI latency during drag-and-drop.
   - The Spring Boot server uses `chesslib` as the authoritative source of truth. Every move is re-validated against the server's internal bitboard. If any discrepancy occurs, the server FEN overrides the client.

2. **High-Performance Bitboard Engine (`chesslib`)**:
   - `chesslib` provides low-allocation, high-throughput bitboard operations in Java, ideal for real-time multiplayer chess engines and fast checkmate/draw evaluations.

3. **Real-Time Push Architecture**:
   - State broadcasts are sent over STOMP topic `/topic/game/{gameId}`.
   - Any spectator or participant receives updates in sub-millisecond dispatch times without polling.
