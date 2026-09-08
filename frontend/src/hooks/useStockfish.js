import { useState, useEffect, useRef, useCallback } from 'react';
import { StockfishEngine, DIFFICULTY_PRESETS } from '../ai/stockfishWorkerController';

export function useStockfish(initialDifficulty = 'intermediate') {
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [difficulty, setDifficultyState] = useState(initialDifficulty);
  const [evaluation, setEvaluation] = useState(null);

  const engineRef = useRef(null);

  // Initialize engine worker on mount
  useEffect(() => {
    let isMounted = true;
    const engine = new StockfishEngine();
    engineRef.current = engine;

    engine.onEvaluation((evalData) => {
      if (isMounted) {
        setEvaluation(evalData);
      }
    });

    engine.init()
      .then(() => {
        if (isMounted) {
          setIsEngineReady(true);
          engine.setDifficulty(initialDifficulty);
        }
      })
      .catch((err) => {
        console.error('[useStockfish] Failed to initialize engine:', err);
      });

    return () => {
      isMounted = false;
      engine.terminate();
      engineRef.current = null;
    };
  }, [initialDifficulty]);

  // Set difficulty level
  const setDifficulty = useCallback((level) => {
    setDifficultyState(level);
    if (engineRef.current) {
      engineRef.current.setDifficulty(level);
    }
  }, []);

  // Get best move for a given FEN
  const getEngineMove = useCallback(async (fen, options = {}) => {
    if (!engineRef.current) {
      throw new Error('Stockfish engine is not initialized');
    }

    setIsThinking(true);
    try {
      const result = await engineRef.current.getBestMove(fen, options);
      return result;
    } finally {
      setIsThinking(false);
    }
  }, []);

  // Evaluate a position without moving
  const evaluatePosition = useCallback(async (fen, depth = 12) => {
    if (!engineRef.current) {
      return null;
    }

    setIsThinking(true);
    try {
      const evalResult = await engineRef.current.evaluatePosition(fen, depth);
      setEvaluation(evalResult);
      return evalResult;
    } finally {
      setIsThinking(false);
    }
  }, []);

  // Stop calculation
  const stopThinking = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
      setIsThinking(false);
    }
  }, []);

  return {
    isEngineReady,
    isThinking,
    difficulty,
    difficultyPresets: DIFFICULTY_PRESETS,
    setDifficulty,
    evaluation,
    getEngineMove,
    evaluatePosition,
    stopThinking,
    engine: engineRef.current,
  };
}
