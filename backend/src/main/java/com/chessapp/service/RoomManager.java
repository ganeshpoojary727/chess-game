package com.chessapp.service;

import com.chessapp.exception.ChessGameException;
import com.chessapp.model.Room;
import com.chessapp.model.TimeControl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomManager {
    private static final Logger logger = LoggerFactory.getLogger(RoomManager.class);

    // Cryptographically secure character pool excluding ambiguous characters: 0, O, 1, I
    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;
    private static final long INACTIVITY_TIMEOUT_MILLIS = 15 * 60 * 1000L; // 15 minutes

    private final Map<String, Room> rooms = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public Room createRoom(TimeControl timeControl) {
        String code = generateUniqueRoomCode();
        Room room = new Room(code, timeControl);
        rooms.put(code, room);
        logger.info("Created new chess room with code: {}", code);
        return room;
    }

    public Room createRoomWithCode(String code, TimeControl timeControl) {
        String normalizedCode = code.trim().toUpperCase();
        if (rooms.containsKey(normalizedCode)) {
            throw new ChessGameException("ROOM_EXISTS", "Room code already in use: " + normalizedCode);
        }
        Room room = new Room(normalizedCode, timeControl);
        rooms.put(normalizedCode, room);
        logger.info("Created chess room with custom code: {}", normalizedCode);
        return room;
    }

    public Optional<Room> getRoom(String roomCode) {
        if (roomCode == null) return Optional.empty();
        return Optional.ofNullable(rooms.get(roomCode.trim().toUpperCase()));
    }

    public Room getRoomOrThrow(String roomCode) {
        return getRoom(roomCode).orElseThrow(() ->
                new ChessGameException("ROOM_NOT_FOUND", "Room not found: " + roomCode));
    }

    public boolean removeRoom(String roomCode) {
        if (roomCode == null) return false;
        Room removed = rooms.remove(roomCode.trim().toUpperCase());
        if (removed != null) {
            logger.info("Removed chess room: {}", roomCode);
            return true;
        }
        return false;
    }

    public int getActiveRoomCount() {
        return rooms.size();
    }

    public Map<String, Room> getAllRooms() {
        return rooms;
    }

    /**
     * Scheduled cleanup every 5 minutes (300,000 ms) to remove rooms inactive > 15 minutes.
     */
    @Scheduled(fixedRate = 300000, initialDelay = 60000)
    public void cleanupInactiveRooms() {
        long now = System.currentTimeMillis();
        int cleanedCount = 0;

        for (Map.Entry<String, Room> entry : rooms.entrySet()) {
            Room room = entry.getValue();
            if (now - room.getLastActivityTimestamp() > INACTIVITY_TIMEOUT_MILLIS) {
                rooms.remove(entry.getKey());
                cleanedCount++;
                logger.info("Cleaned up inactive room: {}", entry.getKey());
            }
        }

        if (cleanedCount > 0) {
            logger.info("Scheduled cleanup complete: removed {} inactive rooms. Active rooms remaining: {}",
                    cleanedCount, rooms.size());
        }
    }

    private String generateUniqueRoomCode() {
        for (int attempts = 0; attempts < 1000; attempts++) {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                int index = secureRandom.nextInt(CODE_ALPHABET.length());
                sb.append(CODE_ALPHABET.charAt(index));
            }
            String code = sb.toString();
            if (!rooms.containsKey(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Failed to generate a unique room code after 1000 attempts");
    }
}
