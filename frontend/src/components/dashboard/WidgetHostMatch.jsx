import React, { useState } from 'react';
import { PlusCircle, Clock, Copy, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { playButtonClick, playCapture } from '../../utils/soundEngine';

const TIME_CONTROLS = [
  { id: '3+2', label: '3+2 Blitz', minutes: 3, increment: 2, icon: '⚡' },
  { id: '5+3', label: '5+3 Rapid', minutes: 5, increment: 3, icon: '⏱️' },
  { id: '10+0', label: '10+0 Standard', minutes: 10, increment: 0, icon: '⏳' },
  { id: 'casual', label: 'Casual', minutes: 15, increment: 10, icon: '☕' },
];

export function WidgetHostMatch({ onCreateRoom, onJoinCreatedRoom }) {
  const [selectedTime, setSelectedTime] = useState('5+3');
  const [colorPref, setColorPref] = useState('random'); // 'random' | 'w' | 'b'
  const [createdRoomCode, setCreatedRoomCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    playButtonClick();
    setIsGenerating(true);
    try {
      const tc = TIME_CONTROLS.find((t) => t.id === selectedTime) || TIME_CONTROLS[1];
      const preferredColor = colorPref === 'random' ? null : colorPref;
      
      let code = null;
      if (onCreateRoom) {
        code = await onCreateRoom({
          initialMinutes: tc.minutes,
          incrementSeconds: tc.increment,
          preferredColor,
        });
      } else {
        // Fallback demo code
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
      }

      setCreatedRoomCode(code);
      playCapture(); // Sound feedback
      
      // Auto-copy invite link to clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const inviteUrl = `${window.location.origin}?room=${code}`;
        await navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!createdRoomCode) return;
    playButtonClick();
    const inviteUrl = `${window.location.origin}?room=${createdRoomCode}`;
    navigator.clipboard?.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="relative group p-5 sm:p-6 rounded-3xl bg-ebony-elevated/90 backdrop-blur-md border border-ebony-border/80 hover:border-terracotta/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[290px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-terracotta/20 border border-terracotta/30 flex items-center justify-center text-terracotta">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-semibold">Widget 01</span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">Host Match</h3>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-mono">
            STOMP Live
          </span>
        </div>

        <p className="text-xs text-stone-400 mt-2">
          Create an authoritative match with custom time controls and 1-click clipboard invite.
        </p>

        {/* Time Control Pills */}
        <div className="mt-4">
          <span className="text-[11px] font-bold text-stone-400 block mb-1.5 uppercase tracking-wider font-mono">
            Time Control
          </span>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {TIME_CONTROLS.map((tc) => {
              const active = selectedTime === tc.id;
              return (
                <button
                  key={tc.id}
                  onClick={() => {
                    playButtonClick();
                    setSelectedTime(tc.id);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-terracotta to-terracotta-dark text-white shadow-md shadow-terracotta/20 border border-terracotta-light/40'
                      : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  }`}
                >
                  <span className="truncate">{tc.label}</span>
                  <span className="text-sm">{tc.icon}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Choice */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-stone-400 font-mono text-[11px] uppercase">Preferred Side</span>
          <div className="flex items-center gap-1">
            {[
              { id: 'random', label: '🎲 Random' },
              { id: 'w', label: '⚪ White' },
              { id: 'b', label: '⚫ Black' },
            ].map((side) => (
              <button
                key={side.id}
                onClick={() => {
                  playButtonClick();
                  setColorPref(side.id);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                  colorPref === side.id
                    ? 'bg-stone-700 text-white border border-terracotta/40'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                {side.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action / Output */}
      <div className="mt-4 pt-3 border-t border-stone-800/80">
        {createdRoomCode ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/90 border border-emerald-500/40">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-mono">CODE:</span>
                <span className="text-base font-bold font-mono tracking-widest text-emerald-400">
                  {createdRoomCode}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold hover:bg-emerald-900 active:scale-95 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                playButtonClick();
                onJoinCreatedRoom?.(createdRoomCode);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
            >
              <span>Enter Arena Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-light hover:to-terracotta text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-terracotta/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="animate-pulse">Generating Room...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Room Code</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default WidgetHostMatch;
