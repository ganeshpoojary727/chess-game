# Client-Server Data Contract Specification: `chess-app`

Version: `1.0.0`  
Protocol: **STOMP 1.2 over SockJS / WebSocket** & **HTTP REST**  
Backend: **Spring Boot 3.3.x (Java 21)**  
Frontend: **React 18+ (Vite + TypeScript)**  

---

## 1. Overview

This document specifies the bidirectional communication protocol between the client (`frontend`) and the server (`backend`). Real-time gameplay events (moves, joins, resets, resignations) are streamed via **STOMP over WebSocket**, while initial session bootstrapping and game lookups use **HTTP REST**.

---

## 2. Real-Time WebSocket Protocol (STOMP)

### 2.1 Handshake Endpoint
- **URL**: `http://localhost:8085/ws` (HTTP SockJS fallback enabled) or `ws://localhost:8085/ws`
- **CORS**: Origin wildcard or `http://localhost:5173`, `http://localhost:3000`
- **Heartbeats**: Incoming 10000ms, Outgoing 10000ms

### 2.2 Client Subscriptions (Server -> Client)

| Destination | Payload | Description |
|---|---|---|
| `/topic/game/{gameId}` | `GameStateResponse` | Broadcasts every state transition (move, join, reset, game over) to all participants in `gameId`. |
| `/topic/games` | `GameStateResponse` | Broadcasts new game creations or global status changes. |
| `/user/queue/errors` | `ErrorResponse` | Private error notification dispatched if an invalid move or action is rejected. |

### 2.3 Client Message Destinations (Client -> Server)

Prefix: `/app`

#### 2.3.1 Submit Move
- **Destination**: `/app/game/{gameId}/move`
- **Payload**: `MoveRequest`
```json
{
  "from": "e2",
  "to": "e4",
  "promotion": "q",
  "playerId": "player_white_123"
}
```
- **Validation**:
  - `from` and `to`: Standard UCI square notation (`a1` to `h8`).
  - `promotion`: Optional piece character: `"q"`, `"r"`, `"b"`, `"n"`.
  - Authorized turn: Server verifies it is `playerId`'s turn according to board side to move.

#### 2.3.2 Join Game
- **Destination**: `/app/game/{gameId}/join`
- **Payload**: `GameActionRequest`
```json
{
  "action": "JOIN",
  "playerId": "player_black_456",
  "playerName": "Grandmaster Alice",
  "preferredColor": "BLACK"
}
```

#### 2.3.3 Reset / Restart Game
- **Destination**: `/app/game/{gameId}/reset`
- **Payload**: `GameActionRequest`
```json
{
  "action": "RESET",
  "playerId": "player_white_123"
}
```

#### 2.3.4 Resign Game
- **Destination**: `/app/game/{gameId}/resign`
- **Payload**: `GameActionRequest`
```json
{
  "action": "RESIGN",
  "playerId": "player_white_123"
}
```

---

## 3. HTTP REST API Endpoints

Base URL: `http://localhost:8085/api`

### 3.1 Create Game
- **Endpoint**: `POST /api/games`
- **Request Body**: `CreateGameRequest`
```json
{
  "whitePlayerName": "Magnus",
  "blackPlayerName": "Hikaru",
  "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
}
```
*Note: All fields are optional. Defaults to standard initial chess position if `fen` is null.*
- **Response**: `201 Created` with `GameStateResponse`

### 3.2 Get Game State
- **Endpoint**: `GET /api/games/{gameId}`
- **Response**: `200 OK` with `GameStateResponse`
- **Error**: `404 Not Found` if `gameId` does not exist.

### 3.3 List Active Games
- **Endpoint**: `GET /api/games`
- **Response**: `200 OK` with `List<GameStateResponse>`

### 3.4 Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `200 OK`
```json
{
  "status": "UP",
  "service": "chess-backend",
  "timestamp": "2026-09-06T07:15:00Z"
}
```

---

## 4. Shared Models & JSON Schemas

### 4.1 `GameStateResponse` Schema
```json
{
  "gameId": "d8c11e74-29c3-4d2c-a05e-85b67e3bf8e2",
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  "status": "IN_PROGRESS",
  "sideToMove": "BLACK",
  "whitePlayer": {
    "id": "p_w_1",
    "name": "Player 1",
    "color": "WHITE",
    "connected": true
  },
  "blackPlayer": {
    "id": "p_b_2",
    "name": "Player 2",
    "color": "BLACK",
    "connected": true
  },
  "moveHistory": [
    {
      "moveNumber": 1,
      "color": "WHITE",
      "from": "e2",
      "to": "e4",
      "san": "e4",
      "fenAfter": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      "timestamp": 1725600000000
    }
  ],
  "lastMove": {
    "from": "e2",
    "to": "e4",
    "san": "e4"
  },
  "inCheck": false,
  "inCheckmate": false,
  "inDraw": false,
  "inStalemate": false,
  "winner": null,
  "capturedWhitePieces": ["p"],
  "capturedBlackPieces": [],
  "halfMoveClock": 0,
  "fullMoveNumber": 1,
  "createdAt": 1725599900000,
  "updatedAt": 1725600000000
}
```

### 4.2 Enums

#### `GameStatus`
- `WAITING_FOR_PLAYERS`: Initial state awaiting opponent.
- `IN_PROGRESS`: Game active; valid moves accepted.
- `CHECK`: King is under check.
- `CHECKMATE`: Decisive win by checkmate.
- `STALEMATE`: Draw by stalemate.
- `DRAW_INSUFFICIENT_MATERIAL`: Draw by lack of mating material.
- `DRAW_FIFTY_MOVES`: Draw by 50-move rule.
- `DRAW_REPETITION`: Draw by threefold repetition.
- `RESIGNED`: Player resigned; opponent wins.
- `TIMEOUT`: Clock expiry.

#### `PlayerColor`
- `WHITE`
- `BLACK`

---

## 5. Type Mapping: Java DTO to TypeScript Interface

| Java Class (com.chess.dto) | TypeScript Interface (`frontend/src/types/chess.ts`) | Description |
|---|---|---|
| `CreateGameRequest` | `CreateGameRequest` | Parameters to initialize a game session |
| `MoveRequest` | `MoveRequest` | Coordinates and details of an attempted move |
| `GameActionRequest` | `GameActionRequest` | Lifecycle actions (JOIN, RESIGN, RESET) |
| `GameStateResponse` | `GameStateResponse` | Comprehensive state payload broadcasted over WS |
| `PlayerDto` | `Player` | Player metadata (id, name, color, connection) |
| `MoveRecordDto` | `MoveRecord` | Historical move record with SAN & FEN snapshot |
| `GameStatus` | `GameStatus` | Union string enum of all game outcome states |
| `PlayerColor` | `PlayerColor` | `"WHITE" \| "BLACK"` |

---

## 6. Sequence Diagrams

### 6.1 Move Execution Flow
```
Client (React + chess.js)                 Server (Spring Boot + chesslib)
       │                                                 │
       ├──[ 1. Optimistic UI update via chess.js ]       │
       ├──[ 2. STOMP: /app/game/{id}/move ]─────────────>│
       │                                                 ├──[ 3. Validate with chesslib ]
       │                                                 ├──[ 4. Check mate/draw conditions ]
       │                                                 ├──[ 5. Update GameSession ]
       │<──[ 6. Broadcast: /topic/game/{id} ]────────────┤
       │                                                 │
  [ 7. Reconcile state & FEN ]                           │
```

---

## 7. Error Handling

When an invalid move or action is received:
1. The server catches the exception (`IllegalMoveException`, `InvalidGameStateException`).
2. Dispatches a STOMP message to `/user/queue/errors` or returns an error event:
```json
{
  "errorCode": "INVALID_MOVE",
  "message": "Illegal move: Pawn cannot move to e5 in this position.",
  "gameId": "d8c11e74-29c3-4d2c-a05e-85b67e3bf8e2",
  "timestamp": 1725600005000
}
```
3. The client receives the rejection and automatically rolls back the local `chess.js` board to the last confirmed server `fen`.
