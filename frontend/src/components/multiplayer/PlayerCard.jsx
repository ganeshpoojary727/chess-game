import React from 'react';
import { User, Wifi, WifiOff, Shield } from 'lucide-react';
import { ChessClock } from './ChessClock';
import { CapturedPieces } from '../game/CapturedPieces';

export function PlayerCard({
  player,
  color, // 'w' or 'b'
  isCurrentTurn = false,
  isLocalPlayer = false,
  timeMs = 600000,
  capturedPieces = [],
  materialAdvantage = 0, // > 0 if this player has material lead
}) {
  const isWhite = color === 'w' || color === 'WHITE';
  const displayName = player?.name || (isWhite ? 'White Player' : 'Black Player');
  const isConnected = player ? !!player.connected : false;

  // Render captured pieces (showing opponent's pieces that this player took)
  // If this card is White, it took Black pieces.
  const opponentColor = isWhite ? 'b' : 'w';

  return (
    <div
      className={`glass-panel p-3 sm:p-4 rounded-xl transition-all duration-300 ${
        isCurrentTurn
          ? 'border-emerald-500/60 ring-1 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-slate-900/90'
          : 'border-slate-800/80 hover:border-slate-700/60'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar, Name, Status, Captured */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar / Color Icon */}
          <div
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md border ${
              isWhite
                ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-slate-900 border-amber-300'
                : 'bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 border-slate-700'
            }`}
          >
            {isWhite ? '♔' : '♚'}

            {/* Turn Pulse Badge */}
            {isCurrentTurn && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          {/* Player details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[160px]">
                {displayName}
              </span>
              {isLocalPlayer && (
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  You
                </span>
              )}
            </div>

            {/* Connection and Sub-info */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <div className="flex items-center gap-1">
                {isConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    <span className="text-emerald-400 font-medium text-[11px]">Online</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
                    <span className="text-rose-400 font-medium text-[11px]">
                      {player ? 'Offline' : 'Waiting...'}
                    </span>
                  </>
                )}
              </div>

              <span className="text-slate-600">•</span>

              <span className="text-[11px] font-medium text-slate-400">
                {isWhite ? 'White' : 'Black'}
              </span>
            </div>

            {/* Captured pieces */}
            {capturedPieces.length > 0 && (
              <CapturedPieces
                pieces={capturedPieces}
                playerColor={isWhite ? 'white' : 'black'}
                materialAdvantage={materialAdvantage}
                className="mt-1"
              />
            )}
          </div>
        </div>

        {/* Right: Integrated ChessClock */}
        <div className="flex-shrink-0">
          <ChessClock
            timeMs={timeMs}
            isActive={isCurrentTurn}
          />
        </div>
      </div>
    </div>
  );
}
