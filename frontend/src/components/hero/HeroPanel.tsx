import React from 'react';
import { motion } from 'framer-motion';

export const HeroPanel: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none py-2 px-3 sm:px-4 z-10 max-w-xl mx-auto w-full">
      {/* Shared Noise Grain Layer across entire hero */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 1. Tracked-Caps Eyebrow Line */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] text-[#6b6b6b] uppercase mb-1.5 sm:mb-2"
      >
        THINK &bull; PLAN &bull; IMPROVE &bull; REPEAT
      </motion.div>

      {/* 2. Large Two-Line Italic Serif Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        className="font-serif italic font-normal text-4xl sm:text-5xl md:text-[54px] leading-[1.05] tracking-tight mb-2 sm:mb-3"
      >
        <span className="text-[#1c1c1c] block">Same Game</span>
        <span className="text-[#b5493c] block">Deeper Minds</span>
      </motion.h1>

      {/* 3. Tracked-Caps Tagline with Thin Rule and Centered Red Dot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="relative flex items-center justify-center w-full max-w-[280px] mb-4 sm:mb-5"
      >
        <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.3em] text-[#1c1c1c] uppercase">
          CHESS FOR A BETTER YOU
        </span>
      </motion.div>

      {/* 4. Centerpiece Dual Knights Scene */}
      <div className="relative w-full max-w-[380px] sm:max-w-[420px] flex flex-col items-center justify-center">
        {/* Top Diamond Dot above Crown */}
        <div className="relative z-20 -mb-1">
          <div className="w-1.5 h-1.5 bg-[#b5493c] rotate-45 mx-auto shadow-sm" />
        </div>

        {/* Small Crown SVG Icon */}
        <div className="relative z-20 my-1">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#1c1c1c]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </div>

        {/* Continuous Thin Red Vertical Line (pinned on top with z-20) */}
        <div className="absolute top-7 bottom-4 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-[#b5493c] via-[#b5493c]/80 to-[#b5493c] z-20 pointer-events-none" />

        {/* Background Soft Semicircle / Arch (Idle Breathing Motion) */}
        <motion.div
          animate={{
            scale: [1, 1.025, 1],
            opacity: [0.92, 1, 0.92],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-6 w-[280px] sm:w-[330px] h-[280px] sm:h-[330px] rounded-full bg-gradient-to-b from-[#ede8de] via-[#ece5d9] to-transparent pointer-events-none z-0 filter blur-[0.5px]"
        />

        {/* The Blended Dual Knights Photo Layer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="relative z-10 w-full flex items-center justify-center -mt-2"
        >
          <img
            src="/assets/knights-hero-feathered.png"
            alt="Checkmate Two Facing Knights"
            className="w-full max-w-[340px] sm:max-w-[370px] h-auto object-contain object-bottom pointer-events-none select-none transition-transform duration-700"
            style={{
              filter: 'contrast(1.05) saturate(0.92) brightness(1.02) sepia(0.06)',
              maskImage:
                'radial-gradient(ellipse 80% 85% at 50% 55%, black 45%, rgba(0,0,0,0.85) 70%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 85% at 50% 55%, black 45%, rgba(0,0,0,0.85) 70%, transparent 100%)',
            }}
          />
        </motion.div>
      </div>

      {/* 5. Bottom Tracked-Caps Two-Line Tagline with Centered Red Dot */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-2.5 flex flex-col items-center justify-center relative z-20 text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.28em] text-[#6b6b6b] uppercase leading-relaxed"
      >
        {/* Red Center Diamond */}
        <div className="w-1.5 h-1.5 bg-[#b5493c] rotate-45 mb-1.5 shadow-sm" />
        <div>GOOD MOVES TODAY</div>
        <div>GREATER TOMORROWS</div>
      </motion.div>
    </div>
  );
};

export default HeroPanel;
