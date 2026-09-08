import React, { useState } from 'react';
import { Copy, Check, Swords, Users, Play, Plus, ArrowRight, Clock, Shuffle } from 'lucide-react';

const TIME_PRESETS = [
  { label: '3+2 Blitz', minutes: 3, increment: 2, icon: '⚡' },
  { label: '5+3 Blitz', minutes: 5, increment: 3, icon: '🔥' },
  { label: '10+0 Rapid', minutes: 10, increment: 0, icon: '⏱️' },
  { label: '15+10 Classical', minutes: 15, increment: 10, icon: '⏳' },
];

export function RoomLobby({
  playerName,
  onUpdatePlayerName,
  roomCode,
  gameStatus,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  playerColor,
}) {
  const [selectedPreset, setSelectedPreset] = useState(TIME_PRESETS[2]); // 10+0 Rapid default
  const [preferredColor, setPreferredColor] = useState('w'); // 'w' | 'b' | null
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCopyCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = async () => {
    if (!roomCode) return;
    try {
      const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await onCreateRoom({
        initialMinutes: selectedPreset.minutes,
        incrementSeconds: selectedPreset.increment,
        preferredColor: preferredColor || null,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async (e) => {
    if (e) e.preventDefault();
    if (!inputRoomCode.trim()) return;
    setIsJoining(true);
    try {
      await onJoinRoom(inputRoomCode.trim().toUpperCase());
    } finally {
      setIsJoining(false);
    }
  };

  // If already in a room and waiting
  if (roomCode && gameStatus === 'WAITING') {
    return (
      <div className="w-full max-w-xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 mb-4 shadow-inner">
          <Users className="w-7 h-7 animate-pulse" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-2">
          Room Created & Waiting!
        </h2>
        <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto">
          Share this room code with a friend. The match will start instantly once they join.
        </p>

        {/* Room Code Display */}
        <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-1">
              Room Code
            </span>
            <span className="text-3xl font-mono font-black tracking-wider text-white">
              {roomCode}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyCode}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700 active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
            </button>
          </div>
        </div>

        {/* Player Status Tag */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Connected as <strong className="text-slate-200">{playerName}</strong> ({playerColor === 'b' ? 'Black' : 'White'})
          </span>
        </div>

        <button
          onClick={onLeaveRoom}
          className="text-xs text-rose-400 hover:text-rose-300 hover:underline transition-colors"
        >
          Cancel & Leave Room
        </button>
      </div>
    );
  }

  // Lobby: Create or Join
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-2 sm:p-4">
      {/* Create Room Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Match</h3>
              <p className="text-xs text-slate-400">Configure time control and challenge a friend</p>
            </div>
          </div>

          {/* Player Name Input */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => onUpdatePlayerName(e.target.value)}
              placeholder="e.g. Grandmaster"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Time Control Presets */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Time Control
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_PRESETS.map((preset) => {
                const isSelected = selectedPreset.label === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <div>
                      <div className="text-xs font-bold leading-none mb-0.5">{preset.label}</div>
                      <div className="text-[10px] text-slate-400">
                        {preset.minutes}m + {preset.increment}s
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Color */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Play As
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPreferredColor('w')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  preferredColor === 'w'
                    ? 'bg-amber-100 text-slate-950 border-amber-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>♔</span> White
              </button>
              <button
                type="button"
                onClick={() => setPreferredColor('b')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  preferredColor === 'b'
                    ? 'bg-slate-900 text-slate-100 border-slate-600 shadow-md ring-1 ring-slate-500'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>♚</span> Black
              </button>
              <button
                type="button"
                onClick={() => setPreferredColor(null)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  preferredColor === null
                    ? 'bg-indigo-950/70 text-indigo-200 border-indigo-500 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Shuffle className="w-3 h-3" /> Random
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Room...
            </span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Create Room</span>
            </>
          )}
        </button>
      </div>

      {/* Join Room Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Join Existing Match</h3>
              <p className="text-xs text-slate-400">Enter a code sent to you by another player</p>
            </div>
          </div>

          <form onSubmit={handleJoin}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Room Code
              </label>
              <input
                type="text"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. A1B2C3"
                maxLength={10}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono font-bold tracking-widest text-center text-lg placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Your Display Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => onUpdatePlayerName(e.target.value)}
                placeholder="e.g. Challenger"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </form>
        </div>

        <button
          onClick={handleJoin}
          disabled={!inputRoomCode.trim() || isJoining}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isJoining ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connecting to Room...
            </span>
          ) : (
            <>
              <span>Enter Match</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
