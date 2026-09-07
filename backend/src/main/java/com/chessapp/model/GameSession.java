package com.chessapp.model;

import com.github.bhlangonijr.chesslib.Board;
import com.github.bhlangonijr.chesslib.Piece;
import com.github.bhlangonijr.chesslib.Side;
import com.github.bhlangonijr.chesslib.Square;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GameSession {
    private final Board board;
    private final List<MoveRecord> moveHistory;
    private String lastMove;
    private MoveRecord lastMoveRecord;
    private String result;
    private String terminationReason;
    private PlayerColor winner;
    private String drawOfferedBy;

    public GameSession() {
        this.board = new Board();
        this.moveHistory = new ArrayList<>();
        this.result = "*";
    }

    public Board getBoard() {
        return board;
    }

    public List<MoveRecord> getMoveHistory() {
        return Collections.unmodifiableList(moveHistory);
    }

    public void addMove(MoveRecord record) {
        moveHistory.add(record);
        this.lastMoveRecord = record;
        this.lastMove = record.getFrom() + record.getTo();
    }

    public void addMove(MoveRecord record, String uciMove) {
        moveHistory.add(record);
        this.lastMoveRecord = record;
        this.lastMove = uciMove != null ? uciMove : (record.getFrom() + record.getTo());
    }

    public String getLastMove() {
        return lastMove;
    }

    public void setLastMove(String lastMove) {
        this.lastMove = lastMove;
    }

    public MoveRecord getLastMoveRecord() {
        return lastMoveRecord;
    }

    public void setLastMoveRecord(MoveRecord lastMoveRecord) {
        this.lastMoveRecord = lastMoveRecord;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getTerminationReason() {
        return terminationReason;
    }

    public void setTerminationReason(String terminationReason) {
        this.terminationReason = terminationReason;
    }

    public PlayerColor getWinner() {
        return winner;
    }

    public void setWinner(PlayerColor winner) {
        this.winner = winner;
    }

    public String getDrawOfferedBy() {
        return drawOfferedBy;
    }

    public void setDrawOfferedBy(String drawOfferedBy) {
        this.drawOfferedBy = drawOfferedBy;
    }

    public PlayerColor getSideToMove() {
        return board.getSideToMove() == Side.WHITE ? PlayerColor.WHITE : PlayerColor.BLACK;
    }

    public boolean isWhiteTurn() {
        return board.getSideToMove() == Side.WHITE;
    }

    public List<String> getCapturedWhitePieces() {
        return calculateCapturedPieces(Side.WHITE);
    }

    public List<String> getCapturedBlackPieces() {
        return calculateCapturedPieces(Side.BLACK);
    }

    private List<String> calculateCapturedPieces(Side side) {
        Map<String, Integer> startingCounts = new HashMap<>();
        if (side == Side.WHITE) {
            startingCounts.put("P", 8);
            startingCounts.put("N", 2);
            startingCounts.put("B", 2);
            startingCounts.put("R", 2);
            startingCounts.put("Q", 1);
        } else {
            startingCounts.put("p", 8);
            startingCounts.put("n", 2);
            startingCounts.put("b", 2);
            startingCounts.put("r", 2);
            startingCounts.put("q", 1);
        }

        Map<String, Integer> currentCounts = new HashMap<>();
        for (Square sq : Square.values()) {
            if (sq == Square.NONE) continue;
            Piece p = board.getPiece(sq);
            if (p != null && p != Piece.NONE && p.getPieceSide() == side) {
                String symbol = p.getFenSymbol();
                currentCounts.put(symbol, currentCounts.getOrDefault(symbol, 0) + 1);
            }
        }

        List<String> captured = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : startingCounts.entrySet()) {
            String symbol = entry.getKey();
            int initial = entry.getValue();
            int current = currentCounts.getOrDefault(symbol, 0);
            int diff = initial - current;
            for (int i = 0; i < diff; i++) {
                captured.add(symbol.toUpperCase());
            }
        }
        return captured;
    }
}
