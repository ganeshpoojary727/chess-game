package com.chess.controller;

import com.chess.dto.GameActionRequest;
import com.chess.dto.GameStateResponse;
import com.chess.dto.MoveRequest;
import com.chess.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class GameWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(GameWebSocketController.class);

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    public GameWebSocketController(GameService gameService, SimpMessagingTemplate messagingTemplate) {
        this.gameService = gameService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/game/{gameId}/move")
    public void handleMove(@DestinationVariable String gameId, MoveRequest request) {
        log.info("Received move for game {}: {}->{}", gameId, request.getFrom(), request.getTo());
        GameStateResponse state = gameService.executeMove(gameId, request);
        messagingTemplate.convertAndSend("/topic/game/" + gameId, state);
    }

    @MessageMapping("/game/{gameId}/join")
    public void handleJoin(@DestinationVariable String gameId, GameActionRequest request) {
        log.info("Received join for game {}: {}", gameId, request.getPlayerName());
        GameStateResponse state = gameService.joinGame(gameId, request);
        messagingTemplate.convertAndSend("/topic/game/" + gameId, state);
    }

    @MessageMapping("/game/{gameId}/reset")
    public void handleReset(@DestinationVariable String gameId) {
        log.info("Received reset for game {}", gameId);
        GameStateResponse state = gameService.resetGame(gameId);
        messagingTemplate.convertAndSend("/topic/game/" + gameId, state);
    }

    @MessageMapping("/game/{gameId}/resign")
    public void handleResign(@DestinationVariable String gameId, GameActionRequest request) {
        log.info("Received resign for game {}", gameId);
        GameStateResponse state = gameService.resignGame(gameId, request);
        messagingTemplate.convertAndSend("/topic/game/" + gameId, state);
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public Map<String, Object> handleException(Exception ex) {
        log.warn("WebSocket processing error: {}", ex.getMessage());
        return Map.of(
                "error", "OPERATION_FAILED",
                "message", ex.getMessage() != null ? ex.getMessage() : "Unknown error occurred",
                "timestamp", System.currentTimeMillis()
        );
    }
}
