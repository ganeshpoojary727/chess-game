package com.chessapp.model;

public class TimeControl {
    private int initialMinutes = 10;
    private int incrementSeconds = 0;

    public TimeControl() {
    }

    public TimeControl(int initialMinutes, int incrementSeconds) {
        this.initialMinutes = initialMinutes;
        this.incrementSeconds = incrementSeconds;
    }

    public int getInitialMinutes() {
        return initialMinutes;
    }

    public void setInitialMinutes(int initialMinutes) {
        this.initialMinutes = initialMinutes;
    }

    public int getIncrementSeconds() {
        return incrementSeconds;
    }

    public void setIncrementSeconds(int incrementSeconds) {
        this.incrementSeconds = incrementSeconds;
    }

    public long getInitialMillis() {
        return (long) initialMinutes * 60 * 1000L;
    }

    public long getIncrementMillis() {
        return (long) incrementSeconds * 1000L;
    }
}
