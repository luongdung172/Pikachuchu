package pikasolver.core.model;

import java.util.*;

public class SolveResult {
    private final Board finalBoard;
    private final List<Move> moves;
    private final SolverStats stats;

    public SolveResult(Board finalBoard, List<Move> moves, SolverStats stats) {
        if (finalBoard == null || moves == null || stats == null) {
            throw new IllegalArgumentException("Arguments cannot be null");
        }

        this.finalBoard = finalBoard.copy();
        this.moves = moves == null ? new ArrayList<>() : new ArrayList<>(moves);
        this.stats = stats;
    }

    public Board getFinalBoard() {
        return finalBoard.copy();
    }

    public List<Move> getMoves() {
        return Collections.unmodifiableList(moves);
    }

    public SolverStats getStats() {
        return stats;
    }
}
