package pikasolver.core.engine;

import pikasolver.core.algorithm.*;
import pikasolver.core.model.*;
import pikasolver.core.solver.*;

import java.util.List;

public class GameEngine {
    private final PathFinder pathFinder;
    private final MoveFinder moveFinder;
    private final BoardGenerator boardGenerator;

    public GameEngine() {
        this.pathFinder = new PathFinder();
        this.moveFinder = new MoveFinder(pathFinder);
        this.boardGenerator = new BoardGenerator();
    }

    public GameEngine(PathFinder pathFinder, MoveFinder moveFinder, BoardGenerator boardGenerator) {
        if (pathFinder == null || moveFinder == null || boardGenerator == null) {
            throw new IllegalArgumentException("Dependencies cannot be null");
        }

        this.pathFinder = pathFinder;
        this.moveFinder = moveFinder;
        this.boardGenerator = boardGenerator;
    }

    public Board generateBoard(int innerRows, int innerCols, int tileTypes) {
        validateGenerateInput(innerRows, innerCols, tileTypes);
        return boardGenerator.generate(innerRows, innerCols, tileTypes);
    }

    public MatchResult checkMatch(Board board, Point from, Point to) {
        validateBoardAndPoints(board, from, to);
        return pathFinder.checkMatch(board, from, to);
    }

    public Board removePair(Board board, Point from, Point to) {
        validateBoardAndPoints(board, from, to);
        MatchResult result = pathFinder.checkMatch(board, from, to);

        if (!result.isMatchable()) {
            throw new IllegalArgumentException("The selected pair is not matchable");
        }

        Board newBoard = board.copy();
        newBoard.removePair(from, to);

        return newBoard;
    }

    public Move getHint(Board board) {
        validateBoard(board);
        List<Move> validMoves = moveFinder.findAllValidMoves(board);

        if (validMoves.isEmpty()) {
            return null;
        }
        return validMoves.get(0);
    }

    public List<Move> getAllValidMoves(Board board) {
        validateBoard(board);
        return moveFinder.findAllValidMoves(board);
    }

    public boolean hasValidMove(Board board) {
        validateBoard(board);
        return moveFinder.hasValidMove(board);
    }

    public boolean isSolved(Board board) {
        validateBoard(board);
        return countRemainingTiles(board) == 0;
    }

    public int countRemainingTiles(Board board) {
        validateBoard(board);
        int[][] cells = board.getCellsCopy();
        int cnt = 0;

        for (int row = 0; row < board.getRows(); row++) {
            for (int col = 0; col < board.getCols(); col++) {
                if (cells[row][col] != 0) {
                    cnt += 1;
                }
            }
        }
        return cnt;
    }

    public int countRemainingPairs(Board board) {
        return countRemainingTiles(board) / 2;
    }

    public SolveResult solve(Board board, String algorithm) {
        validateBoard(board);

        Solver solver = createSolver(algorithm);

        return solver.solve(board);
    }

    private Solver createSolver(String algorithm) {
        if (algorithm == null || algorithm.isBlank()) {
            throw new IllegalArgumentException("Algorithm cannot be null or blank");
        }

        if (algorithm.equalsIgnoreCase("greedy")) {
            return new GreedySolver(moveFinder);
        }

        if (algorithm.equalsIgnoreCase("backtrack")) {
            return new BacktrackSolver(moveFinder);
        }

        throw new IllegalArgumentException("Unsupported algorithm: " + algorithm);
    }

    private void validateGenerateInput(int innerRows, int innerCols, int tileTypes) {
        if (innerRows <= 0 || innerCols <=0 || tileTypes <= 0) {
            throw new IllegalArgumentException("Rows, columns, and tileTypes must be positive");
        }

        if ((innerRows * innerCols) % 2 != 0) {
            throw new IllegalArgumentException("The number of playable cells must be even");
        }
    }

    private void validateBoard(Board board) {
        if (board == null) {
            throw new IllegalArgumentException("Board cannot be null");
        }
    }

    private void validateBoardAndPoints(Board board, Point from, Point to) {
        validateBoard(board);

        if (from == null || to == null) {
            throw new IllegalArgumentException("Points cannot be null");
        }

        if (!board.isInside(from) || !board.isInside(to)) {
            throw new IllegalArgumentException("Points must be inside the board");
        }
    }
}
