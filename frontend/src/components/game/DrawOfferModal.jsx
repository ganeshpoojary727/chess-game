import React, { useEffect } from 'react';
import { Handshake, Check, X, ShieldAlert } from 'lucide-react';

/**
 * DrawOfferModal: Accessible modal dialogue displayed when opponent offers a draw.
 * Features:
 * - Escape key declines the offer
 * - Enter key accepts the draw
 * - Clear explanation of the outcome
 */
export function DrawOfferModal({
  isOpen,
  opponentName = 'Opponent',
  onAccept,
  onDecline,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDecline();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onAccept();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onAccept, onDecline]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="draw-modal-title"
      >
        {/* Close / Decline X */}
        <button
          onClick={onDecline}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Decline (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Handshake Icon & Heading */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-950/40">
            <Handshake className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 id="draw-modal-title" className="text-lg font-black tracking-tight text-white">
              Draw Offered
            </h3>
            <p className="text-xs text-slate-400">
              <strong className="text-indigo-300">{opponentName}</strong> has proposed a peaceful draw.
            </p>
          </div>
        </div>

        {/* Informational Box */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <span>
            Accepting will end the match immediately in a draw (½ - ½). Declining will resume normal play on your clock.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onDecline}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            <span>Decline</span>
            <span className="opacity-60 text-[10px] ml-1">(Esc)</span>
          </button>
          <button
            onClick={onAccept}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept Draw</span>
            <span className="opacity-70 text-[10px] ml-1">&crarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DrawOfferModal;
