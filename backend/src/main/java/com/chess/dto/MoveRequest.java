package com.chess.dto;

public class MoveRequest {
    private String from;
    private String to;
    private String promotion;
    private String playerId;

    public MoveRequest() {
    }

    public MoveRequest(String from, String to, String promotion, String playerId) {
        this.from = from;
        this.to = to;
        this.promotion = promotion;
        this.playerId = playerId;
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

    public String getPromotion() {
        return promotion;
    }

    public void setPromotion(String promotion) {
        this.promotion = promotion;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
}
