package com.chessapp.controller;

import com.chessapp.model.GameStateMessage;
import com.chessapp.model.Room;
import com.chessapp.model.TimeControl;
import com.chessapp.service.RoomManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RoomController {

    private final RoomManager roomManager;

    public RoomController(RoomManager roomManager) {
        this.roomManager = roomManager;
    }

    public static class CreateRoomPayload {
        private Integer initialMinutes = 10;
        private Integer incrementSeconds = 0;
        private String roomCode;

        public Integer getInitialMinutes() {
            return initialMinutes != null ? initialMinutes : 10;
        }

        public void setInitialMinutes(Integer initialMinutes) {
            this.initialMinutes = initialMinutes;
        }

        public Integer getIncrementSeconds() {
            return incrementSeconds != null ? incrementSeconds : 0;
        }

        public void setIncrementSeconds(Integer incrementSeconds) {
            this.incrementSeconds = incrementSeconds;
        }

        public String getRoomCode() {
            return roomCode;
        }

        public void setRoomCode(String roomCode) {
            this.roomCode = roomCode;
        }
    }

    @PostMapping({"/rooms", "/games"})
    public ResponseEntity<GameStateMessage> createRoom(@RequestBody(required = false) CreateRoomPayload payload) {
        int initialMinutes = (payload != null && payload.getInitialMinutes() != null) ? payload.getInitialMinutes() : 10;
        int incrementSeconds = (payload != null && payload.getIncrementSeconds() != null) ? payload.getIncrementSeconds() : 0;
        TimeControl timeControl = new TimeControl(initialMinutes, incrementSeconds);

        Room room;
        if (payload != null && payload.getRoomCode() != null && !payload.getRoomCode().trim().isEmpty()) {
            room = roomManager.createRoomWithCode(payload.getRoomCode().trim(), timeControl);
        } else {
            room = roomManager.createRoom(timeControl);
        }

        return ResponseEntity.ok(GameStateMessage.fromRoom(room));
    }

    @GetMapping({"/rooms/{roomCode}", "/games/{roomCode}"})
    public ResponseEntity<GameStateMessage> getRoom(@PathVariable String roomCode) {
        Room room = roomManager.getRoomOrThrow(roomCode);
        return ResponseEntity.ok(GameStateMessage.fromRoom(room));
    }

    @GetMapping({"/rooms", "/games"})
    public ResponseEntity<Map<String, Object>> listRooms() {
        Map<String, Object> response = new HashMap<>();
        response.put("activeRoomsCount", roomManager.getActiveRoomCount());
        response.put("rooms", roomManager.getAllRooms().keySet());
        return ResponseEntity.ok(response);
    }
}
