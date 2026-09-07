package com.chessapp.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public class DrawRequest {
    @JsonAlias({"playerId", "token"})
    private String playerToken;
    private String action; // OFFER, ACCEPT, DECLINE

    public DrawRequest() {
    }

    public DrawRequest(String playerToken, String action) {
        this.playerToken = playerToken;
        this.action = action;
    }

    public String getPlayerToken() {
        return playerToken;
    }

    public void setPlayerToken(String playerToken) {
        this.playerToken = playerToken;
    }

    public String getPlayerId() {
        return playerToken;
    }

    public void setPlayerId(String playerId) {
        this.playerToken = playerId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
