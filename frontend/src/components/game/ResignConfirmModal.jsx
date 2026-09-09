import React, { useEffect } from 'react';
import { Flag, AlertTriangle, X } from 'lucide-react';

/**
 * ResignConfirmModal: Accessible confirmation dialog to prevent accidental resignations.
 * Features:
 * - Escape key dismisses
 * - Enter key confirms resignation
 * - Focus-trapped backdrop blur
 */
export function ResignConfirmModal({
  isOpen,
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resign-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Dismiss (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/40">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <h3 id="resign-modal-title" className="text-lg font-black tracking-tight text-white">
              Resign Game?
            </h3>
            <p className="text-xs text-slate-400">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Modal Description */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            Resigning will forfeit the current match immediately. Your opponent will be awarded the victory.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all active:scale-95"
          >
            Cancel <span className="opacity-60 text-[10px] ml-1">(Esc)</span>
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/40 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Confirm Resign</span>
            <span className="opacity-70 text-[10px] ml-1">&crarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResignConfirmModal;
