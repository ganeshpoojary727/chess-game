package com.chessapp.controller;

import com.chessapp.model.DrawRequest;
import com.chessapp.model.JoinRequest;
import com.chessapp.model.MoveRequest;
import com.chessapp.model.ResignRequest;
import com.chessapp.service.GameEngineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {
    private static final Logger logger = LoggerFactory.getLogger(GameWebSocketController.class);

    private final GameEngineService gameEngineService;

    public GameWebSocketController(GameEngineService gameEngineService) {
        this.gameEngineService = gameEngineService;
    }

    @MessageMapping({"/room/{roomCode}/join", "/game/{roomCode}/join"})
    public void joinRoom(@DestinationVariable String roomCode, @Payload JoinRequest request) {
        logger.info("Received join request for room: {}", roomCode);
        gameEngineService.handleJoin(roomCode, request);
    }

    @MessageMapping({"/room/{roomCode}/move", "/game/{roomCode}/move"})
    public void processMove(@DestinationVariable String roomCode, @Payload MoveRequest request) {
        logger.info("Received move request for room: {} ({} -> {})", roomCode, request.getFrom(), request.getTo());
        gameEngineService.handleMove(roomCode, request);
    }

    @MessageMapping({"/room/{roomCode}/resign", "/game/{roomCode}/resign"})
    public void processResign(@DestinationVariable String roomCode, @Payload ResignRequest request) {
        logger.info("Received resign request for room: {}", roomCode);
        gameEngineService.handleResign(roomCode, request);
    }

    @MessageMapping({"/room/{roomCode}/draw", "/game/{roomCode}/draw"})
    public void processDraw(@DestinationVariable String roomCode, @Payload DrawRequest request) {
        logger.info("Received draw action for room: {} (action: {})", roomCode, request.getAction());
        gameEngineService.handleDraw(roomCode, request);
    }

    @MessageMapping({"/room/{roomCode}/reset", "/game/{roomCode}/reset"})
    public void processReset(@DestinationVariable String roomCode) {
        logger.info("Received reset request for room: {}", roomCode);
        gameEngineService.handleReset(roomCode);
    }
}
