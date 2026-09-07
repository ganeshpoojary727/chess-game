package com.chessapp.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public class ResignRequest {
    @JsonAlias({"playerId", "token"})
    private String playerToken;
    private String action; // RESIGN

    public ResignRequest() {
    }

    public ResignRequest(String playerToken) {
        this.playerToken = playerToken;
        this.action = "RESIGN";
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
