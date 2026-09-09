import React, { useState, useRef } from 'react';
import { LogIn, ClipboardPaste, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { playButtonClick, playMove } from '../../utils/soundEngine';

export function WidgetEnterArena({ onJoinRoom }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length <= 6) {
      setPin(raw);
      setError('');
      if (raw.length > 0 && raw.length < 6) {
        playMove();
      }
    }
  };

  const handlePasteAndConnect = async () => {
    playButtonClick();
    setError('');
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        let extracted = text.trim();
        // Check if full URL containing ?room=
        if (extracted.includes('room=')) {
          const match = extracted.match(/room=([A-Za-z0-9]{4,6})/);
          if (match && match[1]) {
            extracted = match[1];
          }
        }
        const cleaned = extracted.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        if (cleaned.length >= 4) {
          setPin(cleaned);
          triggerJoin(cleaned);
          return;
        } else {
          setError('Clipboard does not contain a valid 6-character code.');
        }
      }
    } catch {
      setError('Clipboard access denied. Please type your code.');
    }
  };

  const triggerJoin = async (codeToJoin) => {
    const code = (codeToJoin || pin).trim().toUpperCase();
    if (code.length < 4) {
      setError('Please enter a valid room code (4-6 characters)');
      return;
    }

    setIsConnecting(true);
    try {
      playButtonClick();
      await onJoinRoom?.(code);
    } catch (err) {
      setError(err?.message || 'Unable to join room. Verify code.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerJoin();
  };

  return (
    <div className="relative group p-5 sm:p-6 rounded-3xl bg-ebony-elevated/90 backdrop-blur-md border border-ebony-border/80 hover:border-terracotta/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[290px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">Widget 02</span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">Enter Arena</h3>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-mono">
            Fast Match
          </span>
        </div>

        <p className="text-xs text-stone-400 mt-2">
          Have an invitation PIN? Enter your 6-character room identifier or paste directly from clipboard.
        </p>

        {/* 6-Character PIN Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-stone-400" />
                <span>6-Character Room PIN</span>
              </label>
              <button
                type="button"
                onClick={handlePasteAndConnect}
                className="text-[11px] font-semibold text-terracotta-light hover:text-white flex items-center gap-1 transition-colors"
              >
                <ClipboardPaste className="w-3 h-3" />
                <span>Paste & Connect</span>
              </button>
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                maxLength={6}
                value={pin}
                onChange={handleInputChange}
                placeholder="e.g. 7X9K2B"
                className="w-full text-center text-xl sm:text-2xl font-mono font-extrabold tracking-[0.35em] uppercase py-2.5 sm:py-3 px-4 rounded-2xl bg-stone-900/90 text-ivory border border-stone-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all placeholder:text-stone-600 placeholder:tracking-widest"
              />
              {pin.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-400">
                  {pin.length}/6
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 p-2 rounded-xl border border-rose-900/60">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-stone-800/80">
        <button
          onClick={() => triggerJoin()}
          disabled={pin.length < 4 || isConnecting}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <span className="animate-pulse">Connecting to Arena...</span>
          ) : (
            <>
              <span>Join Arena</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default WidgetEnterArena;
