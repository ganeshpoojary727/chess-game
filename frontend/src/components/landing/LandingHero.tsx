import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Menu, X } from 'lucide-react';

interface LandingHeroProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
  onNavigatePlay?: () => void;
  onNavigateLearn?: () => void;
  onNavigateAbout?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onGetStarted,
  onSignIn,
  onNavigatePlay,
  onNavigateLearn,
  onNavigateAbout,
}) => {
  const [activeNav, setActiveNav] = useState<'home' | 'play' | 'learn' | 'about'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parallax scroll transforms for layered depth
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 400], [0, 80]);
  const imageY = useTransform(scrollY, [0, 400], [0, 35]);

  const handleNavClick = (tab: 'home' | 'play' | 'learn' | 'about') => {
    setActiveNav(tab);
    setMobileMenuOpen(false);
    if (tab === 'play') onNavigatePlay?.();
    else if (tab === 'learn') onNavigateLearn?.();
    else if (tab === 'about') onNavigateAbout?.();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f7f5f0] text-[#141414] font-sans overflow-hidden flex flex-col justify-between select-none">
      {/* ========================================================================= */}
      {/* 1. SHARED SURFACE TEXTURE (SVG feTurbulence Noise Layer across ALL layers) */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ========================================================================= */}
      {/* 2. BACKGROUND MOTIF: Soft Geometric Dome / Circle with Vertical Split Line */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Large circle/dome shape positioned behind right-center */}
        <div className="relative w-[540px] sm:w-[680px] lg:w-[780px] h-[540px] sm:h-[680px] lg:h-[780px] -right-12 sm:right-[-6%] lg:right-[4%] top-[14%] sm:top-[10%] rounded-full bg-[#ebe6db]/65 flex items-center justify-center filter blur-[0.5px]">
          {/* Subtle radial wash */}
          <div className="absolute inset-0 rounded-full bg-radial from-[#f2eee6]/80 via-[#ebe6db]/60 to-[#e4ded2]/40" />

          {/* Thin Vertical Split Line down the center */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#141414]/15 transform -translate-x-1/2" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NAVBAR                                                                 */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 sm:w-7 sm:h-7 text-[#141414]"
          >
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
          <span className="font-sans font-bold tracking-[0.25em] text-sm sm:text-base text-[#141414] uppercase">
            CHECKMATE
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans font-medium">
          {(
            [
              { id: 'home', label: 'Home' },
              { id: 'play', label: 'Play' },
              { id: 'learn', label: 'Learn' },
              { id: 'about', label: 'About' },
            ] as const
          ).map((link) => {
            const isActive = activeNav === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-[#141414] font-bold'
                    : 'text-[#6b6b6b] hover:text-[#141414]'
                }`}
              >
                {link.label}

                {/* Active Indicator: underline + small dot */}
                {isActive && (
                  <span className="absolute -bottom-1.5 inset-x-0 flex flex-col items-center">
                    <span className="w-full h-[1.5px] bg-[#141414]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141414] -mt-1" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Pills */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSignIn}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full border border-[#dcd9d0] hover:border-[#141414] text-xs sm:text-sm font-semibold text-[#141414] bg-transparent transition-all active:scale-95"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#141414] hover:bg-[#2a2a2a] text-xs sm:text-sm font-semibold text-white shadow-sm transition-all active:scale-95 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#141414] hover:bg-[#141414]/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden relative z-40 bg-[#f7f5f0] border-b border-[#dcd9d0] px-6 py-4 flex flex-col gap-3">
          {(['home', 'play', 'learn', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleNavClick(tab)}
              className={`text-left text-sm uppercase tracking-wider font-semibold py-1.5 ${
                activeNav === tab ? 'text-[#141414]' : 'text-[#6b6b6b]'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onSignIn}
              className="w-full py-2.5 rounded-full border border-[#dcd9d0] text-sm font-semibold text-center"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. HERO SECTION CONTENT                                                   */}
      {/* ========================================================================= */}
      <motion.div
        style={{ y: textY }}
        className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 w-full pt-4 sm:pt-10 flex-1 flex flex-col justify-center"
      >
        <div className="relative flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Left Column: Eyebrow, Giant Headline, Paragraph, CTAs */}
          <div className="max-w-2xl">
            {/* Eyebrow Line */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.28em] text-[#6b6b6b] uppercase mb-3 sm:mb-4"
            >
              THINK &bull; PLAY &bull; IMPROVE
            </motion.div>

            {/* Giant Headline: "Welcome to" (black), "Chess" (terracotta red) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-sans font-black text-6xl sm:text-7xl md:text-8xl lg:text-[96px] leading-[0.92] tracking-[-0.035em] select-none"
            >
              <div className="text-[#141414]">Welcome to</div>
              <div className="text-[#b5493c] mt-1 sm:mt-2">Chess</div>
            </motion.h1>

            {/* Body Paragraph (3 lines, max-width constrained) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 sm:mt-8 text-sm sm:text-base leading-relaxed text-[#555555] max-w-md font-sans"
            >
              Play, learn, and challenge yourself in a global community of chess enthusiasts.
              Sharpen your mind, make better moves, and be part of something bigger.
            </motion.p>

            {/* CTA Row: Filled Red Button + Outlined Sign In */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-7 sm:mt-9 flex items-center gap-3.5 flex-wrap"
            >
              {/* Filled Red Pill CTA */}
              <button
                type="button"
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 rounded-full bg-[#b5493c] hover:bg-[#9e3e32] text-white font-sans font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                {/* Circular Play Icon */}
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                </span>
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Outlined Pill CTA */}
              <button
                type="button"
                onClick={onSignIn}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-[#dcd9d0] hover:border-[#141414] bg-white/40 hover:bg-white/70 backdrop-blur-sm text-[#141414] font-sans font-semibold text-sm transition-all active:scale-95"
              >
                Sign In
              </button>
            </motion.div>
          </div>

          {/* Right Column: Vertical Tracked Caption Block */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="hidden lg:flex flex-col items-start pr-4 pt-12 self-start"
          >
            {/* Top dash line */}
            <div className="w-7 h-[1.5px] bg-[#141414] mb-4" />

            {/* 4 Stacked Tracked-Caps Lines */}
            <div className="text-[11px] font-sans font-semibold tracking-[0.28em] text-[#141414] leading-[2.1] uppercase">
              <div>A SMALL</div>
              <div>MOVE CAN</div>
              <div>MAKE A BIG</div>
              <div>DIFFERENCE</div>
            </div>

            {/* Bottom dash line */}
            <div className="w-7 h-[1.5px] bg-[#141414] mt-4" />
          </motion.div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. HERO PHOTOGRAPHIC CHESS SET LAYER (Full 6-Requirement Blending Engine) */}
      {/* ========================================================================= */}
      <motion.div
        style={{ y: imageY }}
        className="relative z-10 w-full h-[36vh] sm:h-[42vh] lg:h-[45vh] -mt-6 sm:-mt-10 overflow-hidden pointer-events-none"
      >
        <img
          src="/assets/chess-set-hero.png"
          alt="Checkmate Chess Set Formation"
          className="w-full h-full object-cover object-bottom"
          style={{
            // 1. Top-edge fade: gradual dissolver into the cream background
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 14%, rgba(0,0,0,0.85) 28%, rgba(0,0,0,1) 45%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 14%, rgba(0,0,0,0.85) 28%, rgba(0,0,0,1) 45%)',

            // 2. Color-grade matching filter: harmonizes photo tone with cream palette
            filter: 'contrast(1.06) saturate(0.92) brightness(1.02) sepia(0.06)',
          }}
        />

        {/* Ambient bottom base shadow */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default LandingHero;
