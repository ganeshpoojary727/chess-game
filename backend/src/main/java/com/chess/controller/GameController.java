package com.chess.controller;

import com.chess.dto.CreateGameRequest;
import com.chess.dto.GameStateResponse;
import com.chess.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/games")
    public ResponseEntity<GameStateResponse> createGame(@RequestBody(required = false) CreateGameRequest request) {
        GameStateResponse response = gameService.createGame(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/games/{gameId}")
    public ResponseEntity<GameStateResponse> getGame(@PathVariable String gameId) {
        GameStateResponse response = gameService.getGame(gameId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/games")
    public ResponseEntity<List<GameStateResponse>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "chess-backend",
                "timestamp", Instant.now().toString()
        ));
    }
}
