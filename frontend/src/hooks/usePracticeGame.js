import { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { openingBook } from '../ai/openingBookEngine';
import { useStockfish } from './useStockfish';
import {
  playMoveSound,
  playCaptureSound,
  playCheckSound,
  playGameEndSound,
} from '../utils/soundEffects';

export function usePracticeGame(initialOpening = 'scotch-game', initialPlayerColor = 'b') {
  const [selectedOpening, setSelectedOpening] = useState(initialOpening);
  const [playerColor, setPlayerColor] = useState(initialPlayerColor); // 'w' or 'b'
  const [difficulty, setDifficulty] = useState('intermediate');

  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [moveHistory, setMoveHistory] = useState([]); // Array of SAN strings
  const [lastMove, setLastMove] = useState(null); // { from, to }

  const [isOffBook, setIsOffBook] = useState(false);
  const [offBookReason, setOffBookReason] = useState(null);
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Coach commentary history & latest highlighted message
  const [coachCommentary, setCoachCommentary] = useState([]);
  const [latestComment, setLatestComment] = useState(null);

  // Stockfish integration
  const stockfish = useStockfish(difficulty);
  const { getEngineMove, evaluatePosition, isEngineReady, evaluation, setDifficulty: setStockfishDiff } = stockfish;

  const botColor = playerColor === 'w' ? 'b' : 'w';

  // Synchronize difficulty change with Stockfish worker
  const handleSetDifficulty = useCallback((newDiff) => {
    setDifficulty(newDiff);
    setStockfishDiff(newDiff);
  }, [setStockfishDiff]);

  // Execute bot response (either Book Move or Stockfish fallback)
  const triggerBotMove = useCallback(async (currentHistory, currentFen) => {
    if (chess.isGameOver()) return;

    setIsBotThinking(true);

    try {
      // 1. Consult Opening Book
      const bookRes = openingBook.getOpeningMove(selectedOpening, currentHistory, currentFen, botColor);

      if (!bookRes.isOffBook && bookRes.move) {
        // --- ON BOOK ---
        // Natural human delay
        await new Promise((r) => setTimeout(r, 550));

        const moveRes = chess.move(bookRes.move);
        if (moveRes) {
          const newFen = chess.fen();
          const newHistory = [...currentHistory, moveRes.san];

          setFen(newFen);
          setMoveHistory(newHistory);
          setLastMove({ from: moveRes.from, to: moveRes.to });

          const commentObj = {
            san: moveRes.san,
            comment: bookRes.comment,
            color: botColor,
            isBook: true,
            variationName: bookRes.variationName,
            moveNum: Math.floor((newHistory.length - 1) / 2) + 1,
          };

          setCoachCommentary((prev) => [...prev, commentObj]);
          setLatestComment({
            title: `${moveRes.san} • ${bookRes.variationName || 'Book Move'}`,
            text: bookRes.comment,
            type: 'book',
          });

          // Audio feedback
          if (chess.isGameOver()) {
            playGameEndSound();
          } else if (chess.inCheck()) {
            playCheckSound();
          } else if (moveRes.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }

          // Run background evaluation
          evaluatePosition(newFen);
          return;
        }
      }

      // --- OFF BOOK: HANDOFF TO STOCKFISH ---
      setIsOffBook(true);
      const reason = bookRes.reason || 'Opening book moves concluded';
      setOffBookReason(reason);

      setLatestComment({
        title: '⚡ Off Book: Stockfish Taking Over',
        text: `${reason}. Stockfish (${difficulty.toUpperCase()}) is calculating the best response.`,
        type: 'off-book',
      });

      const best = await getEngineMove(currentFen);
      if (best && best.from && best.to) {
        const moveRes = chess.move({
          from: best.from,
          to: best.to,
          promotion: best.promotion || 'q',
        });

        if (moveRes) {
          const newFen = chess.fen();
          const newHistory = [...currentHistory, moveRes.san];

          setFen(newFen);
          setMoveHistory(newHistory);
          setLastMove({ from: moveRes.from, to: moveRes.to });

          const commentObj = {
            san: moveRes.san,
            comment: `Stockfish calculated move (${best.raw}) evaluating the position with deep tactical accuracy.`,
            color: botColor,
            isBook: false,
            variationName: 'Stockfish Engine',
            moveNum: Math.floor((newHistory.length - 1) / 2) + 1,
          };

          setCoachCommentary((prev) => [...prev, commentObj]);

          // Audio feedback
          if (chess.isGameOver()) {
            playGameEndSound();
          } else if (chess.inCheck()) {
            playCheckSound();
          } else if (moveRes.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }

          evaluatePosition(newFen);
        }
      }
    } catch (err) {
      console.warn('[usePracticeGame] Error during bot move calculation:', err);
    } finally {
      setIsBotThinking(false);
    }
  }, [chess, selectedOpening, botColor, difficulty, getEngineMove, evaluatePosition]);

  // Reset practice game
  const resetGame = useCallback((openingId = selectedOpening, color = playerColor) => {
    chess.reset();
    const initialFen = chess.fen();
    setFen(initialFen);
    setMoveHistory([]);
    setLastMove(null);
    setIsOffBook(false);
    setOffBookReason(null);
    setCoachCommentary([]);

    const openingObj = openingBook.getOpeningById(openingId);
    setLatestComment({
      title: `${openingObj?.name || 'Opening Practice'} (${openingObj?.eco || ''})`,
      text: openingObj?.description || 'Play canonical book moves to master this opening!',
      type: 'info',
    });

    // If player is playing Black, Bot plays White move 1 immediately!
    const activeBotColor = color === 'w' ? 'b' : 'w';
    if (activeBotColor === 'w') {
      setTimeout(() => {
        triggerBotMove([], initialFen);
      }, 300);
    } else {
      evaluatePosition(initialFen);
    }
  }, [chess, selectedOpening, playerColor, triggerBotMove, evaluatePosition]);

  // Initialize on mount or when opening/color changes
  useEffect(() => {
    resetGame(selectedOpening, playerColor);
  }, [selectedOpening, playerColor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Player makes a move
  const makePlayerMove = useCallback((from, to, promotion = 'q') => {
    if (isBotThinking || chess.isGameOver()) return false;
    if (chess.turn() !== playerColor) return false;

    try {
      const move = chess.move({ from, to, promotion });
      if (!move) return false;

      const newFen = chess.fen();
      const newHistory = [...moveHistory, move.san];

      setFen(newFen);
      setMoveHistory(newHistory);
      setLastMove({ from: move.from, to: move.to });

      // Audio feedback
      if (chess.isGameOver()) {
        playGameEndSound();
      } else if (chess.inCheck()) {
        playCheckSound();
      } else if (move.captured) {
        playCaptureSound();
      } else {
        playMoveSound();
      }

      // Check coach commentary for player's move
      const coachNote = openingBook.getCoachComment(selectedOpening, newHistory, newFen);
      if (coachNote) {
        const commentObj = {
          san: move.san,
          comment: coachNote.comment,
          color: playerColor,
          isBook: true,
          variationName: coachNote.variationName,
          moveNum: Math.floor((newHistory.length - 1) / 2) + 1,
        };
        setCoachCommentary((prev) => [...prev, commentObj]);
        setLatestComment({
          title: `Your Move: ${move.san} (${coachNote.variationName})`,
          text: coachNote.comment,
          type: 'book',
        });
      } else {
        // Player moved off-book!
        setIsOffBook(true);
        setOffBookReason('You played an alternative move outside the book line');
        setLatestComment({
          title: `Alternative Move: ${move.san}`,
          text: 'You deviated from the primary book line. Stockfish will now challenge your position directly.',
          type: 'off-book',
        });
      }

      evaluatePosition(newFen);

      // Trigger bot turn if game not over
      if (!chess.isGameOver()) {
        setTimeout(() => {
          triggerBotMove(newHistory, newFen);
        }, 150);
      }

      return true;
    } catch (err) {
      console.warn('[usePracticeGame] Player move rejected:', err);
      return false;
    }
  }, [chess, isBotThinking, playerColor, moveHistory, selectedOpening, evaluatePosition, triggerBotMove]);

  // Change Opening
  const changeOpening = useCallback((newOpeningId) => {
    setSelectedOpening(newOpeningId);
  }, []);

  // Change Player Color
  const changePlayerColor = useCallback((newColor) => {
    setPlayerColor(newColor);
  }, []);

  return {
    // Opening & Settings
    selectedOpening,
    openingDetails: openingBook.getOpeningById(selectedOpening),
    allOpenings: openingBook.getAllOpenings(),
    changeOpening,
    playerColor,
    changePlayerColor,
    difficulty,
    setDifficulty: handleSetDifficulty,
    difficultyPresets: stockfish.difficultyPresets,

    // Game Board State
    chess,
    fen,
    moveHistory,
    lastMove,
    isBotThinking,
    isEngineReady,
    evaluation,
    isGameOver: chess.isGameOver(),
    isCheck: chess.inCheck(),

    // Book & Commentary
    isOffBook,
    offBookReason,
    coachCommentary,
    latestComment,

    // Actions
    makePlayerMove,
    resetGame,
  };
}
