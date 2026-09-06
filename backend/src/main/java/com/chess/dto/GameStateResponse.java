package com.chess.dto;

import com.chess.model.GameStatus;
import com.chess.model.PlayerColor;
import java.util.ArrayList;
import java.util.List;

public class GameStateResponse {
    private String gameId;
    private String fen;
    private GameStatus status;
    private PlayerColor sideToMove;
    private PlayerDto whitePlayer;
    private PlayerDto blackPlayer;
    private List<MoveRecordDto> moveHistory = new ArrayList<>();
    private MoveRecordDto lastMove;
    private boolean inCheck;
    private boolean inCheckmate;
    private boolean inDraw;
    private boolean inStalemate;
    private PlayerColor winner;
    private List<String> capturedWhitePieces = new ArrayList<>();
    private List<String> capturedBlackPieces = new ArrayList<>();
    private int halfMoveClock;
    private int fullMoveNumber;
    private long createdAt;
    private long updatedAt;

    public GameStateResponse() {
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getFen() {
        return fen;
    }

    public void setFen(String fen) {
        this.fen = fen;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public PlayerColor getSideToMove() {
        return sideToMove;
    }

    public void setSideToMove(PlayerColor sideToMove) {
        this.sideToMove = sideToMove;
    }

    public PlayerDto getWhitePlayer() {
        return whitePlayer;
    }

    public void setWhitePlayer(PlayerDto whitePlayer) {
        this.whitePlayer = whitePlayer;
    }

    public PlayerDto getBlackPlayer() {
        return blackPlayer;
    }

    public void setBlackPlayer(PlayerDto blackPlayer) {
        this.blackPlayer = blackPlayer;
    }

    public List<MoveRecordDto> getMoveHistory() {
        return moveHistory;
    }

    public void setMoveHistory(List<MoveRecordDto> moveHistory) {
        this.moveHistory = moveHistory;
    }

    public MoveRecordDto getLastMove() {
        return lastMove;
    }

    public void setLastMove(MoveRecordDto lastMove) {
        this.lastMove = lastMove;
    }

    public boolean isInCheck() {
        return inCheck;
    }

    public void setInCheck(boolean inCheck) {
        this.inCheck = inCheck;
    }

    public boolean isInCheckmate() {
        return inCheckmate;
    }

    public void setInCheckmate(boolean inCheckmate) {
        this.inCheckmate = inCheckmate;
    }

    public boolean isInDraw() {
        return inDraw;
    }

    public void setInDraw(boolean inDraw) {
        this.inDraw = inDraw;
    }

    public boolean isInStalemate() {
        return inStalemate;
    }

    public void setInStalemate(boolean inStalemate) {
        this.inStalemate = inStalemate;
    }

    public PlayerColor getWinner() {
        return winner;
    }

    public void setWinner(PlayerColor winner) {
        this.winner = winner;
    }

    public List<String> getCapturedWhitePieces() {
        return capturedWhitePieces;
    }

    public void setCapturedWhitePieces(List<String> capturedWhitePieces) {
        this.capturedWhitePieces = capturedWhitePieces;
    }

    public List<String> getCapturedBlackPieces() {
        return capturedBlackPieces;
    }

    public void setCapturedBlackPieces(List<String> capturedBlackPieces) {
        this.capturedBlackPieces = capturedBlackPieces;
    }

    public int getHalfMoveClock() {
        return halfMoveClock;
    }

    public void setHalfMoveClock(int halfMoveClock) {
        this.halfMoveClock = halfMoveClock;
    }

    public int getFullMoveNumber() {
        return fullMoveNumber;
    }

    public void setFullMoveNumber(int fullMoveNumber) {
        this.fullMoveNumber = fullMoveNumber;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(long updatedAt) {
        this.updatedAt = updatedAt;
    }
}
