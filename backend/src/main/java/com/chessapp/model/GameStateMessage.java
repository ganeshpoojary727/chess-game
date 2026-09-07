package com.chessapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class GameStateMessage {
    private String roomCode;
    private String gameId;
    private String fen;
    private String lastMove;
    private MoveRecord lastMoveRecord;
    private PlayerColor turn;
    private PlayerColor sideToMove;

    @JsonProperty("isCheck")
    private boolean isCheck;
    private boolean inCheck;

    @JsonProperty("isCheckmate")
    private boolean isCheckmate;
    private boolean inCheckmate;

    @JsonProperty("isDraw")
    private boolean isDraw;
    private boolean inDraw;

    private boolean inStalemate;

    private long whiteTime;
    private long blackTime;

    private RoomStatus status;
    private Player whitePlayer;
    private Player blackPlayer;
    private PlayerColor winner;
    private String terminationReason;
    private String drawOfferedBy;

    private List<MoveRecord> moveHistory;
    private List<String> capturedWhitePieces;
    private List<String> capturedBlackPieces;
    private int halfMoveClock;
    private int fullMoveNumber;
    private long updatedAt;

    public GameStateMessage() {
    }

    public static GameStateMessage fromRoom(Room room) {
        GameStateMessage msg = new GameStateMessage();
        msg.setRoomCode(room.getRoomCode());
        msg.setGameId(room.getRoomCode());

        GameSession session = room.getSession();
        if (session != null) {
            String fen = session.getBoard().getFen();
            msg.setFen(fen);
            msg.setLastMove(session.getLastMove());
            msg.setLastMoveRecord(session.getLastMoveRecord());
            msg.setTurn(session.getSideToMove());
            msg.setSideToMove(session.getSideToMove());

            boolean check = session.getBoard().isKingAttacked();
            msg.setCheck(check);
            msg.setInCheck(check);

            boolean mated = session.getBoard().isMated();
            msg.setCheckmate(mated);
            msg.setInCheckmate(mated);

            boolean stale = session.getBoard().isStaleMate();
            msg.setInStalemate(stale);

            boolean draw = session.getBoard().isDraw() 
                    || stale 
                    || "MUTUAL_AGREEMENT".equals(session.getTerminationReason()) 
                    || "1/2-1/2".equals(session.getResult());
            msg.setDraw(draw);
            msg.setInDraw(draw);

            msg.setWinner(session.getWinner());
            msg.setTerminationReason(session.getTerminationReason());
            msg.setDrawOfferedBy(session.getDrawOfferedBy());
            msg.setMoveHistory(session.getMoveHistory());
            msg.setCapturedWhitePieces(session.getCapturedWhitePieces());
            msg.setCapturedBlackPieces(session.getCapturedBlackPieces());
            msg.setHalfMoveClock(session.getBoard().getHalfMoveCounter());
            msg.setFullMoveNumber(session.getBoard().getMoveCounter());
        }

        msg.setStatus(room.getStatus());
        msg.setWhitePlayer(room.getWhitePlayer());
        msg.setBlackPlayer(room.getBlackPlayer());

        if (room.getWhitePlayer() != null) {
            msg.setWhiteTime(room.getWhitePlayer().getRemainingTimeMillis());
        }
        if (room.getBlackPlayer() != null) {
            msg.setBlackTime(room.getBlackPlayer().getRemainingTimeMillis());
        }

        msg.setUpdatedAt(System.currentTimeMillis());
        return msg;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
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

    public PlayerColor getTurn() {
        return turn;
    }

    public void setTurn(PlayerColor turn) {
        this.turn = turn;
    }

    public PlayerColor getSideToMove() {
        return sideToMove;
    }

    public void setSideToMove(PlayerColor sideToMove) {
        this.sideToMove = sideToMove;
    }

    public boolean isCheck() {
        return isCheck;
    }

    public void setCheck(boolean check) {
        isCheck = check;
    }

    public boolean isInCheck() {
        return inCheck;
    }

    public void setInCheck(boolean inCheck) {
        this.inCheck = inCheck;
    }

    public boolean isCheckmate() {
        return isCheckmate;
    }

    public void setCheckmate(boolean checkmate) {
        isCheckmate = checkmate;
    }

    public boolean isInCheckmate() {
        return inCheckmate;
    }

    public void setInCheckmate(boolean inCheckmate) {
        this.inCheckmate = inCheckmate;
    }

    public boolean isDraw() {
        return isDraw;
    }

    public void setDraw(boolean draw) {
        isDraw = draw;
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

    public long getWhiteTime() {
        return whiteTime;
    }

    public void setWhiteTime(long whiteTime) {
        this.whiteTime = whiteTime;
    }

    public long getBlackTime() {
        return blackTime;
    }

    public void setBlackTime(long blackTime) {
        this.blackTime = blackTime;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public Player getWhitePlayer() {
        return whitePlayer;
    }

    public void setWhitePlayer(Player whitePlayer) {
        this.whitePlayer = whitePlayer;
    }

    public Player getBlackPlayer() {
        return blackPlayer;
    }

    public void setBlackPlayer(Player blackPlayer) {
        this.blackPlayer = blackPlayer;
    }

    public PlayerColor getWinner() {
        return winner;
    }

    public void setWinner(PlayerColor winner) {
        this.winner = winner;
    }

    public String getTerminationReason() {
        return terminationReason;
    }

    public void setTerminationReason(String terminationReason) {
        this.terminationReason = terminationReason;
    }

    public String getDrawOfferedBy() {
        return drawOfferedBy;
    }

    public void setDrawOfferedBy(String drawOfferedBy) {
        this.drawOfferedBy = drawOfferedBy;
    }

    public List<MoveRecord> getMoveHistory() {
        return moveHistory;
    }

    public void setMoveHistory(List<MoveRecord> moveHistory) {
        this.moveHistory = moveHistory;
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

    public long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(long updatedAt) {
        this.updatedAt = updatedAt;
    }
}
