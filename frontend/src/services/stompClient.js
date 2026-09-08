import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * ChessStompClient provides a managed STOMP WebSocket connection
 * with automatic reconnect, exponential backoff, topic/queue subscriptions,
 * and typed room action dispatchers.
 */
export class ChessStompClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.currentRoomCode = null;
    this.currentPlayerToken = null;

    // Subscriptions
    this.roomSubscription = null;
    this.tokenErrorSubscription = null;
    this.genericErrorSubscription = null;

    // Callbacks
    this.onStateMessageCallback = null;
    this.onErrorMessageCallback = null;
    this.onConnectionChangeCallback = null;

    // Exponential Backoff Reconnection Configuration
    this.reconnectAttempts = 0;
    this.baseReconnectDelay = 1000; // 1 second
    this.maxReconnectDelay = 15000; // 15 seconds
    this.reconnectTimer = null;
    this.manuallyDisconnected = false;
  }

  /**
   * Connect to the STOMP server over SockJS
   */
  connect({ onStateMessage, onErrorMessage, onConnectionChange } = {}) {
    if (onStateMessage) this.onStateMessageCallback = onStateMessage;
    if (onErrorMessage) this.onErrorMessageCallback = onErrorMessage;
    if (onConnectionChange) this.onConnectionChangeCallback = onConnectionChange;

    this.manuallyDisconnected = false;

    if (this.client && this.client.active) {
      if (this.isConnected && this.onConnectionChangeCallback) {
        this.onConnectionChangeCallback(true);
      }
      return;
    }

    if (this.onConnectionChangeCallback) {
      this.onConnectionChangeCallback(false);
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      debug: (msg) => {
        if (import.meta.env?.DEV && false) {
          console.debug('[STOMP]', msg);
        }
      },
      // Disable default fixed reconnect so we can manage exponential backoff
      reconnectDelay: 0,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: (receipt) => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }

        if (this.onConnectionChangeCallback) {
          this.onConnectionChangeCallback(true);
        }

        // Restore subscriptions if we had a room or player token
        if (this.currentRoomCode) {
          this.subscribeToRoom(this.currentRoomCode, this.onStateMessageCallback);
        }
        if (this.currentPlayerToken) {
          this.subscribeToErrors(this.currentPlayerToken, this.onErrorMessageCallback);
        }
      },

      onDisconnect: () => {
        this.isConnected = false;
        if (this.onConnectionChangeCallback) {
          this.onConnectionChangeCallback(false);
        }
      },

      onStompError: (frame) => {
        console.error('[STOMP error]', frame.headers['message'], frame.body);
        if (this.onErrorMessageCallback) {
          this.onErrorMessageCallback({
            error: 'STOMP_ERROR',
            message: frame.headers['message'] || frame.body || 'STOMP protocol error'
          });
        }
      },

      onWebSocketClose: (event) => {
        this.isConnected = false;
        if (this.onConnectionChangeCallback) {
          this.onConnectionChangeCallback(false);
        }
        if (!this.manuallyDisconnected) {
          this.scheduleReconnect();
        }
      },

      onWebSocketError: (error) => {
        console.warn('[STOMP WebSocket Error]', error);
      }
    });

    this.client.activate();
  }

  /**
   * Exponential backoff retry handler
   */
  scheduleReconnect() {
    if (this.reconnectTimer || this.manuallyDisconnected) {
      return;
    }

    const delay = Math.min(
      this.maxReconnectDelay,
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts)
    );
    this.reconnectAttempts++;

    console.info(`[STOMP] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.manuallyDisconnected && (!this.client || !this.client.connected)) {
        try {
          this.client?.activate();
        } catch (e) {
          console.warn('[STOMP] Reconnect activate error:', e);
          this.scheduleReconnect();
        }
      }
    }, delay);
  }

  /**
   * Subscribe to room topic updates
   */
  subscribeToRoom(roomCode, callback) {
    this.currentRoomCode = roomCode;
    if (callback) this.onStateMessageCallback = callback;

    if (!this.client || !this.isConnected) {
      return;
    }

    if (this.roomSubscription) {
      try {
        this.roomSubscription.unsubscribe();
      } catch (e) {}
      this.roomSubscription = null;
    }

    // Subscribe to /topic/room/{code}
    this.roomSubscription = this.client.subscribe(`/topic/room/${roomCode}`, (message) => {
      try {
        const payload = JSON.parse(message.body);
        if (this.onStateMessageCallback) {
          this.onStateMessageCallback(payload);
        }
      } catch (err) {
        console.error('[STOMP] Failed to parse room message JSON', err);
      }
    });
  }

  /**
   * Subscribe to private errors queue /queue/errors-{token} and general /queue/errors
   */
  subscribeToErrors(playerToken, callback) {
    this.currentPlayerToken = playerToken;
    if (callback) this.onErrorMessageCallback = callback;

    if (!this.client || !this.isConnected) {
      return;
    }

    if (this.tokenErrorSubscription) {
      try {
        this.tokenErrorSubscription.unsubscribe();
      } catch (e) {}
      this.tokenErrorSubscription = null;
    }

    if (playerToken) {
      this.tokenErrorSubscription = this.client.subscribe(
        `/queue/errors-${playerToken}`,
        (message) => {
          try {
            const err = JSON.parse(message.body);
            if (this.onErrorMessageCallback) {
              this.onErrorMessageCallback(err);
            }
          } catch {
            if (this.onErrorMessageCallback) {
              this.onErrorMessageCallback({ message: message.body });
            }
          }
        }
      );
    }

    if (!this.genericErrorSubscription) {
      this.genericErrorSubscription = this.client.subscribe(
        '/queue/errors',
        (message) => {
          try {
            const err = JSON.parse(message.body);
            if (this.onErrorMessageCallback) {
              this.onErrorMessageCallback(err);
            }
          } catch {
            if (this.onErrorMessageCallback) {
              this.onErrorMessageCallback({ message: message.body });
            }
          }
        }
      );
    }
  }

  /**
   * Send Join Room request
   * Destination: /app/room/{roomCode}/join
   * Payload: { playerToken, playerName, preferredColor }
   */
  joinRoom(roomCode, { playerToken, playerName, preferredColor = null }) {
    let colorValue = null;
    if (preferredColor) {
      const p = String(preferredColor).toUpperCase();
      if (p === 'W' || p === 'WHITE') colorValue = 'WHITE';
      else if (p === 'B' || p === 'BLACK') colorValue = 'BLACK';
    }

    this.publish(`/app/room/${roomCode}/join`, {
      playerToken,
      playerName: playerName || 'Guest',
      preferredColor: colorValue
    });
  }

  /**
   * Send Move request
   * Destination: /app/room/{roomCode}/move
   * Payload: { playerToken, from, to, promotion }
   */
  sendMove(roomCode, { playerToken, from, to, promotion = null }) {
    this.publish(`/app/room/${roomCode}/move`, {
      playerToken,
      from,
      to,
      promotion: promotion || (from && to ? undefined : undefined)
    });
  }

  /**
   * Send Resign request
   * Destination: /app/room/{roomCode}/resign
   * Payload: { playerToken, action: "RESIGN" }
   */
  sendResign(roomCode, { playerToken }) {
    this.publish(`/app/room/${roomCode}/resign`, {
      playerToken,
      action: 'RESIGN'
    });
  }

  /**
   * Send Draw request (OFFER, ACCEPT, DECLINE)
   * Destination: /app/room/{roomCode}/draw
   * Payload: { playerToken, action }
   */
  sendDraw(roomCode, { playerToken, action = 'OFFER' }) {
    this.publish(`/app/room/${roomCode}/draw`, {
      playerToken,
      action
    });
  }

  /**
   * Send Reset / Rematch request
   * Destination: /app/room/{roomCode}/reset
   */
  sendReset(roomCode) {
    this.publish(`/app/room/${roomCode}/reset`, {});
  }

  /**
   * Internal publish helper
   */
  publish(destination, bodyObj) {
    if (!this.client || !this.isConnected) {
      console.warn(`[STOMP] Cannot publish to ${destination}: client not connected.`);
      return false;
    }
    this.client.publish({
      destination,
      body: JSON.stringify(bodyObj)
    });
    return true;
  }

  /**
   * Clean disconnect
   */
  disconnect() {
    this.manuallyDisconnected = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.roomSubscription) {
      try { this.roomSubscription.unsubscribe(); } catch (e) {}
      this.roomSubscription = null;
    }
    if (this.tokenErrorSubscription) {
      try { this.tokenErrorSubscription.unsubscribe(); } catch (e) {}
      this.tokenErrorSubscription = null;
    }
    if (this.genericErrorSubscription) {
      try { this.genericErrorSubscription.unsubscribe(); } catch (e) {}
      this.genericErrorSubscription = null;
    }

    if (this.client) {
      try {
        this.client.deactivate();
      } catch (e) {}
      this.client = null;
    }

    this.isConnected = false;
    this.currentRoomCode = null;
    if (this.onConnectionChangeCallback) {
      this.onConnectionChangeCallback(false);
    }
  }
}

// Export singleton instance for convenience
export const stompClient = new ChessStompClient();
