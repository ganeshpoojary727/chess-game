import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import KnightSVG from './KnightSVG';
import PerspectiveFloor from './PerspectiveFloor';

export const HeroKnights: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const knightsWrapperRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animation Sequence
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(eyebrowRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.9,
      })
        .from(
          headlineRef.current,
          {
            opacity: 0,
            y: 25,
            duration: 1.1,
            scale: 0.97,
          },
          '-=0.6'
        )
        .from(
          knightsWrapperRef.current,
          {
            opacity: 0,
            scale: 0.92,
            duration: 1.3,
            ease: 'expo.out',
          },
          '-=0.7'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center text-center select-none py-2 px-4 z-10 max-w-xl mx-auto"
    >
      {/* 1. Tracked-Caps Eyebrow Line */}
      <div
        ref={eyebrowRef}
        className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] text-[#8e8e93] uppercase mb-2"
      >
        THINK &bull; PLAN &bull; IMPROVE &bull; REPEAT
      </div>

      {/* 2. Large Serif Two-Line Headline */}
      <h1
        ref={headlineRef}
        className="font-serif italic font-normal text-4xl sm:text-5xl md:text-[56px] leading-[1.08] text-[#f5f5f7] tracking-tight mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
      >
        <span>Same Game</span>
        <br />
        <span className="text-[#f5f5f7]">Deeper Minds</span>
      </h1>

      {/* 3. Tracked-Caps Tagline */}
      <div className="text-[11px] sm:text-xs font-sans font-medium tracking-[0.3em] text-[#c9a86a] uppercase mb-6">
        CHESS FOR A BETTER YOU
      </div>

      {/* 4. Centerpiece Duo (Knights + Glow + Rings) */}
      <div
        ref={knightsWrapperRef}
        className="relative w-full max-w-[420px] flex flex-col items-center justify-center"
      >
        {/* Crown Icon Above Knights */}
        <div className="relative z-20 mb-[-12px]">
          <svg
            className="w-6 h-6 text-[#c9a86a] drop-shadow-[0_0_12px_rgba(201,168,106,0.5)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </div>

        {/* Ambient Radial Spotlight Pulse */}
        <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-b from-white/10 via-[#c9a86a]/10 to-transparent filter blur-3xl pointer-events-none -z-10 animate-glow-pulse" />

        {/* Faint Rotating Orbit Rings (Pure SVG) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <svg className="w-[340px] h-[340px] animate-spin-slow opacity-30" viewBox="0 0 340 340">
            <circle
              cx="170"
              cy="170"
              r="155"
              fill="none"
              stroke="#c9a86a"
              strokeWidth="1"
              strokeDasharray="4 12"
            />
            <circle
              cx="170"
              cy="170"
              r="125"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="6 18"
            />
          </svg>
        </div>

        {/* The Two Facing Knights (Framer Motion Floating Loop) */}
        <div className="relative z-10 flex items-end justify-center gap-1 sm:gap-4 w-full h-[260px] sm:h-[300px]">
          {/* White Knight (Left, facing right) */}
          <motion.div
            animate={{
              y: [-5, 5, -5],
              rotate: [0, -1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-40 sm:w-48 h-auto shrink-0 -mr-6 sm:-mr-8 z-10"
          >
            <KnightSVG variant="white" className="w-full h-auto" />
          </motion.div>

          {/* Black Knight (Right, facing left towards White Knight) */}
          <motion.div
            animate={{
              y: [5, -5, 5],
              rotate: [0, 1, 0],
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            className="w-40 sm:w-48 h-auto shrink-0 -ml-6 sm:-ml-8 z-0"
          >
            <KnightSVG variant="black" mirrored={true} className="w-full h-auto" />
          </motion.div>
        </div>

        {/* Perspective Checkerboard Floor */}
        <PerspectiveFloor />
      </div>

      {/* 5. Bottom Tracked-Caps Two-Line Tagline */}
      <div className="mt-2 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.28em] text-[#8e8e93] uppercase leading-relaxed">
        <div>GOOD MOVES TODAY</div>
        <div>GREATER TOMORROWS</div>
      </div>
    </div>
  );
};

export default HeroKnights;
