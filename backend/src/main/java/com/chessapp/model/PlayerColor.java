package com.chessapp.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PlayerColor {
    WHITE,
    BLACK;

    @JsonCreator
    public static PlayerColor fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim().toUpperCase();
        if (trimmed.equals("W") || trimmed.equals("WHITE")) {
            return WHITE;
        }
        if (trimmed.equals("B") || trimmed.equals("BLACK")) {
            return BLACK;
        }
        return null;
    }
}
