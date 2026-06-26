package pikasolver.api.dto;

import pikasolver.core.model.Move;

import java.util.List;

public class SolveResponse {
    private int[][] finalBoard;
    private List<Move> moves;
    private boolean solved;
    private int exploredStates;
    private int backtracks;
    private long runtimeMs;
    private int remainingPairs;

    public SolveResponse() {
    }

    public SolveResponse(int[][] finalBoard, List<Move> moves, boolean solved, int exploredStates, int backtracks, long runtimeMs, int remainingPairs) {
        this.finalBoard = finalBoard;
        this.moves = moves;
        this.solved = solved;
        this.exploredStates = exploredStates;
        this.backtracks = backtracks;
        this.runtimeMs = runtimeMs;
        this.remainingPairs = remainingPairs;
    }

    public int[][] getFinalBoard() {
        return finalBoard;
    }

    public List<Move> getMoves() {
        return moves;
    }

    public boolean isSolved() {
        return solved;
    }

    public int getExploredStates() {
        return exploredStates;
    }

    public int getBacktracks() {
        return backtracks;
    }

    public long getRuntimeMs() {
        return runtimeMs;
    }

    public int getRemainingPairs() {
        return remainingPairs;
    }

    public void setFinalBoard(int[][] finalBoard) {
        this.finalBoard = finalBoard;
    }

    public void setMoves(List<Move> moves) {
        this.moves = moves;
    }

    public void setSolved(boolean solved) {
        this.solved = solved;
    }

    public void setExploredStates(int exploredStates) {
        this.exploredStates = exploredStates;
    }

    public void setBacktracks(int backtracks) {
        this.backtracks = backtracks;
    }

    public void setRuntimeMs(long runtimeMs) {
        this.runtimeMs = runtimeMs;
    }

    public void setRemainingPairs(int remainingPairs) {
        this.remainingPairs = remainingPairs;
    }
}