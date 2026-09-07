package com.chessapp.service;

import com.chessapp.exception.ChessGameException;
import com.chessapp.model.DrawRequest;
import com.chessapp.model.GameSession;
import com.chessapp.model.GameStateMessage;
import com.chessapp.model.JoinRequest;
import com.chessapp.model.MoveRecord;
import com.chessapp.model.MoveRequest;
import com.chessapp.model.Player;
import com.chessapp.model.PlayerColor;
import com.chessapp.model.ResignRequest;
import com.chessapp.model.Room;
import com.chessapp.model.RoomStatus;
import com.chessapp.model.TimeControl;
import com.github.bhlangonijr.chesslib.Board;
import com.github.bhlangonijr.chesslib.Piece;
import com.github.bhlangonijr.chesslib.Side;
import com.github.bhlangonijr.chesslib.Square;
import com.github.bhlangonijr.chesslib.move.Move;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class GameEngineService {
    private static final Logger logger = LoggerFactory.getLogger(GameEngineService.class);

    private final RoomManager roomManager;
    private final SimpMessagingTemplate messagingTemplate;

    public GameEngineService(RoomManager roomManager, SimpMessagingTemplate messagingTemplate) {
        this.roomManager = roomManager;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Handles a player joining a room.
     */
    public GameStateMessage handleJoin(String roomCode, JoinRequest request) {
        Room room = roomManager.getRoomOrThrow(roomCode);
        synchronized (room) {
            room.updateActivity();

            String token = request.getPlayerToken();
            if (token == null || token.trim().isEmpty()) {
                token = UUID.randomUUID().toString();
                request.setPlayerToken(token);
            }

            String playerName = request.getPlayerName() != null && !request.getPlayerName().trim().isEmpty()
                    ? request.getPlayerName().trim()
                    : "Player " + token.substring(0, Math.min(token.length(), 6));

            // Check if player is reconnecting with existing token
            Player existing = room.getPlayerByToken(token);
            if (existing != null) {
                existing.setConnected(true);
                existing.setName(playerName);
                logger.info("Player {} reconnected to room {}", playerName, roomCode);
                broadcastGameState(room);
                return GameStateMessage.fromRoom(room);
            }

            // If game is completed, allow joining only as spectator / view state
            if (room.getStatus() == RoomStatus.COMPLETED) {
                return GameStateMessage.fromRoom(room);
            }

            TimeControl tc = room.getTimeControl();
            long initialMillis = tc.getInitialMillis();

            // Assign side based on availability and preference
            if (room.getWhitePlayer() == null && room.getBlackPlayer() == null) {
                // First player to join
                if (request.getPreferredColor() == PlayerColor.BLACK) {
                    room.setBlackPlayer(new Player(token, playerName, PlayerColor.BLACK, initialMillis));
                } else {
                    room.setWhitePlayer(new Player(token, playerName, PlayerColor.WHITE, initialMillis));
                }
            } else if (room.getWhitePlayer() == null) {
                room.setWhitePlayer(new Player(token, playerName, PlayerColor.WHITE, initialMillis));
            } else if (room.getBlackPlayer() == null) {
                room.setBlackPlayer(new Player(token, playerName, PlayerColor.BLACK, initialMillis));
            } else {
                // Room is full for players
                logger.info("Room {} full, player {} joined as spectator", roomCode, playerName);
                return GameStateMessage.fromRoom(room);
            }

            // If both players have joined, activate game
            if (room.getWhitePlayer() != null && room.getBlackPlayer() != null && room.getStatus() == RoomStatus.WAITING) {
                room.setStatus(RoomStatus.ACTIVE);
                room.setLastMoveTimestamp(System.currentTimeMillis());
                logger.info("Room {} is now ACTIVE with both players connected", roomCode);
            }

            broadcastGameState(room);
            return GameStateMessage.fromRoom(room);
        }
    }

    /**
     * Server-authoritative move processing. Validates turn, legality, deductions, and evaluations.
     */
    public GameStateMessage handleMove(String roomCode, MoveRequest request) {
        Room room = roomManager.getRoomOrThrow(roomCode);
        synchronized (room) {
            room.updateActivity();

            try {
                if (room.getStatus() != RoomStatus.ACTIVE) {
                    throw new ChessGameException("GAME_NOT_ACTIVE", "Game is not active (current status: " + room.getStatus() + ")");
                }

                String token = request.getPlayerToken();
                Player player = room.getPlayerByToken(token);
                if (player == null) {
                    throw new ChessGameException("UNAUTHORIZED", "Invalid player token for room " + roomCode);
                }

                GameSession session = room.getSession();
                Board board = session.getBoard();
                Side sideToMove = board.getSideToMove();
                PlayerColor activeColor = (sideToMove == Side.WHITE) ? PlayerColor.WHITE : PlayerColor.BLACK;

                if (player.getColor() != activeColor) {
                    throw new ChessGameException("NOT_YOUR_TURN", "It is not your turn. Current turn: " + activeColor);
                }

                long now = System.currentTimeMillis();

                // Deduct clock time for active player
                if (room.getLastMoveTimestamp() != null) {
                    long elapsed = now - room.getLastMoveTimestamp();
                    long remainingTime = player.getRemainingTimeMillis() - elapsed;

                    if (remainingTime <= 0) {
                        player.setRemainingTimeMillis(0);
                        room.setStatus(RoomStatus.COMPLETED);
                        Player opponent = room.getOpponent(player);
                        session.setWinner(opponent != null ? opponent.getColor() : null);
                        session.setTerminationReason("TIMEOUT");
                        session.setResult(opponent != null && opponent.getColor() == PlayerColor.WHITE ? "1-0" : "0-1");
                        broadcastGameState(room);
                        throw new ChessGameException("TIMEOUT", "Time expired for " + player.getColor());
                    }

                    // Apply increment
                    player.setRemainingTimeMillis(remainingTime + room.getTimeControl().getIncrementMillis());
                }

                // Parse move squares
                Square fromSquare;
                Square toSquare;
                try {
                    fromSquare = Square.fromValue(request.getFrom().trim().toUpperCase());
                    toSquare = Square.fromValue(request.getTo().trim().toUpperCase());
                } catch (Exception e) {
                    throw new ChessGameException("INVALID_SQUARE", "Invalid square coordinates: " + request.getFrom() + " -> " + request.getTo());
                }

                if (fromSquare == Square.NONE || toSquare == Square.NONE) {
                    throw new ChessGameException("INVALID_SQUARE", "Square coordinate out of bounds");
                }

                // Resolve promotion piece if applicable
                Piece promoPiece = parsePromotionPiece(request.getPromotion(), sideToMove);
                Move move;

                if (promoPiece != null && promoPiece != Piece.NONE) {
                    move = new Move(fromSquare, toSquare, promoPiece);
                } else {
                    Move simpleMove = new Move(fromSquare, toSquare);
                    if (board.legalMoves().contains(simpleMove)) {
                        move = simpleMove;
                    } else {
                        // Check if it's a promotion move defaulting to Queen
                        Piece defaultQueen = (sideToMove == Side.WHITE) ? Piece.WHITE_QUEEN : Piece.BLACK_QUEEN;
                        Move promoQueenMove = new Move(fromSquare, toSquare, defaultQueen);
                        if (board.legalMoves().contains(promoQueenMove)) {
                            move = promoQueenMove;
                        } else {
                            move = simpleMove; // Will fail legality check below
                        }
                    }
                }

                // Move legality check
                if (!board.legalMoves().contains(move)) {
                    throw new ChessGameException("ILLEGAL_MOVE", "Move " + request.getFrom() + request.getTo() + " is illegal");
                }

                // Execute move on chesslib board
                String sanNotation = move.getSan() != null ? move.getSan() : (request.getFrom() + request.getTo());
                board.doMove(move);

                // Record move history
                String uciMove = move.toString().toLowerCase();
                MoveRecord record = new MoveRecord(
                        board.getMoveCounter(),
                        player.getColor(),
                        request.getFrom().toLowerCase(),
                        request.getTo().toLowerCase(),
                        sanNotation,
                        board.getFen(),
                        now
                );
                session.addMove(record, uciMove);
                session.setDrawOfferedBy(null); // Clear any pending draw offer on move
                room.setLastMoveTimestamp(now);

                // State evaluation after move
                if (board.isMated()) {
                    room.setStatus(RoomStatus.COMPLETED);
                    session.setWinner(player.getColor());
                    session.setTerminationReason("CHECKMATE");
                    session.setResult(player.getColor() == PlayerColor.WHITE ? "1-0" : "0-1");
                    logger.info("Game in room {} ended by CHECKMATE. Winner: {}", roomCode, player.getColor());
                } else if (board.isStaleMate()) {
                    room.setStatus(RoomStatus.COMPLETED);
                    session.setWinner(null);
                    session.setTerminationReason("STALEMATE");
                    session.setResult("1/2-1/2");
                    logger.info("Game in room {} ended by STALEMATE", roomCode);
                } else if (board.isDraw()) {
                    room.setStatus(RoomStatus.COMPLETED);
                    session.setWinner(null);
                    session.setResult("1/2-1/2");
                    if (board.isInsufficientMaterial()) {
                        session.setTerminationReason("INSUFFICIENT_MATERIAL");
                    } else if (board.isRepetition()) {
                        session.setTerminationReason("THREEFOLD_REPETITION");
                    } else {
                        session.setTerminationReason("FIFTY_MOVES");
                    }
                    logger.info("Game in room {} ended by {}", roomCode, session.getTerminationReason());
                }

                broadcastGameState(room);
                return GameStateMessage.fromRoom(room);

            } catch (ChessGameException e) {
                sendError(request.getPlayerToken(), e.getMessage());
                throw e;
            } catch (Exception e) {
                logger.error("Unexpected error handling move in room " + roomCode, e);
                sendError(request.getPlayerToken(), "Internal move processing error: " + e.getMessage());
                throw new ChessGameException("INTERNAL_ERROR", e.getMessage());
            }
        }
    }

    /**
     * Handles resignation by a player.
     */
    public GameStateMessage handleResign(String roomCode, ResignRequest request) {
        Room room = roomManager.getRoomOrThrow(roomCode);
        synchronized (room) {
            room.updateActivity();
            if (room.getStatus() != RoomStatus.ACTIVE) {
                throw new ChessGameException("GAME_NOT_ACTIVE", "Cannot resign a game that is not active");
            }

            Player resigningPlayer = room.getPlayerByToken(request.getPlayerToken());
            if (resigningPlayer == null) {
                throw new ChessGameException("UNAUTHORIZED", "Invalid player token");
            }

            Player opponent = room.getOpponent(resigningPlayer);
            GameSession session = room.getSession();
            room.setStatus(RoomStatus.COMPLETED);
            session.setWinner(opponent != null ? opponent.getColor() : null);
            session.setTerminationReason("RESIGNATION");
            session.setResult(opponent != null && opponent.getColor() == PlayerColor.WHITE ? "1-0" : "0-1");

            logger.info("Player {} resigned in room {}", resigningPlayer.getColor(), roomCode);
            broadcastGameState(room);
            return GameStateMessage.fromRoom(room);
        }
    }

    /**
     * Handles draw offers, acceptance, and decline.
     */
    public GameStateMessage handleDraw(String roomCode, DrawRequest request) {
        Room room = roomManager.getRoomOrThrow(roomCode);
        synchronized (room) {
            room.updateActivity();
            if (room.getStatus() != RoomStatus.ACTIVE) {
                throw new ChessGameException("GAME_NOT_ACTIVE", "Cannot offer/accept draw in an inactive game");
            }

            Player player = room.getPlayerByToken(request.getPlayerToken());
            if (player == null) {
                throw new ChessGameException("UNAUTHORIZED", "Invalid player token");
            }

            GameSession session = room.getSession();
            String action = request.getAction() != null ? request.getAction().toUpperCase() : "OFFER";

            if ("OFFER".equals(action)) {
                session.setDrawOfferedBy(player.getPlayerId());
                logger.info("Player {} offered a draw in room {}", player.getColor(), roomCode);
            } else if ("ACCEPT".equals(action)) {
                if (session.getDrawOfferedBy() == null || session.getDrawOfferedBy().equals(player.getPlayerId())) {
                    throw new ChessGameException("NO_DRAW_OFFER", "No valid draw offer to accept");
                }
                room.setStatus(RoomStatus.COMPLETED);
                session.setWinner(null);
                session.setTerminationReason("MUTUAL_AGREEMENT");
                session.setResult("1/2-1/2");
                session.setDrawOfferedBy(null);
                logger.info("Draw offer accepted in room {}", roomCode);
            } else if ("DECLINE".equals(action)) {
                session.setDrawOfferedBy(null);
                logger.info("Draw offer declined in room {}", roomCode);
            }

            broadcastGameState(room);
            return GameStateMessage.fromRoom(room);
        }
    }

    /**
     * Resets the game session in a room.
     */
    public GameStateMessage handleReset(String roomCode) {
        Room room = roomManager.getRoomOrThrow(roomCode);
        synchronized (room) {
            room.updateActivity();
            room.setSession(new GameSession());
            long initialMillis = room.getTimeControl().getInitialMillis();
            if (room.getWhitePlayer() != null) {
                room.getWhitePlayer().setRemainingTimeMillis(initialMillis);
            }
            if (room.getBlackPlayer() != null) {
                room.getBlackPlayer().setRemainingTimeMillis(initialMillis);
            }
            if (room.getWhitePlayer() != null && room.getBlackPlayer() != null) {
                room.setStatus(RoomStatus.ACTIVE);
                room.setLastMoveTimestamp(System.currentTimeMillis());
            } else {
                room.setStatus(RoomStatus.WAITING);
                room.setLastMoveTimestamp(null);
            }
            broadcastGameState(room);
            return GameStateMessage.fromRoom(room);
        }
    }

    /**
     * Broadcasts the authoritative game state to all subscribed clients across both
     * /topic/room/{code} and /topic/game/{code}.
     */
    public void broadcastGameState(Room room) {
        GameStateMessage message = GameStateMessage.fromRoom(room);
        String roomTopic = "/topic/room/" + room.getRoomCode();
        String gameTopic = "/topic/game/" + room.getRoomCode();
        messagingTemplate.convertAndSend(roomTopic, message);
        messagingTemplate.convertAndSend(gameTopic, message);
    }

    /**
     * Sends error messages directly to the player's private error queue.
     */
    public void sendError(String playerToken, String errorMessage) {
        if (playerToken == null || playerToken.isEmpty()) return;
        Map<String, String> payload = Map.of("error", errorMessage, "message", errorMessage);
        messagingTemplate.convertAndSend("/queue/errors-" + playerToken, payload);
        messagingTemplate.convertAndSend("/queue/errors", payload);
    }

    /**
     * Background scheduled task running every second to inspect active rooms and enforce clock timeouts.
     */
    @Scheduled(fixedRate = 1000)
    public void enforceClockTimeouts() {
        long now = System.currentTimeMillis();
        for (Room room : roomManager.getAllRooms().values()) {
            if (room.getStatus() != RoomStatus.ACTIVE) continue;
            synchronized (room) {
                if (room.getStatus() != RoomStatus.ACTIVE || room.getLastMoveTimestamp() == null) continue;

                Side sideToMove = room.getSession().getBoard().getSideToMove();
                Player activePlayer = (sideToMove == Side.WHITE) ? room.getWhitePlayer() : room.getBlackPlayer();

                if (activePlayer != null) {
                    long elapsed = now - room.getLastMoveTimestamp();
                    long remaining = activePlayer.getRemainingTimeMillis() - elapsed;

                    if (remaining <= 0) {
                        activePlayer.setRemainingTimeMillis(0);
                        room.setStatus(RoomStatus.COMPLETED);
                        Player opponent = room.getOpponent(activePlayer);
                        room.getSession().setWinner(opponent != null ? opponent.getColor() : null);
                        room.getSession().setTerminationReason("TIMEOUT");
                        room.getSession().setResult(opponent != null && opponent.getColor() == PlayerColor.WHITE ? "1-0" : "0-1");
                        logger.info("Room {} clock expired for {}. Game completed by TIMEOUT.", room.getRoomCode(), activePlayer.getColor());
                        broadcastGameState(room);
                    }
                }
            }
        }
    }

    private Piece parsePromotionPiece(String promo, Side side) {
        if (promo == null || promo.trim().isEmpty()) {
            return Piece.NONE;
        }
        String p = promo.trim().toLowerCase();
        switch (p) {
            case "q":
            case "queen":
                return side == Side.WHITE ? Piece.WHITE_QUEEN : Piece.BLACK_QUEEN;
            case "r":
            case "rook":
                return side == Side.WHITE ? Piece.WHITE_ROOK : Piece.BLACK_ROOK;
            case "b":
            case "bishop":
                return side == Side.WHITE ? Piece.WHITE_BISHOP : Piece.BLACK_BISHOP;
            case "n":
            case "knight":
                return side == Side.WHITE ? Piece.WHITE_KNIGHT : Piece.BLACK_KNIGHT;
            default:
                return Piece.NONE;
        }
    }
}
