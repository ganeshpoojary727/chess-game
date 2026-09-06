import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { ConnectionState, GameStateResponse, MoveRequest, PlayerColor } from '../types/chess';
import { createGame, getGame } from '../services/api';
import { wsService } from '../services/websocket';
import confetti from 'canvas-confetti';

export function useChessGame(initialGameId?: string) {
  const [chess] = useState<Chess>(() => new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [gameState, setGameState] = useState<GameStateResponse | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAiOpponent, setIsAiOpponent] = useState<boolean>(false);

  const activeGameIdRef = useRef<string | null>(initialGameId || null);

  // Trigger celebration on checkmate
  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
    });
  }, []);

  // Synchronize server state to local chess.js instance
  const applyServerState = useCallback(
    (state: GameStateResponse) => {
      setGameState(state);
      try {
        chess.load(state.fen);
        setFen(state.fen);
      } catch (err) {
        console.error('Failed to load server FEN into chess.js', err);
      }

      if (state.inCheckmate) {
        triggerCelebration();
      }
    },
    [chess, triggerCelebration]
  );

  // Initialize and connect WebSocket
  const initializeGame = useCallback(
    async (gameIdToLoad?: string) => {
      try {
        let state: GameStateResponse;
        if (gameIdToLoad) {
          state = await getGame(gameIdToLoad);
        } else {
          state = await createGame();
        }

        activeGameIdRef.current = state.gameId;
        applyServerState(state);
        wsService.subscribeToGame(state.gameId);
      } catch (err: unknown) {
        console.warn('Backend unavailable, running in standalone client mode.', err);
        chess.reset();
        setFen(chess.fen());
        // Standalone fallback state
        setGameState({
          gameId: 'local-practice',
          fen: chess.fen(),
          status: 'IN_PROGRESS',
          sideToMove: 'WHITE',
          moveHistory: [],
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          capturedWhitePieces: [],
          capturedBlackPieces: [],
          halfMoveClock: 0,
          fullMoveNumber: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    },
    [applyServerState, chess]
  );

  useEffect(() => {
    wsService.connect(
      (updatedState) => applyServerState(updatedState),
      (status) => setConnectionState(status),
      (err) => {
        setErrorMessage(err);
        setTimeout(() => setErrorMessage(null), 5000);
      }
    );

    initializeGame(initialGameId);

    return () => {
      wsService.disconnect();
    };
  }, [initializeGame, applyServerState, initialGameId]);

  // Compute possible moves from a square
  const getLegalMovesForSquare = useCallback(
    (square: string): string[] => {
      try {
        const moves = chess.moves({ square: square as Square, verbose: true });
        return moves.map((m) => m.to);
      } catch {
        return [];
      }
    },
    [chess]
  );

  // Handle local AI move if AI mode enabled
  const triggerAiMove = useCallback(() => {
    if (chess.isGameOver()) return;
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return;

    // Pick a random legal move or capture
    const captures = moves.filter((m) => m.captured);
    const selected = captures.length > 0
      ? captures[Math.floor(Math.random() * captures.length)]
      : moves[Math.floor(Math.random() * moves.length)];

    setTimeout(() => {
      chess.move(selected);
      setFen(chess.fen());
      if (activeGameIdRef.current && connectionState === 'CONNECTED') {
        const moveReq: MoveRequest = {
          from: selected.from,
          to: selected.to,
          promotion: selected.promotion,
        };
        wsService.sendMove(activeGameIdRef.current, moveReq);
      }
    }, 400);
  }, [chess, connectionState]);

  // Make move handler
  const makeMove = useCallback(
    (from: string, to: string, promotion: string = 'q'): boolean => {
      try {
        // Optimistic client-side validation
        const move = chess.move({
          from: from as Square,
          to: to as Square,
          promotion: promotion,
        });

        if (!move) return false;

        setFen(chess.fen());
        setSelectedSquare(null);
        setPossibleMoves([]);

        // Send to backend via WebSocket if connected
        if (activeGameIdRef.current && connectionState === 'CONNECTED') {
          const moveReq: MoveRequest = {
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            promotion: promotion,
          };
          wsService.sendMove(activeGameIdRef.current, moveReq);
        } else {
          // Local state update
          if (chess.isCheckmate()) {
            triggerCelebration();
          }
          if (isAiOpponent && chess.turn() === 'b') {
            triggerAiMove();
          }
        }

        return true;
      } catch (e) {
        console.warn('Invalid move attempted:', e);
        return false;
      }
    },
    [chess, connectionState, isAiOpponent, triggerAiMove, triggerCelebration]
  );

  // Square click handling for point-and-click movement
  const onSquareClick = useCallback(
    (square: string) => {
      if (selectedSquare) {
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setPossibleMoves([]);
          return;
        }

        const success = makeMove(selectedSquare, square);
        if (success) return;
      }

      const piece = chess.get(square as Square);
      if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(getLegalMovesForSquare(square));
      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    },
    [selectedSquare, makeMove, chess, getLegalMovesForSquare]
  );

  // Drag-and-drop handler
  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      return makeMove(sourceSquare, targetSquare);
    },
    [makeMove]
  );

  // Actions
  const handleNewGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const handleReset = useCallback(() => {
    if (activeGameIdRef.current && connectionState === 'CONNECTED') {
      wsService.resetGame(activeGameIdRef.current);
    } else {
      chess.reset();
      setFen(chess.fen());
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  }, [chess, connectionState]);

  const handleResign = useCallback(() => {
    if (activeGameIdRef.current && connectionState === 'CONNECTED') {
      const preferredColor: PlayerColor = orientation === 'white' ? 'WHITE' : 'BLACK';
      wsService.resignGame(activeGameIdRef.current, {
        action: 'RESIGN',
        preferredColor,
      });
    }
  }, [orientation, connectionState]);

  const toggleOrientation = useCallback(() => {
    setOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }, []);

  return {
    game: chess,
    fen,
    gameState,
    connectionState,
    orientation,
    selectedSquare,
    possibleMoves,
    errorMessage,
    isAiOpponent,
    setIsAiOpponent,
    onSquareClick,
    onPieceDrop,
    handleNewGame,
    handleReset,
    handleResign,
    toggleOrientation,
  };
}
