import React, { useState, useMemo, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';

export function MultiplayerBoard({
  fen,
  chess,
  playerColor, // 'w' | 'b' | null
  isMyTurn = false,
  gameStatus = 'WAITING',
  isCheck = false,
  lastMove = null,
  onMakeMove,
}) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  // Auto board orientation
  const orientation = playerColor === 'b' ? 'black' : 'white';

  // Can the user drag pieces?
  const canDrag = gameStatus === 'ACTIVE' && isMyTurn;

  // Filter draggable piece: only allow dragging pieces of user's own color
  const isDraggablePiece = useCallback(
    ({ piece }) => {
      if (!canDrag || !playerColor) return false;
      const pieceColorPrefix = playerColor === 'b' ? 'b' : 'w';
      return piece.startsWith(pieceColorPrefix);
    },
    [canDrag, playerColor]
  );

  // Square Click handler for click-to-move as well as legal move display
  const onSquareClick = useCallback(
    (square) => {
      if (!canDrag || !chess) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      // If already selected a square, check if clicking a destination
      if (selectedSquare) {
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setPossibleMoves([]);
          return;
        }

        const isDest = possibleMoves.includes(square);
        if (isDest) {
          const success = onMakeMove(selectedSquare, square, 'q');
          setSelectedSquare(null);
          setPossibleMoves([]);
          if (success) return;
        }
      }

      // Check if clicked square has player's piece
      const piece = chess.get(square);
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        try {
          const moves = chess.moves({ square, verbose: true });
          setPossibleMoves(moves.map((m) => m.to));
        } catch {
          setPossibleMoves([]);
        }
      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    },
    [canDrag, chess, selectedSquare, possibleMoves, playerColor, onMakeMove]
  );

  // Piece Drop Handler
  const handlePieceDrop = useCallback(
    (sourceSquare, targetSquare, piece) => {
      if (!canDrag) return false;

      setSelectedSquare(null);
      setPossibleMoves([]);

      // Check for promotion
      let promotion = 'q';
      const isPawn = piece && (piece === 'wP' || piece === 'bP');
      const isPromotionRank =
        (piece === 'wP' && targetSquare.endsWith('8')) ||
        (piece === 'bP' && targetSquare.endsWith('1'));

      if (!isPawn || !isPromotionRank) {
        promotion = undefined;
      }

      const moveSuccess = onMakeMove(sourceSquare, targetSquare, promotion);
      return !!moveSuccess;
    },
    [canDrag, onMakeMove]
  );

  // Custom square styles for moves, selections, check, and last move
  const customSquareStyles = useMemo(() => {
    const styles = {};

    // 1. Last move highlights (from & to)
    if (lastMove) {
      if (lastMove.from) {
        styles[lastMove.from] = {
          backgroundColor: 'rgba(234, 179, 8, 0.28)',
        };
      }
      if (lastMove.to) {
        styles[lastMove.to] = {
          backgroundColor: 'rgba(234, 179, 8, 0.38)',
        };
      }
    }

    // 2. Selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(16, 185, 129, 0.45)',
        boxShadow: 'inset 0 0 0 2px #10b981',
      };
    }

    // 3. Legal moves dots
    possibleMoves.forEach((sq) => {
      const pieceOnTarget = chess?.get(sq);
      if (pieceOnTarget) {
        // Capture circle outline
        styles[sq] = {
          background: 'radial-gradient(circle, transparent 55%, rgba(16, 185, 129, 0.5) 56%)',
          borderRadius: '50%',
          cursor: 'pointer',
        };
      } else {
        // Small center dot
        styles[sq] = {
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.65) 24%, transparent 26%)',
          borderRadius: '50%',
          cursor: 'pointer',
        };
      }
    });

    // 4. King in check highlight
    if (isCheck && fen) {
      const activeColor = fen.split(' ')[1] || 'w';
      const targetKing = activeColor === 'w' ? 'K' : 'k';
      const rows = fen.split(' ')[0].split('/');

      rows.forEach((row, rowIndex) => {
        let colIndex = 0;
        for (const char of row) {
          if (isNaN(Number(char))) {
            if (char === targetKing) {
              const file = String.fromCharCode(97 + colIndex);
              const rank = 8 - rowIndex;
              styles[`${file}${rank}`] = {
                background:
                  'radial-gradient(circle, rgba(239, 68, 68, 0.85) 0%, rgba(239, 68, 68, 0.35) 70%, transparent 100%)',
                boxShadow: 'inset 0 0 12px #ef4444',
              };
            }
            colIndex++;
          } else {
            colIndex += Number(char);
          }
        }
      });
    }

    return styles;
  }, [lastMove, selectedSquare, possibleMoves, isCheck, fen, chess]);

  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto p-2 sm:p-2.5 bg-slate-900/90 rounded-2xl border-2 border-slate-800 shadow-2xl backdrop-blur-xl">
      <div className="w-full h-full rounded-xl overflow-hidden shadow-inner relative">
        <Chessboard
          position={fen}
          boardOrientation={orientation}
          onPieceDrop={handlePieceDrop}
          onSquareClick={onSquareClick}
          isDraggablePiece={isDraggablePiece}
          arePiecesDraggable={canDrag}
          customSquareStyles={customSquareStyles}
          customBoardStyle={{
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#779952' }}
          customLightSquareStyle={{ backgroundColor: '#edeed1' }}
          animationDuration={200}
        />

        {/* Turn Status Overlay banner if waiting */}
        {gameStatus === 'WAITING' && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mb-3 animate-bounce">
              <span className="text-xl">⏳</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-1">Waiting for Opponent</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Share your room code or link to start the match. The game will automatically begin once both players are ready!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
