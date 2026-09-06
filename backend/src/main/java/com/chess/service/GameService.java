package com.chess.service;

import com.chess.dto.*;
import com.chess.model.GameSession;
import com.chess.model.GameStatus;
import com.chess.model.PlayerColor;
import com.github.bhlangonijr.chesslib.Board;
import com.github.bhlangonijr.chesslib.Piece;
import com.github.bhlangonijr.chesslib.Side;
import com.github.bhlangonijr.chesslib.Square;
import com.github.bhlangonijr.chesslib.move.Move;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private static final Logger log = LoggerFactory.getLogger(GameService.class);
    private final Map<String, GameSession> games = new ConcurrentHashMap<>();

    public GameStateResponse createGame(CreateGameRequest request) {
        String gameId = UUID.randomUUID().toString();
        GameSession session = new GameSession(gameId);

        if (request != null && request.getFen() != null && !request.getFen().isBlank()) {
            session.getBoard().loadFromFen(request.getFen().trim());
        }

        String whiteName = (request != null && request.getWhitePlayerName() != null && !request.getWhitePlayerName().isBlank())
                ? request.getWhitePlayerName() : "White Player";
        String blackName = (request != null && request.getBlackPlayerName() != null && !request.getBlackPlayerName().isBlank())
                ? request.getBlackPlayerName() : "Black Player";

        session.setWhitePlayer(new PlayerDto("p_w_" + UUID.randomUUID().toString().substring(0, 8), whiteName, PlayerColor.WHITE, true));
        session.setBlackPlayer(new PlayerDto("p_b_" + UUID.randomUUID().toString().substring(0, 8), blackName, PlayerColor.BLACK, true));

        refreshCapturedPieces(session);
        updateGameStatus(session);

        games.put(gameId, session);
        log.info("Created new chess game session: {}", gameId);
        return toResponse(session);
    }

    public GameStateResponse getGame(String gameId) {
        GameSession session = findSessionOrThrow(gameId);
        return toResponse(session);
    }

    public List<GameStateResponse> getAllGames() {
        return games.values().stream().map(this::toResponse).toList();
    }

    public synchronized GameStateResponse executeMove(String gameId, MoveRequest request) {
        GameSession session = findSessionOrThrow(gameId);
        Board board = session.getBoard();

        if (session.getStatus() == GameStatus.CHECKMATE ||
            session.getStatus() == GameStatus.STALEMATE ||
            session.getStatus() == GameStatus.RESIGNED ||
            session.getStatus() == GameStatus.DRAW_INSUFFICIENT_MATERIAL ||
            session.getStatus() == GameStatus.DRAW_FIFTY_MOVES ||
            session.getStatus() == GameStatus.DRAW_REPETITION) {
            throw new IllegalStateException("Game is already finished.");
        }

        try {
            Square from = Square.fromValue(request.getFrom().toUpperCase());
            Square to = Square.fromValue(request.getTo().toUpperCase());
            Side currentSide = board.getSideToMove();

            Piece promotionPiece = Piece.NONE;
            if (request.getPromotion() != null && !request.getPromotion().isBlank()) {
                promotionPiece = resolvePromotionPiece(request.getPromotion(), currentSide);
            }

            final Piece finalPromo = promotionPiece;
            Move matchedLegalMove = board.legalMoves().stream()
                    .filter(m -> m.getFrom() == from && m.getTo() == to &&
                            (finalPromo == Piece.NONE || m.getPromotion() == finalPromo))
                    .findFirst()
                    .orElse(null);

            if (matchedLegalMove == null) {
                throw new IllegalArgumentException("Illegal move from " + request.getFrom() + " to " + request.getTo());
            }

            boolean success = board.doMove(matchedLegalMove);
            if (!success) {
                throw new IllegalArgumentException("Failed to execute move from " + request.getFrom() + " to " + request.getTo());
            }

            Move move = matchedLegalMove;

            // Create move record
            PlayerColor moveColor = (currentSide == Side.WHITE) ? PlayerColor.WHITE : PlayerColor.BLACK;
            int moveNumber = (session.getMoveHistory().size() / 2) + 1;
            String moveNotation = move.getSan() != null && !move.getSan().isBlank()
                    ? move.getSan()
                    : move.toString();

            MoveRecordDto record = new MoveRecordDto(
                    moveNumber,
                    moveColor,
                    request.getFrom().toLowerCase(),
                    request.getTo().toLowerCase(),
                    moveNotation,
                    board.getFen(),
                    System.currentTimeMillis()
            );

            session.getMoveHistory().add(record);
            session.setLastMove(record);
            session.setUpdatedAt(System.currentTimeMillis());

            refreshCapturedPieces(session);
            updateGameStatus(session);

            log.debug("Move executed in game {}: {} ({})", gameId, moveNotation, board.getFen());
            return toResponse(session);
        } catch (Exception e) {
            log.error("Failed to execute move in game {}: {}", gameId, e.getMessage());
            throw new IllegalArgumentException("Invalid or illegal move: " + e.getMessage(), e);
        }
    }

    public synchronized GameStateResponse resetGame(String gameId) {
        GameSession session = findSessionOrThrow(gameId);
        session.setBoard(new Board());
        session.getMoveHistory().clear();
        session.setLastMove(null);
        session.setWinner(null);
        session.setStatus(GameStatus.IN_PROGRESS);
        session.setCapturedWhitePieces(new ArrayList<>());
        session.setCapturedBlackPieces(new ArrayList<>());
        session.setUpdatedAt(System.currentTimeMillis());
        log.info("Reset game session {}", gameId);
        return toResponse(session);
    }

    public synchronized GameStateResponse resignGame(String gameId, GameActionRequest request) {
        GameSession session = findSessionOrThrow(gameId);
        session.setStatus(GameStatus.RESIGNED);

        if (request != null && request.getPreferredColor() != null) {
            session.setWinner(request.getPreferredColor() == PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE);
        } else {
            // Default winner is opponent of whose turn it is
            PlayerColor current = (session.getBoard().getSideToMove() == Side.WHITE) ? PlayerColor.WHITE : PlayerColor.BLACK;
            session.setWinner(current == PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE);
        }
        session.setUpdatedAt(System.currentTimeMillis());
        log.info("Game {} resigned. Winner: {}", gameId, session.getWinner());
        return toResponse(session);
    }

    public synchronized GameStateResponse joinGame(String gameId, GameActionRequest request) {
        GameSession session = findSessionOrThrow(gameId);
        if (request != null) {
            String name = request.getPlayerName() != null ? request.getPlayerName() : "Player";
            String id = request.getPlayerId() != null ? request.getPlayerId() : UUID.randomUUID().toString();
            PlayerColor color = request.getPreferredColor();

            if (color == PlayerColor.WHITE || (color == null && session.getWhitePlayer() == null)) {
                session.setWhitePlayer(new PlayerDto(id, name, PlayerColor.WHITE, true));
            } else {
                session.setBlackPlayer(new PlayerDto(id, name, PlayerColor.BLACK, true));
            }
            session.setUpdatedAt(System.currentTimeMillis());
        }
        return toResponse(session);
    }

    private void updateGameStatus(GameSession session) {
        Board board = session.getBoard();
        if (board.isMated()) {
            session.setStatus(GameStatus.CHECKMATE);
            // Side to move is mated; opposing side won
            session.setWinner(board.getSideToMove() == Side.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE);
        } else if (board.isStaleMate()) {
            session.setStatus(GameStatus.STALEMATE);
        } else if (board.isInsufficientMaterial()) {
            session.setStatus(GameStatus.DRAW_INSUFFICIENT_MATERIAL);
        } else if (board.isRepetition()) {
            session.setStatus(GameStatus.DRAW_REPETITION);
        } else if (board.isDraw()) {
            session.setStatus(GameStatus.DRAW_FIFTY_MOVES);
        } else if (board.isKingAttacked()) {
            session.setStatus(GameStatus.CHECK);
        } else {
            session.setStatus(GameStatus.IN_PROGRESS);
        }
    }

    private void refreshCapturedPieces(GameSession session) {
        Board board = session.getBoard();
        Map<Piece, Integer> currentCounts = new EnumMap<>(Piece.class);
        for (Piece p : board.boardToArray()) {
            if (p != Piece.NONE) {
                currentCounts.put(p, currentCounts.getOrDefault(p, 0) + 1);
            }
        }

        // Captured White pieces (lost by White)
        List<String> capturedWhite = new ArrayList<>();
        addMissingPieces(capturedWhite, "P", 8 - currentCounts.getOrDefault(Piece.WHITE_PAWN, 0));
        addMissingPieces(capturedWhite, "N", 2 - currentCounts.getOrDefault(Piece.WHITE_KNIGHT, 0));
        addMissingPieces(capturedWhite, "B", 2 - currentCounts.getOrDefault(Piece.WHITE_BISHOP, 0));
        addMissingPieces(capturedWhite, "R", 2 - currentCounts.getOrDefault(Piece.WHITE_ROOK, 0));
        addMissingPieces(capturedWhite, "Q", 1 - currentCounts.getOrDefault(Piece.WHITE_QUEEN, 0));
        session.setCapturedWhitePieces(capturedWhite);

        // Captured Black pieces (lost by Black)
        List<String> capturedBlack = new ArrayList<>();
        addMissingPieces(capturedBlack, "p", 8 - currentCounts.getOrDefault(Piece.BLACK_PAWN, 0));
        addMissingPieces(capturedBlack, "n", 2 - currentCounts.getOrDefault(Piece.BLACK_KNIGHT, 0));
        addMissingPieces(capturedBlack, "b", 2 - currentCounts.getOrDefault(Piece.BLACK_BISHOP, 0));
        addMissingPieces(capturedBlack, "r", 2 - currentCounts.getOrDefault(Piece.BLACK_ROOK, 0));
        addMissingPieces(capturedBlack, "q", 1 - currentCounts.getOrDefault(Piece.BLACK_QUEEN, 0));
        session.setCapturedBlackPieces(capturedBlack);
    }

    private void addMissingPieces(List<String> list, String symbol, int count) {
        for (int i = 0; i < count; i++) {
            list.add(symbol);
        }
    }

    private Piece resolvePromotionPiece(String promo, Side side) {
        String p = promo.toLowerCase();
        if (side == Side.WHITE) {
            return switch (p) {
                case "r" -> Piece.WHITE_ROOK;
                case "b" -> Piece.WHITE_BISHOP;
                case "n" -> Piece.WHITE_KNIGHT;
                default -> Piece.WHITE_QUEEN;
            };
        } else {
            return switch (p) {
                case "r" -> Piece.BLACK_ROOK;
                case "b" -> Piece.BLACK_BISHOP;
                case "n" -> Piece.BLACK_KNIGHT;
                default -> Piece.BLACK_QUEEN;
            };
        }
    }

    private GameSession findSessionOrThrow(String gameId) {
        GameSession session = games.get(gameId);
        if (session == null) {
            throw new NoSuchElementException("Game session not found with ID: " + gameId);
        }
        return session;
    }

    public GameStateResponse toResponse(GameSession session) {
        GameStateResponse res = new GameStateResponse();
        Board board = session.getBoard();

        res.setGameId(session.getGameId());
        res.setFen(board.getFen());
        res.setStatus(session.getStatus());
        res.setSideToMove(board.getSideToMove() == Side.WHITE ? PlayerColor.WHITE : PlayerColor.BLACK);
        res.setWhitePlayer(session.getWhitePlayer());
        res.setBlackPlayer(session.getBlackPlayer());
        res.setMoveHistory(new ArrayList<>(session.getMoveHistory()));
        res.setLastMove(session.getLastMove());
        res.setInCheck(board.isKingAttacked());
        res.setInCheckmate(board.isMated());
        res.setInDraw(board.isDraw());
        res.setInStalemate(board.isStaleMate());
        res.setWinner(session.getWinner());
        res.setCapturedWhitePieces(session.getCapturedWhitePieces());
        res.setCapturedBlackPieces(session.getCapturedBlackPieces());
        res.setHalfMoveClock(board.getHalfMoveCounter() != null ? board.getHalfMoveCounter() : 0);
        res.setFullMoveNumber(board.getMoveCounter() != null ? board.getMoveCounter() : 1);
        res.setCreatedAt(session.getCreatedAt());
        res.setUpdatedAt(session.getUpdatedAt());

        return res;
    }
}
