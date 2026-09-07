package com.chessapp.model;

public class Room {
    private final String roomCode;
    private Player whitePlayer;
    private Player blackPlayer;
    private GameSession session;
    private RoomStatus status;
    private TimeControl timeControl;
    private Long lastMoveTimestamp;
    private long lastActivityTimestamp;

    public Room(String roomCode, TimeControl timeControl) {
        this.roomCode = roomCode;
        this.timeControl = timeControl != null ? timeControl : new TimeControl(10, 0);
        this.session = new GameSession();
        this.status = RoomStatus.WAITING;
        this.lastActivityTimestamp = System.currentTimeMillis();
    }

    public String getRoomCode() {
        return roomCode;
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

    public GameSession getSession() {
        return session;
    }

    public void setSession(GameSession session) {
        this.session = session;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public TimeControl getTimeControl() {
        return timeControl;
    }

    public void setTimeControl(TimeControl timeControl) {
        this.timeControl = timeControl;
    }

    public Long getLastMoveTimestamp() {
        return lastMoveTimestamp;
    }

    public void setLastMoveTimestamp(Long lastMoveTimestamp) {
        this.lastMoveTimestamp = lastMoveTimestamp;
    }

    public long getLastActivityTimestamp() {
        return lastActivityTimestamp;
    }

    public void setLastActivityTimestamp(long lastActivityTimestamp) {
        this.lastActivityTimestamp = lastActivityTimestamp;
    }

    public void updateActivity() {
        this.lastActivityTimestamp = System.currentTimeMillis();
    }

    public Player getPlayerByToken(String token) {
        if (token == null) return null;
        if (whitePlayer != null && token.equals(whitePlayer.getPlayerId())) {
            return whitePlayer;
        }
        if (blackPlayer != null && token.equals(blackPlayer.getPlayerId())) {
            return blackPlayer;
        }
        return null;
    }

    public Player getOpponent(Player player) {
        if (player == null) return null;
        if (player == whitePlayer) return blackPlayer;
        if (player == blackPlayer) return whitePlayer;
        return null;
    }

    public Player getPlayerByColor(PlayerColor color) {
        if (color == PlayerColor.WHITE) return whitePlayer;
        if (color == PlayerColor.BLACK) return blackPlayer;
        return null;
    }
}
