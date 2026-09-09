import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ScrollText, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * MoveHistoryTable: A standard two-column PGN chess move sheet.
 * Supports:
 * - Numbered paired rows (e.g. 1. e4 e5)
 * - Highlighting of the latest move or currently inspected past move
 * - Click-to-inspect past moves
 * - Smooth auto-scrolling
 * - One-click Copy PGN functionality
 */
export function MoveHistoryTable({
  history = [], // Array of SAN strings ['e4', 'e5', 'Nf3', ...]
  currentPly = null, // Current viewed ply (defaults to history.length)
  onSelectPly = null, // Callback when a player clicks a past move
  className = '',
}) {
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  const activePly = currentPly !== null ? currentPly : history.length;

  // Group linear history into move pairs: [{ num: 1, white: 'e4', whitePly: 1, black: 'e5', blackPly: 2 }, ...]
  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({
        num: Math.floor(i / 2) + 1,
        white: history[i],
        whitePly: i + 1,
        black: history[i + 1] || null,
        blackPly: history[i + 1] ? i + 2 : null,
      });
    }
    return pairs;
  }, [history]);

  // Auto-scroll on new moves
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length]);

  // Generate standard PGN format for clipboard
  const handleCopyPgn = async () => {
    if (history.length === 0) return;

    let pgnString = '';
    movePairs.forEach((pair) => {
      pgnString += `${pair.num}. ${pair.white} `;
      if (pair.black) {
        pgnString += `${pair.black} `;
      }
    });

    try {
      await navigator.clipboard.writeText(pgnString.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy PGN', e);
    }
  };

  return (
    <div
      className={`flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/70 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <ScrollText className="w-4 h-4 text-emerald-400" />
          <span>Move Sheet</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 font-mono">
            {history.length}
          </span>
        </div>

        <button
          onClick={handleCopyPgn}
          disabled={history.length === 0}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Copy PGN Notation"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[11px]">PGN</span>
            </>
          )}
        </button>
      </div>

      {/* Move Sheet Body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-h-[300px] min-h-[160px] p-2 space-y-0.5 font-mono text-xs select-none"
      >
        {movePairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 text-slate-500 text-xs">
            <span>No moves recorded</span>
            <span className="text-[10px] text-slate-600 mt-0.5">Game in starting position</span>
          </div>
        ) : (
          movePairs.map((pair) => {
            const isWhiteActive = activePly === pair.whitePly;
            const isBlackActive = activePly === pair.blackPly;

            return (
              <div
                key={pair.num}
                className="grid grid-cols-12 items-center py-1 px-2 rounded-lg hover:bg-slate-800/40 transition-colors"
              >
                {/* Move Number */}
                <span className="col-span-2 text-slate-500 font-bold text-[11px]">
                  {pair.num}.
                </span>

                {/* White Move */}
                <button
                  onClick={() => onSelectPly && onSelectPly(pair.whitePly)}
                  className={`col-span-5 text-left px-2 py-0.5 rounded transition-all font-semibold ${
                    isWhiteActive
                      ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'text-slate-200 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  {pair.white}
                </button>

                {/* Black Move */}
                <div className="col-span-5 text-left">
                  {pair.black ? (
                    <button
                      onClick={() => onSelectPly && onSelectPly(pair.blackPly)}
                      className={`w-full text-left px-2 py-0.5 rounded transition-all ${
                        isBlackActive
                          ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`}
                    >
                      {pair.black}
                    </button>
                  ) : (
                    <span className="text-slate-600 text-xs px-2">&bull;&bull;&bull;</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Status */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>
          {history.length === 0
            ? 'Move 1 (White to move)'
            : `Move ${Math.floor(history.length / 2) + 1} (${
                history.length % 2 === 0 ? 'White' : 'Black'
              } to move)`}
        </span>
        {onSelectPly && activePly < history.length && (
          <button
            onClick={() => onSelectPly(history.length)}
            className="text-emerald-400 hover:text-emerald-300 font-bold transition-all"
          >
            Live &rarr;
          </button>
        )}
      </div>
    </div>
  );
}

export default MoveHistoryTable;
