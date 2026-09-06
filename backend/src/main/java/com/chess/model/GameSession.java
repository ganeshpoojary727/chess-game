package com.chess.model;

import com.chess.dto.MoveRecordDto;
import com.chess.dto.PlayerDto;
import com.github.bhlangonijr.chesslib.Board;
import java.util.ArrayList;
import java.util.List;

public class GameSession {
    private String gameId;
    private Board board;
    private GameStatus status;
    private PlayerDto whitePlayer;
    private PlayerDto blackPlayer;
    private List<MoveRecordDto> moveHistory = new ArrayList<>();
    private MoveRecordDto lastMove;
    private PlayerColor winner;
    private List<String> capturedWhitePieces = new ArrayList<>();
    private List<String> capturedBlackPieces = new ArrayList<>();
    private long createdAt;
    private long updatedAt;

    public GameSession() {
        this.board = new Board();
        this.status = GameStatus.IN_PROGRESS;
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    public GameSession(String gameId) {
        this();
        this.gameId = gameId;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
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
