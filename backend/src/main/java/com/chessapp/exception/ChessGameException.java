package com.chessapp.exception;

public class ChessGameException extends RuntimeException {
    private final String errorCode;

    public ChessGameException(String message) {
        super(message);
        this.errorCode = "BAD_REQUEST";
    }

    public ChessGameException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
