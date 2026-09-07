package com.chessapp.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public class MoveRequest {
    @JsonAlias({"playerId", "token"})
    private String playerToken;
    private String from;
    private String to;
    private String promotion;

    public MoveRequest() {
    }

    public MoveRequest(String playerToken, String from, String to, String promotion) {
        this.playerToken = playerToken;
        this.from = from;
        this.to = to;
        this.promotion = promotion;
    }

    public String getPlayerToken() {
        return playerToken;
    }

    public void setPlayerToken(String playerToken) {
        this.playerToken = playerToken;
    }

    // Frontend compatibility getter & setter
    public String getPlayerId() {
        return playerToken;
    }

    public void setPlayerId(String playerId) {
        this.playerToken = playerId;
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
}
