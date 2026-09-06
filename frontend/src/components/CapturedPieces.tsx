import React from 'react';

interface CapturedPiecesProps {
  pieces: string[]; // e.g. ['p', 'p', 'n']
  color: 'white' | 'black';
  advantageScore?: number;
}

const PIECE_GLYPHS: Record<string, string> = {
  P: '♙',
  N: '♘',
  B: '♗',
  R: '♖',
  Q: '♕',
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
};



export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  pieces,
  color,
  advantageScore = 0,
}) => {
  return (
    <div className="flex items-center gap-2 min-h-[28px]">
      <div className="flex flex-wrap items-center gap-0.5 text-lg leading-none select-none">
        {pieces.map((piece, idx) => (
          <span
            key={idx}
            className={`transition-transform hover:scale-125 ${
              color === 'white' ? 'text-slate-200' : 'text-slate-400'
            }`}
            title={`Captured ${piece.toUpperCase()}`}
          >
            {PIECE_GLYPHS[piece] || piece}
          </span>
        ))}
      </div>
      {advantageScore > 0 && (
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          +{advantageScore}
        </span>
      )}
    </div>
  );
};
