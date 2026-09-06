import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check, ScrollText, Play } from 'lucide-react';
import { MoveRecord } from '../types/chess';

interface MoveHistoryProps {
  moves: MoveRecord[];
  currentFen: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, currentFen }) => {
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest move
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves.length]);

  const copyFen = async () => {
    try {
      await navigator.clipboard.writeText(currentFen);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.warn('Failed to copy FEN');
    }
  };

  // Group moves into pairs [whiteMove, blackMove]
  const movePairs: { number: number; white?: MoveRecord; black?: MoveRecord }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/80">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <ScrollText className="w-4 h-4 text-emerald-400" />
          <span>Move Notation</span>
          <span className="text-xs text-slate-500 font-normal">
            ({moves.length} {moves.length === 1 ? 'move' : 'moves'})
          </span>
        </div>

        <button
          onClick={copyFen}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          title="Copy FEN to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy FEN</span>
            </>
          )}
        </button>
      </div>

      {/* Move list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-sm">
        {movePairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-xs">
            <Play className="w-6 h-6 mb-2 opacity-40 text-emerald-500" />
            <span>Awaiting first move...</span>
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.number}
              className="grid grid-cols-12 items-center py-1 px-2 rounded hover:bg-slate-800/50 transition-colors text-xs"
            >
              <span className="col-span-2 text-slate-500 font-medium">
                {pair.number}.
              </span>
              <span className="col-span-5 text-slate-200 font-medium">
                {pair.white ? pair.white.san : ''}
              </span>
              <span className="col-span-5 text-slate-300">
                {pair.black ? pair.black.san : ''}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer: current position FEN snapshot */}
      <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/60 text-[11px] font-mono text-slate-500 truncate">
        <span className="text-slate-400 font-semibold mr-1.5">FEN:</span>
        <span className="select-all" title={currentFen}>{currentFen}</span>
      </div>
    </div>
  );
};
