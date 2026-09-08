import { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { stompClient } from '../services/stompClient';
import { createRoomApi, getRoomApi } from '../services/api';

const SESSION_TOKEN_KEY = 'chess_player_token';
const SESSION_NAME_KEY = 'chess_player_name';
const SESSION_ROOM_KEY = 'chess_room_code';

function getOrCreatePlayerToken() {
  let token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) {
    token = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'p_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }
  return token;
}

export function useMultiplayerRoom() {
  const [playerToken] = useState(() => getOrCreatePlayerToken());
  const [playerName, setPlayerName] = useState(() => sessionStorage.getItem(SESSION_NAME_KEY) || 'Player');
  const [roomCode, setRoomCode] = useState(() => sessionStorage.getItem(SESSION_ROOM_KEY) || null);

  const [connected, setConnected] = useState(false);
  const [playerColor, setPlayerColor] = useState(null); // 'w' | 'b' | null
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [drawOffer, setDrawOffer] = useState(null); // { fromPlayerToken: string }

  // Game state object
  const [gameState, setGameState] = useState({
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    turn: 'w',
    status: 'WAITING', // 'WAITING' | 'ACTIVE' | 'FINISHED' | 'PAUSED'
    moveHistory: [],
    lastMove: null,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    isGameOver: false,
    winner: null,
    winReason: null,
    whitePlayer: null,
    blackPlayer: null,
    initialMinutes: 10,
    incrementSeconds: 0,
  });

  // Clocks in milliseconds
  const [clocks, setClocks] = useState({
    whiteMs: 600000,
    blackMs: 600000,
  });

  // Authoritative references
  const chessRef = useRef(new Chess());
  const lastConfirmedFenRef = useRef('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const lastTickTimeRef = useRef(Date.now());
  const roomCodeRef = useRef(roomCode);
  roomCodeRef.current = roomCode;

  // Persist name changes
  const updatePlayerName = useCallback((name) => {
    setPlayerName(name);
    sessionStorage.setItem(SESSION_NAME_KEY, name);
  }, []);

  // Compute captured pieces and material difference
  const getCapturedPieces = useCallback(() => {
    const startCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    const currentCounts = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
    };

    const board = chessRef.current.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type !== 'k') {
          currentCounts[piece.color][piece.type]++;
        }
      }
    }

    // Pieces captured BY White (i.e. missing Black pieces)
    const whiteCaptures = [];
    // Pieces captured BY Black (i.e. missing White pieces)
    const blackCaptures = [];

    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    let whiteScore = 0;
    let blackScore = 0;

    ['p', 'n', 'b', 'r', 'q'].forEach((type) => {
      const missingBlack = startCounts[type] - currentCounts.b[type];
      for (let i = 0; i < missingBlack; i++) {
        whiteCaptures.push(type);
        whiteScore += pieceValues[type];
      }

      const missingWhite = startCounts[type] - currentCounts.w[type];
      for (let i = 0; i < missingWhite; i++) {
        blackCaptures.push(type);
        blackScore += pieceValues[type];
      }
    });

    return {
      whiteCaptures,
      blackCaptures,
      materialDiff: whiteScore - blackScore // positive = White leads, negative = Black leads
    };
  }, []);

  // Synchronize state from authoritative backend message
  const handleServerGameState = useCallback((msg) => {
    if (!msg) return;

    // Handle Draw Offer notification
    if (msg.type === 'DRAW_OFFER') {
      if (msg.playerToken !== playerToken) {
        setDrawOffer({ fromPlayerToken: msg.playerToken });
      }
      return;
    }

    // Full GameStateMessage
    if (msg.fen) {
      lastConfirmedFenRef.current = msg.fen;
      try {
        chessRef.current.load(msg.fen);
      } catch (err) {
        console.warn('Failed to load server FEN into local chess instance:', err);
      }

      // Determine local player color
      let assignedColor = null;
      if (msg.whitePlayer && msg.whitePlayer.token === playerToken) {
        assignedColor = 'w';
      } else if (msg.blackPlayer && msg.blackPlayer.token === playerToken) {
        assignedColor = 'b';
      }
      setPlayerColor(assignedColor);

      // Determine opponent connection status
      if (assignedColor === 'w') {
        setOpponentConnected(!!msg.blackPlayer?.connected);
      } else if (assignedColor === 'b') {
        setOpponentConnected(!!msg.whitePlayer?.connected);
      } else {
        setOpponentConnected(!!(msg.whitePlayer?.connected && msg.blackPlayer?.connected));
      }

      // Turn mapping: "WHITE" -> 'w', "BLACK" -> 'b'
      const turnColor = (msg.turn === 'WHITE' || msg.turn === 'w') ? 'w' : 'b';

      const isGameOver = msg.status === 'FINISHED' || msg.checkmate || msg.stalemate || msg.draw;

      setGameState({
        fen: msg.fen,
        turn: turnColor,
        status: msg.status || 'WAITING',
        moveHistory: msg.moveHistory || [],
        lastMove: msg.lastMove || null,
        isCheck: !!msg.check,
        isCheckmate: !!msg.checkmate,
        isStalemate: !!msg.stalemate,
        isDraw: !!msg.draw,
        isGameOver,
        winner: msg.winner || null,
        winReason: msg.winReason || null,
        whitePlayer: msg.whitePlayer || null,
        blackPlayer: msg.blackPlayer || null,
        initialMinutes: msg.initialMinutes || 10,
        incrementSeconds: msg.incrementSeconds || 0,
      });

      // Update clocks from authoritative server milliseconds
      const whiteMs = typeof msg.whiteTime === 'number' ? msg.whiteTime
        : msg.whitePlayer?.remainingTimeMillis ?? 600000;
      const blackMs = typeof msg.blackTime === 'number' ? msg.blackTime
        : msg.blackPlayer?.remainingTimeMillis ?? 600000;

      setClocks({ whiteMs: Math.max(0, whiteMs), blackMs: Math.max(0, blackMs) });
      lastTickTimeRef.current = Date.now();

      // Clear any pending draw offer if game finished or state advanced
      if (isGameOver) {
        setDrawOffer(null);
      }
    }
  }, [playerToken]);

  // Rollback on server error
  const handleServerError = useCallback((err) => {
    console.warn('[Multiplayer Room Error]', err);
    const message = err?.message || err?.error || 'Move rejected by server';
    setErrorMessage(message);

    // Rollback local board to last confirmed authoritative FEN
    if (lastConfirmedFenRef.current) {
      try {
        chessRef.current.load(lastConfirmedFenRef.current);
        setGameState((prev) => ({
          ...prev,
          fen: lastConfirmedFenRef.current,
          turn: chessRef.current.turn(),
          isCheck: chessRef.current.inCheck(),
        }));
      } catch (e) {
        console.error('Rollback error', e);
      }
    }
  }, []);

  // Connect STOMP and register listeners
  useEffect(() => {
    stompClient.connect({
      onStateMessage: handleServerGameState,
      onErrorMessage: handleServerError,
      onConnectionChange: (isConn) => {
        setConnected(isConn);
        if (isConn && roomCodeRef.current) {
          // Re-subscribe and rejoin on reconnect
          stompClient.subscribeToRoom(roomCodeRef.current, handleServerGameState);
          stompClient.subscribeToErrors(playerToken, handleServerError);
          stompClient.joinRoom(roomCodeRef.current, {
            playerToken,
            playerName,
          });
        }
      }
    });

    return () => {
      // Don't kill socket on re-render unless leaving room completely
    };
  }, [handleServerGameState, handleServerError, playerToken, playerName]);

  // Handle local 100ms clock countdown when game is ACTIVE
  useEffect(() => {
    if (gameState.status !== 'ACTIVE' || gameState.isGameOver) {
      return;
    }

    lastTickTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      setClocks((prev) => {
        const activeTurn = gameState.turn;
        if (activeTurn === 'w') {
          const nextWhite = Math.max(0, prev.whiteMs - delta);
          return { ...prev, whiteMs: nextWhite };
        } else {
          const nextBlack = Math.max(0, prev.blackMs - delta);
          return { ...prev, blackMs: nextBlack };
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.status, gameState.turn, gameState.isGameOver]);

  // Action: Create Room via REST API, then join over STOMP
  const createRoom = useCallback(async ({ initialMinutes = 10, incrementSeconds = 0, preferredColor = null }) => {
    try {
      setErrorMessage(null);
      const res = await createRoomApi({ initialMinutes, incrementSeconds });
      const newRoomCode = res.roomCode;
      setRoomCode(newRoomCode);
      sessionStorage.setItem(SESSION_ROOM_KEY, newRoomCode);

      // Subscribe and Join
      stompClient.subscribeToRoom(newRoomCode, handleServerGameState);
      stompClient.subscribeToErrors(playerToken, handleServerError);
      stompClient.joinRoom(newRoomCode, {
        playerToken,
        playerName,
        preferredColor
      });

      handleServerGameState(res);
      return newRoomCode;
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create room');
      throw err;
    }
  }, [handleServerGameState, handleServerError, playerToken, playerName]);

  // Action: Join existing room
  const joinRoom = useCallback(async (codeToJoin, preferredColor = null) => {
    if (!codeToJoin) return;
    const cleanCode = codeToJoin.trim().toUpperCase();
    try {
      setErrorMessage(null);
      setRoomCode(cleanCode);
      sessionStorage.setItem(SESSION_ROOM_KEY, cleanCode);

      // Verify room exists via REST
      try {
        const roomInfo = await getRoomApi(cleanCode);
        handleServerGameState(roomInfo);
      } catch (e) {
        console.info('Room info REST fetch note:', e);
      }

      // Connect & subscribe
      stompClient.subscribeToRoom(cleanCode, handleServerGameState);
      stompClient.subscribeToErrors(playerToken, handleServerError);
      stompClient.joinRoom(cleanCode, {
        playerToken,
        playerName,
        preferredColor
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to join room');
    }
  }, [handleServerGameState, handleServerError, playerToken, playerName]);

  // Action: Make move with optimistic local execution
  const makeMove = useCallback((from, to, promotion = 'q') => {
    if (!roomCode) {
      setErrorMessage('No active room');
      return false;
    }

    // Enforce player color turn constraint
    if (playerColor && gameState.turn !== playerColor) {
      setErrorMessage("It's not your turn!");
      return false;
    }

    if (gameState.status !== 'ACTIVE') {
      setErrorMessage(
        gameState.status === 'WAITING'
          ? 'Waiting for opponent to join...'
          : 'Game is not active'
      );
      return false;
    }

    try {
      // 1. Validate and execute locally on chess.js
      const move = chessRef.current.move({
        from,
        to,
        promotion: promotion || 'q'
      });

      if (!move) {
        return false;
      }

      // 2. Optimistic update
      const newFen = chessRef.current.fen();
      const nextTurn = chessRef.current.turn();
      const moveSan = move.san;

      setGameState((prev) => ({
        ...prev,
        fen: newFen,
        turn: nextTurn,
        lastMove: { from, to, promotion },
        moveHistory: [...prev.moveHistory, moveSan],
        isCheck: chessRef.current.inCheck(),
      }));

      // 3. Send over STOMP WebSocket
      stompClient.sendMove(roomCode, {
        playerToken,
        from,
        to,
        promotion: move.promotion || (promotion ? promotion : undefined)
      });

      return true;
    } catch (err) {
      console.warn('Move validation error:', err);
      return false;
    }
  }, [roomCode, playerColor, gameState.turn, gameState.status, playerToken]);

  // Action: Resign
  const resign = useCallback(() => {
    if (!roomCode) return;
    stompClient.sendResign(roomCode, { playerToken });
  }, [roomCode, playerToken]);

  // Action: Offer Draw
  const offerDraw = useCallback(() => {
    if (!roomCode) return;
    stompClient.sendDraw(roomCode, { playerToken, action: 'OFFER' });
  }, [roomCode, playerToken]);

  // Action: Accept Draw
  const acceptDraw = useCallback(() => {
    if (!roomCode) return;
    stompClient.sendDraw(roomCode, { playerToken, action: 'ACCEPT' });
    setDrawOffer(null);
  }, [roomCode, playerToken]);

  // Action: Decline Draw
  const declineDraw = useCallback(() => {
    if (!roomCode) return;
    stompClient.sendDraw(roomCode, { playerToken, action: 'DECLINE' });
    setDrawOffer(null);
  }, [roomCode, playerToken]);

  // Action: Request Rematch / Reset
  const requestRematch = useCallback(() => {
    if (!roomCode) return;
    stompClient.sendReset(roomCode);
  }, [roomCode]);

  // Action: Leave room
  const leaveRoom = useCallback(() => {
    sessionStorage.removeItem(SESSION_ROOM_KEY);
    setRoomCode(null);
    setPlayerColor(null);
    setErrorMessage(null);
    setDrawOffer(null);
    lastConfirmedFenRef.current = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    chessRef.current.reset();
    setGameState({
      fen: chessRef.current.fen(),
      turn: 'w',
      status: 'WAITING',
      moveHistory: [],
      lastMove: null,
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      isDraw: false,
      isGameOver: false,
      winner: null,
      winReason: null,
      whitePlayer: null,
      blackPlayer: null,
      initialMinutes: 10,
      incrementSeconds: 0,
    });
  }, []);

  // Clear transient error message
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    // Identity & Room
    playerToken,
    playerName,
    updatePlayerName,
    roomCode,
    playerColor,
    connected,
    opponentConnected,

    // Game & Clocks
    gameState,
    clocks,
    chess: chessRef.current,
    captured: getCapturedPieces(),
    errorMessage,
    clearError,
    drawOffer,

    // Actions
    createRoom,
    joinRoom,
    makeMove,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    requestRematch,
    leaveRoom,
  };
}
