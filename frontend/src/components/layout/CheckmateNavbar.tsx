import React, { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import clsx from 'clsx';

interface CheckmateNavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenProfile?: () => void;
}

export const CheckmateNavbar: React.FC<CheckmateNavbarProps> = ({
  activeTab = 'home',
  onTabChange,
  onOpenProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'play', label: 'Play' },
    { id: 'learn', label: 'Learn' },
    { id: 'profile', label: 'Profile' },
    { id: 'more', label: 'More' },
  ];

  const handleLinkClick = (id: string) => {
    onTabChange?.(id);
    if (id === 'profile') {
      onOpenProfile?.();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0a0a0d]/85 border-b border-[rgba(255,255,255,0.06)] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* LEFT: Crown Logo & Wordmark */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          onClick={() => handleLinkClick('home')}
        >
          <div className="flex items-center justify-center w-8 h-8 text-[#f5f5f7]">
            {/* Custom Crown Icon with Cross */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M11 2h2v2h-2V2zm-1 3h4v1.5h-4V5zm-6 3l3.5 4 4.5-4 4.5 4L20 8l-2 11H6L4 8zm3.5 9h9v1h-9v-1z" />
            </svg>
          </div>
          <span className="font-sans font-bold tracking-[0.25em] text-sm text-[#f5f5f7] uppercase">
            CHECKMATE
          </span>
        </div>

        {/* CENTER-LEFT: Desktop Nav Links with Active Underline & Dot */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans font-medium">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={clsx(
                  'relative py-1 tracking-wider uppercase text-xs transition-colors duration-200 select-none',
                  isActive
                    ? 'text-[#f5f5f7] font-semibold'
                    : 'text-[#8e8e93] hover:text-[#f5f5f7]'
                )}
              >
                {link.label}

                {/* Active Indicator: Underline + Golden Dot */}
                {isActive && (
                  <span className="absolute -bottom-1.5 inset-x-0 flex flex-col items-center">
                    <span className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#c9a86a] to-transparent" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a86a] -mt-1 shadow-[0_0_8px_#c9a86a]" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Search, Notifications, Profile Avatar & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Search Input Bar */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus-within:border-[#c9a86a]/50 focus-within:bg-[rgba(255,255,255,0.07)] transition-all w-60 xl:w-72">
            <Search className="w-3.5 h-3.5 text-[#8e8e93] shrink-0" />
            <input
              type="text"
              placeholder="Search players, openings, games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#f5f5f7] placeholder-[#545458] focus:outline-none w-full font-sans"
            />
          </div>

          {/* Notification Bell with Gold Unread Badge */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 rounded-full text-[#8e8e93] hover:text-[#f5f5f7] hover:bg-white/[0.05] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c9a86a] ring-2 ring-[#0a0a0d]" />
          </button>

          {/* Profile Badge (Avatar + Name + Online Dot) */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-[rgba(255,255,255,0.035)] border border-[rgba(255,255,255,0.08)] hover:border-[#c9a86a]/40 transition-colors"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#18181f] border border-white/10 text-xs font-bold text-[#f5f5f7]">
              G
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-[#f5f5f7]">Ganesh</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-[#8e8e93]">Online</span>
              </div>
            </div>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#8e8e93] hover:text-[#f5f5f7] hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 pb-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={clsx(
                'text-left px-3 py-2 rounded-xl text-sm font-sans tracking-wide uppercase',
                activeTab === link.id
                  ? 'bg-[#c9a86a]/15 text-[#c9a86a] font-semibold'
                  : 'text-[#8e8e93] hover:bg-white/5 hover:text-white'
              )}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default CheckmateNavbar;
