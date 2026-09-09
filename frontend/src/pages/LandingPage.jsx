import React, { useState } from 'react';
import { Crown, Swords, Sparkles, User, Lock, ArrowRight, ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { playButtonClick, playVictory } from '../utils/soundEngine';

export function LandingPage({ onLogin, onGuestLogin, onOpenAbout }) {
  const [authTab, setAuthTab] = useState('signin'); // 'signin' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username or player handle');
      return;
    }
    playVictory();
    onLogin({
      name: username.trim(),
      elo: 1520,
      winRate: 64,
      totalMatches: 42,
      topOpening: 'Scotch: 78%',
    });
  };

  const handleGuest = () => {
    playButtonClick();
    const randomGuestId = Math.floor(1000 + Math.random() * 9000);
    const guestUser = {
      name: `Grandmaster_${randomGuestId}`,
      elo: 1500,
      winRate: 60,
      totalMatches: 12,
      topOpening: 'Italian: 70%',
      isGuest: true,
    };
    onGuestLogin(guestUser);
  };

  return (
    <div className="relative min-h-screen bg-ebony-surface text-stone-100 flex flex-col justify-between overflow-x-hidden">
      {/* Top Banner / Hero inspired by Image 1 (welcome-bg.png) */}
      <div className="relative w-full max-w-6xl mx-auto mt-4 sm:mt-6 px-4">
        {/* The Card frame resembling Image 1 */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-ivory text-ebony">
          {/* Top Half: Clean Ivory canvas with headline & terracotta cards */}
          <div className="p-6 sm:p-10 md:p-12 relative z-10">
            {/* Top Micro Nav */}
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-6 uppercase tracking-wider">
              <span className="font-serif font-bold text-terracotta text-sm tracking-widest">
                STRAT'S CHESS
              </span>
              <div className="hidden sm:flex items-center gap-6">
                <button
                  onClick={() => {
                    playButtonClick();
                    onOpenAbout?.();
                  }}
                  className="hover:text-terracotta transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    playButtonClick();
                    onOpenAbout?.();
                  }}
                  className="hover:text-terracotta transition-colors"
                >
                  Rules
                </button>
                <button
                  onClick={() => {
                    playButtonClick();
                    onOpenAbout?.();
                  }}
                  className="hover:text-terracotta transition-colors"
                >
                  Engine
                </button>
              </div>
            </div>

            {/* Headline + Stat Cards Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-terracotta tracking-tight leading-none">
                  Welcome to Chess
                </h1>
                <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
                  The flagship arena where grandmaster strategy meets real-time WebSockets and Stockfish neural analysis. Master named repertoires or challenge players globally.
                </p>

                {/* Left 100% Quality Tag inspired by Image 1 */}
                <div className="mt-6 inline-flex items-center gap-3 p-3.5 rounded-2xl bg-terracotta text-white shadow-lg shadow-terracotta/30">
                  <div className="text-2xl sm:text-3xl font-serif font-black">100%</div>
                  <div className="text-xs font-sans font-bold uppercase tracking-wider leading-tight">
                    Precision
                    <br />
                    Engine
                  </div>
                </div>
              </div>

              {/* Terracotta Stat Block from Image 1 */}
              <div className="lg:col-span-5">
                <div className="p-6 sm:p-7 rounded-2xl bg-terracotta text-white shadow-xl shadow-terracotta/25 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="block text-2xl sm:text-3xl font-serif font-bold">10+</span>
                    <span className="text-[11px] font-sans uppercase tracking-wider text-ivory/80 mt-1 block">
                      Tournament
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl sm:text-3xl font-serif font-bold">38K</span>
                    <span className="text-[11px] font-sans uppercase tracking-wider text-ivory/80 mt-1 block">
                      Players
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl sm:text-3xl font-serif font-bold">2K</span>
                    <span className="text-[11px] font-sans uppercase tracking-wider text-ivory/80 mt-1 block">
                      Matches / Day
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: Monochrome real chessboard photograph */}
          <div className="relative h-60 sm:h-72 md:h-80 w-full overflow-hidden">
            <img
              src="/assets/welcome-bg.png"
              alt="Chess Board Panoramic View"
              className="w-full h-full object-cover object-bottom filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ebony/90 via-ebony/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Centered Frosted-Glass Auth Card (prompt specification) */}
      <div className="relative -mt-20 sm:-mt-28 z-20 px-4 mb-12">
        <div className="backdrop-blur-md bg-white/95 text-stone-900 shadow-2xl border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md mx-auto relative overflow-hidden transition-all duration-300 hover:shadow-terracotta/15">
          {/* Subtle top terracotta accent line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-terracotta-dark via-terracotta to-amber-500" />

          {/* Auth Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta/15 text-terracotta mb-2 shadow-inner">
              <Crown className="w-6 h-6 fill-terracotta/30" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Enter the Arena</h2>
            <p className="text-xs text-stone-500 mt-1">Sign in to track Elo, or play instantly as a guest</p>
          </div>

          {/* Seamless Tabs: Sign In vs Create Account */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-100 border border-stone-200 mb-5">
            <button
              onClick={() => {
                playButtonClick();
                setAuthTab('signin');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authTab === 'signin'
                  ? 'bg-white text-terracotta shadow-sm font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setAuthTab('register');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authTab === 'register'
                  ? 'bg-white text-terracotta shadow-sm font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Player Handle / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Mikhail_Tal"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none text-sm font-medium transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none text-sm font-medium transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-light hover:to-terracotta text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-terracotta/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{authTab === 'signin' ? 'Sign In to Arena' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-stone-400 font-mono">Or Instant Play</span>
            </div>
          </div>

          {/* One-Click Guest Play Button */}
          <button
            type="button"
            onClick={handleGuest}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>1-Click Guest Play</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-stone-900 text-xs text-stone-500">
        Strat's Chess Platform &copy; 2026 &bull; High-Performance Spring Boot 3.3 + React Vite &bull; Designed after Studio Reference
      </footer>
    </div>
  );
}

export default LandingPage;
