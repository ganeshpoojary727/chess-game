package com.chessapp;

import com.chessapp.exception.ChessGameException;
import com.chessapp.model.DrawRequest;
import com.chessapp.model.GameStateMessage;
import com.chessapp.model.JoinRequest;
import com.chessapp.model.MoveRequest;
import com.chessapp.model.PlayerColor;
import com.chessapp.model.ResignRequest;
import com.chessapp.model.Room;
import com.chessapp.model.RoomStatus;
import com.chessapp.model.TimeControl;
import com.chessapp.service.GameEngineService;
import com.chessapp.service.RoomManager;
import com.github.bhlangonijr.chesslib.Piece;
import com.github.bhlangonijr.chesslib.Square;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;

class GameEngineServiceTest {

    private RoomManager roomManager;
    private SimpMessagingTemplate messagingTemplate;
    private GameEngineService gameEngineService;

    @BeforeEach
    void setUp() {
        roomManager = new RoomManager();
        messagingTemplate = Mockito.mock(SimpMessagingTemplate.class);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Object.class));
        gameEngineService = new GameEngineService(roomManager, messagingTemplate);
    }

    @Test
    @DisplayName("Room codes are 6 chars and exclude confusing characters (0, O, 1, I)")
    void testRoomCodeGeneration() {
        for (int i = 0; i < 50; i++) {
            Room room = roomManager.createRoom(new TimeControl(5, 3));
            String code = room.getRoomCode();
            assertEquals(6, code.length());
            assertFalse(code.contains("0"));
            assertFalse(code.contains("O"));
            assertFalse(code.contains("1"));
            assertFalse(code.contains("I"));
        }
    }

    @Test
    @DisplayName("Two players join, room transitions from WAITING to ACTIVE")
    void testPlayerJoiningAndActivation() {
        Room room = roomManager.createRoom(new TimeControl(10, 0));
        assertEquals(RoomStatus.WAITING, room.getStatus());

        // Player 1 joins
        JoinRequest join1 = new JoinRequest("token-white", "Alice", PlayerColor.WHITE);
        gameEngineService.handleJoin(room.getRoomCode(), join1);

        assertEquals(RoomStatus.WAITING, room.getStatus());
        assertNotNull(room.getWhitePlayer());
        assertEquals("Alice", room.getWhitePlayer().getName());
        assertEquals(600000L, room.getWhitePlayer().getRemainingTimeMillis());

        // Player 2 joins
        JoinRequest join2 = new JoinRequest("token-black", "Bob", PlayerColor.BLACK);
        gameEngineService.handleJoin(room.getRoomCode(), join2);

        assertEquals(RoomStatus.ACTIVE, room.getStatus());
        assertNotNull(room.getBlackPlayer());
        assertEquals("Bob", room.getBlackPlayer().getName());
        assertNotNull(room.getLastMoveTimestamp());
    }

    @Test
    @DisplayName("Standard legal moves update board, turn, clock and move history")
    void testStandardLegalMoves() {
        Room room = setupActiveGame(10, 5);

        // White moves e2 -> e4
        MoveRequest move1 = new MoveRequest("token-white", "e2", "e4", null);
        GameStateMessage state1 = gameEngineService.handleMove(room.getRoomCode(), move1);

        assertEquals(PlayerColor.BLACK, state1.getTurn());
        assertEquals("e2e4", state1.getLastMove());
        assertEquals(1, state1.getMoveHistory().size());
        assertEquals(RoomStatus.ACTIVE, state1.getStatus());

        // Black moves e7 -> e5
        MoveRequest move2 = new MoveRequest("token-black", "e7", "e5", null);
        GameStateMessage state2 = gameEngineService.handleMove(room.getRoomCode(), move2);

        assertEquals(PlayerColor.WHITE, state2.getTurn());
        assertEquals("e7e5", state2.getLastMove());
        assertEquals(2, state2.getMoveHistory().size());
    }

    @Test
    @DisplayName("Enforce turn authorization: player cannot move out of turn")
    void testTurnAuthorizationViolation() {
        Room room = setupActiveGame(10, 0);

        // Black attempts to move first
        MoveRequest badMove = new MoveRequest("token-black", "e7", "e5", null);
        ChessGameException ex = assertThrows(ChessGameException.class, () ->
                gameEngineService.handleMove(room.getRoomCode(), badMove));

        assertEquals("NOT_YOUR_TURN", ex.getErrorCode());

        // White moves e2 -> e4
        gameEngineService.handleMove(room.getRoomCode(), new MoveRequest("token-white", "e2", "e4", null));

        // White attempts to move again
        MoveRequest whiteDoubleMove = new MoveRequest("token-white", "e4", "e5", null);
        ChessGameException ex2 = assertThrows(ChessGameException.class, () ->
                gameEngineService.handleMove(room.getRoomCode(), whiteDoubleMove));

        assertEquals("NOT_YOUR_TURN", ex2.getErrorCode());
    }

    @Test
    @DisplayName("Illegal move rejected and state preserved")
    void testIllegalMoveRejection() {
        Room room = setupActiveGame(10, 0);

        // White attempts illegal move: pawn jumps sideways e2 -> d3 without capture
        MoveRequest illegalMove = new MoveRequest("token-white", "e2", "d3", null);
        ChessGameException ex = assertThrows(ChessGameException.class, () ->
                gameEngineService.handleMove(room.getRoomCode(), illegalMove));

        assertEquals("ILLEGAL_MOVE", ex.getErrorCode());
        assertEquals(PlayerColor.WHITE, room.getSession().getSideToMove());
        assertEquals(0, room.getSession().getMoveHistory().size());
    }

    @Test
    @DisplayName("Scholar's Mate triggers checkmate and game completion")
    void testScholarsMateCheckmate() {
        Room room = setupActiveGame(10, 0);
        String code = room.getRoomCode();

        // 1. e4 e5
        gameEngineService.handleMove(code, new MoveRequest("token-white", "e2", "e4", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "e7", "e5", null));

        // 2. Qh5 Nc6
        gameEngineService.handleMove(code, new MoveRequest("token-white", "d1", "h5", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "b8", "c6", null));

        // 3. Bc4 Nf6
        gameEngineService.handleMove(code, new MoveRequest("token-white", "f1", "c4", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "g8", "f6", null));

        // 4. Qxf7# (Checkmate)
        GameStateMessage finalState = gameEngineService.handleMove(code, new MoveRequest("token-white", "h5", "f7", null));

        assertTrue(finalState.isCheckmate());
        assertTrue(finalState.isCheck());
        assertEquals(RoomStatus.COMPLETED, finalState.getStatus());
        assertEquals(PlayerColor.WHITE, finalState.getWinner());
        assertEquals("CHECKMATE", finalState.getTerminationReason());
    }

    @Test
    @DisplayName("Clock expiry marks game completed by TIMEOUT")
    void testClockTimeout() {
        Room room = setupActiveGame(1, 0);
        String code = room.getRoomCode();

        // Artificially advance the last move timestamp past White's 1-minute limit
        room.setLastMoveTimestamp(System.currentTimeMillis() - 70000L); // 70 seconds ago

        MoveRequest move = new MoveRequest("token-white", "e2", "e4", null);
        ChessGameException ex = assertThrows(ChessGameException.class, () ->
                gameEngineService.handleMove(code, move));

        assertEquals("TIMEOUT", ex.getErrorCode());
        assertEquals(RoomStatus.COMPLETED, room.getStatus());
        assertEquals(PlayerColor.BLACK, room.getSession().getWinner());
        assertEquals("TIMEOUT", room.getSession().getTerminationReason());
    }

    @Test
    @DisplayName("Resignation immediately ends game in favor of opponent")
    void testResignation() {
        Room room = setupActiveGame(10, 0);
        String code = room.getRoomCode();

        ResignRequest resign = new ResignRequest("token-black");
        GameStateMessage state = gameEngineService.handleResign(code, resign);

        assertEquals(RoomStatus.COMPLETED, state.getStatus());
        assertEquals(PlayerColor.WHITE, state.getWinner());
        assertEquals("RESIGNATION", state.getTerminationReason());
    }

    @Test
    @DisplayName("Mutual draw offer and acceptance ends game peacefully")
    void testMutualDraw() {
        Room room = setupActiveGame(10, 0);
        String code = room.getRoomCode();

        // White offers draw
        DrawRequest offer = new DrawRequest("token-white", "OFFER");
        GameStateMessage offerState = gameEngineService.handleDraw(code, offer);
        assertEquals("token-white", offerState.getDrawOfferedBy());
        assertEquals(RoomStatus.ACTIVE, offerState.getStatus());

        // Black accepts draw
        DrawRequest accept = new DrawRequest("token-black", "ACCEPT");
        GameStateMessage acceptState = gameEngineService.handleDraw(code, accept);
        assertEquals(RoomStatus.COMPLETED, acceptState.getStatus());
        assertTrue(acceptState.isDraw());
        assertNull(acceptState.getWinner());
        assertEquals("MUTUAL_AGREEMENT", acceptState.getTerminationReason());
    }

    @Test
    @DisplayName("Kingside Castling is executed legally")
    void testCastling() {
        Room room = setupActiveGame(10, 0);
        String code = room.getRoomCode();

        // 1. e4 e5
        gameEngineService.handleMove(code, new MoveRequest("token-white", "e2", "e4", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "e7", "e5", null));

        // 2. Nf3 Nc6
        gameEngineService.handleMove(code, new MoveRequest("token-white", "g1", "f3", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "b8", "c6", null));

        // 3. Bc4 Bc5
        gameEngineService.handleMove(code, new MoveRequest("token-white", "f1", "c4", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "f8", "c5", null));

        // 4. White castles kingside: e1 -> g1
        GameStateMessage castleState = gameEngineService.handleMove(code, new MoveRequest("token-white", "e1", "g1", null));

        assertEquals("e1g1", castleState.getLastMove());
        assertEquals(Piece.WHITE_KING, room.getSession().getBoard().getPiece(Square.G1));
        assertEquals(Piece.WHITE_ROOK, room.getSession().getBoard().getPiece(Square.F1));
    }

    @Test
    @DisplayName("Pinned piece cannot move if it exposes King to check")
    void testPinnedPieceIllegality() {
        Room room = setupActiveGame(10, 0);
        String code = room.getRoomCode();

        // 1. e4 e5
        gameEngineService.handleMove(code, new MoveRequest("token-white", "e2", "e4", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "e7", "e5", null));

        // 2. d4 exd4
        gameEngineService.handleMove(code, new MoveRequest("token-white", "d2", "d4", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "e5", "d4", null));

        // 3. Qe2 (Pinning Black's e-file pawn/pieces to e8 King)
        gameEngineService.handleMove(code, new MoveRequest("token-white", "d1", "e2", null));

        // Black plays d7-d6
        gameEngineService.handleMove(code, new MoveRequest("token-black", "d7", "d6", null));

        // 4. Bg5 Be7
        gameEngineService.handleMove(code, new MoveRequest("token-white", "c1", "g5", null));
        gameEngineService.handleMove(code, new MoveRequest("token-black", "f8", "e7", null));

        // Black's bishop on e7 is now shielding King on e8 from White Queen on e2
        // White plays a3
        gameEngineService.handleMove(code, new MoveRequest("token-white", "a2", "a3", null));

        // Black attempts to move pinned bishop on e7 away to d6 (exposing e8 King to e2 Queen)
        MoveRequest pinnedMove = new MoveRequest("token-black", "e7", "d6", null);
        ChessGameException ex = assertThrows(ChessGameException.class, () ->
                gameEngineService.handleMove(code, pinnedMove));

        assertEquals("ILLEGAL_MOVE", ex.getErrorCode());
    }

    @Test
    @DisplayName("Pawn promotion to Knight is honored when requested")
    void testPawnPromotion() {
        Room room = setupActiveGame(10, 0);
        String code = room.getRoomCode();

        // Set board FEN right before pawn promotion: White pawn on e7, Black King on h8, White King on h1
        room.getSession().getBoard().loadFromFen("7k/4P3/8/8/8/8/8/7K w - - 0 1");

        // White promotes e7 to e8 as Knight ("n")
        MoveRequest promoRequest = new MoveRequest("token-white", "e7", "e8", "n");
        GameStateMessage state = gameEngineService.handleMove(code, promoRequest);

        assertEquals("e7e8n", state.getLastMove());
        assertEquals(Piece.WHITE_KNIGHT, room.getSession().getBoard().getPiece(Square.E8));
        assertEquals(PlayerColor.BLACK, state.getTurn());
    }

    private Room setupActiveGame(int minutes, int increment) {
        Room room = roomManager.createRoom(new TimeControl(minutes, increment));
        gameEngineService.handleJoin(room.getRoomCode(), new JoinRequest("token-white", "Alice", PlayerColor.WHITE));
        gameEngineService.handleJoin(room.getRoomCode(), new JoinRequest("token-black", "Bob", PlayerColor.BLACK));
        return room;
    }
}
