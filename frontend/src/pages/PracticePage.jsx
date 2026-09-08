import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { usePracticeGame } from '../hooks/usePracticeGame';
import { EngineEvaluationBar } from '../components/practice/EngineEvaluationBar';
import {
  BookOpen,
  RotateCcw,
  Sparkles,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  Shield,
  Lightbulb,
} from 'lucide-react';

export function PracticePage({ onSwitchMode }) {
  const {
    selectedOpening,
    openingDetails,
    allOpenings,
    changeOpening,
    playerColor,
    changePlayerColor,
    difficulty,
    setDifficulty,
    difficultyPresets,
    chess,
    fen,
    moveHistory,
    lastMove,
    isBotThinking,
    isEngineReady,
    evaluation,
    isGameOver,
    isCheck,
    isOffBook,
    offBookReason,
    coachCommentary,
    latestComment,
    makePlayerMove,
    resetGame,
  } = usePracticeGame('scotch-game', 'b'); // Default to Scotch Game as Black

  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const commentaryScrollRef = useRef(null);

  // Auto-scroll commentary feed on new moves
  useEffect(() => {
    if (commentaryScrollRef.current) {
      commentaryScrollRef.current.scrollTop = commentaryScrollRef.current.scrollHeight;
    }
  }, [coachCommentary.length]);

  // Orientation based on player color
  const orientation = playerColor === 'b' ? 'black' : 'white';
  const isPlayerTurn = chess.turn() === playerColor;

  // Draggable filter: only allow dragging player's own pieces on their turn
  const isDraggablePiece = useCallback(
    ({ piece }) => {
      if (!isPlayerTurn || isBotThinking || isGameOver) return false;
      const piecePrefix = playerColor === 'b' ? 'b' : 'w';
      return piece.startsWith(piecePrefix);
    },
    [isPlayerTurn, isBotThinking, isGameOver, playerColor]
  );

  // Click-to-move handler
  const onSquareClick = useCallback(
    (square) => {
      if (!isPlayerTurn || isBotThinking || isGameOver) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      if (selectedSquare) {
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setPossibleMoves([]);
          return;
        }

        const isDest = possibleMoves.includes(square);
        if (isDest) {
          const success = makePlayerMove(selectedSquare, square, 'q');
          setSelectedSquare(null);
          setPossibleMoves([]);
          if (success) return;
        }
      }

      const piece = chess.get(square);
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        try {
          const moves = chess.moves({ square, verbose: true });
          setPossibleMoves(moves.map((m) => m.to));
        } catch {
          setPossibleMoves([]);
        }
      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    },
    [isPlayerTurn, isBotThinking, isGameOver, selectedSquare, possibleMoves, chess, playerColor, makePlayerMove]
  );

  // Piece Drop handler
  const handlePieceDrop = useCallback(
    (sourceSquare, targetSquare, piece) => {
      if (!isPlayerTurn || isBotThinking || isGameOver) return false;

      setSelectedSquare(null);
      setPossibleMoves([]);

      let promotion = 'q';
      const isPawn = piece && (piece === 'wP' || piece === 'bP');
      const isPromotionRank =
        (piece === 'wP' && targetSquare.endsWith('8')) ||
        (piece === 'bP' && targetSquare.endsWith('1'));

      if (!isPawn || !isPromotionRank) {
        promotion = undefined;
      }

      return makePlayerMove(sourceSquare, targetSquare, promotion);
    },
    [isPlayerTurn, isBotThinking, isGameOver, makePlayerMove]
  );

  // Custom square styles
  const customSquareStyles = useMemo(() => {
    const styles = {};

    if (lastMove) {
      if (lastMove.from) {
        styles[lastMove.from] = { backgroundColor: 'rgba(234, 179, 8, 0.3)' };
      }
      if (lastMove.to) {
        styles[lastMove.to] = { backgroundColor: 'rgba(234, 179, 8, 0.4)' };
      }
    }

    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        boxShadow: 'inset 0 0 0 2px #10b981',
      };
    }

    possibleMoves.forEach((sq) => {
      const pieceOnTarget = chess.get(sq);
      if (pieceOnTarget) {
        styles[sq] = {
          background: 'radial-gradient(circle, transparent 55%, rgba(16, 185, 129, 0.5) 56%)',
          borderRadius: '50%',
          cursor: 'pointer',
        };
      } else {
        styles[sq] = {
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.65) 24%, transparent 26%)',
          borderRadius: '50%',
          cursor: 'pointer',
        };
      }
    });

    if (isCheck && fen) {
      const activeColor = fen.split(' ')[1] || 'w';
      const targetKing = activeColor === 'w' ? 'K' : 'k';
      const rows = fen.split(' ')[0].split('/');

      rows.forEach((row, rowIndex) => {
        let colIndex = 0;
        for (const char of row) {
          if (isNaN(Number(char))) {
            if (char === targetKing) {
              const file = String.fromCharCode(97 + colIndex);
              const rank = 8 - rowIndex;
              styles[`${file}${rank}`] = {
                background:
                  'radial-gradient(circle, rgba(239, 68, 68, 0.85) 0%, rgba(239, 68, 68, 0.35) 70%, transparent 100%)',
                boxShadow: 'inset 0 0 12px #ef4444',
              };
            }
            colIndex++;
          } else {
            colIndex += Number(char);
          }
        }
      });
    }

    return styles;
  }, [lastMove, selectedSquare, possibleMoves, isCheck, fen, chess]);

  // Group openings by category for select menu
  const categorizedOpenings = useMemo(() => {
    const map = {};
    allOpenings.forEach((op) => {
      const cat = op.category || 'General Openings';
      if (!map[cat]) map[cat] = [];
      map[cat].push(op);
    });
    return map;
  }, [allOpenings]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Controls Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Title and Icon */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-900/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Opening Practice</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Interactive Coach
                </span>
              </h1>
            </div>
          </div>

          {/* Opening Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400 hidden sm:inline">Opening:</label>
            <select
              value={selectedOpening}
              onChange={(e) => changeOpening(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[200px] sm:max-w-xs"
            >
              {Object.entries(categorizedOpenings).map(([category, items]) => (
                <optgroup key={category} label={category} className="bg-slate-950 text-slate-400 font-bold">
                  {items.map((op) => (
                    <option key={op.id} value={op.id} className="bg-slate-900 text-white font-medium">
                      {op.name} ({op.eco})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Color & Difficulty Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Color Switcher */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => changePlayerColor('w')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  playerColor === 'w'
                    ? 'bg-amber-100 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>♔</span> White
              </button>
              <button
                onClick={() => changePlayerColor('b')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  playerColor === 'b'
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>♚</span> Black
              </button>
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1">
              {['beginner', 'intermediate', 'advanced', 'master'].map((lvl) => {
                const isSelected = difficulty === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize transition-all hidden md:inline-block ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>

            {/* Restart Opening button */}
            <button
              onClick={() => resetGame()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-95"
              title="Restart this opening from move 1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reset</span>
            </button>

            {onSwitchMode && (
              <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-slate-800">
                <button
                  onClick={() => onSwitchMode('multiplayer')}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-xs font-bold text-white transition-all shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>⚡ Multiplayer</span>
                </button>
                <button
                  onClick={() => onSwitchMode('solo')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>🤖 Solo AI</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Practice Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Chessboard & Eval Bar */}
        <div className="lg:col-span-7 flex flex-col gap-3 max-w-[580px] mx-auto w-full">
          {/* Match & Turn Banner */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Opening:</span>
              <strong className="text-white">{openingDetails?.name}</strong>
              <span className="font-mono text-indigo-400 text-[11px] bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-800">
                {openingDetails?.eco}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isBotThinking ? (
                <span className="flex items-center gap-1.5 text-indigo-400 font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  Bot is thinking...
                </span>
              ) : isPlayerTurn ? (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Your Turn ({playerColor === 'w' ? 'White' : 'Black'})
                </span>
              ) : (
                <span className="text-slate-400">Waiting for Bot...</span>
              )}
            </div>
          </div>

          {/* Board with Vertical Evaluation Bar */}
          <div className="flex items-center gap-3 w-full justify-center">
            {/* Evaluation Bar */}
            <EngineEvaluationBar
              evaluation={evaluation}
              orientation={orientation}
              isThinking={isBotThinking}
            />

            {/* Chessboard */}
            <div className="flex-1 max-w-[540px] aspect-square relative p-2 sm:p-2.5 bg-slate-900/90 rounded-2xl border-2 border-slate-800 shadow-2xl backdrop-blur-xl">
              <div className="w-full h-full rounded-xl overflow-hidden shadow-inner relative">
                <Chessboard
                  position={fen}
                  boardOrientation={orientation}
                  onPieceDrop={handlePieceDrop}
                  onSquareClick={onSquareClick}
                  isDraggablePiece={isDraggablePiece}
                  arePiecesDraggable={isPlayerTurn && !isBotThinking && !isGameOver}
                  customSquareStyles={customSquareStyles}
                  customBoardStyle={{
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                  }}
                  customDarkSquareStyle={{ backgroundColor: '#779952' }}
                  customLightSquareStyle={{ backgroundColor: '#edeed1' }}
                  animationDuration={200}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Coach Commentary & Move Notes */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full h-full min-h-[500px]">
          {/* Status Alert Badge */}
          <div
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              isOffBook
                ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                : 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {isOffBook ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <span className="text-xs uppercase font-bold tracking-wider">
                {isOffBook ? 'Off Book: Stockfish Active' : 'On Book: Canonical Line'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {isOffBook
                ? `${offBookReason || 'Deviation detected'}. Stockfish is now calculating responses directly.`
                : 'Follow the canonical move order or test counter-variations.'}
            </p>
          </div>

          {/* Current Move Explanation Hero Card */}
          {latestComment && (
            <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/30">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Lightbulb className="w-4 h-4 text-indigo-400" />
                <span>{latestComment.title}</span>
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed italic">
                "{latestComment.text}"
              </p>
            </div>
          )}

          {/* Move-by-Move Coach Commentary Feed */}
          <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-slate-800 overflow-hidden min-h-[260px] max-h-[380px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Move Commentary ({coachCommentary.length})</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {moveHistory.length > 0 ? `Move ${Math.ceil(moveHistory.length / 2)}` : 'Move 1'}
              </span>
            </div>

            <div
              ref={commentaryScrollRef}
              className="flex-1 overflow-y-auto p-3 space-y-2 text-xs select-text"
            >
              {coachCommentary.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-36 text-slate-500 text-center px-4">
                  <Info className="w-5 h-5 mb-2 opacity-50 text-indigo-400" />
                  <span>Make a move on the board to see tactical explanations and coach guidance.</span>
                </div>
              ) : (
                coachCommentary.map((c, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border transition-all ${
                      c.isBook
                        ? 'bg-slate-900/80 border-slate-800'
                        : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-indigo-400">
                          {c.moveNum}. {c.san}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                          {c.color === 'w' ? 'White' : 'Black'}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                          c.isBook
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                        }`}
                      >
                        {c.isBook ? 'Book' : 'Engine'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{c.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Strategic Overview Card */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                {openingDetails?.name} Overview
              </span>
              <span className="font-mono text-slate-500 font-bold">{openingDetails?.eco}</span>
            </div>
            <p className="leading-relaxed text-slate-300">{openingDetails?.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
