package com.chess.dto;

import com.chess.model.PlayerColor;

public class PlayerDto {
    private String id;
    private String name;
    private PlayerColor color;
    private boolean connected;

    public PlayerDto() {
    }

    public PlayerDto(String id, String name, PlayerColor color, boolean connected) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.connected = connected;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public boolean isConnected() {
        return connected;
    }

    public void setConnected(boolean connected) {
        this.connected = connected;
    }
}
