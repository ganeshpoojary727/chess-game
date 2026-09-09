import React from 'react';
import { Crown, Volume2, VolumeX, Swords, BookOpen, User, LogOut, LogIn, Sparkles } from 'lucide-react';
import { playButtonClick } from '../../utils/soundEngine';

export function Header({
  user,
  onLogout,
  onOpenAuth,
  onOpenAbout,
  onNavigateHome,
  onNavigatePlay,
  muted,
  onToggleMute,
  activeSection = 'home'
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-ebony/95 backdrop-blur-md border-b border-ebony-border/70 text-ivory transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              playButtonClick();
              onNavigateHome?.();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeSection === 'home'
                ? 'bg-terracotta/15 text-terracotta-light border border-terracotta/30'
                : 'text-stone-300 hover:text-white hover:bg-ebony-elevated'
            }`}
          >
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              playButtonClick();
              onOpenAbout?.();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeSection === 'about'
                ? 'bg-terracotta/15 text-terracotta-light border border-terracotta/30'
                : 'text-stone-300 hover:text-white hover:bg-ebony-elevated'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-terracotta" />
            <span className="hidden xs:inline">About & Rules</span>
            <span className="xs:hidden">About</span>
          </button>

          <button
            onClick={() => {
              playButtonClick();
              onNavigatePlay?.();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeSection === 'play'
                ? 'bg-terracotta/15 text-terracotta-light border border-terracotta/30'
                : 'text-stone-300 hover:text-white hover:bg-ebony-elevated'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>Play</span>
          </button>
        </nav>

        {/* Center Brand Title */}
        <div
          onClick={() => {
            playButtonClick();
            onNavigateHome?.();
          }}
          className="cursor-pointer flex items-center gap-2 group select-none"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-terracotta to-terracotta-dark shadow-md shadow-terracotta/30 group-hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 text-ivory fill-ivory/20" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-serif font-bold text-lg sm:text-xl tracking-wide bg-gradient-to-r from-ivory via-stone-200 to-terracotta-light bg-clip-text text-transparent group-hover:from-white group-hover:to-terracotta transition-all">
              Strat's Chess
            </h1>
          </div>
        </div>

        {/* Right Controls & User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute?.();
            }}
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-xl bg-ebony-elevated hover:bg-stone-800 border border-ebony-border text-stone-300 hover:text-white transition-all active:scale-95 flex items-center justify-center"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* User Badge / Login / Logout */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-ebony-elevated border border-ebony-border">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-terracotta to-amber-600 flex items-center justify-center text-[11px] font-bold text-white shadow-inner">
                  {user.name ? user.name[0].toUpperCase() : 'P'}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-semibold text-ivory max-w-[90px] truncate">{user.name || 'Grandmaster'}</span>
                  <span className="text-[10px] text-terracotta-light font-mono font-bold">Elo {user.elo || 1520}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playButtonClick();
                  onLogout?.();
                }}
                title="Sign Out"
                className="p-2 rounded-xl bg-ebony-elevated hover:bg-rose-950/40 hover:border-rose-800/60 border border-ebony-border text-stone-400 hover:text-rose-300 transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                playButtonClick();
                onOpenAuth?.();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-light hover:to-terracotta text-white font-medium text-xs sm:text-sm shadow-md shadow-terracotta/25 hover:shadow-terracotta/40 transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
