import React, { useState } from 'react';
import { X, Phone, Globe, BookOpen, Shield, Award, Mail } from 'lucide-react';
import { playButtonClick } from '../../utils/soundEngine';

export function AboutContactModal({ isOpen, onClose, onStartPlaying }) {
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'contact'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-ebony-surface/80 backdrop-blur-md transition-all animate-fadeIn">
      {/* Container matching Image 2 composition */}
      <div className="relative w-full max-w-4xl bg-ebony-elevated rounded-3xl overflow-hidden shadow-2xl border border-ebony-border flex flex-col md:flex-row min-h-[500px]">
        {/* Close Button */}
        <button
          onClick={() => {
            playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-ebony/70 hover:bg-ebony border border-ebony-border text-stone-300 hover:text-white transition-all active:scale-95"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Terracotta Section (Image 2 style) */}
        <div className="w-full md:w-5/12 bg-terracotta text-ivory p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle chess watermark in terracotta panel */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none text-9xl font-serif">
            ♞
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ivory/80">Strat's Chess Academy</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mt-1">
                Contact us
              </h2>
            </div>

            <p className="text-sm text-ivory/90 leading-relaxed font-sans">
              Welcome to the premier arena of strategic thought. Built for grandmasters, casual thinkers, and opening students alike with tournament-grade WebSocket infrastructure.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-ivory/75">Call Number</span>
                <a href="tel:+1234567890" className="text-sm font-semibold text-white hover:underline flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  +1 (800) 555-CHESS
                </a>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-ivory/75">Website & Discord</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  <Globe className="w-3.5 h-3.5" />
                  www.stratschess.com
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-ivory/75">Direct Inquiries</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  grandmaster@stratschess.com
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 relative z-10">
            <button
              onClick={() => {
                playButtonClick();
                onStartPlaying?.();
                onClose();
              }}
              className="w-full py-3 px-6 rounded-xl bg-ivory hover:bg-white text-terracotta-dark font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl active:scale-95 text-center"
            >
              START PLAYING NOW
            </button>
          </div>
        </div>

        {/* Right Photographic / Rules Section */}
        <div className="w-full md:w-7/12 relative flex flex-col justify-between bg-stone-900">
          {/* Top Tabs */}
          <div className="p-4 sm:p-6 pb-2 flex items-center justify-between border-b border-stone-800/80 bg-stone-900/90 z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playButtonClick();
                  setActiveTab('rules');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'rules'
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                Tournament Rules
              </button>
              <button
                onClick={() => {
                  playButtonClick();
                  setActiveTab('engine');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'engine'
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                Stockfish 16+ Engine
              </button>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-4 text-stone-200 text-sm">
            {activeTab === 'rules' ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/50">
                  <Award className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Authoritative Server Clock</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      FIDE Standard match timers enforce millisecond precision on every move. Increments are credited instantly upon authoritative STOMP broadcast.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/50">
                  <Shield className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Legality Validation via chesslib</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      En-passant, castling rights (kingside/queenside), pawn promotion, three-fold repetition, and the 50-move rule are checked authoritatively.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/50">
                  <BookOpen className="w-5 h-5 text-terracotta-light mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Opening Book Subsystem</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Explore classical master repertoires including the Scotch Game, Italian Game, Sicilian Defense, and Ruy Lopez with real-time accuracy scoring.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/50">
                  <h4 className="font-bold text-white text-sm">WASM Stockfish Integration</h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    Powered by Stockfish 16 compiled to WebAssembly with multi-threaded neural networks (NNUE). The evaluation bar analyzes centipawn advantages and checkmate depth live.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-stone-800/40 border border-stone-700/30">
                    <span className="text-[10px] text-stone-400 font-mono block uppercase">Tactical Depth</span>
                    <span className="text-base font-bold text-amber-400">18-24 Plies</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-800/40 border border-stone-700/30">
                    <span className="text-[10px] text-stone-400 font-mono block uppercase">WebSocket Latency</span>
                    <span className="text-base font-bold text-emerald-400">&lt; 15 ms</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Reference Visual banner */}
          <div className="h-28 w-full relative overflow-hidden border-t border-stone-800">
            <img
              src="/assets/about-contact.png"
              alt="Chess Board Close-up"
              className="w-full h-full object-cover object-right filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
            <span className="absolute bottom-2 right-3 text-[10px] font-mono text-stone-400/80">
              Strat's Chess &bull; Studio Edition
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutContactModal;
