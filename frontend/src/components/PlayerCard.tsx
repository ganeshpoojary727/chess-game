import React from 'react';
import { User, Shield, Clock } from 'lucide-react';
import { CapturedPieces } from './CapturedPieces';

interface PlayerCardProps {
  name: string;
  color: 'white' | 'black';
  isTurn: boolean;
  capturedPieces: string[];
  advantageScore?: number;
  timeDisplay?: string;
  connected?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  color,
  isTurn,
  capturedPieces,
  advantageScore,
  timeDisplay = '10:00',
  connected = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 ${
        isTurn
          ? 'bg-slate-900/90 border-2 border-emerald-500/80 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]'
          : 'bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Left: Avatar, Name & Captured */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-inner ${
              color === 'white'
                ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-slate-900 border border-white/60'
                : 'bg-gradient-to-br from-slate-800 to-slate-950 text-amber-200 border border-slate-700'
            }`}
          >
            {color === 'white' ? (
              <Shield className="w-5 h-5 text-amber-900" />
            ) : (
              <User className="w-5 h-5 text-amber-400" />
            )}
          </div>
          {/* Online status indicator */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
              connected ? 'bg-emerald-500' : 'bg-slate-500'
            }`}
            title={connected ? 'Online' : 'Offline'}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100 text-sm md:text-base tracking-wide">
              {name}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                color === 'white'
                  ? 'bg-slate-200 text-slate-900'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {color}
            </span>
            {isTurn && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Turn
              </span>
            )}
          </div>

          <div className="mt-1">
            <CapturedPieces
              pieces={capturedPieces}
              color={color === 'white' ? 'black' : 'white'}
              advantageScore={advantageScore}
            />
          </div>
        </div>
      </div>

      {/* Right: Clock timer */}
      <div className="flex items-center gap-2 pl-3">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold tracking-wider ${
            isTurn
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-950/60 text-slate-400 border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 opacity-70" />
          <span>{timeDisplay}</span>
        </div>
      </div>
    </div>
  );
};
