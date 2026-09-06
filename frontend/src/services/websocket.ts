import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ConnectionState, GameActionRequest, GameStateResponse, MoveRequest } from '../types/chess';

export class ChessWebSocketService {
  private client: Client | null = null;
  private currentGameId: string | null = null;
  private gameSubscription: StompSubscription | null = null;
  private errorSubscription: StompSubscription | null = null;

  private onStateUpdateCallback: ((state: GameStateResponse) => void) | null = null;
  private onConnectionStateChangeCallback: ((state: ConnectionState) => void) | null = null;
  private onErrorCallback: ((err: string) => void) | null = null;

  public connect(
    onStateUpdate: (state: GameStateResponse) => void,
    onConnectionStateChange: (state: ConnectionState) => void,
    onError: (err: string) => void
  ) {
    this.onStateUpdateCallback = onStateUpdate;
    this.onConnectionStateChangeCallback = onConnectionStateChange;
    this.onErrorCallback = onError;

    this.onConnectionStateChangeCallback('CONNECTING');

    this.client = new Client({
      // Use SockJS fallback compatible with Spring Boot endpoint /ws
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.onConnectionStateChangeCallback?.('CONNECTED');
        if (this.currentGameId) {
          this.subscribeToGame(this.currentGameId);
        }
      },
      onDisconnect: () => {
        this.onConnectionStateChangeCallback?.('DISCONNECTED');
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
        this.onErrorCallback?.(`STOMP error: ${frame.headers['message'] || 'Connection error'}`);
      },
      onWebSocketError: (event) => {
        console.warn('WebSocket transport error:', event);
      },
    });

    this.client.activate();
  }

  public subscribeToGame(gameId: string) {
    this.currentGameId = gameId;

    if (!this.client || !this.client.connected) {
      return;
    }

    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
      this.gameSubscription = null;
    }

    // Subscribe to public game topic
    this.gameSubscription = this.client.subscribe(
      `/topic/game/${gameId}`,
      (message: IMessage) => {
        try {
          const state: GameStateResponse = JSON.parse(message.body);
          this.onStateUpdateCallback?.(state);
        } catch (err) {
          console.error('Failed to parse incoming GameStateResponse', err);
        }
      }
    );

    // Subscribe to private error queue
    if (!this.errorSubscription) {
      this.errorSubscription = this.client.subscribe(
        '/user/queue/errors',
        (message: IMessage) => {
          try {
            const errObj = JSON.parse(message.body);
            this.onErrorCallback?.(errObj.message || 'Operation failed on server');
          } catch {
            this.onErrorCallback?.(message.body);
          }
        }
      );
    }
  }

  public sendMove(gameId: string, move: MoveRequest) {
    if (!this.client || !this.client.connected) {
      throw new Error('WebSocket is not connected');
    }
    this.client.publish({
      destination: `/app/game/${gameId}/move`,
      body: JSON.stringify(move),
    });
  }

  public joinGame(gameId: string, action: GameActionRequest) {
    if (!this.client || !this.client.connected) {
      return;
    }
    this.client.publish({
      destination: `/app/game/${gameId}/join`,
      body: JSON.stringify(action),
    });
  }

  public resetGame(gameId: string) {
    if (!this.client || !this.client.connected) {
      return;
    }
    this.client.publish({
      destination: `/app/game/${gameId}/reset`,
      body: JSON.stringify({ action: 'RESET' }),
    });
  }

  public resignGame(gameId: string, action?: GameActionRequest) {
    if (!this.client || !this.client.connected) {
      return;
    }
    this.client.publish({
      destination: `/app/game/${gameId}/resign`,
      body: JSON.stringify(action || { action: 'RESIGN' }),
    });
  }

  public disconnect() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
      this.gameSubscription = null;
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
      this.errorSubscription = null;
    }
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.currentGameId = null;
    this.onConnectionStateChangeCallback?.('DISCONNECTED');
  }
}

export const wsService = new ChessWebSocketService();
