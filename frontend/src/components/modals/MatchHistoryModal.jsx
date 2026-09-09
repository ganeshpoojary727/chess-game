import React from 'react';
import { X, Trophy, Swords, Calendar, Award, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { playButtonClick } from '../../utils/soundEngine';

const RECENT_MATCHES = [
  { id: 'm-1', opponent: 'Magnus_Clone', result: 'WIN', opening: 'Scotch Game (C45)', moves: 34, eloDiff: '+14', date: 'Today' },
  { id: 'm-2', opponent: 'Kasparov_AI', result: 'DRAW', opening: 'Sicilian Defense (B20)', moves: 52, eloDiff: '+1', date: 'Yesterday' },
  { id: 'm-3', opponent: 'Alex_Grand', result: 'WIN', opening: 'Italian Game (C50)', moves: 28, eloDiff: '+16', date: '2 days ago' },
  { id: 'm-4', opponent: 'Stockfish_Club', result: 'LOSS', opening: "Queen's Gambit (D06)", moves: 41, eloDiff: '-12', date: '3 days ago' },
];

export function MatchHistoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony-surface/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-ebony-elevated rounded-3xl overflow-hidden shadow-2xl border border-ebony-border p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => {
            playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-ebony hover:bg-stone-800 border border-ebony-border text-stone-300 hover:text-white transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-ivory">Match Dossier & Repertoire</h3>
            <p className="text-xs text-stone-400">Authoritative match logs and Elo progression history</p>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {RECENT_MATCHES.map((match) => {
            const isWin = match.result === 'WIN';
            const isLoss = match.result === 'LOSS';
            return (
              <div
                key={match.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-stone-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isWin
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isLoss
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isWin ? <CheckCircle2 className="w-4 h-4" /> : isLoss ? <XCircle className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ivory">vs {match.opponent}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                        {match.opening}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {match.moves} moves &bull; {match.date}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span
                    className={`text-sm font-extrabold ${
                      isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {match.eloDiff}
                  </span>
                  <span className="block text-[10px] text-stone-500 uppercase">{match.result}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={() => {
              playButtonClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold tracking-wider uppercase transition-all active:scale-95"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchHistoryModal;
