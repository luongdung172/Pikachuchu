package pikasolver.core.algorithm;

import pikasolver.core.model.Board;
import pikasolver.core.model.MatchResult;
import pikasolver.core.model.Move;
import pikasolver.core.model.Point;

import java.util.ArrayList;
import java.util.List;

public class MoveFinder {
    private final PathFinder pathFinder;
    public MoveFinder(PathFinder pathFinder) {
        if (pathFinder == null) {
            throw new IllegalArgumentException("PathFinder cannot be null");
        }
        this.pathFinder = pathFinder;
    }
    
    public List<Move> findAllValidMoves(Board board) {
        if (board == null) {
            throw new IllegalArgumentException("Board cannot be null");
        }

        List<Move> validMoves = new ArrayList<>();
        for (int row1 = 0;row1 < board.getRows();row1++) {
            for (int col1 = 0; col1 < board.getCols(); col1++) {
                Point first = new Point(row1, col1);
                if (board.isEmpty(first)) {
                    continue;
                }
                for (int row2 = row1; row2 < board.getRows(); row2++) {
                    int startCol = (row2 == row1) ? col1 + 1 : 0;
                    for (int col2 = startCol; col2 < board.getCols(); col2++ ) {
                        Point second = new Point(row2, col2);
                        if (board.isEmpty(second)) {
                            continue;
                        }

                        if (!board.isSameTitle(first, second)) {
                            continue;
                        }

                        MatchResult result = pathFinder.checkMatch(board, first, second);
                        if (result.isMatchable()) {
                            validMoves.add(new Move(first, second));
                        }
                    }
                }
            }
        }
        return validMoves;
    }

    public boolean hasValidMove(Board board) {
        return !findAllValidMoves(board).isEmpty();
    }
}

