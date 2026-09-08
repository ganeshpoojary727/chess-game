import React from 'react';
import { Clock, AlertTriangle, Flame } from 'lucide-react';

export function ChessClock({
  timeMs = 0,
  isActive = false,
  isLowThreshold = 20000,
  isCriticalThreshold = 10000,
}) {
  const safeMs = Math.max(0, Number(timeMs) || 0);

  // Formatting
  const formatTime = (ms) => {
    if (ms <= 0) return '00:00';

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Tenths of a second if under 10 seconds
    if (ms < 10000) {
      const tenths = Math.floor((ms % 1000) / 100);
      return `${seconds}.${tenths}`;
    }

    const padMin = String(minutes).padStart(2, '0');
    const padSec = String(seconds).padStart(2, '0');
    return `${padMin}:${padSec}`;
  };

  const isLow = safeMs <= isLowThreshold && safeMs > 0;
  const isCritical = safeMs <= isCriticalThreshold && safeMs > 0;
  const isTimeout = safeMs <= 0;

  // Dynamic visual classes
  let containerStyles = 'bg-slate-900/80 border-slate-800 text-slate-300';
  let badgeStyles = 'text-slate-400';

  if (isTimeout) {
    containerStyles = 'bg-red-950/70 border-red-800 text-red-400';
    badgeStyles = 'text-red-500';
  } else if (isCritical) {
    containerStyles = isActive
      ? 'bg-red-950/90 border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
      : 'bg-red-950/50 border-red-700/60 text-red-300';
    badgeStyles = 'text-red-400';
  } else if (isLow) {
    containerStyles = isActive
      ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
      : 'bg-amber-950/40 border-amber-700/60 text-amber-300';
    badgeStyles = 'text-amber-400';
  } else if (isActive) {
    containerStyles = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.25)]';
    badgeStyles = 'text-emerald-400';
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 font-mono select-none ${containerStyles}`}
    >
      <div className="flex items-center justify-center">
        {isCritical && isActive ? (
          <Flame className="w-4 h-4 text-red-400 animate-bounce" />
        ) : isLow ? (
          <AlertTriangle className={`w-3.5 h-3.5 ${badgeStyles}`} />
        ) : (
          <Clock className={`w-3.5 h-3.5 ${badgeStyles}`} />
        )}
      </div>

      <span className={`text-base sm:text-lg font-bold tracking-wider ${isCritical ? 'text-red-300 font-black' : ''}`}>
        {formatTime(safeMs)}
      </span>
    </div>
  );
}
