import React, { useState } from 'react';
import { RotateCw, RotateCcw, Flag, Plus, Bot, Users, Link2, Check } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onReset: () => void;
  onResign: () => void;
  onFlipBoard: () => void;
  isAiOpponent: boolean;
  onToggleAi: () => void;
  gameId?: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onReset,
  onResign,
  onFlipBoard,
  isAiOpponent,
  onToggleAi,
  gameId,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const copyShareLink = async () => {
    try {
      const url = `${window.location.origin}?game=${gameId || ''}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      console.warn('Failed to copy share link');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 backdrop-blur-md">
      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNewGame}
          className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95"
          title="Start a new game session"
        >
          <Plus className="w-4 h-4" />
          <span>New Game</span>
        </button>

        <button
          onClick={onFlipBoard}
          className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
          title="Flip board orientation"
        >
          <RotateCw className="w-4 h-4" />
          <span className="hidden sm:inline">Flip</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
          title="Reset board to initial position"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Secondary Controls & Mode */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAi}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium rounded-lg border transition-all ${
            isAiOpponent
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Toggle AI Bot opponent mode"
        >
          {isAiOpponent ? <Bot className="w-4 h-4 text-amber-400" /> : <Users className="w-4 h-4 text-slate-400" />}
          <span>{isAiOpponent ? 'vs AI' : '2-Player'}</span>
        </button>

        {gameId && (
          <button
            onClick={copyShareLink}
            className="flex items-center gap-1 px-3 py-2 text-xs md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
            title="Copy invitation link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
            <span className="hidden md:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        )}

        <button
          onClick={onResign}
          className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium rounded-lg bg-red-950/60 hover:bg-red-900/70 text-red-300 border border-red-800/60 transition-all active:scale-95"
          title="Resign this game"
        >
          <Flag className="w-4 h-4" />
          <span className="hidden sm:inline">Resign</span>
        </button>
      </div>
    </div>
  );
};
