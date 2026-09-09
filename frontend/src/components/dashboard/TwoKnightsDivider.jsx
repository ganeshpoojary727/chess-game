import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { playButtonClick } from '../../utils/soundEngine';

export function TwoKnightsDivider({ onCenterpieceClick }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt calculations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 select-none perspective-1000">
      {/* Decorative Aura Rings in background */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.6, 0.35],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-terracotta/20 pointer-events-none -z-10"
      />

      <motion.div
        animate={{
          scale: [1.05, 0.96, 1.05],
          opacity: [0.25, 0.5, 0.25],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full border border-cyan-400/20 pointer-events-none -z-10"
      />

      {/* Main 3D Card Container */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          playButtonClick();
          onCenterpieceClick?.();
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative cursor-pointer group rounded-3xl p-1 bg-gradient-to-b from-stone-700/60 via-stone-800/40 to-stone-900/80 backdrop-blur-xl shadow-2xl border border-stone-700/60 transition-shadow duration-500 hover:shadow-terracotta/25 hover:shadow-2xl"
      >
        {/* Left Side: Soft Lunar White/Cyan Breathing Glow */}
        <motion.div
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -left-4 top-1/4 w-32 h-44 bg-cyan-300/20 rounded-full filter blur-2xl pointer-events-none"
        />

        {/* Right Side: Fiery Terracotta/Ember Pulse */}
        <motion.div
          animate={{
            opacity: [0.45, 0.9, 0.45],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -right-4 top-1/4 w-36 h-48 bg-terracotta/35 rounded-full filter blur-2xl pointer-events-none"
        />

        {/* Orbiting / Floating Ember Dust Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-10, -60, -10],
                x: [0, (i % 2 === 0 ? 15 : -15), 0],
                opacity: [0, 0.8, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + i * 0.8,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
              className={`absolute w-1.5 h-1.5 rounded-full ${
                i % 2 === 0 ? 'bg-cyan-200 shadow-[0_0_8px_#67e8f9]' : 'bg-terracotta-light shadow-[0_0_8px_#DE705F]'
              }`}
              style={{
                left: `${20 + i * 12}%`,
                bottom: '15%',
              }}
            />
          ))}
        </div>

        {/* Oval / Rounded-3xl Frame Holding two-knights.png */}
        <div className="relative w-56 sm:w-64 md:w-72 h-72 sm:h-80 md:h-92 rounded-[28px] overflow-hidden bg-ebony-surface flex items-center justify-center border border-stone-800/90 shadow-inner">
          <img
            src="/assets/two-knights.png"
            alt="Strat's Chess - Two Knights Centerpiece"
            className="w-full h-full object-cover object-center filter contrast-125 brightness-105 group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Vignette & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-ebony-surface via-transparent to-ebony-surface/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-terracotta-900/15 pointer-events-none" />

          {/* Bottom Title Plaque */}
          <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-2xl bg-ebony-elevated/90 backdrop-blur-md border border-stone-700/60 text-center shadow-lg transform translate-z-10">
            <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold tracking-widest text-ivory">
              <span className="text-cyan-300">LIGHT</span>
              <span className="text-stone-500 font-sans text-[10px]">&bull;</span>
              <span className="text-terracotta-light">SHADOW</span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider mt-0.5">
              Authoritative Master Engine
            </p>
          </div>
        </div>
      </motion.div>

      {/* Subtitle badge under centerpiece */}
      <div className="mt-3 flex items-center gap-2 px-3.5 py-1 rounded-full bg-ebony-elevated/80 border border-ebony-border text-[11px] font-mono text-stone-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Dual WebSocket Synced</span>
      </div>
    </div>
  );
}

export default TwoKnightsDivider;
