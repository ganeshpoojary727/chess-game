import React, { useState, useEffect, useRef } from 'react';
import { useMultiplayerRoom } from '../hooks/useMultiplayerRoom';
import { PlayerCard } from '../components/multiplayer/PlayerCard';
import { MultiplayerBoard } from '../components/multiplayer/MultiplayerBoard';
import { RoomLobby } from '../components/multiplayer/RoomLobby';
import { GameEndModal } from '../components/multiplayer/GameEndModal';
import {
  Flag,
  Handshake,
  RotateCcw,
  LogOut,
  Wifi,
  WifiOff,
  Copy,
  Check,
  AlertCircle,
  ScrollText,
  Volume2,
  VolumeX,
} from 'lucide-react';

export function MultiplayerRoomPage() {
  const {
    playerToken,
    playerName,
    updatePlayerName,
    roomCode,
    playerColor,
    connected,
    opponentConnected,
    gameState,
    clocks,
    chess,
    captured,
    errorMessage,
    clearError,
    drawOffer,
    createRoom,
    joinRoom,
    makeMove,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    requestRematch,
    leaveRoom,
  } = useMultiplayerRoom();

  const [copiedCode, setCopiedCode] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [drawOfferSent, setDrawOfferSent] = useState(false);
  const moveScrollRef = useRef(null);

  // Auto-check URL parameters for ?room=ROOMCODE
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam && !roomCode) {
      joinRoom(roomParam.trim().toUpperCase());
    }
  }, [roomCode, joinRoom]);

  // Auto-scroll move history
  useEffect(() => {
    if (moveScrollRef.current) {
      moveScrollRef.current.scrollTop = moveScrollRef.current.scrollHeight;
    }
  }, [gameState.moveHistory?.length]);

  const handleCopyCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResignClick = () => {
    if (showResignConfirm) {
      resign();
      setShowResignConfirm(false);
    } else {
      setShowResignConfirm(true);
      setTimeout(() => setShowResignConfirm(false), 5000);
    }
  };

  const handleOfferDraw = () => {
    offerDraw();
    setDrawOfferSent(true);
    setTimeout(() => setDrawOfferSent(false), 4000);
  };

  // Determine top (opponent) and bottom (local) player representations
  const isWhite = playerColor === 'w';
  const isBlack = playerColor === 'b';

  // Bottom player is local player if assigned, else White
  const bottomPlayer = isBlack ? gameState.blackPlayer : gameState.whitePlayer;
  const bottomColor = isBlack ? 'b' : 'w';
  const bottomClocks = isBlack ? clocks.blackMs : clocks.whiteMs;
  const bottomCaptures = isBlack ? captured.blackCaptures : captured.whiteCaptures;
  const bottomAdvantage = isBlack
    ? (captured.materialDiff < 0 ? Math.abs(captured.materialDiff) : 0)
    : (captured.materialDiff > 0 ? captured.materialDiff : 0);

  // Top player is opponent
  const topPlayer = isBlack ? gameState.whitePlayer : gameState.blackPlayer;
  const topColor = isBlack ? 'w' : 'b';
  const topClocks = isBlack ? clocks.whiteMs : clocks.blackMs;
  const topCaptures = isBlack ? captured.whiteCaptures : captured.blackCaptures;
  const topAdvantage = isBlack
    ? (captured.materialDiff > 0 ? captured.materialDiff : 0)
    : (captured.materialDiff < 0 ? Math.abs(captured.materialDiff) : 0);

  const isMyTurn = playerColor ? gameState.turn === playerColor : false;

  // Group move history into pairs
  const movePairs = [];
  const history = gameState.moveHistory || [];
  const formatMove = (m) => {
    if (!m) return '';
    if (typeof m === 'string') return m;
    return m.san || (m.from && m.to ? `${m.from}-${m.to}` : '');
  };
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: formatMove(history[i]),
      black: formatMove(history[i + 1]),
    });
  }

  // Active game or finished game view
  const inGameView = roomCode && gameState.status !== 'WAITING';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-900/30">
              ♞
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Chess Live</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Multiplayer
                </span>
              </h1>
            </div>
          </div>

          {/* Center Info: Room Code & Status */}
          {roomCode && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
                title="Click to copy room code"
              >
                <span className="text-slate-400">ROOM:</span>
                <span className="text-emerald-400">{roomCode}</span>
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* Status pill */}
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  gameState.status === 'ACTIVE'
                    ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                    : gameState.status === 'WAITING'
                    ? 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    gameState.status === 'ACTIVE'
                      ? 'bg-emerald-400 animate-pulse'
                      : gameState.status === 'WAITING'
                      ? 'bg-indigo-400 animate-ping'
                      : 'bg-slate-500'
                  }`}
                />
                <span>{gameState.status}</span>
              </div>
            </div>
          )}

          {/* Right Info: Connection Dot & Leave Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              {connected ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Wifi className="w-4 h-4" />
                  <span className="hidden md:inline font-medium">Connected</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 animate-pulse">
                  <WifiOff className="w-4 h-4" />
                  <span className="hidden md:inline font-medium">Reconnecting...</span>
                </span>
              )}
            </div>

            {roomCode && (
              <button
                onClick={leaveRoom}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800/80 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all"
                title="Leave room"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col justify-center">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-4 max-w-xl mx-auto w-full p-3 rounded-xl bg-rose-950/80 border border-rose-700/80 text-rose-200 text-xs sm:text-sm flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={clearError}
              className="ml-3 text-rose-400 hover:text-white text-xs font-bold uppercase"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Draw Offer Notification Banner */}
        {drawOffer && gameState.status === 'ACTIVE' && (
          <div className="mb-4 max-w-md mx-auto w-full p-3.5 rounded-2xl bg-indigo-950/90 border border-indigo-500 text-indigo-100 text-sm flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-indigo-400 animate-bounce" />
              <span>Opponent has offered a draw!</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={acceptDraw}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
              >
                Accept
              </button>
              <button
                onClick={declineDraw}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {!inGameView ? (
          /* Lobby / Waiting View */
          <div className="my-auto py-4 sm:py-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                Real-Time Chess Arena
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
                Play against friends anywhere in the world with instant synchronization, dynamic clocks, and authoritative server validation.
              </p>
            </div>

            <RoomLobby
              playerName={playerName}
              onUpdatePlayerName={updatePlayerName}
              roomCode={roomCode}
              gameStatus={gameState.status}
              onCreateRoom={createRoom}
              onJoinRoom={joinRoom}
              onLeaveRoom={leaveRoom}
              playerColor={playerColor}
            />
          </div>
        ) : (
          /* Active / Finished Game Arena */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Center: Board and Player Cards (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-3 max-w-[580px] mx-auto w-full">
              {/* Opponent Card (Top) */}
              <PlayerCard
                player={topPlayer}
                color={topColor}
                isCurrentTurn={gameState.turn === topColor && gameState.status === 'ACTIVE'}
                isLocalPlayer={false}
                timeMs={topClocks}
                capturedPieces={topCaptures}
                materialAdvantage={topAdvantage}
              />

              {/* Board */}
              <MultiplayerBoard
                fen={gameState.fen}
                chess={chess}
                playerColor={playerColor}
                isMyTurn={isMyTurn}
                gameStatus={gameState.status}
                isCheck={gameState.isCheck}
                lastMove={gameState.lastMove}
                onMakeMove={makeMove}
              />

              {/* Local Player Card (Bottom) */}
              <PlayerCard
                player={bottomPlayer}
                color={bottomColor}
                isCurrentTurn={gameState.turn === bottomColor && gameState.status === 'ACTIVE'}
                isLocalPlayer={true}
                timeMs={bottomClocks}
                capturedPieces={bottomCaptures}
                materialAdvantage={bottomAdvantage}
              />
            </div>

            {/* Right: Actions, Status, and Move History (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4 w-full h-full min-h-[480px]">
              {/* Turn Status Alert */}
              <div
                className={`p-4 rounded-2xl border text-center transition-all ${
                  gameState.isCheck
                    ? 'bg-rose-950/70 border-rose-600 text-rose-200 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : isMyTurn
                    ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs uppercase font-bold tracking-widest opacity-75 mb-0.5">
                  {gameState.isGameOver ? 'Match Concluded' : 'Active Turn'}
                </div>
                <div className="text-base sm:text-lg font-black tracking-tight">
                  {gameState.isGameOver
                    ? gameState.winReason || 'Game Finished'
                    : gameState.isCheck
                    ? isMyTurn
                      ? '⚠️ You are in Check!'
                      : 'Opponent is in Check!'
                    : isMyTurn
                    ? '✨ Your Turn to Move'
                    : "Opponent's Turn..."}
                </div>
              </div>

              {/* Move History Panel */}
              <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-slate-800/80 overflow-hidden min-h-[260px] max-h-[420px]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <ScrollText className="w-4 h-4 text-emerald-400" />
                    <span>Move Log ({history.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {history.length > 0 ? `Move ${Math.ceil(history.length / 2)}` : 'Starting position'}
                  </span>
                </div>

                <div
                  ref={moveScrollRef}
                  className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs select-text"
                >
                  {movePairs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-36 text-slate-500 text-xs">
                      <span>No moves made yet</span>
                    </div>
                  ) : (
                    movePairs.map((pair) => (
                      <div
                        key={pair.num}
                        className="grid grid-cols-12 py-1 px-2 rounded hover:bg-slate-800/40 transition-colors"
                      >
                        <span className="col-span-2 text-slate-500 font-bold">{pair.num}.</span>
                        <span className="col-span-5 text-slate-200 font-semibold">{pair.white}</span>
                        <span className="col-span-5 text-slate-300">{pair.black || ''}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* FEN snapshot */}
                <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/70 text-[10px] font-mono text-slate-500 truncate">
                  <span className="text-slate-400 font-semibold mr-1">FEN:</span>
                  <span title={gameState.fen}>{gameState.fen}</span>
                </div>
              </div>

              {/* In-Game Action Bar */}
              {gameState.status === 'ACTIVE' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOfferDraw}
                    disabled={drawOfferSent}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Handshake className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{drawOfferSent ? 'Draw Offered' : 'Offer Draw'}</span>
                  </button>

                  <button
                    onClick={handleResignClick}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                      showResignConfirm
                        ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 animate-pulse'
                        : 'bg-slate-900 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border-slate-800 hover:border-rose-800/70'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5 text-rose-400" />
                    <span>{showResignConfirm ? 'Confirm Resign?' : 'Resign'}</span>
                  </button>
                </div>
              )}

              {/* Rematch Button when game over */}
              {gameState.isGameOver && (
                <button
                  onClick={requestRematch}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Request Rematch</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Game End Modal */}
      <GameEndModal
        isOpen={gameState.isGameOver}
        winner={gameState.winner}
        winReason={gameState.winReason}
        playerColor={playerColor}
        whitePlayer={gameState.whitePlayer}
        blackPlayer={gameState.blackPlayer}
        onRequestRematch={requestRematch}
        onLeaveRoom={leaveRoom}
      />
    </div>
  );
}
