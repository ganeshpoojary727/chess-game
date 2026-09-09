import React, { useState } from 'react';
import { User, Shield, TrendingUp, History, Trophy, Award, Flame } from 'lucide-react';
import { playButtonClick } from '../../utils/soundEngine';

export function WidgetPlayerDossier({ user, onViewHistory }) {
  const userName = user?.name || 'Grandmaster';
  const userElo = user?.elo || 1520;
  const winRate = user?.winRate || 64;
  const totalMatches = user?.totalMatches || 42;
  const topOpening = user?.topOpening || 'Scotch: 78%';

  return (
    <div className="relative group p-5 sm:p-6 rounded-3xl bg-ebony-elevated/90 backdrop-blur-md border border-ebony-border/80 hover:border-terracotta/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[290px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold">Widget 04</span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">Player Dossier</h3>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/60 font-mono flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            Knight Class
          </span>
        </div>

        {/* Avatar & Elo Badge */}
        <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-terracotta via-amber-600 to-terracotta-light flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
              {userName[0].toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-ebony-elevated flex items-center justify-center text-[8px] text-black font-bold">
              ✓
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-ivory truncate">{userName}</h4>
              <span className="text-xs font-mono font-bold text-amber-400">{userElo} Elo</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-400 font-mono">
              <span className="flex items-center gap-1 text-terracotta-light">
                <Flame className="w-3 h-3 fill-terracotta-light" />
                Streak: 4W
              </span>
              <span>&bull;</span>
              <span>{totalMatches} Matches</span>
            </div>
          </div>
        </div>

        {/* Stat Bars */}
        <div className="mt-3.5 space-y-2.5">
          {/* Win Rate Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-stone-400">Competitive Win Rate</span>
              <span className="text-emerald-400 font-bold">{winRate}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </div>

          {/* Top Opening Stat */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-stone-900/60 border border-stone-800/80 text-xs">
            <span className="text-stone-400 font-mono text-[11px]">Top Repertoire:</span>
            <span className="font-bold text-terracotta-light font-mono text-[11px] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              {topOpening}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-stone-800/80">
        <button
          onClick={() => {
            playButtonClick();
            onViewHistory?.();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-purple-500/40 text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
        >
          <History className="w-3.5 h-3.5 text-purple-400" />
          <span>View Full History</span>
        </button>
      </div>
    </div>
  );
}

export default WidgetPlayerDossier;
