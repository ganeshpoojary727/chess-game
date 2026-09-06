package com.chess.model;

public enum GameStatus {
    WAITING_FOR_PLAYERS,
    IN_PROGRESS,
    CHECK,
    CHECKMATE,
    STALEMATE,
    DRAW_INSUFFICIENT_MATERIAL,
    DRAW_FIFTY_MOVES,
    DRAW_REPETITION,
    RESIGNED
}
