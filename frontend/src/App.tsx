import React, { useState, useEffect } from 'react';
import {
  Swords,
  Crown,
  Cpu,
  RotateCw,
  LayoutDashboard,
  ArrowLeft,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useChessGame } from './hooks/useChessGame';
import { ChessBoardView } from './components/ChessBoardView';
import { PlayerCard } from './components/PlayerCard';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';
import { StatusBanner } from './components/StatusBanner';
import { EngineEvaluationBar } from './components/practice/EngineEvaluationBar';
import { Header } from './components/common/Header';
import { AboutContactModal } from './components/modals/AboutContactModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardHub } from './pages/DashboardHub';
import { MultiplayerRoomPage } from './pages/MultiplayerRoomPage';
import { PracticePage } from './pages/PracticePage';
import { isMuted, toggleMute, playButtonClick } from './utils/soundEngine';
import { createRoomApi } from './services/api';

export interface UserProfile {
  name: string;
  elo: number;
  winRate: number;
  totalMatches: number;
  topOpening: string;
  isGuest?: boolean;
}

const STORAGE_USER_KEY = 'strats_chess_user';

export const App: React.FC = () => {
  // URL params check
  const params = new URLSearchParams(window.location.search);
  const urlRoomId = params.get('room');
  const urlGameId = params.get('game') || undefined;

  // Persisted user state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Active view: 'landing' | 'dashboard' | 'multiplayer' | 'practice' | 'solo'
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'multiplayer' | 'practice' | 'solo'>(() => {
    if (urlRoomId || sessionStorage.getItem('chess_room_code')) {
      return 'multiplayer';
    }
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    return saved ? 'dashboard' : 'landing';
  });

  const [muted, setMutedState] = useState(() => isMuted());
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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

  // Global keyboard shortcuts: Z (flip board), M (mute audio)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        toggleOrientation();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setMutedState(toggleMute());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleOrientation]);

  // Auth actions
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    sessionStorage.setItem('chess_player_name', newUser.name);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    setActiveTab('landing');
  };

  const handleToggleMute = () => {
    setMutedState(toggleMute());
  };

  // Dashboard actions
  const handleCreateRoom = async (params: { initialMinutes: number; incrementSeconds: number; preferredColor?: string | null }) => {
    try {
      const res = await createRoomApi(params);
      const code = res.roomCode;
      sessionStorage.setItem('chess_room_code', code);
      return code;
    } catch {
      // Fallback local generated code
      const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      sessionStorage.setItem('chess_room_code', fallbackCode);
      return fallbackCode;
    }
  };

  const handleJoinRoom = (code: string) => {
    sessionStorage.setItem('chess_room_code', code);
    setActiveTab('multiplayer');
  };

  const handleStartPractice = () => {
    setActiveTab('practice');
  };

  // 1. Landing View (Unauthenticated)
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-ebony-surface text-stone-100 flex flex-col">
        <Header
          user={user}
          onLogout={handleLogout}
          onOpenAuth={() => setActiveTab('landing')}
          onOpenAbout={() => setIsAboutOpen(true)}
          onNavigateHome={() => setActiveTab('landing')}
          onNavigatePlay={() => {
            if (user) setActiveTab('dashboard');
            else {
              // Guest entry
              handleLogin({
                name: 'Guest_' + Math.floor(1000 + Math.random() * 9000),
                elo: 1500,
                winRate: 60,
                totalMatches: 12,
                topOpening: 'Italian: 70%',
                isGuest: true,
              });
            }
          }}
          muted={muted}
          onToggleMute={handleToggleMute}
          activeSection="home"
        />

        <main className="flex-1">
          <LandingPage
            onLogin={handleLogin}
            onGuestLogin={handleLogin}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        </main>

        <AboutContactModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          onStartPlaying={() => {
            if (!user) {
              handleLogin({
                name: 'Guest_' + Math.floor(1000 + Math.random() * 9000),
                elo: 1500,
                winRate: 60,
                totalMatches: 12,
                topOpening: 'Italian: 70%',
                isGuest: true,
              });
            } else {
              setActiveTab('dashboard');
            }
          }}
        />
      </div>
    );
  }

  // 2. Post-Login Flagship Dashboard
  if (activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-ebony-surface text-stone-100 flex flex-col">
        <Header
          user={user}
          onLogout={handleLogout}
          onOpenAuth={() => setActiveTab('landing')}
          onOpenAbout={() => setIsAboutOpen(true)}
          onNavigateHome={() => setActiveTab('dashboard')}
          onNavigatePlay={() => setActiveTab('multiplayer')}
          muted={muted}
          onToggleMute={handleToggleMute}
          activeSection="home"
        />

        <main className="flex-1">
          <DashboardHub
            user={user}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onStartPractice={handleStartPractice}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        </main>

        <AboutContactModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          onStartPlaying={() => setIsAboutOpen(false)}
        />
      </div>
    );
  }

  // 3. Multiplayer Match Room
  if (activeTab === 'multiplayer') {
    return (
      <div className="relative min-h-screen bg-ebony-surface text-stone-100 flex flex-col">
        {/* Universal Top Navigation Header */}
        <Header
          user={user}
          onLogout={handleLogout}
          onOpenAuth={() => setActiveTab('landing')}
          onOpenAbout={() => setIsAboutOpen(true)}
          onNavigateHome={() => setActiveTab('dashboard')}
          onNavigatePlay={() => setActiveTab('multiplayer')}
          muted={muted}
          onToggleMute={handleToggleMute}
          activeSection="play"
        />

        {/* Floating Quick Switcher */}
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
          <button
            onClick={() => {
              playButtonClick();
              setActiveTab('dashboard');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-terracotta hover:bg-terracotta-dark border border-terracotta-light/40 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Two Knights Hub</span>
          </button>
          <button
            onClick={() => {
              playButtonClick();
              setActiveTab('practice');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ebony-elevated hover:bg-stone-800 border border-ebony-border text-xs font-bold text-stone-300 hover:text-white shadow-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <span>📚 Opening Practice Bot</span>
          </button>
          <button
            onClick={() => {
              playButtonClick();
              setActiveTab('solo');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ebony-elevated hover:bg-stone-800 border border-ebony-border text-xs font-bold text-stone-300 hover:text-white shadow-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <span>🤖 Solo / AI Mode</span>
          </button>
        </div>

        <main className="flex-1">
          <MultiplayerRoomPage />
        </main>

        <AboutContactModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          onStartPlaying={() => setIsAboutOpen(false)}
        />
      </div>
    );
  }

  // 4. Opening Practice Mode
  if (activeTab === 'practice') {
    return (
      <div className="relative min-h-screen bg-ebony-surface text-stone-100 flex flex-col">
        <Header
          user={user}
          onLogout={handleLogout}
          onOpenAuth={() => setActiveTab('landing')}
          onOpenAbout={() => setIsAboutOpen(true)}
          onNavigateHome={() => setActiveTab('dashboard')}
          onNavigatePlay={() => setActiveTab('multiplayer')}
          muted={muted}
          onToggleMute={handleToggleMute}
          activeSection="play"
        />

        <div className="fixed top-20 left-4 z-40">
          <button
            onClick={() => {
              playButtonClick();
              setActiveTab('dashboard');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ebony-elevated hover:bg-stone-800 border border-ebony-border text-xs font-bold text-stone-300 hover:text-white shadow-lg transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-terracotta" />
            <span>Return to Hub</span>
          </button>
        </div>

        <main className="flex-1">
          <PracticePage onSwitchMode={setActiveTab} />
        </main>

        <AboutContactModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          onStartPlaying={() => setIsAboutOpen(false)}
        />
      </div>
    );
  }

  // 5. Solo / Engine Mode
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

  return (
    <div className="min-h-screen bg-ebony-surface text-stone-100 flex flex-col">
      {/* Top Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setActiveTab('landing')}
        onOpenAbout={() => setIsAboutOpen(true)}
        onNavigateHome={() => setActiveTab('dashboard')}
        onNavigatePlay={() => setActiveTab('multiplayer')}
        muted={muted}
        onToggleMute={handleToggleMute}
        activeSection="play"
      />

      {/* Mode Navigation Bar */}
      <div className="bg-ebony-elevated border-b border-ebony-border px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playButtonClick();
              setActiveTab('dashboard');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-terracotta" />
            <span>Hub</span>
          </button>
          <span className="text-stone-500">|</span>
          <span className="font-mono text-terracotta font-semibold">Solo Sandbox</span>
          <span className="text-stone-500">|</span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-stone-400">
            {connectionState === 'CONNECTED' ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Wifi className="w-3 h-3" />
                <span>Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-stone-400">
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleOrientation}
            className="p-1 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1 font-mono text-[11px]"
            title="Flip Board (Z)"
          >
            <RotateCw className="w-3 h-3 text-cyan-400" />
            <span>Flip (Z)</span>
          </button>
          <button
            onClick={() => setActiveTab('multiplayer')}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm flex items-center gap-1"
          >
            <Swords className="w-3 h-3" />
            <span>Online Rooms</span>
          </button>
        </div>
      </div>

      {/* Main Chess Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Chessboard Section */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <PlayerCard
            name={topPlayer.name}
            color={topPlayer.color}
            isTurn={topPlayer.isTurn}
            capturedPieces={topPlayer.captured}
          />

          <StatusBanner
            status={gameState?.status}
            winner={gameState?.winner}
            inCheck={gameState?.inCheck}
            errorMessage={errorMessage}
          />

          {isAiOpponent && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-ebony-elevated border border-ebony-border">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-300">
                  <Cpu className="w-3.5 h-3.5 text-terracotta-light" />
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
                          ? 'bg-terracotta text-white shadow-sm'
                          : 'bg-stone-800 text-stone-400 hover:text-stone-200'
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

          <div className="flex items-center gap-3 w-full justify-center">
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

          <PlayerCard
            name={bottomPlayer.name}
            color={bottomPlayer.color}
            isTurn={bottomPlayer.isTurn}
            capturedPieces={bottomPlayer.captured}
          />

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
          <div className="flex-1 min-h-[380px]">
            <MoveHistory
              moves={gameState?.moveHistory || []}
              currentFen={fen}
            />
          </div>

          <div className="p-4 rounded-2xl bg-ebony-elevated border border-ebony-border space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider">
              <span>Match Status</span>
              <span className="flex items-center gap-1 text-terracotta-light font-bold">
                <Crown className="w-3.5 h-3.5" />
                {gameState?.status || 'IN_PROGRESS'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                <span className="block text-[11px] text-stone-400">Turn</span>
                <span className="font-bold text-sm text-stone-200">
                  {gameState?.sideToMove || 'WHITE'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                <span className="block text-[11px] text-stone-400">Full Move</span>
                <span className="font-bold text-sm text-stone-200">
                  {gameState?.fullMoveNumber || 1}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                <span className="block text-[11px] text-stone-400">Half Clock</span>
                <span className="font-bold text-sm text-stone-200">
                  {gameState?.halfMoveClock || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AboutContactModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onStartPlaying={() => setIsAboutOpen(false)}
      />

      <footer className="py-3 text-center border-t border-stone-900 text-xs text-stone-500">
        Strat's Chess &copy; 2026 &bull; Spring Boot 3.3.4 (Java 21) &bull; React + Vite + Tailwind CSS
      </footer>
    </div>
  );
};

export default App;
