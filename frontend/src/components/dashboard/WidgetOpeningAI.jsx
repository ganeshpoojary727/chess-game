import React, { useState } from 'react';
import { Cpu, BookOpen, BrainCircuit, Play, Sparkles, ChevronRight, Award } from 'lucide-react';
import { playButtonClick } from '../../utils/soundEngine';

const OPENINGS = [
  { id: 'scotch', name: 'Scotch Game', moves: '1.e4 e5 2.Nf3 Nc6 3.d4', eco: 'C45', tag: 'Aggressive' },
  { id: 'italian', name: 'Italian Game', moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4', eco: 'C50', tag: 'Classical' },
  { id: 'sicilian', name: "Sicilian Defense", moves: '1.e4 c5 2.Nf3 d6', eco: 'B20', tag: 'Counter' },
  { id: 'scholars', name: "Scholar's Defense", moves: '1.e4 e5 2.Qh5 Nc6 3.Bc4', eco: 'C20', tag: 'Tactical' },
];

const DIFFICULTY_LEVELS = [
  { level: 1, name: 'Beginner', elo: 1350, depth: 3, label: 'Novice Trainer' },
  { level: 2, name: 'Intermediate', elo: 1650, depth: 6, label: 'Club Player' },
  { level: 3, name: 'Advanced', elo: 2050, depth: 10, label: 'Master Candidate' },
  { level: 4, name: 'Grandmaster', elo: 2850, depth: 16, label: 'Full Stockfish 16' },
];

export function WidgetOpeningAI({ onStartPractice }) {
  const [selectedOpening, setSelectedOpening] = useState(OPENINGS[0].id);
  const [difficultyIndex, setDifficultyIndex] = useState(1); // 1 = Intermediate 1650

  const currentDiff = DIFFICULTY_LEVELS[difficultyIndex];
  const activeOpening = OPENINGS.find((o) => o.id === selectedOpening) || OPENINGS[0];

  const handleStart = () => {
    playButtonClick();
    onStartPractice?.({
      openingId: selectedOpening,
      difficulty: currentDiff.name.toLowerCase(),
      elo: currentDiff.elo,
    });
  };

  return (
    <div className="relative group p-5 sm:p-6 rounded-3xl bg-ebony-elevated/90 backdrop-blur-md border border-ebony-border/80 hover:border-terracotta/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[290px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">Widget 03</span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">Opening & AI Practice</h3>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-mono">
            WASM NNUE
          </span>
        </div>

        {/* Opening Selector Pills */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-mono">
              Repertoire Trainer
            </span>
            <span className="text-[10px] font-mono text-amber-400">{activeOpening.eco}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {OPENINGS.map((op) => {
              const active = selectedOpening === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => {
                    playButtonClick();
                    setSelectedOpening(op.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold transition-all ${
                    active
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-stone-900/80 hover:bg-stone-800 text-stone-400 border border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{op.name}</span>
                    <span className="text-[9px] opacity-75 font-normal">{op.tag}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stockfish Difficulty Slider */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400 font-mono text-[11px] uppercase">
              Stockfish Elo: <strong className="text-ivory">{currentDiff.elo}</strong>
            </span>
            <span className="text-[11px] font-semibold text-amber-400 font-mono">
              {currentDiff.name}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={difficultyIndex}
            onChange={(e) => {
              setDifficultyIndex(parseInt(e.target.value, 10));
              playButtonClick();
            }}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-stone-500 px-0.5">
            <span>1350 Elo</span>
            <span>1650</span>
            <span>2050</span>
            <span>Master</span>
          </div>
        </div>

        {/* Coach Insights Preview */}
        <div className="mt-2.5 p-2 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div className="text-[11px] text-stone-300 truncate">
            <span className="font-semibold text-amber-300">Coach Insight: </span>
            <span>Focus on central pawn tension & early kingside castling.</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-stone-800/80">
        <button
          onClick={handleStart}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-terracotta hover:from-amber-500 hover:to-terracotta-light text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Start Session</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default WidgetOpeningAI;
