import React, { useState } from 'react';
import LandingHero from '../components/landing/LandingHero';
import { X, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { playButtonClick, playVictory } from '../utils/soundEngine';

export function LandingPage({ onLogin, onGuestLogin, onOpenAbout }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    playButtonClick();
    onLogin({
      name: 'Ganesh',
      elo: 1530,
      winRate: 64,
      totalMatches: 42,
      topOpening: 'Scotch: 78%',
    });
  };

  const handleOpenAuth = () => {
    playButtonClick();
    setIsAuthModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username or player handle');
      return;
    }
    playVictory();
    onLogin({
      name: username.trim(),
      elo: 1530,
      winRate: 64,
      totalMatches: 42,
      topOpening: 'Scotch: 78%',
    });
  };

  return (
    <div className="relative min-h-screen bg-[#f7f5f0] text-[#141414] overflow-x-hidden">
      {/* Flagship Public Landing Hero */}
      <LandingHero
        onGetStarted={handleStart}
        onSignIn={handleOpenAuth}
        onNavigatePlay={handleStart}
        onNavigateLearn={handleStart}
        onNavigateAbout={onOpenAbout}
      />

      {/* Auth Modal (when Sign In is clicked) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200">
            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-sans text-[#141414]">Welcome to Checkmate</h2>
              <p className="text-xs text-stone-500 mt-1">Sign in to track stats or enter instantly</p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-100 mb-5">
              <button
                type="button"
                onClick={() => setAuthTab('signin')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  authTab === 'signin' ? 'bg-white text-[#141414] shadow-sm' : 'text-stone-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  authTab === 'register' ? 'bg-white text-[#141414] shadow-sm' : 'text-stone-500'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Player Name / Handle
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Ganesh"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#b5493c] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#b5493c] transition-colors"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#b5493c] hover:bg-[#9e3e32] text-white font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{authTab === 'signin' ? 'Sign In & Play' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleStart}
                className="w-full py-2.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-all"
              >
                Continue as Guest (1530 Elo)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
