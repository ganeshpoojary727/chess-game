import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
  BackendErrorPayload,
  DrawRequest,
  GameStateMessage,
  JoinRequest,
  MoveRequest,
  ResignRequest,
} from '../types/backend';

const WS_BASE = (import.meta as any).env?.VITE_WS_URL || 'http://localhost:8080';

export class ChessSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private roomSubscription: StompSubscription | null = null;
  private errorSubscription: StompSubscription | null = null;

  /**
   * Connect to the Spring Boot STOMP WebSocket broker at /ws.
   */
  public connect(): Promise<Client> {
    return new Promise((resolve, reject) => {
      if (this.client && this.connected) {
        resolve(this.client);
        return;
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(`${WS_BASE}/ws`),
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
      });

      this.client.onConnect = () => {
        this.connected = true;
        resolve(this.client!);
      };

      this.client.onStompError = (frame) => {
        this.connected = false;
        reject(new Error(`STOMP error: ${frame.headers['message']}`));
      };

      this.client.onDisconnect = () => {
        this.connected = false;
      };

      this.client.activate();
    });
  }

  public isConnected(): boolean {
    return this.connected && this.client !== null && this.client.active;
  }

  /**
   * Subscribes to authoritative game state broadcasts for the given room code.
   * Listens on: /topic/room/{roomCode}
   */
  public subscribeToRoom(
    roomCode: string,
    onGameState: (state: GameStateMessage) => void
  ): StompSubscription | null {
    if (!this.client || !this.connected) return null;

    if (this.roomSubscription) {
      this.roomSubscription.unsubscribe();
    }

    const cleanCode = roomCode.toUpperCase().trim();
    this.roomSubscription = this.client.subscribe(
      `/topic/room/${cleanCode}`,
      (message: IMessage) => {
        try {
          const parsed: GameStateMessage = JSON.parse(message.body);
          onGameState(parsed);
        } catch (e) {
          console.error('Failed to parse GameStateMessage', e);
        }
      }
    );

    return this.roomSubscription;
  }

  /**
   * Subscribes to private error notifications for a specific player token.
   * Listens on: /queue/errors-{playerToken}
   */
  public subscribeToErrors(
    playerToken: string,
    onError: (error: BackendErrorPayload) => void
  ): StompSubscription | null {
    if (!this.client || !this.connected) return null;

    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }

    this.errorSubscription = this.client.subscribe(
      `/queue/errors-${playerToken}`,
      (message: IMessage) => {
        try {
          const parsed: BackendErrorPayload = JSON.parse(message.body);
          onError(parsed);
        } catch (e) {
          onError({ error: 'UNKNOWN', message: message.body });
        }
      }
    );

    return this.errorSubscription;
  }

  /**
   * Send a JOIN request to /app/room/{roomCode}/join.
   */
  public joinRoom(roomCode: string, payload: JoinRequest): void {
    if (!this.client || !this.connected) throw new Error('WebSocket not connected');
    this.client.publish({
      destination: `/app/room/${roomCode.toUpperCase().trim()}/join`,
      body: JSON.stringify(payload),
    });
  }

  /**
   * Send an authoritative MOVE request to /app/room/{roomCode}/move.
   */
  public sendMove(roomCode: string, payload: MoveRequest): void {
    if (!this.client || !this.connected) throw new Error('WebSocket not connected');
    this.client.publish({
      destination: `/app/room/${roomCode.toUpperCase().trim()}/move`,
      body: JSON.stringify(payload),
    });
  }

  /**
   * Send a RESIGN request to /app/room/{roomCode}/resign.
   */
  public sendResign(roomCode: string, payload: ResignRequest): void {
    if (!this.client || !this.connected) throw new Error('WebSocket not connected');
    this.client.publish({
      destination: `/app/room/${roomCode.toUpperCase().trim()}/resign`,
      body: JSON.stringify(payload),
    });
  }

  /**
   * Send a DRAW offer, acceptance, or decline to /app/room/{roomCode}/draw.
   */
  public sendDraw(roomCode: string, payload: DrawRequest): void {
    if (!this.client || !this.connected) throw new Error('WebSocket not connected');
    this.client.publish({
      destination: `/app/room/${roomCode.toUpperCase().trim()}/draw`,
      body: JSON.stringify(payload),
    });
  }

  /**
   * Send a RESET command to /app/room/{roomCode}/reset.
   */
  public sendReset(roomCode: string): void {
    if (!this.client || !this.connected) throw new Error('WebSocket not connected');
    this.client.publish({
      destination: `/app/room/${roomCode.toUpperCase().trim()}/reset`,
      body: JSON.stringify({}),
    });
  }

  public disconnect(): void {
    if (this.roomSubscription) {
      this.roomSubscription.unsubscribe();
      this.roomSubscription = null;
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
      this.errorSubscription = null;
    }
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.connected = false;
  }
}

export const socketService = new ChessSocketService();
