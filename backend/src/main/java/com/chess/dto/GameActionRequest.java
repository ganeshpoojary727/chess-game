package com.chess.dto;

import com.chess.model.PlayerColor;

public class GameActionRequest {
    private String action; // JOIN, RESET, RESIGN
    private String playerId;
    private String playerName;
    private PlayerColor preferredColor;

    public GameActionRequest() {
    }

    public GameActionRequest(String action, String playerId, String playerName, PlayerColor preferredColor) {
        this.action = action;
        this.playerId = playerId;
        this.playerName = playerName;
        this.preferredColor = preferredColor;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
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
}
