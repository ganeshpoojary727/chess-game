import React from 'react';
import { Trophy, AlertTriangle, Scale, Flag, AlertCircle } from 'lucide-react';
import { GameStatus, PlayerColor } from '../types/chess';

interface StatusBannerProps {
  status?: GameStatus;
  winner?: PlayerColor | null;
  inCheck?: boolean;
  errorMessage?: string | null;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  winner,
  inCheck,
  errorMessage,
}) => {
  if (errorMessage) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm animate-bounce">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span>{errorMessage}</span>
      </div>
    );
  }

  if (status === 'CHECKMATE') {
    return (
      <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/60 shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)]">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
          <div>
            <span className="font-bold text-slate-100 text-base">Checkmate!</span>
            <span className="text-emerald-400 text-sm ml-2 font-semibold">
              {winner ? `${winner} wins by victory!` : 'Game finished.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'RESIGNED') {
    return (
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-200">
        <Flag className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-semibold text-sm">Resignation: </span>
          <span className="text-sm text-slate-300">
            {winner ? `${winner} wins by resignation.` : 'Game forfeited.'}
          </span>
        </div>
      </div>
    );
  }

  if (status === 'STALEMATE' || status?.startsWith('DRAW')) {
    return (
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/90 border border-blue-500/40 text-blue-200">
        <Scale className="w-5 h-5 text-blue-400 shrink-0" />
        <div>
          <span className="font-semibold text-sm">Draw: </span>
          <span className="text-sm text-slate-300">
            {status === 'STALEMATE' ? 'Stalemate reached' : 'Game drawn by rule'}
          </span>
        </div>
      </div>
    );
  }

  if (inCheck || status === 'CHECK') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-sm animate-pulse">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold">Check! King is under immediate attack.</span>
      </div>
    );
  }

  return null;
};
