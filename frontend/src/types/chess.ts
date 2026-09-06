export type PlayerColor = 'WHITE' | 'BLACK';

export type GameStatus =
  | 'WAITING_FOR_PLAYERS'
  | 'IN_PROGRESS'
  | 'CHECK'
  | 'CHECKMATE'
  | 'STALEMATE'
  | 'DRAW_INSUFFICIENT_MATERIAL'
  | 'DRAW_FIFTY_MOVES'
  | 'DRAW_REPETITION'
  | 'RESIGNED';

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  connected: boolean;
}

export interface MoveRecord {
  moveNumber: number;
  color: PlayerColor;
  from: string;
  to: string;
  san: string;
  fenAfter: string;
  timestamp: number;
}

export interface MoveRequest {
  from: string;
  to: string;
  promotion?: string;
  playerId?: string;
}

export interface CreateGameRequest {
  whitePlayerName?: string;
  blackPlayerName?: string;
  fen?: string;
}

export interface GameActionRequest {
  action: 'JOIN' | 'RESET' | 'RESIGN';
  playerId?: string;
  playerName?: string;
  preferredColor?: PlayerColor;
}

export interface GameStateResponse {
  gameId: string;
  fen: string;
  status: GameStatus;
  sideToMove: PlayerColor;
  whitePlayer?: Player;
  blackPlayer?: Player;
  moveHistory: MoveRecord[];
  lastMove?: MoveRecord | null;
  inCheck: boolean;
  inCheckmate: boolean;
  inDraw: boolean;
  inStalemate: boolean;
  winner?: PlayerColor | null;
  capturedWhitePieces: string[];
  capturedBlackPieces: string[];
  halfMoveClock: number;
  fullMoveNumber: number;
  createdAt: number;
  updatedAt: number;
}

export type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
