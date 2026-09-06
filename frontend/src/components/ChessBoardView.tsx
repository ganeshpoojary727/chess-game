import React, { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { MoveRecord } from '../types/chess';

interface ChessBoardViewProps {
  fen: string;
  orientation: 'white' | 'black';
  selectedSquare: string | null;
  possibleMoves: string[];
  lastMove?: MoveRecord | null;
  inCheck?: boolean;
  sideToMove?: 'WHITE' | 'BLACK';
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  onSquareClick: (square: string) => void;
}

export const ChessBoardView: React.FC<ChessBoardViewProps> = ({
  fen,
  orientation,
  selectedSquare,
  possibleMoves,
  lastMove,
  inCheck,
  sideToMove,
  onPieceDrop,
  onSquareClick,
}) => {
  // Custom square styling for legal moves, highlights, and check
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight last move squares
    if (lastMove) {
      styles[lastMove.from] = {
        backgroundColor: 'rgba(234, 179, 8, 0.3)',
      };
      styles[lastMove.to] = {
        backgroundColor: 'rgba(234, 179, 8, 0.4)',
      };
    }

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        boxShadow: 'inset 0 0 0 2px #10b981',
      };
    }

    // Show legal moves with circular dots
    possibleMoves.forEach((square) => {
      styles[square] = {
        background:
          'radial-gradient(circle, rgba(16, 185, 129, 0.6) 24%, transparent 26%)',
        borderRadius: '50%',
        cursor: 'pointer',
      };
    });

    // Highlight king square in red when in check
    if (inCheck) {
      const targetKing = sideToMove === 'BLACK' ? 'k' : 'K';
      const rows = fen.split(' ')[0].split('/');
      rows.forEach((row, rowIndex) => {
        let colIndex = 0;
        for (const char of row) {
          if (isNaN(Number(char))) {
            if (char === targetKing) {
              const file = String.fromCharCode(97 + colIndex);
              const rank = 8 - rowIndex;
              styles[`${file}${rank}`] = {
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0.3) 70%, transparent 100%)',
                boxShadow: 'inset 0 0 10px #ef4444',
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
  }, [selectedSquare, possibleMoves, lastMove, inCheck, sideToMove, fen]);

  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto p-2 bg-slate-900/90 rounded-2xl border-2 border-slate-800 shadow-2xl backdrop-blur-xl">
      <div className="w-full h-full rounded-xl overflow-hidden shadow-inner">
        <Chessboard
          position={fen}
          boardOrientation={orientation}
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          customSquareStyles={customSquareStyles}
          customBoardStyle={{
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#779952' }}
          customLightSquareStyle={{ backgroundColor: '#edeed1' }}
          animationDuration={250}
          arePiecesDraggable={true}
        />
      </div>
    </div>
  );
};
