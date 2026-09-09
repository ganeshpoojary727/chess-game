/**
 * Re-export and compatibility layer for soundEngine.js
 */
import soundEngine, {
  playMove,
  playCapture,
  playCheck,
  playVictory,
  playButtonClick,
  isMuted,
  setMuted,
  toggleMute
} from './soundEngine.js';

export {
  soundEngine,
  playMove,
  playCapture,
  playCheck,
  playVictory,
  playButtonClick,
  isMuted,
  setMuted,
  toggleMute
};

export const playMoveSound = playMove;
export const playCaptureSound = playCapture;
export const playCheckSound = playCheck;
export const playGameEndSound = playVictory;

export default soundEngine;
