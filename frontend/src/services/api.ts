import {
  CreateRoomPayload,
  GameStateMessage,
} from '../types/backend';
import openingsData from '../ai/data/openings.json';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

export interface UserProfileStats {
  id: string;
  name: string;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  accuracy: string;
  avatarUrl?: string;
  online: boolean;
}

export interface OpeningOption {
  key: string;
  name: string;
  eco: string;
  description?: string;
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  movesCount: number;
  opening: string;
  timeControl: string;
}

// ============================================================================
// 1. DISCOVERED BACKEND REST ENDPOINTS (Real Spring Boot Controller endpoints)
// ============================================================================

/**
 * Creates a new multiplayer room via the authoritative backend.
 * Calls: POST /api/rooms (or /api/games)
 */
export async function createRoom(payload: CreateRoomPayload = {}): Promise<GameStateMessage> {
  const response = await fetch(`${API_BASE}/api/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create room: ${errorText || response.statusText}`);
  }

  return response.json();
}

export const createRoomApi = createRoom;
export const createGame = createRoom;

/**
 * Fetches the current authoritative room state.
 * Calls: GET /api/rooms/{roomCode}
 */
export async function getRoom(roomCode: string): Promise<GameStateMessage> {
  const response = await fetch(`${API_BASE}/api/rooms/${roomCode.toUpperCase().trim()}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch room ${roomCode}: ${errorText || response.statusText}`);
  }

  return response.json();
}

export const getGame = getRoom;
export const getRoomApi = getRoom;

/**
 * Lists active rooms and server occupancy.
 * Calls: GET /api/rooms
 */
export async function listRooms(): Promise<{ activeRoomsCount: number; rooms: string[] }> {
  const response = await fetch(`${API_BASE}/api/rooms`);
  if (!response.ok) {
    throw new Error(`Failed to list rooms: ${response.statusText}`);
  }
  return response.json();
}

// ============================================================================
// 2. FLAGGED BACKEND GAPS & CLIENT STUBS (With explicit TODO comments)
// ============================================================================

/**
 * TODO: Backend does not have an authentication endpoint (/api/auth/login or /api/auth/register).
 * The backend currently uses ephemeral player tokens passed in STOMP headers.
 * We persist a persistent playerToken and user profile in localStorage.
 */
export function getOrCreatePlayerToken(): string {
  const stored = localStorage.getItem('checkmate_player_token');
  if (stored) return stored;
  const token = 'token_' + Math.random().toString(36).substring(2, 10);
  localStorage.setItem('checkmate_player_token', token);
  return token;
}

/**
 * TODO: Backend does not have a user profile / stats endpoint (/api/users/{id}/stats).
 * The UI dashboard requires: Rating (1530), Wins (42), Accuracy (68%), and player name ("Ganesh").
 * Stubbed below with local persistence and default fallback data matching the reference design.
 */
export async function fetchUserProfile(): Promise<UserProfileStats> {
  await new Promise((r) => setTimeout(r, 100));

  const saved = localStorage.getItem('checkmate_user_profile');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Fallback
    }
  }

  const defaultProfile: UserProfileStats = {
    id: getOrCreatePlayerToken(),
    name: 'Ganesh',
    username: 'Ganesh',
    rating: 1530,
    wins: 42,
    losses: 18,
    draws: 6,
    accuracy: '68%',
    online: true,
  };

  localStorage.setItem('checkmate_user_profile', JSON.stringify(defaultProfile));
  return defaultProfile;
}

/**
 * TODO: Backend does not have an openings catalog endpoint (/api/openings).
 * Populated from local opening repertoire dataset (src/ai/data/openings.json).
 */
export async function fetchOpeningsList(): Promise<OpeningOption[]> {
  const list: OpeningOption[] = [];
  const rawOpenings = (openingsData as any)?.openings;

  if (Array.isArray(rawOpenings)) {
    for (const item of rawOpenings) {
      list.push({
        key: item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        eco: item.eco || 'C00',
        description: item.description || '',
      });
    }
  }

  // Ensure default openings exist
  if (!list.some((o) => o.name === 'Sicilian Defense')) {
    list.unshift({ key: 'sicilian-defense', name: 'Sicilian Defense', eco: 'B20' });
  }

  return list;
}

/**
 * TODO: Backend does not have a persistent match history endpoint (/api/users/{id}/matches).
 * The backend only tracks moves in-memory during active sessions.
 * Stubbed below for the "View Profile" history modal.
 */
export async function fetchMatchHistory(): Promise<MatchHistoryItem[]> {
  return [
    {
      id: 'm-101',
      date: 'Today, 14:20',
      opponent: 'Grandmaster_X',
      result: 'win',
      movesCount: 34,
      opening: 'Sicilian Defense',
      timeControl: '5 + 0 Blitz',
    },
    {
      id: 'm-102',
      date: 'Yesterday',
      opponent: 'DeepBlue_AI',
      result: 'win',
      movesCount: 28,
      opening: 'Scotch Game',
      timeControl: '10 + 0 Rapid',
    },
    {
      id: 'm-103',
      date: '3 days ago',
      opponent: 'Magnus_Fan99',
      result: 'loss',
      movesCount: 41,
      opening: 'Italian Game',
      timeControl: '3 + 2 Blitz',
    },
  ];
}
