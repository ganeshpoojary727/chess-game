package com.chess.dto;

public class CreateGameRequest {
    private String whitePlayerName;
    private String blackPlayerName;
    private String fen;

    public CreateGameRequest() {
    }

    public CreateGameRequest(String whitePlayerName, String blackPlayerName, String fen) {
        this.whitePlayerName = whitePlayerName;
        this.blackPlayerName = blackPlayerName;
        this.fen = fen;
    }

    public String getWhitePlayerName() {
        return whitePlayerName;
    }

    public void setWhitePlayerName(String whitePlayerName) {
        this.whitePlayerName = whitePlayerName;
    }

    public String getBlackPlayerName() {
        return blackPlayerName;
    }

    public void setBlackPlayerName(String blackPlayerName) {
        this.blackPlayerName = blackPlayerName;
    }

    public String getFen() {
        return fen;
    }

    public void setFen(String fen) {
        this.fen = fen;
    }
}
