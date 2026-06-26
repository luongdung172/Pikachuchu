package pikasolver.core.solver;

import pikasolver.core.algorithm.MoveFinder;
import pikasolver.core.model.*;

import java.util.*;

public class BacktrackSolver implements Solver{
    private final MoveFinder moveFinder;
    private int exploredStates;
    private int backtracks;

    public BacktrackSolver (MoveFinder moveFinder) {
        if (moveFinder == null) {
            throw new IllegalArgumentException("MoveFinder cannot be null");
        }
        this.moveFinder = moveFinder;
    }

    @Override
    public SolveResult solve(Board originalBoard) {
        if (originalBoard == null) {
            throw new IllegalArgumentException("Board cannot be null");
        }

        long startTime = System.currentTimeMillis();
        Board board = originalBoard.copy();
        List<Move> solution = new ArrayList<>();

        exploredStates = 0;
        backtracks = 0;
        boolean solved = backtrack(board, solution);
        long runtimeMs = System.currentTimeMillis() - startTime;
        int remainingPairs = countRemainingPairs(board);

        SolverStats stats = new SolverStats(exploredStates, backtracks, runtimeMs, solved, remainingPairs);

        return new SolveResult(board, solution, stats);
    }

    private boolean backtrack(Board board, List<Move> solution) {
        exploredStates++;

        if(isSolved(board)) {
            return true;
        }

        List<Move> validMoves = moveFinder.findAllValidMoves(board);

        if (validMoves.isEmpty()) {
            return false;
        }

        for (Move move: validMoves) {
            Board nextBoard = board.copy();
            nextBoard.removePair(move.getFrom(), move.getTo());
            solution.add(move);

            if (backtrack(nextBoard, solution)) {
                copyBoard(nextBoard, board);
                return true;
            }

            solution.remove(solution.size()-1);
            backtracks++;
        };
        return false;
    }

    private void copyBoard(Board source, Board target) {
        int[][] cells = source.getCellsCopy();

        for (int row = 0; row < source.getRows(); row++) {
            for (int col = 0; col < source.getCols(); col++) {
                target.setValue(new Point(row, col), cells[row][col]);
            }
        }
    }

    private boolean isSolved(Board board) {
        return countRemainingTiles(board) == 0;
    }

    private int countRemainingTiles(Board board) {
        int[][] cells = board.getCellsCopy();
        int count = 0;

        for (int row = 0; row < board.getRows(); row++) {
            for (int col = 0; col < board.getCols(); col++) {
                if (cells[row][col] != 0) {
                    count++;
                }
            }
        }
        return count;
    }

    private int countRemainingPairs(Board board) {
        return countRemainingTiles(board) / 2;
    }
}
