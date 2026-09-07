package com.chessapp.model;

public class MoveRecord {
    private int moveNumber;
    private PlayerColor color;
    private String from;
    private String to;
    private String san;
    private String fenAfter;
    private long timestamp;

    public MoveRecord() {
    }

    public MoveRecord(int moveNumber, PlayerColor color, String from, String to, String san, String fenAfter, long timestamp) {
        this.moveNumber = moveNumber;
        this.color = color;
        this.from = from;
        this.to = to;
        this.san = san;
        this.fenAfter = fenAfter;
        this.timestamp = timestamp;
    }

    public int getMoveNumber() {
        return moveNumber;
    }

    public void setMoveNumber(int moveNumber) {
        this.moveNumber = moveNumber;
    }

    public PlayerColor getColor() {
        return color;
    }

    public void setColor(PlayerColor color) {
        this.color = color;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSan() {
        return san;
    }

    public void setSan(String san) {
        this.san = san;
    }

    public String getFenAfter() {
        return fenAfter;
    }

    public void setFenAfter(String fenAfter) {
        this.fenAfter = fenAfter;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
