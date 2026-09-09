import React, { useMemo } from 'react';

// Piece point values
const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  P: 1,
  N: 3,
  B: 3,
  R: 5,
  Q: 9,
};

// Unicode glyph representations for crisp vector scaling
const PIECE_GLYPHS = {
  // Black pieces (captured by White)
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  k: '♚',
  // White pieces (captured by Black)
  P: '♙',
  N: '♘',
  B: '♗',
  R: '♖',
  Q: '♕',
  K: '♔',
};

// Sort order: Queens, Rooks, Bishops, Knights, Pawns
const SORT_ORDER = {
  q: 1,
  Q: 1,
  r: 2,
  R: 2,
  b: 3,
  B: 3,
  n: 4,
  N: 4,
  p: 5,
  P: 5,
};

/**
 * CapturedPieces: Displays captured pieces cleanly organized by value,
 * with optional material advantage badge (+3, +1, etc.).
 *
 * @param {Array<string>} pieces - Array of captured piece characters (e.g. ['p', 'p', 'b', 'q'])
 * @param {'white' | 'black'} playerColor - Color of the player who captured these pieces
 * @param {number} materialAdvantage - Optional material point lead (e.g. +3)
 */
export function CapturedPieces({
  pieces = [],
  playerColor = 'white',
  materialAdvantage = 0,
  className = '',
}) {
  // Sort pieces by descending importance: Q -> R -> B -> N -> P
  const sortedPieces = useMemo(() => {
    return [...pieces].sort((a, b) => {
      const orderA = SORT_ORDER[a] || 99;
      const orderB = SORT_ORDER[b] || 99;
      return orderA - orderB;
    });
  }, [pieces]);

  // Group duplicate pieces to show stacked count (e.g. 3 pawns, 2 rooks)
  const groupedPieces = useMemo(() => {
    const counts = {};
    sortedPieces.forEach((p) => {
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts);
  }, [sortedPieces]);

  return (
    <div className={`flex items-center gap-1.5 min-h-[24px] select-none ${className}`}>
      <div className="flex items-center gap-1 flex-wrap">
        {groupedPieces.map(([piece, count]) => {
          const glyph = PIECE_GLYPHS[piece] || piece;
          return (
            <div
              key={piece}
              className="flex items-center text-sm sm:text-base leading-none transition-transform hover:scale-110"
              title={`${count}x ${piece.toUpperCase()}`}
            >
              <span
                className={
                  playerColor === 'white'
                    ? 'text-slate-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'
                    : 'text-slate-100 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]'
                }
              >
                {glyph}
              </span>
              {count > 1 && (
                <span className="text-[10px] font-bold text-slate-400 ml-0.5 font-mono">
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {materialAdvantage > 0 && (
        <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm animate-fade-in">
          +{materialAdvantage}
        </span>
      )}
    </div>
  );
}

export default CapturedPieces;
