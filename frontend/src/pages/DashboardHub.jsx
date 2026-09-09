import React, { useState } from 'react';
import { TwoKnightsDivider } from '../components/dashboard/TwoKnightsDivider';
import { WidgetHostMatch } from '../components/dashboard/WidgetHostMatch';
import { WidgetEnterArena } from '../components/dashboard/WidgetEnterArena';
import { WidgetOpeningAI } from '../components/dashboard/WidgetOpeningAI';
import { WidgetPlayerDossier } from '../components/dashboard/WidgetPlayerDossier';
import { MatchHistoryModal } from '../components/modals/MatchHistoryModal';
import { Sparkles, Trophy, Radio, Shield } from 'lucide-react';

export function DashboardHub({
  user,
  onCreateRoom,
  onJoinRoom,
  onStartPractice,
  onOpenAbout,
}) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-ebony via-ebony-surface to-ebony-950 text-ivory p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-x-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-terracotta/10 rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Ticker */}
      <div className="max-w-7xl mx-auto w-full mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ivory">
              Welcome back, <span className="text-terracotta-light">{user?.name || 'Grandmaster'}</span>
            </h2>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300">
              Knight Class
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Select an arena to host or join, or sharpen your repertoire against Stockfish 16+
          </p>
        </div>

        {/* Global Live Indicator */}
        <div className="flex items-center gap-3 bg-ebony-elevated/80 border border-ebony-border px-3.5 py-1.5 rounded-2xl text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
          <span className="text-stone-500">|</span>
          <span className="text-stone-300">38,412 Online</span>
        </div>
      </div>

      {/* Main Flagship Grid: 4 Widgets around Two Knights Centerpiece */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Desktop Layout (lg and above): 3 columns (Left 2 widgets, Center centerpiece, Right 2 widgets) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
          {/* Left Column: Widget 1 (Host Match) & Widget 2 (Enter Arena) */}
          <div className="col-span-4 flex flex-col gap-6">
            {/* Widget 1: Create Room */}
            <WidgetHostMatch
              onCreateRoom={onCreateRoom}
              onJoinCreatedRoom={onJoinRoom}
            />

            {/* Widget 2: Join Room */}
            <WidgetEnterArena
              onJoinRoom={onJoinRoom}
            />
          </div>

          {/* Center Column: Two Knights Centerpiece */}
          <div className="col-span-4 flex items-center justify-center">
            <TwoKnightsDivider
              onCenterpieceClick={() => {
                // Focus or trigger friendly prompt
              }}
            />
          </div>

          {/* Right Column: Widget 3 (Opening & AI Practice) & Widget 4 (Player Dossier) */}
          <div className="col-span-4 flex flex-col gap-6">
            {/* Widget 3: Opening AI Practice */}
            <WidgetOpeningAI
              onStartPractice={onStartPractice}
            />

            {/* Widget 4: Player Dossier */}
            <WidgetPlayerDossier
              user={user}
              onViewHistory={() => setShowHistoryModal(true)}
            />
          </div>
        </div>

        {/* Mobile & Tablet Layout (< 1024px): Two Knights Centerpiece divides stacked rows */}
        <div className="lg:hidden flex flex-col gap-6">
          {/* Top Row: Widget 1 & Widget 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WidgetHostMatch
              onCreateRoom={onCreateRoom}
              onJoinCreatedRoom={onJoinRoom}
            />
            <WidgetOpeningAI
              onStartPractice={onStartPractice}
            />
          </div>

          {/* Centerpiece divider in between */}
          <div className="py-2 flex justify-center">
            <TwoKnightsDivider />
          </div>

          {/* Bottom Row: Widget 2 & Widget 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WidgetEnterArena
              onJoinRoom={onJoinRoom}
            />
            <WidgetPlayerDossier
              user={user}
              onViewHistory={() => setShowHistoryModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Match History Modal */}
      <MatchHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />

      {/* Micro Footer Bar */}
      <div className="max-w-7xl mx-auto w-full mt-6 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-mono gap-2">
        <div className="flex items-center gap-2">
          <span>Strat's Chess Hub v2.4</span>
          <span>&bull;</span>
          <span className="text-terracotta-light">Dual-Engine Architecture</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAbout}
            className="hover:text-stone-300 transition-colors"
          >
            FIDE Regulations
          </button>
          <span>&bull;</span>
          <span>WASM Stockfish 16 NNUE</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardHub;
