import React from 'react';
import { Swords, Wifi, WifiOff, RefreshCw, Crown, Cpu } from 'lucide-react';
import { useChessGame } from './hooks/useChessGame';
import { ChessBoardView } from './components/ChessBoardView';
import { PlayerCard } from './components/PlayerCard';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';
import { StatusBanner } from './components/StatusBanner';
import { EngineEvaluationBar } from './components/practice/EngineEvaluationBar';

import { MultiplayerRoomPage } from './pages/MultiplayerRoomPage';

export const App: React.FC = () => {
  // Read game or room ID from URL query if present
  const params = new URLSearchParams(window.location.search);
  const urlRoomId = params.get('room');
  const urlGameId = params.get('game') || undefined;

  // Active view: 'multiplayer' | 'solo'
  const [activeTab, setActiveTab] = React.useState<'multiplayer' | 'solo'>(() => {
    if (urlRoomId || sessionStorage.getItem('chess_room_code')) {
      return 'multiplayer';
    }
    return 'multiplayer'; // Default to multiplayer mode
  });

  const {
    fen,
    gameState,
    connectionState,
    orientation,
    selectedSquare,
    possibleMoves,
    errorMessage,
    isAiOpponent,
    setIsAiOpponent,
    onSquareClick,
    onPieceDrop,
    handleNewGame,
    handleReset,
    handleResign,
    toggleOrientation,
    isEngineReady,
    isStockfishThinking,
    stockfishDifficulty,
    setStockfishDifficulty,
    difficultyPresets,
    evaluation,
  } = useChessGame(urlGameId);

  const whitePlayerName = gameState?.whitePlayer?.name || 'White Player';
  const aiDisplayName = isStockfishThinking
    ? 'Stockfish (Thinking...)'
    : `Stockfish (${(difficultyPresets as any)?.[stockfishDifficulty]?.name || 'AI'})`;
  const blackPlayerName = isAiOpponent ? aiDisplayName : (gameState?.blackPlayer?.name || 'Black Player');

  const topPlayer = orientation === 'white' ? {
    name: blackPlayerName,
    color: 'black' as const,
    isTurn: gameState?.sideToMove === 'BLACK',
    captured: gameState?.capturedBlackPieces || [],
  } : {
    name: whitePlayerName,
    color: 'white' as const,
    isTurn: gameState?.sideToMove === 'WHITE',
    captured: gameState?.capturedWhitePieces || [],
  };

  const bottomPlayer = orientation === 'white' ? {
    name: whitePlayerName,
    color: 'white' as const,
    isTurn: gameState?.sideToMove === 'WHITE',
    captured: gameState?.capturedWhitePieces || [],
  } : {
    name: blackPlayerName,
    color: 'black' as const,
    isTurn: gameState?.sideToMove === 'BLACK',
    captured: gameState?.capturedBlackPieces || [],
  };

  if (activeTab === 'multiplayer') {
    return (
      <div className="relative min-h-screen">
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => setActiveTab('solo')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white shadow-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <span>🤖 Solo / AI Mode</span>
          </button>
        </div>
        <MultiplayerRoomPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <Swords className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Chess App
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Java 21 + React
                </span>
              </div>
              <p className="text-xs text-slate-400">High-Performance WebSocket Engine</p>
            </div>
          </div>

          {/* Connection Status Badge & Game ID */}
          <div className="flex items-center gap-3">
            {gameState?.gameId && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                <span>ID:</span>
                <span className="text-slate-200 font-semibold truncate max-w-[120px]">
                  {gameState.gameId}
                </span>
              </div>
            )}

            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                connectionState === 'CONNECTED'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  : connectionState === 'CONNECTING'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                  : 'bg-red-950/60 text-red-300 border-red-500/30'
              }`}
            >
              {connectionState === 'CONNECTED' ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>STOMP Connected</span>
                </>
              ) : connectionState === 'CONNECTING' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-red-400" />
                  <span>Standalone / Offline</span>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveTab('multiplayer')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>⚡ Online Rooms</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Chess Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Chessboard Section */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Top Player Card */}
          <PlayerCard
            name={topPlayer.name}
            color={topPlayer.color}
            isTurn={topPlayer.isTurn}
            capturedPieces={topPlayer.captured}
          />

          {/* Status Notifications */}
          <StatusBanner
            status={gameState?.status}
            winner={gameState?.winner}
            inCheck={gameState?.inCheck}
            errorMessage={errorMessage}
          />

          {/* Stockfish AI Difficulty Selector */}
          {isAiOpponent && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stockfish AI:</span>
                </div>
                {isEngineReady ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    WASM Ready
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-semibold animate-pulse">Initializing Engine...</span>
                )}
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                {(['beginner', 'intermediate', 'advanced', 'master'] as const).map((lvl) => {
                  const isSelected = stockfishDifficulty === lvl;
                  const preset = (difficultyPresets as any)?.[lvl];
                  return (
                    <button
                      key={lvl}
                      onClick={() => setStockfishDifficulty(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/30'
                          : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                      }`}
                      title={preset?.description}
                    >
                      {preset?.name || lvl} <span className="opacity-60 text-[10px]">({preset?.elo})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Chess Board with Evaluation Bar */}
          <div className="flex items-center gap-3 w-full justify-center">
            {/* Vertical Stockfish Evaluation Bar */}
            <EngineEvaluationBar
              evaluation={evaluation}
              orientation={orientation}
              isThinking={isStockfishThinking}
            />

            <div className="flex-1 max-w-[560px]">
              <ChessBoardView
                fen={fen}
                orientation={orientation}
                selectedSquare={selectedSquare}
                possibleMoves={possibleMoves}
                lastMove={gameState?.lastMove}
                inCheck={gameState?.inCheck}
                sideToMove={gameState?.sideToMove}
                onPieceDrop={onPieceDrop}
                onSquareClick={onSquareClick}
              />
            </div>
          </div>

          {/* Bottom Player Card */}
          <PlayerCard
            name={bottomPlayer.name}
            color={bottomPlayer.color}
            isTurn={bottomPlayer.isTurn}
            capturedPieces={bottomPlayer.captured}
          />

          {/* Controls Bar */}
          <GameControls
            onNewGame={handleNewGame}
            onReset={handleReset}
            onResign={handleResign}
            onFlipBoard={toggleOrientation}
            isAiOpponent={isAiOpponent}
            onToggleAi={() => setIsAiOpponent(!isAiOpponent)}
            gameId={gameState?.gameId}
          />
        </div>

        {/* Right 5 Columns: Moves History & Engine Status */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full min-h-[500px]">
          {/* Move Log */}
          <div className="flex-1 min-h-[380px]">
            <MoveHistory
              moves={gameState?.moveHistory || []}
              currentFen={fen}
            />
          </div>

          {/* Quick Engine & Match Info */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Match Status</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Crown className="w-3.5 h-3.5" />
                {gameState?.status || 'IN_PROGRESS'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="block text-[11px] text-slate-400">Turn</span>
                <span className="font-bold text-sm text-slate-200">
                  {gameState?.sideToMove || 'WHITE'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="block text-[11px] text-slate-400">Full Move</span>
                <span className="font-bold text-sm text-slate-200">
                  {gameState?.fullMoveNumber || 1}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="block text-[11px] text-slate-400">Half Clock</span>
                <span className="font-bold text-sm text-slate-200">
                  {gameState?.halfMoveClock || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-t border-slate-900 text-xs text-slate-500">
        High-Performance Chess Monorepo &copy; 2026 &bull; Spring Boot 3.3.4 (Java 21) &bull; chesslib &bull; React + Vite + Tailwind CSS
      </footer>
    </div>
  );
};

export default App;
