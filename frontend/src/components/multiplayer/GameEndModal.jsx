import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Frown, Equal, RotateCcw, Home, X } from 'lucide-react';

export function GameEndModal({
  isOpen = false,
  onClose,
  winner, // "WHITE" | "BLACK" | "DRAW"
  winReason,
  playerColor, // 'w' | 'b'
  whitePlayer,
  blackPlayer,
  onRequestRematch,
  onLeaveRoom,
}) {
  const [minimized, setMinimized] = useState(false);

  // Normalize winner: 'w' | 'b' | 'draw'
  const normWinner = winner ? winner.toLowerCase() : null;
  const isDraw = normWinner === 'draw' || normWinner === 'stalemate';
  const isWhiteWin = normWinner === 'white' || normWinner === 'w';
  const isBlackWin = normWinner === 'black' || normWinner === 'b';

  const isLocalWinner =
    (isWhiteWin && playerColor === 'w') ||
    (isBlackWin && playerColor === 'b');

  const isLocalLoser =
    (isWhiteWin && playerColor === 'b') ||
    (isBlackWin && playerColor === 'w');

  // Trigger celebration confetti on victory
  useEffect(() => {
    if (isOpen && isLocalWinner && !minimized) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'],
        });
      } catch (e) {
        console.info('Confetti note:', e);
      }
    }
  }, [isOpen, isLocalWinner, minimized]);

  if (!isOpen || minimized) {
    if (isOpen && minimized) {
      return (
        <button
          onClick={() => setMinimized(false)}
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-bold text-xs shadow-2xl flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Show Game Result</span>
        </button>
      );
    }
    return null;
  }

  // Header content based on outcome
  let title = 'Game Over';
  let titleColor = 'text-white';
  let badgeBg = 'bg-slate-800 text-slate-300';
  let IconComponent = Equal;

  if (isDraw) {
    title = 'Draw';
    titleColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    IconComponent = Equal;
  } else if (isLocalWinner) {
    title = 'Victory!';
    titleColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    IconComponent = Trophy;
  } else if (isLocalLoser) {
    title = 'Defeat';
    titleColor = 'text-rose-400';
    badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    IconComponent = Frown;
  } else {
    title = `${isWhiteWin ? 'White' : 'Black'} Won`;
    titleColor = 'text-indigo-300';
    IconComponent = Trophy;
  }

  const winnerName = isWhiteWin
    ? whitePlayer?.name || 'White'
    : isBlackWin
    ? blackPlayer?.name || 'Black'
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center">
        {/* Close / Minimize button */}
        <button
          onClick={() => setMinimized(true)}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Review Board"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Outcome Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-xl border bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <IconComponent
            className={`w-10 h-10 ${
              isLocalWinner
                ? 'text-emerald-400 animate-bounce'
                : isLocalLoser
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}
          />
        </div>

        {/* Title */}
        <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-2 ${titleColor}`}>
          {title}
        </h2>

        {/* Reason */}
        <p className="text-slate-300 text-sm mb-4">
          {winReason
            ? winReason
            : isDraw
            ? 'The game concluded in a draw'
            : `${winnerName} won the match`}
        </p>

        {/* Winner Badge */}
        {!isDraw && winnerName && (
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-6 bg-slate-800/60 border-slate-700 text-slate-300">
            Winner: <strong className="text-white">{winnerName}</strong> ({isWhiteWin ? 'White' : 'Black'})
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
          <button
            onClick={onRequestRematch}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/30 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch</span>
          </button>

          <button
            onClick={onLeaveRoom}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Lobby</span>
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setMinimized(true)}
            className="text-xs text-slate-400 hover:text-slate-300 hover:underline"
          >
            Review final board position
          </button>
        </div>
      </div>
    </div>
  );
}
