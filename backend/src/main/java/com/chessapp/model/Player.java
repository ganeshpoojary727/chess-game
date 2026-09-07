package com.chessapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Player {
    @JsonProperty("playerId")
    private String playerId;
    private String name;
    private PlayerColor color;
    private long remainingTimeMillis;
    private boolean connected;

    public Player() {
    }

    public Player(String playerId, String name, PlayerColor color, long remainingTimeMillis) {
        this.playerId = playerId;
        this.name = name;
        this.color = color;
        this.remainingTimeMillis = remainingTimeMillis;
        this.connected = true;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    // Convenience alias for frontend compatibility
    public String getId() {
        return playerId;
    }

    public void setId(String id) {
        this.playerId = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PlayerColor getColor() {
        return color;
    }

    public void setColor(PlayerColor color) {
        this.color = color;
    }

    public long getRemainingTimeMillis() {
        return remainingTimeMillis;
    }

    public void setRemainingTimeMillis(long remainingTimeMillis) {
        this.remainingTimeMillis = remainingTimeMillis;
    }

    public boolean isConnected() {
        return connected;
    }

    public void setConnected(boolean connected) {
        this.connected = connected;
    }
}
