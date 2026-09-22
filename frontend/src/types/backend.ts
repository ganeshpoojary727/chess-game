/**
 * Backend Data Transfer Objects (DTOs) and Models.
 * Strictly mirrors Java backend packages in com.chessapp.model.
 */

export type PlayerColor = 'WHITE' | 'BLACK';

export type RoomStatus = 'WAITING' | 'ACTIVE' | 'COMPLETED';

export interface Player {
  playerId: string;
  id?: string;
  name: string;
  color: PlayerColor;
  remainingTimeMillis: number;
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

export interface GameStateMessage {
  roomCode: string;
  gameId: string;
  fen: string;
  lastMove: string | null;
  lastMoveRecord: MoveRecord | null;
  turn: PlayerColor;
  sideToMove: PlayerColor;
  isCheck: boolean;
  inCheck?: boolean;
  isCheckmate: boolean;
  inCheckmate?: boolean;
  isDraw: boolean;
  inDraw?: boolean;
  inStalemate?: boolean;
  whiteTime: number;
  blackTime: number;
  status: RoomStatus;
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  winner: PlayerColor | null;
  terminationReason: string | null;
  drawOfferedBy: string | null;
  moveHistory: MoveRecord[];
  capturedWhitePieces: string[];
  capturedBlackPieces: string[];
  halfMoveClock: number;
  fullMoveNumber: number;
  updatedAt: number;
}

export interface CreateRoomPayload {
  initialMinutes?: number;
  incrementSeconds?: number;
  roomCode?: string;
}

export interface JoinRequest {
  playerToken: string;
  playerName: string;
  preferredColor?: PlayerColor;
  action?: string;
}

export interface MoveRequest {
  playerToken: string;
  from: string;
  to: string;
  promotion?: string;
}

export interface ResignRequest {
  playerToken: string;
  action?: 'RESIGN';
}

export interface DrawRequest {
  playerToken: string;
  action: 'OFFER' | 'ACCEPT' | 'DECLINE';
}

export interface BackendErrorPayload {
  error: string;
  message: string;
}
