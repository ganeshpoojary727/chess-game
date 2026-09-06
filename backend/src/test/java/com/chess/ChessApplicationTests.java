package com.chess;

import com.chess.dto.CreateGameRequest;
import com.chess.dto.GameStateResponse;
import com.chess.dto.MoveRequest;
import com.chess.model.GameStatus;
import com.chess.model.PlayerColor;
import com.chess.service.GameService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ChessApplicationTests {

    @Autowired
    private GameService gameService;

    @Test
    void contextLoads() {
        assertNotNull(gameService);
    }

    @Test
    @DisplayName("Should create a new chess game with default start position")
    void testCreateGame() {
        GameStateResponse game = gameService.createGame(new CreateGameRequest("Alice", "Bob", null));

        assertNotNull(game.getGameId());
        assertTrue(game.getFen().startsWith("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"));
        assertEquals(GameStatus.IN_PROGRESS, game.getStatus());
        assertEquals(PlayerColor.WHITE, game.getSideToMove());
        assertEquals("Alice", game.getWhitePlayer().getName());
        assertEquals("Bob", game.getBlackPlayer().getName());
        assertTrue(game.getMoveHistory().isEmpty());
    }

    @Test
    @DisplayName("Should execute valid moves and alternate turns")
    void testExecuteValidMoves() {
        GameStateResponse game = gameService.createGame(null);
        String gameId = game.getGameId();

        // 1. e2 -> e4
        GameStateResponse state1 = gameService.executeMove(gameId, new MoveRequest("e2", "e4", null, null));
        assertEquals(PlayerColor.BLACK, state1.getSideToMove());
        assertEquals(1, state1.getMoveHistory().size());
        assertEquals("e2e4", state1.getLastMove().getSan());
        assertFalse(state1.isInCheck());

        // 1... e7 -> e5
        GameStateResponse state2 = gameService.executeMove(gameId, new MoveRequest("e7", "e5", null, null));
        assertEquals(PlayerColor.WHITE, state2.getSideToMove());
        assertEquals(2, state2.getMoveHistory().size());
        assertEquals("e7e5", state2.getLastMove().getSan());
    }

    @Test
    @DisplayName("Should reject illegal moves")
    void testRejectIllegalMove() {
        GameStateResponse game = gameService.createGame(null);
        String gameId = game.getGameId();

        // Illegal move: pawn e2 cannot jump to e5 immediately
        assertThrows(IllegalArgumentException.class, () ->
                gameService.executeMove(gameId, new MoveRequest("e2", "e5", null, null))
        );
    }

    @Test
    @DisplayName("Should detect Fool's Mate checkmate correctly")
    void testDetectCheckmate() {
        GameStateResponse game = gameService.createGame(null);
        String gameId = game.getGameId();

        // Fool's Mate:
        // 1. f2-f3 e7-e5
        // 2. g2-g4 d8-h4#
        gameService.executeMove(gameId, new MoveRequest("f2", "f3", null, null));
        gameService.executeMove(gameId, new MoveRequest("e7", "e5", null, null));
        gameService.executeMove(gameId, new MoveRequest("g2", "g4", null, null));
        GameStateResponse finalState = gameService.executeMove(gameId, new MoveRequest("d8", "h4", null, null));

        assertEquals(GameStatus.CHECKMATE, finalState.getStatus());
        assertTrue(finalState.isInCheckmate());
        assertEquals(PlayerColor.BLACK, finalState.getWinner());
    }

    @Test
    @DisplayName("Should reset game to start position")
    void testResetGame() {
        GameStateResponse game = gameService.createGame(null);
        String gameId = game.getGameId();

        gameService.executeMove(gameId, new MoveRequest("e2", "e4", null, null));
        GameStateResponse resetState = gameService.resetGame(gameId);

        assertTrue(resetState.getFen().startsWith("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"));
        assertEquals(GameStatus.IN_PROGRESS, resetState.getStatus());
        assertEquals(PlayerColor.WHITE, resetState.getSideToMove());
        assertTrue(resetState.getMoveHistory().isEmpty());
    }
}
