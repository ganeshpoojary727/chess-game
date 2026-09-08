import { CreateGameRequest, GameStateResponse } from '../types/chess';

const API_BASE = '/api';

export async function createGame(request?: CreateGameRequest): Promise<GameStateResponse> {
  const response = await fetch(`${API_BASE}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request || {}),
  });

  if (!response.ok) {
    throw new Error(`Failed to create game: ${response.statusText}`);
  }
  return response.json();
}

export async function getGame(gameId: string): Promise<GameStateResponse> {
  const response = await fetch(`${API_BASE}/games/${gameId}`);
  if (!response.ok) {
    throw new Error(`Failed to get game ${gameId}: ${response.statusText}`);
  }
  return response.json();
}

export async function getGames(): Promise<GameStateResponse[]> {
  const response = await fetch(`${API_BASE}/games`);
  if (!response.ok) {
    throw new Error(`Failed to get games list: ${response.statusText}`);
  }
  return response.json();
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export interface CreateRoomParams {
  initialMinutes?: number;
  incrementSeconds?: number;
  roomCode?: string;
}

export async function createRoomApi(params?: CreateRoomParams): Promise<any> {
  const response = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params || {}),
  });

  if (!response.ok) {
    throw new Error(`Failed to create room: ${response.statusText}`);
  }
  return response.json();
}

export async function getRoomApi(roomCode: string): Promise<any> {
  const response = await fetch(`${API_BASE}/rooms/${roomCode}`);
  if (!response.ok) {
    throw new Error(`Failed to get room ${roomCode}: ${response.statusText}`);
  }
  return response.json();
}

