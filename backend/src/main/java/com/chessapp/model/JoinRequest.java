package com.chessapp.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public class JoinRequest {
    @JsonAlias({"playerId", "token"})
    private String playerToken;
    private String playerName;
    private PlayerColor preferredColor;
    private String action;

    public JoinRequest() {
    }

    public JoinRequest(String playerToken, String playerName, PlayerColor preferredColor) {
        this.playerToken = playerToken;
        this.playerName = playerName;
        this.preferredColor = preferredColor;
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

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public PlayerColor getPreferredColor() {
        return preferredColor;
    }

    public void setPreferredColor(PlayerColor preferredColor) {
        this.preferredColor = preferredColor;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
