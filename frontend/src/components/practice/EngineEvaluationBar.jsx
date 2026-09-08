import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export function EngineEvaluationBar({
  evaluation = null,
  orientation = 'white', // 'white' | 'black'
  isThinking = false,
  height = '100%',
}) {
  // Default values
  const score = evaluation?.score ?? '0.0';
  const depth = evaluation?.depth ?? 0;
  const isMate = evaluation?.isMate ?? false;
  const winChance = evaluation?.winChance ?? 50; // 0 (100% Black) to 100 (100% White)

  // Determine white height percentage
  // If orientation is 'white': White is at bottom, Black is at top
  // If orientation is 'black': Black is at bottom, White is at top
  let whiteHeightPercent = winChance;

  if (isMate) {
    // If mate in favor of White -> White bar takes nearly full height
    // If mate in favor of Black -> White bar shrinks to minimal height
    const centipawns = evaluation?.centipawns ?? 0;
    whiteHeightPercent = centipawns > 0 ? 98 : 2;
  }

  // Visual percentages based on orientation
  const isWhiteBottom = orientation === 'white';
  const bottomBarHeight = isWhiteBottom ? whiteHeightPercent : 100 - whiteHeightPercent;

  // Numerical display formatting
  const displayScore = isMate ? score : (score.startsWith('+') || score.startsWith('-') ? score : `+${score}`);

  return (
    <div
      className="relative flex flex-col items-center justify-between w-7 sm:w-8 h-full min-h-[300px] max-h-[560px] rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-xl select-none"
      style={{ height }}
      title={`Engine Eval: ${displayScore} (Depth ${depth})`}
    >
      {/* Top Half (Opponent side) */}
      <div
        className={`w-full transition-all duration-500 ease-out flex items-start justify-center pt-1.5 ${
          isWhiteBottom ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-800'
        }`}
        style={{ height: `${100 - bottomBarHeight}%` }}
      >
        {/* If Black is winning and at the top */}
        {!isWhiteBottom && (
          <span className="text-[10px] font-black font-mono tracking-tight px-1 py-0.5 rounded shadow-sm">
            {displayScore}
          </span>
        )}
      </div>

      {/* Evaluation Center / Thinking Pulse Indicator */}
      {isThinking && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
      )}

      {/* Bottom Half (Player side) */}
      <div
        className={`w-full transition-all duration-500 ease-out flex items-end justify-center pb-1.5 ${
          isWhiteBottom ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-400'
        }`}
        style={{ height: `${bottomBarHeight}%` }}
      >
        {/* If White is winning and at the bottom */}
        {isWhiteBottom && (
          <span className="text-[10px] font-black font-mono tracking-tight px-1 py-0.5 rounded shadow-sm">
            {displayScore}
          </span>
        )}
      </div>

      {/* Depth Badge at bottom edge */}
      {depth > 0 && (
        <div className="absolute bottom-1 right-1 left-1 text-center pointer-events-none z-10">
          <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-slate-950/70 text-slate-400 border border-slate-800 backdrop-blur-xs">
            D{depth}
          </span>
        </div>
      )}
    </div>
  );
}
